import { createClient } from "@supabase/supabase-js";
import { logDiagnostic } from "./firebase";
import { Course, StudyMaterial, Unit } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export interface UploadMetadataParams {
  courseId?: string;
  semesterId?: string;
  subjectId?: string;
  unitId?: string;
}

export interface UploadResult {
  id: string;
  name: string;
  type: "pdf" | "ppt" | "image" | "doc" | "code" | "question" | "youtube" | "other";
  size: string;
  cloudPath: string;
  publicUrl: string;
  uploadedAt: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  unitId: string;
}

/**
 * Inserts metadata record for an uploaded material directly into Supabase PostgreSQL table 'study_materials'.
 */
export async function insertMaterialToSupabaseDB(material: UploadResult): Promise<UploadResult> {
  const isInvalidUrl = !supabaseUrl || supabaseUrl.includes("placeholder") || supabaseUrl.includes("your-project");
  const isInvalidKey = !supabaseAnonKey || supabaseAnonKey.includes("placeholder") || supabaseAnonKey.includes("your-anon-key");

  if (isInvalidUrl || isInvalidKey) {
    const msg = "Supabase credentials missing or invalid! Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.";
    console.error("[Supabase DB Error]", msg);
    throw new Error(msg);
  }

  const insertPayload: any = {
    id: material.id,
    name: material.name,
    type: material.type,
    size: material.size,
    public_url: material.publicUrl,
    cloud_path: material.cloudPath,
    course_id: material.courseId,
    semester_id: material.semesterId,
    subject_id: material.subjectId,
    unit_id: material.unitId,
    uploaded_at: material.uploadedAt
  };

  console.log("[Supabase DB Insert Executing] Inserting record into 'study_materials':", insertPayload);
  logDiagnostic("info", `[Supabase DB] Executing insert for "${material.name}" into table 'study_materials'...`);

  let { data, error } = await supabase
    .from("study_materials")
    .insert([insertPayload])
    .select();

  console.log("[Supabase DB Insert Raw Result]", { data, error });

  // Retry 1: If 'id' is defined as UUID or auto-increment INTEGER in Postgres, retry without passing explicit text 'id'
  if (error && (error.code === "22P02" || error.message.includes("uuid") || error.message.includes("integer"))) {
    console.warn("[Supabase DB Retry] Column 'id' mismatch detected. Retrying insert without explicit 'id' field...");
    const { id, ...payloadWithoutId } = insertPayload;
    const retryRes = await supabase
      .from("study_materials")
      .insert([payloadWithoutId])
      .select();
    data = retryRes.data;
    error = retryRes.error;
    console.log("[Supabase DB Insert Retry Result]", { data, error });
  }

  // Retry 2: If RLS policy allows INSERT but restricts SELECT, retry insert without chaining .select()
  if (error && (error.code === "42501" || error.message.includes("row-level security") || error.message.includes("policy"))) {
    console.warn("[Supabase DB Retry] RLS restriction on .select() detected. Retrying insert without .select()...");
    const retryNoSelect = await supabase
      .from("study_materials")
      .insert([insertPayload]);
    if (!retryNoSelect.error) {
      error = null;
      console.log("[Supabase DB Insert Retry Without Select Successful]");
    } else {
      error = retryResNoSelectError(retryNoSelect.error, insertPayload);
    }
  }

  if (error) {
    const errorDetails = error.details ? ` | Details: ${error.details}` : "";
    const errorHint = error.hint ? ` | Hint: ${error.hint}` : "";
    const errorCode = error.code ? ` [Code: ${error.code}]` : "";
    const fullErrMsg = `Supabase DB Insert Error: ${error.message}${errorDetails}${errorHint}${errorCode}`;
    
    console.error("[EXACT SUPABASE ERROR]", fullErrMsg, error);
    logDiagnostic("error", fullErrMsg);
    throw new Error(fullErrMsg);
  }

  logDiagnostic("success", `[Supabase DB Insert Success] Metadata for "${material.name}" saved to PostgreSQL study_materials table!`);
  return material;
}

function retryResNoSelectError(err: any, payload: any) {
  return err;
}

/**
 * Fetches all study materials from Supabase PostgreSQL table 'study_materials' for a specific subject or unit.
 */
export async function fetchMaterialsFromSupabaseDB(subjectId?: string, unitId?: string): Promise<UploadResult[]> {
  const isInvalidUrl = !supabaseUrl || supabaseUrl.includes("placeholder") || supabaseUrl.includes("your-project");
  if (isInvalidUrl) return [];

  try {
    let query = supabase.from("study_materials").select("*");
    if (unitId) {
      query = query.eq("unit_id", unitId);
    } else if (subjectId) {
      query = query.eq("subject_id", subjectId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("[Supabase DB Fetch Warning]", error.message);
      return [];
    }

    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type || "pdf",
      size: row.size,
      publicUrl: row.public_url,
      cloudPath: row.cloud_path,
      courseId: row.course_id,
      semesterId: row.semester_id,
      subjectId: row.subject_id,
      unitId: row.unit_id,
      uploadedAt: row.uploaded_at || new Date().toISOString()
    }));
  } catch (err) {
    console.warn("[Supabase DB Fetch Error]", err);
    return [];
  }
}

/**
 * Fetches all study materials from Supabase PostgreSQL table 'study_materials' across the entire app.
 */
export async function fetchAllMaterialsFromSupabaseDB(): Promise<UploadResult[]> {
  const isInvalidUrl = !supabaseUrl || supabaseUrl.includes("placeholder") || supabaseUrl.includes("your-project");
  if (isInvalidUrl) return [];

  try {
    const { data, error } = await supabase.from("study_materials").select("*");
    if (error) {
      console.warn("[Supabase DB Fetch All Warning]", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type || "pdf",
      size: row.size,
      publicUrl: row.public_url,
      cloudPath: row.cloud_path,
      courseId: row.course_id,
      semesterId: row.semester_id,
      subjectId: row.subject_id,
      unitId: row.unit_id,
      uploadedAt: row.uploaded_at || new Date().toISOString()
    }));
  } catch (err) {
    console.warn("[Supabase DB Fetch All Error]", err);
    return [];
  }
}

/**
 * Deletes material metadata row from Supabase DB and deletes file from Storage bucket.
 * Deletes from Storage FIRST using cloudPath, then deletes row from DB using id.
 * Returns success only after BOTH operations succeed.
 */
export async function deleteMaterialFromSupabase(
  id: string,
  cloudPath?: string
): Promise<{ success: boolean; message: string }> {
  try {
    let targetCloudPath = cloudPath;

    // If cloudPath is missing, fetch row from study_materials table first
    if (!targetCloudPath && id) {
      const { data: row } = await supabase
        .from("study_materials")
        .select("cloud_path")
        .eq("id", id)
        .maybeSingle();
      if (row?.cloud_path) {
        targetCloudPath = row.cloud_path;
      }
    }

    // Step 1: Delete object from Supabase Storage using cloud_path
    if (targetCloudPath) {
      logDiagnostic("info", `[Supabase Storage] Deleting file '${targetCloudPath}'...`);
      const storageSuccess = await deleteFileFromSupabaseStorage(targetCloudPath);
      if (!storageSuccess) {
        const msg = `Failed to delete file '${targetCloudPath}' from Supabase Storage. Database record deletion was aborted.`;
        logDiagnostic("error", `[Supabase Delete Storage Failed] ${msg}`);
        return { success: false, message: msg };
      }
    }

    // Step 2: Delete metadata row from public.study_materials using id
    logDiagnostic("info", `[Supabase DB] Deleting record '${id}' from study_materials...`);
    const { error: dbError } = await supabase
      .from("study_materials")
      .delete()
      .eq("id", id);

    if (dbError) {
      const msg = `Failed to delete record from study_materials table: ${dbError.message}`;
      logDiagnostic("error", `[Supabase DB Delete Failed] ${msg}`);
      return { success: false, message: msg };
    }

    logDiagnostic("success", `[Supabase Delete Complete] Object '${targetCloudPath}' and DB record '${id}' deleted successfully.`);
    return {
      success: true,
      message: `File successfully deleted from Supabase Storage and Database.`
    };
  } catch (err: any) {
    const msg = err?.message || "Unexpected error during material deletion.";
    logDiagnostic("error", `[Supabase Delete Exception] ${msg}`);
    return { success: false, message: msg };
  }
}

/**
 * Uploads a file directly to Supabase Storage bucket 'study-materials'.
 * Returns publicUrl and complete cloud metadata for shared cross-device access.
 */
export async function uploadFileToSupabaseStorage(
  file: File,
  contextParams: UploadMetadataParams = {},
  onProgress?: (percent: number, statusMsg: string) => void
): Promise<UploadResult> {
  const isInvalidUrl = !supabaseUrl || supabaseUrl.includes("placeholder") || supabaseUrl.includes("your-project");
  const isInvalidKey = !supabaseAnonKey || supabaseAnonKey.includes("placeholder") || supabaseAnonKey.includes("your-anon-key");

  if (isInvalidUrl || isInvalidKey) {
    throw new Error(
      "Supabase credentials are missing or set to placeholders! " +
      "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment / Netlify environment variables."
    );
  }

  const formattedSize = file.size >= 1024 * 1024 
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
    : `${Math.round(file.size / 1024)} KB`;

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  let fileType: UploadResult["type"] = "other";
  if (ext === 'pdf') fileType = 'pdf';
  else if (['ppt', 'pptx', 'pps'].includes(ext)) fileType = 'ppt';
  else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) fileType = 'image';
  else if (['doc', 'docx', 'xls', 'xlsx', 'txt', 'md', 'rtf'].includes(ext)) fileType = 'doc';
  else if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'sh', 'sql'].includes(ext)) fileType = 'code';

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const courseId = (contextParams.courseId || "course").replace(/[^a-zA-Z0-9._-]/g, '_');
  const semesterId = (contextParams.semesterId || "sem").replace(/[^a-zA-Z0-9._-]/g, '_');
  const subjectId = (contextParams.subjectId || "subj").replace(/[^a-zA-Z0-9._-]/g, '_');
  const unitId = (contextParams.unitId || "unit").replace(/[^a-zA-Z0-9._-]/g, '_');
  
  const cloudPath = `${courseId}/${semesterId}/${subjectId}/${unitId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanFileName}`;
  const fileId = "mat_sb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

  logDiagnostic("info", `[Supabase Storage] Uploading "${file.name}" (${formattedSize}) to bucket 'study-materials' at '${cloudPath}'...`);
  if (onProgress) onProgress(25, `Uploading "${file.name}" to Supabase Storage...`);

  // Retry loop with exponential backoff for network/protocol recovery
  const MAX_RETRIES = 3;
  let uploadError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const { error } = await supabase.storage
      .from('study-materials')
      .upload(cloudPath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (!error) {
      uploadError = null;
      break;
    }

    uploadError = error;
    if (attempt < MAX_RETRIES) {
      const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
      const retryMsg = `Network glitch: Retrying upload (attempt ${attempt + 1}/${MAX_RETRIES}) in ${(delayMs / 1000).toFixed(1)}s...`;
      logDiagnostic("warn", `[Supabase Storage Retry] Upload attempt ${attempt} failed (${error.message}). Retrying in ${(delayMs / 1000).toFixed(1)}s...`);
      console.warn(`[SUPABASE UPLOAD RETRY] Attempt ${attempt} failed. Backing off ${delayMs}ms:`, error);
      if (onProgress) {
        onProgress(30, retryMsg);
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  if (uploadError) {
    logDiagnostic("error", `[Supabase Upload Failed] ${uploadError.message}`);
    const msg = uploadError.message.toLowerCase();
    if (msg.includes("bucket not found")) {
      throw new Error("Supabase Storage bucket 'study-materials' does not exist! Go to Supabase Dashboard -> Storage -> Create a public bucket named 'study-materials'.");
    }
    if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("unauthorized") || msg.includes("permission denied")) {
      throw new Error("Supabase RLS policy issue: Make sure bucket 'study-materials' is set to Public or has INSERT/SELECT policies enabled for anon users.");
    }
    throw new Error(`Supabase Storage Upload Failed: ${uploadError.message}`);
  }

  if (onProgress) onProgress(75, `Storage upload complete! Generating URL...`);

  const { data: publicUrlData } = supabase.storage
    .from('study-materials')
    .getPublicUrl(cloudPath);

  const publicUrl = publicUrlData.publicUrl;

  if (!publicUrl) {
    throw new Error("Could not retrieve public URL from Supabase Storage.");
  }

  logDiagnostic("success", `[Supabase Upload Success] Public URL: ${publicUrl}`);
  if (onProgress) onProgress(85, `Public URL ready!`);

  return {
    id: fileId,
    name: file.name,
    type: fileType,
    size: formattedSize,
    cloudPath: cloudPath,
    publicUrl: publicUrl,
    uploadedAt: new Date().toISOString(),
    courseId: courseId,
    semesterId: semesterId,
    subjectId: subjectId,
    unitId: unitId
  };
}

/**
 * Removes file from Supabase Storage bucket 'study-materials'.
 */
export async function deleteFileFromSupabaseStorage(cloudPath: string): Promise<boolean> {
  if (!cloudPath) return false;
  try {
    logDiagnostic("info", `Deleting file '${cloudPath}' from Supabase Storage...`);
    const { error } = await supabase.storage.from('study-materials').remove([cloudPath]);
    if (error) {
      logDiagnostic("warn", `[Supabase Delete Warning] ${error.message}`);
      return false;
    }
    logDiagnostic("success", `[Supabase Delete Success] File '${cloudPath}' deleted from storage.`);
    return true;
  } catch (err: any) {
    logDiagnostic("warn", `[Supabase Delete Error] ${err?.message || err}`);
    return false;
  }
}

/**
 * Merges uploaded study material records from Supabase DB into the base curriculum structure.
 * Supabase 'study_materials' table is the primary source of truth across all devices.
 */
export function mergeSupabaseMaterialsIntoCourses(
  baseCourses: Course[],
  supabaseMaterials: UploadResult[]
): Course[] {
  if (!baseCourses || !Array.isArray(baseCourses)) return baseCourses;

  // Clone base courses to avoid direct mutation
  const coursesCopy: Course[] = JSON.parse(JSON.stringify(baseCourses));

  if (!supabaseMaterials || !Array.isArray(supabaseMaterials) || supabaseMaterials.length === 0) {
    return coursesCopy;
  }

  // Set of valid identifiers present in Supabase DB for uploaded materials
  const validSupabaseIds = new Set(supabaseMaterials.map(m => m.id).filter(Boolean));
  const validSupabaseCloudPaths = new Set(supabaseMaterials.map(m => m.cloudPath).filter(Boolean));
  const validSupabaseUrls = new Set(supabaseMaterials.map(m => m.publicUrl).filter(Boolean));

  const isCloudMaterial = (m: StudyMaterial) => Boolean(m.cloudPath || (m.publicUrl && m.publicUrl.includes("supabase")));

  const isMaterialValidInSupabase = (m: StudyMaterial) => {
    if (!isCloudMaterial(m)) return true;
    if (m.id && validSupabaseIds.has(m.id)) return true;
    if (m.cloudPath && validSupabaseCloudPaths.has(m.cloudPath)) return true;
    if (m.publicUrl && validSupabaseUrls.has(m.publicUrl)) return true;
    return false;
  };

  // Clean stale uploaded materials that were deleted from Supabase
  const cleanUnitMaterialsRecursively = (u: Unit) => {
    if (u.materials) {
      u.materials = u.materials.filter(isMaterialValidInSupabase);
    }
    if (u.children && u.children.length > 0) {
      u.children.forEach(cleanUnitMaterialsRecursively);
    }
  };

  for (const course of coursesCopy) {
    for (const sem of course.semesters) {
      for (const subject of sem.subjects) {
        if (subject.materials) {
          subject.materials = subject.materials.filter(isMaterialValidInSupabase);
        }
        if (subject.textbooks) {
          subject.textbooks = subject.textbooks.filter(isMaterialValidInSupabase);
        }
        for (const unit of (subject.units || [])) {
          cleanUnitMaterialsRecursively(unit);
        }
      }
    }
  }

  // Helper to insert material recursively into unit tree
  const insertIntoUnitRecursive = (units: Unit[], matItem: StudyMaterial, targetUnitId: string, isSameFn: (existing: StudyMaterial) => boolean): boolean => {
    for (const u of units) {
      if (u.id === targetUnitId) {
        u.materials = u.materials || [];
        const uIdx = u.materials.findIndex(isSameFn);
        if (uIdx >= 0) {
          u.materials[uIdx] = { ...u.materials[uIdx], ...matItem };
        } else {
          u.materials.push(matItem);
        }
        return true;
      }
      if (u.children && u.children.length > 0) {
        const found = insertIntoUnitRecursive(u.children, matItem, targetUnitId, isSameFn);
        if (found) return true;
      }
    }
    return false;
  };

  // Merge each material from Supabase DB into the appropriate location
  for (const mat of supabaseMaterials) {
    if (!mat.publicUrl) continue;

    const matItem: StudyMaterial = {
      id: mat.id || `supa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: mat.name || "Uploaded Document",
      size: mat.size || "PDF Document",
      addedTime: "Uploaded by Admin",
      type: mat.type || "pdf",
      isBookmarked: false,
      tag: mat.unitId === "textbook" ? "Prescribed Textbook" : mat.unitId ? "Unit File" : "Subject File",
      details: mat.publicUrl,
      cloudPath: mat.cloudPath,
      publicUrl: mat.publicUrl,
      uploadedAt: mat.uploadedAt || new Date().toISOString(),
      courseId: mat.courseId,
      semesterId: mat.semesterId,
      subjectId: mat.subjectId,
      unitId: mat.unitId
    };

    const isSameMaterial = (existing: StudyMaterial) => {
      if (matItem.id && existing.id === matItem.id) return true;
      if (matItem.cloudPath && existing.cloudPath && existing.cloudPath === matItem.cloudPath) return true;
      if (matItem.publicUrl && existing.publicUrl && existing.publicUrl === matItem.publicUrl) return true;
      return false;
    };

    for (const course of coursesCopy) {
      if (mat.courseId && course.id !== mat.courseId) {
        const belongs = course.semesters.some(s => s.subjects.some(sub => sub.id === mat.subjectId));
        if (!belongs) continue;
      }

      for (const sem of course.semesters) {
        if (mat.semesterId && String(sem.id) !== String(mat.semesterId)) {
          const belongs = sem.subjects.some(sub => sub.id === mat.subjectId);
          if (!belongs) continue;
        }

        for (const subject of sem.subjects) {
          if (subject.id === mat.subjectId) {
            if (mat.unitId === "textbook") {
              subject.textbooks = subject.textbooks || [];
              const tbIdx = subject.textbooks.findIndex(isSameMaterial);
              if (tbIdx >= 0) {
                subject.textbooks[tbIdx] = { ...subject.textbooks[tbIdx], ...matItem };
              } else {
                subject.textbooks.push(matItem);
              }

              subject.materials = subject.materials || [];
              const mIdx = subject.materials.findIndex(isSameMaterial);
              if (mIdx >= 0) {
                subject.materials[mIdx] = { ...subject.materials[mIdx], ...matItem };
              } else {
                subject.materials.push(matItem);
              }
            } else if (mat.unitId) {
              const inserted = insertIntoUnitRecursive(subject.units || [], matItem, mat.unitId, isSameMaterial);
              if (!inserted) {
                subject.materials = subject.materials || [];
                const mIdx = subject.materials.findIndex(isSameMaterial);
                if (mIdx >= 0) {
                  subject.materials[mIdx] = { ...subject.materials[mIdx], ...matItem };
                } else {
                  subject.materials.push(matItem);
                }
              }
            } else {
              subject.materials = subject.materials || [];
              const mIdx = subject.materials.findIndex(isSameMaterial);
              if (mIdx >= 0) {
                subject.materials[mIdx] = { ...subject.materials[mIdx], ...matItem };
              } else {
                subject.materials.push(matItem);
              }
            }
          }
        }
      }
    }
  }

  return coursesCopy;
}

