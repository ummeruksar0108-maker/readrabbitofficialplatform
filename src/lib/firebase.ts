import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
  const { uploadFileToSupabaseStorage } = await import("./supabase");
  
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

let firestoreQuotaExceededUntil = typeof window !== "undefined" && window.sessionStorage?.getItem("firestore_quota_exceeded") ? Date.now() + 86400000 : 0;

/**
 * Saves the entire curriculum and materials tree to Firebase Firestore.
 */
export async function saveCoursesToFirestore(coursesData: any[]): Promise<boolean> {
  if (Date.now() < firestoreQuotaExceededUntil || (typeof window !== "undefined" && window.sessionStorage?.getItem("firestore_quota_exceeded"))) {
    console.warn("[Firestore Quota Skip] Skipping Firestore write because free tier daily write quota was exceeded. Relying on Supabase, Express server & local storage.");
    return false;
  }

  logDiagnostic("info", `Writing curriculum payload (${coursesData.length} courses) to Firestore 'courses/main'...`);
  try {
    const courseDocRef = doc(db, "courses", "main");
    // Strip study material metadata so materials are stored ONLY in Supabase PostgreSQL study_materials table
    const cleanCoursesData = coursesData.map((course: any) => ({
      ...course,
      semesters: (course.semesters || []).map((sem: any) => ({
        ...sem,
        subjects: (sem.subjects || []).map((sub: any) => {
          const { materials, ...subWithoutMaterials } = sub;
          return {
            ...subWithoutMaterials,
            units: (sub.units || []).map((unit: any) => {
              const { materials: unitMaterials, ...unitWithoutMaterials } = unit;
              return unitWithoutMaterials;
            })
          };
        })
      }))
    }));
    const payload = {
      coursesData: cleanCoursesData,
      updatedAt: new Date().toISOString()
    };

    await setDoc(courseDocRef, payload);

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
    const isQuotaError = errMsg.includes("resource-exhausted") || errMsg.includes("Quota limit exceeded") || err?.code === "resource-exhausted";
    
    if (isQuotaError) {
      firestoreQuotaExceededUntil = Date.now() + 86400000; // Cool down Firestore write calls for 24 hours
      if (typeof window !== "undefined") {
        try { window.sessionStorage?.setItem("firestore_quota_exceeded", "true"); } catch (e) {}
      }
      console.warn("[Firestore Quota Exceeded] Daily free tier write quota reached. App is seamlessly falling back to Supabase, Express server & localStorage.");
    }

    updateDiagnostics({
      writeStatus: "FAILED",
      writeError: isQuotaError ? "Firestore Daily Write Quota Exceeded (Saved to Supabase, Express Server & Local Storage instead)" : errMsg,
      isFallbackActive: true
    });
    logDiagnostic("warn", `[Firestore Write Notice] ${errMsg}`);
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
