import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, getDocFromServer, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { uploadFileToSupabaseStorage } from "./supabase";
import config from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(config) : getApp();

// Initialize Firestore Database using the specific databaseId from config if provided
const targetDbId = config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)"
  ? config.firestoreDatabaseId
  : "(default)";

export const db = targetDbId !== "(default)"
  ? getFirestore(app, targetDbId)
  : getFirestore(app);

// Initialize Firebase Storage with explicit bucket URL
const storageBucketName = config.storageBucket || "solid-aquifer-j5fd2.firebasestorage.app";
export const storage = getStorage(
  app, 
  storageBucketName.startsWith("gs://") ? storageBucketName : `gs://${storageBucketName}`
);

// Diagnostic State Types
export interface DiagnosticLog {
  id: string;
  time: string;
  message: string;
  level: "info" | "success" | "warn" | "error";
}

export interface FirebaseDiagnostics {
  projectId: string;
  databaseId: string;
  storageBucket: string;
  readStatus: "SUCCESS" | "FAILED" | "CONNECTING" | "IDLE";
  readSource: string;
  readDocPath: string;
  readCourseCount: number;
  lastReadTime: string;
  readError: string | null;
  storageStatus: "SUCCESS" | "FAILED" | "FIRESTORE_DOC" | "IDLE";
  storageUrl: string | null;
  storageError: string | null;
  writeStatus: "SUCCESS" | "FAILED" | "IDLE";
  writeDocPath: string;
  writeTimestamp: string | null;
  writeError: string | null;
  isFallbackActive: boolean;
  logs: DiagnosticLog[];
}

let diagnosticsState: FirebaseDiagnostics = {
  projectId: config.projectId || "solid-aquifer-j5fd2",
  databaseId: targetDbId,
  storageBucket: storageBucketName,
  readStatus: "IDLE",
  readSource: "None",
  readDocPath: "courses/main",
  readCourseCount: 0,
  lastReadTime: "Never",
  readError: null,
  storageStatus: "IDLE",
  storageUrl: null,
  storageError: null,
  writeStatus: "IDLE",
  writeDocPath: "courses/main",
  writeTimestamp: null,
  writeError: null,
  isFallbackActive: false,
  logs: []
};

type DiagnosticsListener = (diag: FirebaseDiagnostics) => void;
const listeners = new Set<DiagnosticsListener>();

export function subscribeDiagnostics(listener: DiagnosticsListener): () => void {
  listeners.add(listener);
  listener({ ...diagnosticsState });
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  const copy = { ...diagnosticsState, logs: [...diagnosticsState.logs] };
  listeners.forEach(fn => fn(copy));
}

export function logDiagnostic(level: "info" | "success" | "warn" | "error", message: string) {
  const time = new Date().toLocaleTimeString();
  const logItem: DiagnosticLog = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    time,
    message,
    level
  };
  diagnosticsState.logs = [logItem, ...diagnosticsState.logs.slice(0, 49)];
  console.log(`[FIREBASE DIAGNOSTIC ${level.toUpperCase()}] ${message}`);
  notifyListeners();
}

function updateDiagnostics(partial: Partial<FirebaseDiagnostics>) {
  diagnosticsState = { ...diagnosticsState, ...partial };
  notifyListeners();
}

export function getDiagnosticsState(): FirebaseDiagnostics {
  return { ...diagnosticsState };
}

/**
 * Uploads a file directly to Supabase Storage bucket 'study-materials'.
 * Replaces old Firebase storage/Firestore binary fallback completely.
 */
export async function uploadFileToCloud(
  file: File,
  folderPath: string = "study_materials",
  onProgress?: (percent: number, statusMsg: string) => void,
  contextParams?: { courseId?: string; semesterId?: string; subjectId?: string; unitId?: string }
): Promise<{ url: string; name: string; size: string; type: string; cloudPath: string; publicUrl: string }> {
  try {
    const res = await uploadFileToSupabaseStorage(file, contextParams, onProgress);
    
    updateDiagnostics({
      storageStatus: "SUCCESS",
      storageUrl: res.publicUrl,
      storageError: null
    });

    return {
      url: res.publicUrl,
      name: res.name,
      size: res.size,
      type: res.type,
      cloudPath: res.cloudPath,
      publicUrl: res.publicUrl
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    updateDiagnostics({
      storageStatus: "FAILED",
      storageError: errMsg,
      storageUrl: null
    });
    logDiagnostic("error", `[Cloud Upload FAIL] Supabase Storage upload failed: ${errMsg}`);
    throw new Error(`Cloud Storage upload failed: ${errMsg}`);
  }
}

let firestoreQuotaExceededUntil = 0;
let lastSavedCoursesPayload = "";

/**
 * Validates connection to Firestore on initial boot.
 */
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, "courses", "main"));
    logDiagnostic("success", "[Firestore Boot] Verified active connection to Firestore cloud!");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("[Firestore Boot] Client is offline or Firestore config needs verification.");
    }
  }
}
testFirestoreConnection();

/**
 * Error handler helper for Firestore operations.
 */
export enum FirestoreOperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export function handleFirestoreError(error: unknown, operationType: FirestoreOperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo = {
    error: errMsg,
    operationType,
    path,
    timestamp: new Date().toISOString()
  };
  console.warn(`[Firestore Error Handler] ${operationType.toUpperCase()} at ${path}:`, errMsg);
  logDiagnostic("warn", `[Firestore ${operationType.toUpperCase()} Error] ${path}: ${errMsg}`);
}

/**
 * Saves the entire curriculum and materials tree to Firebase Firestore.
 */
export async function saveCoursesToFirestore(coursesData: any[]): Promise<boolean> {
  if (!coursesData || !Array.isArray(coursesData) || coursesData.length === 0) {
    return false;
  }

  // Cool off if quota exceeded or write stream exhausted
  if (Date.now() < firestoreQuotaExceededUntil) {
    logDiagnostic("info", "[Firestore Cloud] Write skipped (Quota or rate backoff active - saved locally & server disk)");
    return false;
  }

  try {
    const courseDocRef = doc(db, "courses", "main");
    const payload = {
      coursesData: coursesData,
      updatedAt: new Date().toISOString()
    };

    const payloadString = JSON.stringify(coursesData);
    if (payloadString === lastSavedCoursesPayload) {
      // Data hasn't changed, skip duplicate write
      return true;
    }

    await setDoc(courseDocRef, payload);

    lastSavedCoursesPayload = payloadString;
    firestoreQuotaExceededUntil = 0; // Reset on success
    if (typeof window !== "undefined") window.sessionStorage?.removeItem("firestore_quota_exceeded");

    updateDiagnostics({
      writeStatus: "SUCCESS",
      writeDocPath: "courses/main",
      writeTimestamp: payload.updatedAt,
      writeError: null
    });
    logDiagnostic("success", `[Firestore Cloud] Saved curriculum to 'courses/main' at ${payload.updatedAt}!`);
    return true;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    handleFirestoreError(err, FirestoreOperationType.WRITE, "courses/main");

    const isQuotaOrStreamError =
      errMsg.includes("resource-exhausted") ||
      errMsg.includes("Quota limit exceeded") ||
      errMsg.includes("backoff delay") ||
      errMsg.includes("exhausted maximum allowed queued writes") ||
      err?.code === "resource-exhausted";

    if (isQuotaOrStreamError) {
      // Pause writing to Firestore for 2 minutes to let queue clear & prevent stream exhaustion
      firestoreQuotaExceededUntil = Date.now() + 120000;
      if (typeof window !== "undefined") {
        try { window.sessionStorage?.setItem("firestore_quota_exceeded", "true"); } catch (e) {}
      }
      console.warn("[Firestore Quota/Stream Protection] Paused Firestore writes. Application is seamlessly falling back to Supabase, Express server & LocalStorage.");
    }

    updateDiagnostics({
      writeStatus: "FAILED",
      writeError: isQuotaOrStreamError ? "Firestore Write Cooldown Active (Fallback to Supabase, Express Server & Local Storage)" : errMsg,
      isFallbackActive: true
    });
    return false;
  }
}

/**
 * Loads courses from Firebase Firestore.
 */
export async function loadCoursesFromFirestore(): Promise<any[] | null> {
  logDiagnostic("info", "Loading curriculum from Firestore 'courses/main'...");
  try {
    const courseDocRef = doc(db, "courses", "main");
    const docSnap = await getDoc(courseDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.coursesData) && data.coursesData.length > 0) {
        updateDiagnostics({
          readStatus: "SUCCESS",
          readSource: "Firestore Direct Fetch",
          readDocPath: "courses/main",
          readCourseCount: data.coursesData.length,
          lastReadTime: new Date().toLocaleTimeString(),
          readError: null
        });
        logDiagnostic("success", `[Firestore Cloud] Loaded ${data.coursesData.length} courses from 'courses/main'!`);
        return data.coursesData;
      }
    }
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    updateDiagnostics({
      readStatus: "FAILED",
      readError: errMsg
    });
    logDiagnostic("error", `[Firestore Cloud Read Error] ${errMsg}`);
  }
  return null;
}

/**
 * Real-time listener for Firestore courses updates across all devices.
 */
export function saveNotificationsToFirestore(notifications: any[]): Promise<boolean> {
  logDiagnostic("info", `Saving ${notifications.length} notifications to Firestore 'notifications/main'...`);
  try {
    const notifDocRef = doc(db, "notifications", "main");
    setDoc(notifDocRef, {
      notifications,
      updatedAt: new Date().toISOString()
    });
    logDiagnostic("success", "[Firestore Notifications] Saved notifications to Firestore cloud!");
    return Promise.resolve(true);
  } catch (err: any) {
    logDiagnostic("warn", `[Firestore Notifications Write Fail] ${err?.message || err}`);
    return Promise.resolve(false);
  }
}

export function subscribeNotificationsFromFirestore(callback: (notifications: any[]) => void): () => void {
  logDiagnostic("info", "Attaching real-time listener to Firestore 'notifications/main'...");
  try {
    const notifDocRef = doc(db, "notifications", "main");
    const unsubscribe = onSnapshot(notifDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.notifications)) {
          logDiagnostic("success", `[Firestore Realtime Notifications] Loaded ${data.notifications.length} broadcast notifications!`);
          callback(data.notifications);
        }
      }
    }, (err) => {
      console.warn("[Firestore Notification Listener Warn]", err);
    });
    return unsubscribe;
  } catch (err: any) {
    console.warn("[Firestore Notification Subscription Fail]", err);
    return () => {};
  }
}

export function saveFeedbackToFirestore(feedbackList: any[]): Promise<boolean> {
  logDiagnostic("info", `Saving ${feedbackList.length} feedback items to Firestore 'feedback/main'...`);
  try {
    const fbDocRef = doc(db, "feedback", "main");
    setDoc(fbDocRef, {
      feedback: feedbackList,
      updatedAt: new Date().toISOString()
    });
    logDiagnostic("success", "[Firestore Feedback] Saved student feedback to Firestore cloud!");
    return Promise.resolve(true);
  } catch (err: any) {
    logDiagnostic("warn", `[Firestore Feedback Write Fail] ${err?.message || err}`);
    return Promise.resolve(false);
  }
}

export function subscribeFeedbackFromFirestore(callback: (feedback: any[]) => void): () => void {
  logDiagnostic("info", "Attaching real-time listener to Firestore 'feedback/main'...");
  try {
    const fbDocRef = doc(db, "feedback", "main");
    const unsubscribe = onSnapshot(fbDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.feedback)) {
          logDiagnostic("success", `[Firestore Realtime Feedback] Received ${data.feedback.length} student feedback entries!`);
          callback(data.feedback);
        }
      }
    }, (err) => {
      console.warn("[Firestore Feedback Listener Warn]", err);
    });
    return unsubscribe;
  } catch (err: any) {
    console.warn("[Firestore Feedback Subscription Fail]", err);
    return () => {};
  }
}

export function subscribeCoursesFromFirestore(callback: (coursesData: any[]) => void): () => void {
  logDiagnostic("info", "Attaching real-time listener to Firestore 'courses/main'...");
  try {
    const courseDocRef = doc(db, "courses", "main");
    const unsubscribe = onSnapshot(courseDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.coursesData) && data.coursesData.length > 0) {
          updateDiagnostics({
            readStatus: "SUCCESS",
            readSource: "Firestore Cloud Realtime Listener",
            readDocPath: "courses/main",
            readCourseCount: data.coursesData.length,
            lastReadTime: new Date().toLocaleTimeString(),
            readError: null
          });
          logDiagnostic("success", `[Firestore Realtime] Live curriculum update (${data.coursesData.length} courses) received!`);
          callback(data.coursesData);
        }
      }
    }, (err) => {
      const errMsg = err?.message || String(err);
      updateDiagnostics({
        readStatus: "FAILED",
        readError: errMsg
      });
      logDiagnostic("error", `[Firestore Realtime ERROR] ${errMsg}`);
    });
    return unsubscribe;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    logDiagnostic("error", `[Firestore Subscription Failed] ${errMsg}`);
    return () => {};
  }
}

/**
 * Retrieves file binary or data URL from Firestore uploaded_files if needed.
 */
export async function getFileContentFromCloud(fileUrl: string): Promise<string> {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("firestore_file://")) {
    const fileId = fileUrl.replace("firestore_file://", "");
    logDiagnostic("info", `Fetching content for file document '${fileId}' from Firestore 'uploaded_files'...`);
    try {
      const fileDocSnap = await getDoc(doc(db, "uploaded_files", fileId));
      if (fileDocSnap.exists()) {
        const fileData = fileDocSnap.data();
        if (fileData && fileData.dataUrl) {
          logDiagnostic("success", `[Firestore Cloud] Retrieved binary data for 'uploaded_files/${fileId}'!`);
          return fileData.dataUrl;
        }
      }
    } catch (err: any) {
      logDiagnostic("error", `[Firestore File Read Error] ${err?.message || err}`);
    }
  }
  return fileUrl;
}
