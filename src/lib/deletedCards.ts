import { Course, Subject, Unit, StudyMaterial } from "../types";

const DELETED_CARDS_STORAGE_KEY = "readrabbit_deleted_card_ids";

// In-memory cache of deleted card IDs
let deletedIdsSet: Set<string> | null = null;

export function getDeletedCardIds(): Set<string> {
  if (deletedIdsSet !== null) {
    return deletedIdsSet;
  }
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(DELETED_CARDS_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        deletedIdsSet = new Set(parsed.filter(id => typeof id === "string" && id.trim().length > 0));
        return deletedIdsSet;
      }
    }
  } catch (e) {
    console.warn("[DELETED CARDS LOAD WARN]", e);
  }
  deletedIdsSet = new Set();
  return deletedIdsSet;
}

export function getDeletedCardIdsArray(): string[] {
  return Array.from(getDeletedCardIds());
}

export function addDeletedCardId(idOrIds: string | string[]): void {
  const currentSet = getDeletedCardIds();
  const idsToAdd = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
  let changed = false;

  for (const id of idsToAdd) {
    if (id && typeof id === "string" && id.trim().length > 0 && !currentSet.has(id.trim())) {
      currentSet.add(id.trim());
      changed = true;
    }
  }

  if (changed) {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(DELETED_CARDS_STORAGE_KEY, JSON.stringify(Array.from(currentSet)));
      }
    } catch (e) {
      console.warn("[DELETED CARDS SAVE WARN]", e);
    }
  }
}

export function mergeRemoteDeletedCardIds(remoteIds: unknown): void {
  if (!Array.isArray(remoteIds)) return;
  addDeletedCardId(remoteIds);
}

export function isCardDeleted(id: string): boolean {
  if (!id) return false;
  return getDeletedCardIds().has(id.trim());
}

/**
 * Recursively filters out any deleted courses, semesters, subjects, units, or materials.
 */
export function filterDeletedCards(courses: Course[]): Course[] {
  if (!courses || !Array.isArray(courses)) return courses;
  const deletedSet = getDeletedCardIds();
  if (deletedSet.size === 0) return courses;

  const filterUnitsRecursive = (units: Unit[]): Unit[] => {
    if (!units || !Array.isArray(units)) return [];
    return units
      .filter(u => !deletedSet.has(u.id))
      .map(u => {
        const copy: Unit = { ...u };
        if (copy.children && Array.isArray(copy.children)) {
          copy.children = filterUnitsRecursive(copy.children);
        }
        if (copy.materials && Array.isArray(copy.materials)) {
          copy.materials = copy.materials.filter(m => !deletedSet.has(m.id));
        }
        return copy;
      });
  };

  return courses
    .filter(c => !deletedSet.has(c.id))
    .map(course => {
      const semList = (course.semesters || []).map(sem => {
        const subList = (sem.subjects || [])
          .filter(sub => !deletedSet.has(sub.id))
          .map(subject => {
            const subCopy: Subject = { ...subject };
            if (subCopy.units && Array.isArray(subCopy.units)) {
              subCopy.units = filterUnitsRecursive(subCopy.units);
              subCopy.modulesCount = subCopy.units.length;
            }
            if (subCopy.materials && Array.isArray(subCopy.materials)) {
              subCopy.materials = subCopy.materials.filter(m => !deletedSet.has(m.id));
            }
            if (subCopy.textbooks && Array.isArray(subCopy.textbooks)) {
              subCopy.textbooks = subCopy.textbooks.filter(m => !deletedSet.has(m.id));
            }
            return subCopy;
          });

        const totalModules = subList.reduce((acc, s) => acc + (s.modulesCount || 0), 0);
        const completedModules = subList.reduce((acc, s) => acc + (s.completedModules || 0), 0);
        const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        return {
          ...sem,
          subjects: subList,
          completedModules,
          progressPercent
        };
      });

      return {
        ...course,
        semesters: semList
      };
    });
}
