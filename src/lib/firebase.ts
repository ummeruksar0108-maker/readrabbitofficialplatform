import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, getDocFromServer, collection, deleteDoc, onSnapshot, Firestore } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { uploadFileToSupabaseStorage } from "./supabase";
import config from "../../firebase-applet-config.json";
import { StudentVisitor } from "../types";
import { mergeRemoteDeletedCardIds, getDeletedCardIdsArray } from "./deletedCards";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(config) : getApp();

// Initialize Firestore Database canonical instance as mandated by Firebase Skill
const targetDbId = config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)"
  ? config.firestoreDatabaseId
  : undefined;

export const db: Firestore = targetDbId
  ? getFirestore(app, targetDbId)
  : getFirestore(app);

export const auth = getAuth(app);

// Test Firestore backend connection on boot (as required by Firebase skill)
async function testConnection() {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Connection check timed out")), 4000)
    );
    await Promise.race([
      getDocFromServer(doc(db, "test", "connection")),
      timeoutPromise
    ]);
    logDiagnostic("success", "[Firestore Backend] Connected successfully to Cloud Firestore.");
  } catch (error: any) {
    const msg = error?.message || String(error);
    if (
      msg.includes("the client is offline") ||
      msg.includes("Could not reach Cloud Firestore backend") ||
      msg.includes("timed out") ||
      error?.code === "unavailable"
    ) {
      console.warn("[Firestore Backend] Operating in offline mode or waiting for connection.");
      logDiagnostic("info", "[Firestore Backend] Client operating in offline mode / local cache.");
    } else {
      console.warn("[Firestore Backend Connection Info]", msg);
    }
  }
}
testConnection();

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
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    timestamp: new Date().toISOString()
  };
  console.warn(`[Firestore Error Handler] ${operationType.toUpperCase()} at ${path}:`, errMsg);
  logDiagnostic("warn", `[Firestore ${operationType.toUpperCase()} Error] ${path}: ${errMsg}`);
  if (errMsg.toLowerCase().includes("permission") || errMsg.toLowerCase().includes("insufficient")) {
    throw new Error(JSON.stringify(errInfo));
  }
}

/**
 * Saves the entire curriculum and materials tree to Firebase Firestore.
 */
export async function saveCoursesToFirestore(coursesData: any[], deletedCardIds?: string[]): Promise<boolean> {
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
    const activeDeletedIds = deletedCardIds || getDeletedCardIdsArray();
    const payload: any = {
      coursesData: coursesData,
      deletedCardIds: activeDeletedIds,
      updatedAt: new Date().toISOString()
    };

    const payloadString = JSON.stringify({ coursesData, deletedCardIds: activeDeletedIds });
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
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
    const fetchPromise = (async () => {
      const docSnap = await getDoc(courseDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.coursesData) && data.coursesData.length > 0) {
          if (Array.isArray(data.deletedCardIds)) {
            mergeRemoteDeletedCardIds(data.deletedCardIds);
          }
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
      return null;
    })();

    return await Promise.race([fetchPromise, timeoutPromise]);
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
          if (Array.isArray(data.deletedCardIds)) {
            mergeRemoteDeletedCardIds(data.deletedCardIds);
          }
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

/**
 * Saves or updates a student visitor profile to Firestore cloud database.
 */
export async function saveStudentVisitorToFirestore(visitorData: {
  name: string;
  email: string;
  courseId?: string;
  courseName?: string;
}): Promise<void> {
  const cleanName = (visitorData.name || "").trim();
  const cleanEmail = (visitorData.email || "").trim();
  if (!cleanName || cleanName === "Little Bunny") return;

  try {
    // Generate deterministic doc ID based on email if available, or encoded name
    const docId = cleanEmail
      ? cleanEmail.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : cleanName.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const visitorDocRef = doc(db, "student_visitors", docId);
    const existingSnap = await getDoc(visitorDocRef);

    const nowStr = new Date().toLocaleString();
    const nowTimestamp = Date.now();

    if (existingSnap.exists()) {
      const existing = existingSnap.data();
      await setDoc(
        visitorDocRef,
        {
          id: docId,
          name: cleanName || existing.name,
          email: cleanEmail || existing.email,
          courseId: visitorData.courseId || existing.courseId || "general",
          courseName: visitorData.courseName || existing.courseName || "BCA",
          firstVisit: existing.firstVisit || nowStr,
          lastActive: nowStr,
          lastActiveTimestamp: nowTimestamp,
          visitCount: (existing.visitCount || 1) + 1,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      logDiagnostic("success", `[Firestore] Updated student visitor '${cleanName}' (${cleanEmail}) in cloud.`);
    } else {
      await setDoc(visitorDocRef, {
        id: docId,
        name: cleanName,
        email: cleanEmail,
        courseId: visitorData.courseId || "general",
        courseName: visitorData.courseName || "BCA",
        firstVisit: nowStr,
        lastActive: nowStr,
        lastActiveTimestamp: nowTimestamp,
        visitCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      logDiagnostic("success", `[Firestore] Saved new student visitor '${cleanName}' (${cleanEmail}) to cloud.`);
    }
  } catch (err: any) {
    console.warn("[Firestore Visitor Sync Error]", err);
    logDiagnostic("warn", `[Firestore Visitor Sync Failed] ${err?.message || err}`);
  }
}

/**
 * Loads all student visitors from Firestore.
 */
export async function loadStudentVisitorsFromFirestore(): Promise<StudentVisitor[]> {
  try {
    const colRef = collection(db, "student_visitors");
    const snapshot = await getDocs(colRef);
    const results: StudentVisitor[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      results.push({
        id: data.id || d.id,
        name: data.name || "Student",
        email: data.email || "",
        courseId: data.courseId || "general",
        courseName: data.courseName || "General",
        firstVisit: data.firstVisit || data.lastActive || "Recently",
        lastActive: data.lastActive || "Recently",
        visitCount: data.visitCount || 1,
        lastActiveTimestamp: data.lastActiveTimestamp || Date.now()
      });
    });
    return results;
  } catch (err: any) {
    console.warn("[Firestore Fetch Visitors Error]", err);
    return [];
  }
}

/**
 * Deletes a student visitor document from Firestore.
 */
export async function deleteStudentVisitorFromFirestore(visitorId: string): Promise<boolean> {
  try {
    const visitorDocRef = doc(db, "student_visitors", visitorId);
    await deleteDoc(visitorDocRef);
    logDiagnostic("info", `[Firestore] Deleted student visitor '${visitorId}'`);
    return true;
  } catch (err: any) {
    console.warn("[Firestore Delete Visitor Error]", err);
    return false;
  }
}
