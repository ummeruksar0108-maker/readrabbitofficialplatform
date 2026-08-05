// IndexedDB helper for storing PDF files and large study materials cleanly without exceeding localStorage quota
const DB_NAME = "ReadRabbitFilesDB";
const STORE_NAME = "study_files";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported in this browser"));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveFileToIndexedDB(fileId: string, fileData: Blob | string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(fileData, fileId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[INDEXEDDB WARN] Failed to save file:", err);
  }
}

export async function getFileFromIndexedDB(fileId: string): Promise<Blob | string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(fileId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[INDEXEDDB WARN] Failed to get file:", err);
    return null;
  }
}

export async function deleteFileFromIndexedDB(fileId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(fileId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[INDEXEDDB WARN] Failed to delete file:", err);
  }
}

// Convert Base64 Data URL to Blob safely for mobile PDF rendering
export function base64ToBlob(base64DataUrl: string, defaultType = "application/pdf"): Blob {
  try {
    const parts = base64DataUrl.split(",");
    const mimeMatch = parts[0]?.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : defaultType;
    const bstr = atob(parts[1] || parts[0]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error("[BLOB CONVERSION ERROR]", e);
    return new Blob([], { type: defaultType });
  }
}
