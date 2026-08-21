import React, { useState, useMemo, useEffect, useRef } from "react";
import { Course, Semester, Subject, StudyMaterial } from "../types";
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ExternalLink, 
  Trash2, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  BookOpen, 
  FileDown, 
  Eye,
  GraduationCap,
  Lock,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Grid,
  List,
  Sparkles,
  Clock,
  Tag,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  FileCheck,
  HelpCircle,
  Printer,
  FileCode,
  FileSpreadsheet
} from "lucide-react";
import { uploadFileToCloud } from "../lib/firebase";
import { insertMaterialToSupabaseDB, deleteMaterialFromSupabase } from "../lib/supabase";
import { getFileFromIndexedDB, base64ToBlob } from "../lib/fileStorage";

export interface QuestionPaperItem {
  paper: StudyMaterial;
  courseId: string;
  courseName: string;
  semesterId: number;
  semesterName: string;
  subjectId: string;
  subjectName: string;
  unitId?: string;
  unitName?: string;
}

export interface SubjectPaperGroup {
  subjectName: string;
  papers: QuestionPaperItem[];
}

export interface SemesterPaperGroup {
  semesterName: string;
  subjects: Record<string, SubjectPaperGroup>;
}

export interface QuestionPaperLibraryProps {
  courses: Course[];
  activeCourseId: string | null;
  isAdmin: boolean;
  onUpdateCourses: (updatedCourses: Course[]) => void;
  onNavigateToSubject?: (courseId: string, semesterId: number, subjectId: string) => void;
}

export default function QuestionPaperLibrary({
  courses,
  activeCourseId,
  isAdmin,
  onUpdateCourses,
  onNavigateToSubject,
}: QuestionPaperLibraryProps) {
  // Course selection
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    return activeCourseId || (courses.length > 0 ? courses[0].id : "bca");
  });

  // Selected semester tab (null means All Semesters)
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null);
  
  // Selected subject filter (null means All Subjects in that semester)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Search query, year filter, category filter & sort
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"year-desc" | "year-asc" | "recent" | "subject">("year-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // In-App PDF Preview Reader Modal State
  const [previewPaper, setPreviewPaper] = useState<StudyMaterial | null>(null);
  const [previewItemContext, setPreviewItemContext] = useState<{
    courseName?: string;
    semesterName?: string;
    subjectName?: string;
  } | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);
  const [copiedLinkPaperId, setCopiedLinkPaperId] = useState<string | null>(null);
  const [downloadProgressId, setDownloadProgressId] = useState<string | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showAdminRequiredModal, setShowAdminRequiredModal] = useState(false);
  const [uploadCourseId, setUploadCourseId] = useState<string>(() => selectedCourseId);
  const [uploadSemId, setUploadSemId] = useState<number>(1);
  const [uploadSubjectId, setUploadSubjectId] = useState<string>("");
  const [paperYear, setPaperYear] = useState<string>(new Date().getFullYear().toString());
  const [paperExamType, setPaperExamType] = useState<string>("Semester End Exam (Nov / Dec)");
  const [paperScheme, setPaperScheme] = useState<string>("NEP 2020 Scheme (60 Marks)");
  const [paperTitle, setPaperTitle] = useState<string>("");
  const [paperNotes, setPaperNotes] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<string>("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Get active course object
  const currentCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0] || null;
  }, [courses, selectedCourseId]);

  // List of semesters for current course
  const currentSemesters = useMemo(() => {
    return currentCourse?.semesters || [];
  }, [currentCourse]);

  // Course object for upload modal
  const uploadTargetCourse = useMemo(() => {
    return courses.find((c) => c.id === uploadCourseId) || courses[0] || null;
  }, [courses, uploadCourseId]);

  const uploadTargetSemesters = useMemo(() => {
    return uploadTargetCourse?.semesters || [];
  }, [uploadTargetCourse]);

  // List of subjects available for upload based on uploadCourseId and uploadSemId
  const availableSubjectsForUpload = useMemo(() => {
    const sem = uploadTargetSemesters.find((s) => s.id === uploadSemId);
    return sem?.subjects || [];
  }, [uploadTargetSemesters, uploadSemId]);

  const availableSubjectsForFilter = useMemo(() => {
    if (!selectedSemesterId) return [];
    const sem = currentSemesters.find((s) => s.id === selectedSemesterId);
    return sem?.subjects || [];
  }, [currentSemesters, selectedSemesterId]);

  // Extract all Previous Year Question Papers from the course hierarchy
  const allQuestionPapers = useMemo(() => {
    if (!currentCourse) return [];
    const papers: QuestionPaperItem[] = [];

    currentCourse.semesters.forEach((sem) => {
      sem.subjects.forEach((sub) => {
        // Collect from subject level materials
        (sub.materials || []).forEach((mat) => {
          const isPYQ =
            mat.type === "question" ||
            mat.tag?.toLowerCase().includes("pyq") ||
            mat.tag?.toLowerCase().includes("question") ||
            mat.tag?.toLowerCase().includes("exam") ||
            mat.tag?.toLowerCase().includes("paper") ||
            mat.name?.toLowerCase().includes("question paper") ||
            mat.name?.toLowerCase().includes("qp") ||
            mat.name?.toLowerCase().includes("202") ||
            mat.name?.toLowerCase().includes("201") ||
            mat.name?.toLowerCase().includes("midterm") ||
            mat.name?.toLowerCase().includes("end sem");

          if (isPYQ) {
            papers.push({
              paper: mat,
              courseId: currentCourse.id,
              courseName: currentCourse.name,
              semesterId: sem.id,
              semesterName: sem.name,
              subjectId: sub.id,
              subjectName: sub.name,
            });
          }
        });

        // Helper to extract PYQs from units recursively
        const extractFromUnits = (unitsList: typeof sub.units) => {
          (unitsList || []).forEach((unit) => {
            (unit.materials || []).forEach((mat) => {
              const isPYQ =
                mat.type === "question" ||
                mat.tag?.toLowerCase().includes("pyq") ||
                mat.tag?.toLowerCase().includes("question") ||
                mat.tag?.toLowerCase().includes("exam") ||
                mat.name?.toLowerCase().includes("question paper") ||
                mat.name?.toLowerCase().includes("qp") ||
                mat.name?.toLowerCase().includes("202") ||
                mat.name?.toLowerCase().includes("201");

              if (isPYQ) {
                papers.push({
                  paper: mat,
                  courseId: currentCourse.id,
                  courseName: currentCourse.name,
                  semesterId: sem.id,
                  semesterName: sem.name,
                  subjectId: sub.id,
                  subjectName: sub.name,
                  unitId: unit.id,
                  unitName: unit.name,
                });
              }
            });

            if (unit.children && unit.children.length > 0) {
              extractFromUnits(unit.children);
            }
          });
        };

        extractFromUnits(sub.units);
      });
    });

    return papers;
  }, [currentCourse]);

  // Distinct exam years list
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allQuestionPapers.forEach((item) => {
      const match = (item.paper.name + " " + (item.paper.tag || "") + " " + (item.paper.details || "")).match(/\b(201\d|202\d)\b/);
      if (match) {
        years.add(match[1]);
      }
    });
    return Array.from(years).sort().reverse();
  }, [allQuestionPapers]);

  // Helper to extract numerical year from item
  const getItemYear = (item: QuestionPaperItem): number => {
    const match = (item.paper.name + " " + (item.paper.tag || "") + " " + (item.paper.details || "")).match(/\b(201\d|202\d)\b/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Filtered & Sorted Question Papers
  const filteredPapers = useMemo(() => {
    let list = allQuestionPapers.filter((item) => {
      // Semester filter
      if (selectedSemesterId !== null && item.semesterId !== selectedSemesterId) {
        return false;
      }
      // Subject filter
      if (selectedSubjectId !== null && item.subjectId !== selectedSubjectId) {
        return false;
      }
      // Year filter
      if (yearFilter !== "all") {
        const text = `${item.paper.name} ${item.paper.tag || ""} ${item.paper.details || ""}`;
        if (!text.includes(yearFilter)) return false;
      }
      // Category filter
      if (categoryFilter !== "all") {
        const text = `${item.paper.name} ${item.paper.tag || ""} ${item.paper.details || ""}`.toLowerCase();
        if (categoryFilter === "endsem" && !text.includes("end sem") && !text.includes("main") && !text.includes("annual")) return false;
        if (categoryFilter === "midterm" && !text.includes("mid") && !text.includes("internal") && !text.includes("cie")) return false;
        if (categoryFilter === "model" && !text.includes("model") && !text.includes("sample")) return false;
        if (categoryFilter === "supp" && !text.includes("supp") && !text.includes("repeat")) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.paper.name.toLowerCase().includes(q);
        const matchesSubject = item.subjectName.toLowerCase().includes(q);
        const matchesSemester = item.semesterName.toLowerCase().includes(q);
        const matchesTag = item.paper.tag?.toLowerCase().includes(q);
        const matchesDetails = item.paper.details?.toLowerCase().includes(q);
        return matchesName || matchesSubject || matchesSemester || matchesTag || matchesDetails;
      }
      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "year-desc") {
        return getItemYear(b) - getItemYear(a);
      }
      if (sortBy === "year-asc") {
        return getItemYear(a) - getItemYear(b);
      }
      if (sortBy === "subject") {
        return a.subjectName.localeCompare(b.subjectName);
      }
      // Default: recent upload
      const tA = a.paper.uploadedAt ? new Date(a.paper.uploadedAt).getTime() : 0;
      const tB = b.paper.uploadedAt ? new Date(b.paper.uploadedAt).getTime() : 0;
      return tB - tA;
    });

    return list;
  }, [allQuestionPapers, selectedSemesterId, selectedSubjectId, yearFilter, categoryFilter, searchQuery, sortBy]);

  // Group papers by Semester & Subject for organized academic layout
  const groupedPapers = useMemo(() => {
    const groups: Record<number, SemesterPaperGroup> = {};

    filteredPapers.forEach((item) => {
      if (!groups[item.semesterId]) {
        groups[item.semesterId] = {
          semesterName: item.semesterName,
          subjects: {},
        };
      }
      if (!groups[item.semesterId].subjects[item.subjectId]) {
        groups[item.semesterId].subjects[item.subjectId] = {
          subjectName: item.subjectName,
          papers: [],
        };
      }
      groups[item.semesterId].subjects[item.subjectId].papers.push(item);
    });

    return groups;
  }, [filteredPapers]);

  // Generate Suggested Title
  const handleAutoSuggestTitle = () => {
    const sem = uploadTargetSemesters.find((s) => s.id === uploadSemId);
    const sub = sem?.subjects.find((s) => s.id === uploadSubjectId);
    const subName = sub ? sub.name : "Subject";
    const semNum = uploadSemId;
    const yr = paperYear || new Date().getFullYear().toString();
    setPaperTitle(`${uploadTargetCourse?.name.split(" ")[0] || "BCA"} Sem ${semNum} ${subName} - ${yr} Question Paper`);
  };

  // Open Upload Trigger
  const handleOpenUploadTrigger = () => {
    if (!isAdmin) {
      setShowAdminRequiredModal(true);
      return;
    }

    setUploadCourseId(selectedCourseId);
    const targetSem = currentSemesters[0];
    if (targetSem) {
      setUploadSemId(targetSem.id);
      if (targetSem.subjects.length > 0) {
        setUploadSubjectId(targetSem.subjects[0].id);
      }
    }
    setUploadError("");
    setUploadSuccess("");
    setIsUploadModalOpen(true);
  };

  // Handle Question Paper Upload (Admin Only)
  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setUploadError("Unauthorized: Only verified administrators can upload question papers.");
      return;
    }
    if (!uploadFile) {
      setUploadError("Please select a PDF or Document question paper file to upload.");
      return;
    }
    if (!uploadSubjectId) {
      setUploadError("Please select a valid subject for this semester.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError("");
      setUploadSuccess("");
      setUploadProgressMsg("Connecting to Supabase Cloud Storage engine...");

      // 1. Format clean title
      const finalTitle = paperTitle.trim()
        ? paperTitle.trim()
        : `${uploadFile.name.replace(/\.[^/.]+$/, "")} (${paperYear || "PYQ"})`;

      // 2. Upload file to Supabase Cloud Storage
      const res = await uploadFileToCloud(
        uploadFile,
        `pyq/${uploadCourseId}/sem_${uploadSemId}/${uploadSubjectId}`,
        (pct, statusMsg) => {
          setUploadProgressMsg(`⏳ ${pct}% - ${statusMsg}`);
        },
        {
          courseId: uploadCourseId,
          semesterId: String(uploadSemId),
          subjectId: uploadSubjectId,
          unitId: "pyq_library",
        }
      );

      // 3. Format StudyMaterial object
      const tagContent = `PYQ ${paperYear} • ${paperExamType} • ${paperScheme}`;
      const descContent = paperNotes.trim()
        ? paperNotes.trim()
        : `Previous Year Examination Paper (${paperYear} - ${paperExamType}). Pattern: ${paperScheme}.`;

      const newPaper: StudyMaterial = {
        id: `pyq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: finalTitle,
        size: res.size || `${(uploadFile.size / 1024).toFixed(0)} KB`,
        addedTime: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        type: "question",
        isBookmarked: false,
        tag: tagContent,
        details: descContent,
        publicUrl: res.publicUrl,
        cloudPath: res.cloudPath,
        uploadedAt: new Date().toISOString(),
        courseId: uploadCourseId,
        semesterId: String(uploadSemId),
        subjectId: uploadSubjectId,
        unitId: "pyq_library",
      };

      // 4. Save metadata record to Supabase SQL Database
      try {
        await insertMaterialToSupabaseDB({
          id: newPaper.id,
          name: newPaper.name,
          type: newPaper.type,
          size: newPaper.size,
          cloudPath: res.cloudPath,
          publicUrl: res.publicUrl,
          uploadedAt: newPaper.uploadedAt || new Date().toISOString(),
          courseId: uploadCourseId,
          semesterId: String(uploadSemId),
          subjectId: uploadSubjectId,
          unitId: "pyq_library",
        });
      } catch (dbErr) {
        console.warn("[SUPABASE DB INSERT NON-BLOCKING]", dbErr);
      }

      // 5. Update Courses hierarchy state
      const updatedCourses = courses.map((course) => {
        if (course.id !== uploadCourseId) return course;

        const updatedSemesters = course.semesters.map((sem) => {
          if (sem.id !== uploadSemId) return sem;

          const updatedSubjects = sem.subjects.map((sub) => {
            if (sub.id !== uploadSubjectId) return sub;

            return {
              ...sub,
              materials: [newPaper, ...(sub.materials || [])],
            };
          });

          return {
            ...sem,
            subjects: updatedSubjects,
          };
        });

        return {
          ...course,
          semesters: updatedSemesters,
        };
      });

      onUpdateCourses(updatedCourses);
      setUploadSuccess(`🎉 Successfully uploaded and stored "${finalTitle}"!`);
      setUploadFile(null);
      setPaperTitle("");
      setPaperNotes("");

      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadSuccess("");
        setUploadProgressMsg("");
      }, 1400);
    } catch (err: any) {
      console.error("[UPLOAD PYQ ERROR]", err);
      setUploadError(err.message || "Failed to upload question paper. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Question Paper (Admin Only with cloud purge)
  const handleDeletePaper = async (courseId: string, semId: number, subId: string, paper: StudyMaterial) => {
    if (!isAdmin) {
      alert("Unauthorized: Only verified administrators can delete study materials.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${paper.name}"? This will permanently delete the file from cloud storage.`)) {
      return;
    }

    try {
      setIsDeletingId(paper.id);
      // Delete from Supabase Storage & DB
      await deleteMaterialFromSupabase(paper.id, paper.cloudPath);

      // Remove from courses state
      const updatedCourses = courses.map((course) => {
        if (course.id !== courseId) return course;

        const updatedSemesters = course.semesters.map((sem) => {
          if (sem.id !== semId) return sem;

          const updatedSubjects = sem.subjects.map((sub) => {
            if (sub.id !== subId) return sub;

            const filteredSubMaterials = (sub.materials || []).filter((m) => m.id !== paper.id);

            const removePaperFromUnitsRecursive = (units: typeof sub.units): typeof sub.units => {
              return (units || []).map((u) => ({
                ...u,
                materials: (u.materials || []).filter((m) => m.id !== paper.id),
                ...(u.children ? { children: removePaperFromUnitsRecursive(u.children) } : {}),
              }));
            };

            return {
              ...sub,
              materials: filteredSubMaterials,
              units: removePaperFromUnitsRecursive(sub.units),
            };
          });

          return {
            ...sem,
            subjects: updatedSubjects,
          };
        });

        return {
          ...course,
          semesters: updatedSemesters,
        };
      });

      onUpdateCourses(updatedCourses);
      if (previewPaper?.id === paper.id) {
        setPreviewPaper(null);
      }
      alert("Question paper deleted successfully! 🥕");
    } catch (err) {
      console.error("[DELETE ERROR]", err);
      alert("Encountered an issue during deletion. Please verify your connection.");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Resolve material content (IndexedDB, Base64 Data URL, or Public Cloud Storage URL) for in-app preview
  useEffect(() => {
    let isMounted = true;
    if (!previewPaper) {
      if (previewBlobUrl && previewBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewBlobUrl);
      }
      setPreviewBlobUrl(null);
      setIsLoadingPreview(false);
      return;
    }

    async function resolvePreviewUrl() {
      setIsLoadingPreview(true);
      try {
        if (!previewPaper) return;

        // 1. Direct Cloud URL or HTTP/HTTPS
        if (
          previewPaper.publicUrl &&
          (previewPaper.publicUrl.startsWith("http://") ||
            previewPaper.publicUrl.startsWith("https://") ||
            previewPaper.publicUrl.startsWith("/api/files/"))
        ) {
          if (isMounted) {
            setPreviewBlobUrl(previewPaper.publicUrl);
          }
          return;
        }

        // 2. Check details field
        const details = previewPaper.details || "";
        if (details.startsWith("indexeddb://")) {
          const fileId = details.replace("indexeddb://", "");
          const dbData = await getFileFromIndexedDB(fileId);
          if (dbData && isMounted) {
            if (dbData instanceof Blob) {
              const url = URL.createObjectURL(dbData);
              setPreviewBlobUrl(url);
            } else if (typeof dbData === "string") {
              if (dbData.startsWith("data:")) {
                const blob = base64ToBlob(dbData, "application/pdf");
                const url = URL.createObjectURL(blob);
                setPreviewBlobUrl(url);
              } else {
                setPreviewBlobUrl(dbData);
              }
            }
          }
        } else if (details.startsWith("data:")) {
          const blob = base64ToBlob(details, "application/pdf");
          const url = URL.createObjectURL(blob);
          if (isMounted) setPreviewBlobUrl(url);
        } else if (previewPaper.id) {
          // 3. Fallback: check IndexedDB using material ID directly
          const dbData = await getFileFromIndexedDB(previewPaper.id);
          if (dbData && isMounted) {
            if (dbData instanceof Blob) {
              const url = URL.createObjectURL(dbData);
              setPreviewBlobUrl(url);
            } else if (typeof dbData === "string" && dbData.startsWith("data:")) {
              const blob = base64ToBlob(dbData, "application/pdf");
              const url = URL.createObjectURL(blob);
              setPreviewBlobUrl(url);
            } else if (typeof dbData === "string") {
              setPreviewBlobUrl(dbData);
            }
          } else {
            if (isMounted) {
              setPreviewBlobUrl(previewPaper.publicUrl || (details.startsWith("http") ? details : null));
            }
          }
        } else {
          if (isMounted) setPreviewBlobUrl(previewPaper.publicUrl || null);
        }
      } catch (err) {
        console.error("Error resolving preview URL:", err);
      } finally {
        if (isMounted) setIsLoadingPreview(false);
      }
    }

    resolvePreviewUrl();

    return () => {
      isMounted = false;
    };
  }, [previewPaper]);

  // Handle Escape key to close modal & browser back popstate integration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && previewPaper) {
        setPreviewPaper(null);
        setIsFullscreenPreview(false);
      }
    };
    const handlePopState = () => {
      if (previewPaper) {
        setPreviewPaper(null);
        setIsFullscreenPreview(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [previewPaper]);

  // Open Preview Modal Handler
  const handleOpenPreview = (
    item: QuestionPaperItem | StudyMaterial,
    context?: { courseName?: string; semesterName?: string; subjectName?: string }
  ) => {
    window.history.pushState({ ...(window.history.state || {}), subModal: "pyq_preview" }, "");
    if ("paper" in item) {
      setPreviewPaper(item.paper);
      setPreviewItemContext({
        courseName: item.courseName,
        semesterName: item.semesterName,
        subjectName: item.subjectName,
      });
    } else {
      setPreviewPaper(item);
      setPreviewItemContext(context || null);
    }
  };

  // Close Preview Modal Handler
  const handleClosePreview = () => {
    setPreviewPaper(null);
    setIsFullscreenPreview(false);
  };

  // Print Question Paper from within Preview Modal
  const handlePrintPreview = () => {
    if (previewIframeRef.current && previewIframeRef.current.contentWindow) {
      try {
        previewIframeRef.current.contentWindow.focus();
        previewIframeRef.current.contentWindow.print();
        return;
      } catch (e) {
        console.warn("Direct iframe print blocked by sandbox, falling back to window.print():", e);
      }
    }
    window.print();
  };

  // Direct Download File Helper
  const handleDownloadFile = async (paper: StudyMaterial) => {
    setDownloadProgressId(paper.id);
    try {
      const downloadTarget =
        previewBlobUrl ||
        paper.publicUrl ||
        (paper.details && !paper.details.startsWith("indexeddb://") ? paper.details : null);

      if (downloadTarget && (downloadTarget.startsWith("blob:") || downloadTarget.startsWith("data:"))) {
        const link = document.createElement("a");
        link.href = downloadTarget;
        link.download = paper.name.endsWith(".pdf") ? paper.name : `${paper.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      if (downloadTarget && (downloadTarget.startsWith("http") || downloadTarget.startsWith("/api/"))) {
        const link = document.createElement("a");
        link.href = downloadTarget;
        link.target = "_blank";
        link.download = paper.name.endsWith(".pdf") ? paper.name : `${paper.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Check IndexedDB
      const dbData = await getFileFromIndexedDB(paper.id);
      if (dbData) {
        let blob: Blob;
        if (dbData instanceof Blob) {
          blob = dbData;
        } else if (typeof dbData === "string" && dbData.startsWith("data:")) {
          blob = base64ToBlob(dbData, "application/pdf");
        } else {
          blob = new Blob([dbData], { type: "application/pdf" });
        }
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = paper.name.endsWith(".pdf") ? paper.name : `${paper.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
        return;
      }

      alert("This question paper does not have a downloadable file link.");
    } catch (e) {
      console.error("Download failure:", e);
      if (paper.publicUrl) {
        window.open(paper.publicUrl, "_blank");
      }
    } finally {
      setTimeout(() => setDownloadProgressId(null), 1000);
    }
  };

  // Copy Direct Link to Clipboard
  const handleCopyLink = (paper: StudyMaterial) => {
    const targetUrl = paper.publicUrl || (paper.details?.startsWith("http") ? paper.details : window.location.href);
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopiedLinkPaperId(paper.id);
    setTimeout(() => setCopiedLinkPaperId(null), 2000);
  };

  // Total stats
  const totalDegreesCount = courses.length;
  const totalSemestersWithPapers = Object.keys(groupedPapers).length;

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-[#dac1c1]/40 shadow-sm relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#fd9b65]/15 via-transparent to-transparent pointer-events-none rounded-bl-full" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="p-2 bg-[#fd9b65]/20 text-[#40010d] rounded-2xl flex items-center justify-center">
                  <GraduationCap size={24} className="text-[#40010d]" />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#95491a] bg-[#FAF3E0] px-3 py-1 rounded-full border border-[#D8C4AC]/40">
                  Past University Exam Papers
                </span>
                {isAdmin ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                    <ShieldCheck size={12} /> Admin Mode (Full Upload & Delete Access)
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-[#735E55] bg-[#F4ECE1]/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <BookOpen size={12} /> Student Access (Read & Download)
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#40010d] tracking-tight">
                Question Paper Library & Model Bank
              </h2>
              
              <p className="text-xs md:text-sm text-[#544243] font-medium leading-relaxed">
                A verified repository of previous university question papers, midterm assessments, model answers, and scheme solutions. Access, preview, and download PDFs instantly.
              </p>

              {/* Quick Academic Key Metrics */}
              <div className="flex items-center gap-4 pt-2 text-xs font-bold text-[#735E55] flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#FAF3E0]/70 px-3 py-1.5 rounded-xl border border-[#dac1c1]/30">
                  <FileText size={14} className="text-[#95491a]" />
                  <span>{allQuestionPapers.length} Question Papers Indexed</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FAF3E0]/70 px-3 py-1.5 rounded-xl border border-[#dac1c1]/30">
                  <Layers size={14} className="text-[#95491a]" />
                  <span>{currentSemesters.length} Semesters Covered</span>
                </div>
                {availableYears.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-[#FAF3E0]/70 px-3 py-1.5 rounded-xl border border-[#dac1c1]/30">
                    <Calendar size={14} className="text-[#95491a]" />
                    <span>Years: {availableYears[availableYears.length - 1]} – {availableYears[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {/* Upload Button */}
              <button
                type="button"
                onClick={handleOpenUploadTrigger}
                className={`flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold rounded-2xl shadow-md transition-all transform active:scale-95 cursor-pointer ${
                  isAdmin
                    ? "bg-[#40010d] hover:bg-[#5a0213] text-white hover:shadow-lg"
                    : "bg-white hover:bg-[#FAF3E0] text-[#40010d] border border-[#dac1c1]/60"
                }`}
              >
                {isAdmin ? (
                  <>
                    <Upload size={16} className="text-[#fd9b65]" />
                    <span>Upload Question Paper</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} className="text-[#95491a]" />
                    <span>Upload (Admin Only)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* COURSE & SEMESTER CONTROLS BAR */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-[#dac1c1]/30 shadow-xs space-y-4">
          {/* Degree / Course Selection */}
          {courses.length > 1 && (
            <div className="flex items-center gap-2 pb-3 border-b border-[#dac1c1]/20 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-extrabold text-[#735E55] uppercase tracking-wider px-1 shrink-0">
                Degree:
              </span>
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setSelectedSemesterId(null);
                    setSelectedSubjectId(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCourseId === course.id
                      ? "bg-[#40010d] text-white shadow-xs"
                      : "bg-[#F4ECE1] text-[#544243] hover:bg-[#e8dbce]"
                  }`}
                >
                  {course.name}
                </button>
              ))}
            </div>
          )}

          {/* Semester Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => {
                setSelectedSemesterId(null);
                setSelectedSubjectId(null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                selectedSemesterId === null
                  ? "bg-[#fd9b65] text-[#40010d] shadow-xs font-extrabold"
                  : "bg-[#F4ECE1]/80 text-[#544243] hover:bg-[#e8dbce]"
              }`}
            >
              <Layers size={14} />
              <span>All Semesters ({allQuestionPapers.length})</span>
            </button>

            {currentSemesters.map((sem) => {
              const semPaperCount = allQuestionPapers.filter((p) => p.semesterId === sem.id).length;
              return (
                <button
                  key={sem.id}
                  onClick={() => {
                    setSelectedSemesterId(sem.id);
                    setSelectedSubjectId(null);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    selectedSemesterId === sem.id
                      ? "bg-[#40010d] text-white shadow-xs"
                      : "bg-[#F4ECE1]/80 text-[#544243] hover:bg-[#e8dbce]"
                  }`}
                >
                  <span>{sem.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      selectedSemesterId === sem.id ? "bg-white/20 text-white" : "bg-black/10 text-[#544243]"
                    }`}
                  >
                    {semPaperCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subject Filter (Visible when a specific semester is chosen) */}
          {selectedSemesterId !== null && availableSubjectsForFilter.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#dac1c1]/20">
              <span className="text-[11px] font-bold text-[#735E55] uppercase tracking-wider whitespace-nowrap">
                Subject Filter:
              </span>
              <button
                onClick={() => setSelectedSubjectId(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  selectedSubjectId === null
                    ? "bg-[#40010d] text-white"
                    : "bg-white text-[#544243] border border-[#dac1c1]/40 hover:bg-[#F4ECE1]"
                }`}
              >
                All Subjects
              </button>
              {availableSubjectsForFilter.map((sub) => {
                const subCount = allQuestionPapers.filter(
                  (p) => p.semesterId === selectedSemesterId && p.subjectId === sub.id
                ).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      selectedSubjectId === sub.id
                        ? "bg-[#40010d] text-white"
                        : "bg-white text-[#544243] border border-[#dac1c1]/40 hover:bg-[#F4ECE1]"
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span className="text-[10px] opacity-75 font-bold">({subCount})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ADVANCED SEARCH, YEAR, CATEGORY & VIEW CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#877272]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject, year (e.g. 2024), exam type, question details..."
                className="w-full pl-10 pr-8 py-2.5 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-2xl text-xs text-[#40010d] placeholder:text-[#877272] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 focus:border-[#40010d] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#877272] hover:text-[#40010d] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Exam Year Filter */}
            <div className="md:col-span-2 flex items-center gap-1.5">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-2xl text-xs font-semibold text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 cursor-pointer"
              >
                <option value="all">All Exam Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Year {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Category Filter */}
            <div className="md:col-span-2 flex items-center gap-1.5">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-2xl text-xs font-semibold text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="endsem">Semester End Exam</option>
                <option value="midterm">Mid-Term / Internal</option>
                <option value="model">Model Question Paper</option>
                <option value="supp">Supplementary Exam</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="md:col-span-2 flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-2xl text-xs font-semibold text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 cursor-pointer"
              >
                <option value="year-desc">Newest Year First</option>
                <option value="year-asc">Oldest Year First</option>
                <option value="recent">Recently Uploaded</option>
                <option value="subject">Subject Name (A-Z)</option>
              </select>
            </div>

            {/* Layout Toggle Buttons */}
            <div className="md:col-span-1 flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#40010d] text-white shadow-xs"
                    : "bg-[#F4ECE1] text-[#544243] hover:bg-[#e8dbce]"
                }`}
                title="Grid View"
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#40010d] text-white shadow-xs"
                    : "bg-[#F4ECE1] text-[#544243] hover:bg-[#e8dbce]"
                }`}
                title="Detailed Table / List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* QUESTION PAPERS ORGANIZED BY SEMESTERS & SUBJECTS */}
        {filteredPapers.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 text-center border border-[#dac1c1]/30 max-w-xl mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 bg-[#fd9b65]/20 text-[#40010d] rounded-3xl flex items-center justify-center mx-auto mb-2">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-[#40010d]">No Question Papers Found</h3>
            <p className="text-xs text-[#544243] leading-relaxed max-w-md mx-auto">
              {searchQuery || yearFilter !== "all" || categoryFilter !== "all" || selectedSemesterId !== null
                ? "No previous year question papers matched your specific filter criteria. Try resetting filters or searching with general terms."
                : "No question papers have been indexed for this curriculum yet."}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              {(searchQuery || yearFilter !== "all" || categoryFilter !== "all" || selectedSemesterId !== null) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setYearFilter("all");
                    setCategoryFilter("all");
                    setSelectedSemesterId(null);
                    setSelectedSubjectId(null);
                  }}
                  className="px-5 py-2.5 bg-[#FAF3E0] hover:bg-[#e8dbce] text-[#40010d] text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenUploadTrigger}
                className="px-6 py-2.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Upload size={14} />
                <span>Upload Question Paper</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {(Object.entries(groupedPapers) as [string, SemesterPaperGroup][]).map(([semIdStr, semData]) => {
              const semId = parseInt(semIdStr, 10);
              return (
                <div
                  key={semId}
                  className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#dac1c1]/30 shadow-xs space-y-6"
                >
                  {/* Semester Section Banner */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#dac1c1]/20">
                    <div className="flex items-center gap-3.5">
                      <span className="w-10 h-10 rounded-2xl bg-[#40010d] text-white flex items-center justify-center text-sm font-extrabold shadow-xs">
                        S{semId}
                      </span>
                      <div>
                        <h3 className="text-xl font-extrabold text-[#40010d]">{semData.semesterName}</h3>
                        <p className="text-xs text-[#735E55] font-medium">
                          {Object.keys(semData.subjects).length} Subjects • {Object.values(semData.subjects).reduce((acc, s) => acc + s.papers.length, 0)} Question Papers Available
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subjects Sub-sections */}
                  <div className="space-y-8">
                    {(Object.entries(semData.subjects) as [string, SubjectPaperGroup][]).map(([subId, subData]) => (
                      <div key={subId} className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="p-1.5 bg-[#FAF3E0] text-[#95491a] rounded-lg">
                              <BookOpen size={16} />
                            </span>
                            <h4 className="text-base font-extrabold text-[#40010d]">{subData.subjectName}</h4>
                            <span className="text-[11px] bg-[#FAF3E0] text-[#95491a] px-2.5 py-0.5 rounded-full font-bold border border-[#D8C4AC]/40">
                              {subData.papers.length} {subData.papers.length === 1 ? "Paper" : "Papers"}
                            </span>
                          </div>

                          {onNavigateToSubject && (
                            <button
                              type="button"
                              onClick={() => onNavigateToSubject(selectedCourseId, semId, subId)}
                              className="text-xs font-bold text-[#95491a] hover:text-[#40010d] flex items-center gap-1.5 px-3 py-1 bg-[#FAF3E0]/70 hover:bg-[#FAF3E0] rounded-xl transition-all cursor-pointer"
                            >
                              <span>Open Subject Hub</span>
                              <ExternalLink size={12} />
                            </button>
                          )}
                        </div>

                        {/* Papers Grid View */}
                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {subData.papers.map((item) => {
                              const { paper } = item;
                              const matchYear = (paper.name + " " + (paper.tag || "")).match(/\b(201\d|202\d)\b/);
                              const yearTag = matchYear ? matchYear[1] : null;
                              const isDownloading = downloadProgressId === paper.id;

                              return (
                                <div
                                  key={paper.id}
                                  className="group bg-[#FAF3E0]/40 hover:bg-[#FAF3E0]/90 rounded-2xl p-5 border border-[#dac1c1]/40 transition-all duration-200 flex flex-col justify-between hover:shadow-md relative overflow-hidden"
                                >
                                  <div>
                                    {/* Card Header & Badges */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div
                                          onClick={() => handleOpenPreview(item)}
                                          className="p-2.5 bg-red-100 text-red-700 rounded-2xl shrink-0 group-hover:scale-105 transition-transform cursor-pointer"
                                          title="Click to Preview Question Paper"
                                        >
                                          <FileText size={20} />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            {yearTag && (
                                              <span className="text-[10px] font-extrabold bg-[#40010d] text-white px-2 py-0.5 rounded-md">
                                                {yearTag}
                                              </span>
                                            )}
                                            <span className="text-[10px] font-bold text-[#95491a] bg-[#FAF3E0] px-2 py-0.5 rounded-md border border-[#D8C4AC]/40 truncate">
                                              {paper.tag?.split("•")[1]?.trim() || "EXAM PAPER"}
                                            </span>
                                          </div>
                                          {/* File name on a single clean line */}
                                          <h5
                                            onClick={() => handleOpenPreview(item)}
                                            className="text-xs font-bold text-[#40010d] mt-1 truncate hover:text-[#95491a] cursor-pointer transition-colors"
                                            title={paper.name}
                                          >
                                            {paper.name}
                                          </h5>
                                        </div>
                                      </div>

                                      {/* Admin Delete Action */}
                                      {isAdmin && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeletePaper(selectedCourseId, semId, subId, paper)}
                                          disabled={isDeletingId === paper.id}
                                          title="Delete Question Paper (Admin Only)"
                                          className="text-red-400 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                        >
                                          {isDeletingId === paper.id ? (
                                            <RefreshCw size={14} className="animate-spin text-red-600" />
                                          ) : (
                                            <Trash2 size={14} />
                                          )}
                                        </button>
                                      )}
                                    </div>

                                    {/* Paper Details / Scheme info */}
                                    {paper.details && (
                                      <p className="text-[11px] text-[#544243] line-clamp-2 leading-relaxed mb-3 font-normal">
                                        {paper.details}
                                      </p>
                                    )}

                                    {/* Metadata Footer */}
                                    <div className="flex items-center gap-2 text-[10px] text-[#877272] font-medium mb-4 flex-wrap">
                                      <span>Size: {paper.size || "1.2 MB"}</span>
                                      <span>•</span>
                                      <span>{paper.addedTime || "Recent"}</span>
                                    </div>
                                  </div>

                                  {/* Action Buttons in a dedicated row below */}
                                  <div className="pt-3 border-t border-[#dac1c1]/30 flex items-center gap-2">
                                    {/* In-App Central Preview Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPreview(item)}
                                      className="flex-1 py-2 px-3 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl text-center transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                                      title="Open preview modal within application"
                                    >
                                      <Eye size={14} />
                                      <span>View</span>
                                    </button>

                                    {/* Direct Download Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadFile(paper)}
                                      disabled={isDownloading}
                                      className="p-2 bg-[#F4ECE1] hover:bg-[#e8dbce] text-[#40010d] rounded-xl transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                                      title="Download PDF File"
                                    >
                                      {isDownloading ? (
                                        <RefreshCw size={16} className="animate-spin text-[#95491a]" />
                                      ) : (
                                        <FileDown size={16} />
                                      )}
                                    </button>

                                    {/* Copy Link Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleCopyLink(paper)}
                                      className="p-2 bg-[#F4ECE1] hover:bg-[#e8dbce] text-[#40010d] rounded-xl transition-all cursor-pointer active:scale-95"
                                      title="Copy Direct Document Link"
                                    >
                                      {copiedLinkPaperId === paper.id ? (
                                        <Check size={16} className="text-emerald-700" />
                                      ) : (
                                        <Share2 size={16} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Detailed Table / List View */
                          <div className="overflow-x-auto rounded-2xl border border-[#dac1c1]/30">
                            <table className="w-full text-left text-xs font-sans">
                              <thead className="bg-[#FAF3E0] text-[#40010d] uppercase text-[10px] tracking-wider font-extrabold border-b border-[#dac1c1]/30">
                                <tr>
                                  <th className="py-3 px-4">Paper Title & Details</th>
                                  <th className="py-3 px-4">Year & Session</th>
                                  <th className="py-3 px-4">Size</th>
                                  <th className="py-3 px-4">Added Date</th>
                                  <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#dac1c1]/20 bg-white">
                                {subData.papers.map((item) => {
                                  const { paper } = item;
                                  const matchYear = (paper.name + " " + (paper.tag || "")).match(/\b(201\d|202\d)\b/);
                                  const yearTag = matchYear ? matchYear[1] : "-";
                                  const isDownloading = downloadProgressId === paper.id;

                                  return (
                                    <tr key={paper.id} className="hover:bg-[#FAF3E0]/30 transition-colors">
                                      <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-2.5">
                                          <FileText size={16} className="text-red-600 shrink-0" />
                                          <div className="min-w-0">
                                            <p
                                              onClick={() => handleOpenPreview(item)}
                                              className="font-bold text-[#40010d] truncate max-w-md hover:text-[#95491a] cursor-pointer transition-colors"
                                              title={paper.name}
                                            >
                                              {paper.name}
                                            </p>
                                            {paper.details && (
                                              <p className="text-[11px] text-[#735E55] line-clamp-1">{paper.details}</p>
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-3.5 px-4 font-bold text-[#95491a]">
                                        <span className="bg-[#FAF3E0] px-2 py-0.5 rounded-md border border-[#D8C4AC]/40">
                                          {yearTag}
                                        </span>
                                      </td>
                                      <td className="py-3.5 px-4 text-[#735E55] font-medium">{paper.size || "1.2 MB"}</td>
                                      <td className="py-3.5 px-4 text-[#735E55]">{paper.addedTime || "Recent"}</td>
                                      <td className="py-3.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          {/* In-App Central Preview */}
                                          <button
                                            type="button"
                                            onClick={() => handleOpenPreview(item)}
                                            className="px-3 py-1.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                                            title="View in central preview modal"
                                          >
                                            <Eye size={12} />
                                            <span>View</span>
                                          </button>

                                          {/* Download */}
                                          <button
                                            type="button"
                                            onClick={() => handleDownloadFile(paper)}
                                            disabled={isDownloading}
                                            className="p-1.5 bg-[#FAF3E0] hover:bg-[#e8dbce] text-[#40010d] rounded-xl transition-all cursor-pointer disabled:opacity-50"
                                            title="Download PDF"
                                          >
                                            {isDownloading ? (
                                              <RefreshCw size={14} className="animate-spin text-[#95491a]" />
                                            ) : (
                                              <FileDown size={14} />
                                            )}
                                          </button>

                                          {/* Delete */}
                                          {isAdmin && (
                                            <button
                                              type="button"
                                              onClick={() => handleDeletePaper(selectedCourseId, semId, subId, paper)}
                                              title="Delete Question Paper"
                                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CENTRAL IN-APP DOCUMENT & PDF PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewPaper && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClosePreview();
            }
          }}
        >
          <div
            className={`bg-white shadow-2xl border border-[#dac1c1]/40 flex flex-col overflow-hidden transition-all duration-300 ${
              isFullscreenPreview
                ? "fixed inset-0 w-screen h-screen rounded-none z-50"
                : "rounded-3xl max-w-5xl w-full h-[90vh]"
            }`}
          >
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 md:px-6 bg-[#FAF3E0] border-b border-[#dac1c1]/30 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="p-2 sm:p-2.5 bg-[#40010d] text-white rounded-xl shrink-0 shadow-xs">
                  <FileText size={18} />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    {previewItemContext?.courseName && (
                      <span className="text-[10px] font-bold text-[#95491a] bg-white/80 px-2 py-0.5 rounded-md border border-[#dac1c1]/30">
                        {previewItemContext.courseName} • {previewItemContext.semesterName || "Semester"}
                      </span>
                    )}
                    {previewItemContext?.subjectName && (
                      <span className="text-[10px] font-bold text-[#40010d] bg-[#fd9b65]/20 px-2 py-0.5 rounded-md">
                        {previewItemContext.subjectName}
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-xs sm:text-sm md:text-base font-extrabold text-[#40010d] truncate"
                    title={previewPaper.name}
                  >
                    {previewPaper.name}
                  </h3>
                  <p className="text-[11px] text-[#735E55] truncate hidden sm:block">
                    {previewPaper.tag || "University Question Paper"} • {previewPaper.size || "1.2 MB"}
                  </p>
                </div>
              </div>

              {/* Reader Action Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Download Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadFile(previewPaper)}
                  disabled={downloadProgressId === previewPaper.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60"
                  title="Download Document to device"
                >
                  {downloadProgressId === previewPaper.id ? (
                    <RefreshCw size={14} className="animate-spin text-white" />
                  ) : (
                    <Download size={14} />
                  )}
                  <span className="hidden sm:inline">Download</span>
                </button>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrintPreview}
                  className="p-2 bg-white hover:bg-[#F4ECE1] text-[#40010d] rounded-xl border border-[#dac1c1]/40 transition-colors cursor-pointer hidden md:flex items-center justify-center shadow-2xs"
                  title="Print Question Paper"
                >
                  <Printer size={16} />
                </button>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullscreenPreview((prev) => !prev)}
                  className="p-2 bg-white hover:bg-[#F4ECE1] text-[#40010d] rounded-xl border border-[#dac1c1]/40 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
                  title={isFullscreenPreview ? "Exit Fullscreen" : "Fullscreen Preview"}
                >
                  {isFullscreenPreview ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                {/* Fallback Open in Tab */}
                {previewPaper.publicUrl && (
                  <a
                    href={previewPaper.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white hover:bg-[#F4ECE1] text-[#40010d] rounded-xl border border-[#dac1c1]/40 transition-colors cursor-pointer hidden sm:flex items-center justify-center shadow-2xs"
                    title="Open in new browser tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="p-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-xl border border-[#dac1c1]/40 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
                  title="Close Preview (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Content Area */}
            <div className="flex-1 bg-slate-900/5 relative overflow-hidden flex flex-col">
              {isLoadingPreview ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-12 h-12 border-3 border-[#40010d]/20 border-t-[#40010d] rounded-full animate-spin" />
                  <div>
                    <h4 className="text-sm font-bold text-[#40010d]">Preparing Question Paper Stream</h4>
                    <p className="text-xs text-[#735E55] mt-1">
                      Loading document preview directly within the application...
                    </p>
                  </div>
                </div>
              ) : previewBlobUrl ? (
                <div className="flex-1 w-full h-full relative bg-slate-100">
                  <iframe
                    ref={previewIframeRef}
                    src={previewBlobUrl}
                    title={previewPaper.name}
                    className="w-full h-full border-none"
                  />
                </div>
              ) : (
                /* Rich Academic Exam Paper Layout when binary PDF is still processing or textual */
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF3E0]/20">
                  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[#dac1c1]/40 p-6 sm:p-10 space-y-6">
                    {/* Academic Exam Header Banner */}
                    <div className="text-center pb-6 border-b-2 border-dashed border-[#dac1c1]/50 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#95491a] bg-[#FAF3E0] px-3 py-1 rounded-full border border-[#D8C4AC]/40">
                        {previewItemContext?.courseName || "University Examination"}
                      </span>
                      <h2 className="text-lg sm:text-xl font-extrabold text-[#40010d] pt-2">
                        {previewPaper.name}
                      </h2>
                      <p className="text-xs text-[#735E55] font-medium">
                        {previewItemContext?.subjectName || "Subject Examination"} • {previewPaper.tag || "End Semester"}
                      </p>
                      <div className="flex items-center justify-center gap-6 pt-3 text-xs font-bold text-[#40010d]">
                        <span>Time Allowed: 2.5 Hours</span>
                        <span>•</span>
                        <span>Max Marks: 60 / 100</span>
                      </div>
                    </div>

                    {/* General Instructions */}
                    <div className="bg-[#FAF3E0]/40 rounded-xl p-4 border border-[#dac1c1]/30 space-y-2">
                      <h4 className="text-xs font-bold text-[#40010d] uppercase tracking-wider">
                        General Instructions to Candidates:
                      </h4>
                      <ul className="text-xs text-[#544243] space-y-1 list-disc list-inside leading-relaxed">
                        <li>Answer all sections according to the blueprint instructions.</li>
                        <li>Figures to the right indicate maximum marks allotted to respective questions.</li>
                        <li>Draw neat and labelled diagrams wherever necessary.</li>
                      </ul>
                    </div>

                    {/* Paper Content / Details */}
                    {previewPaper.details ? (
                      <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-bold text-[#40010d] uppercase tracking-wider border-b border-[#dac1c1]/30 pb-2">
                          Examination Structure & Curriculum Questions
                        </h4>
                        <div className="text-xs text-[#40010d] leading-relaxed whitespace-pre-wrap font-sans bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                          {previewPaper.details}
                        </div>
                      </div>
                    ) : null}

                    {/* In-Modal Download CTA */}
                    <div className="pt-4 border-t border-[#dac1c1]/30 flex items-center justify-between flex-wrap gap-3">
                      <span className="text-[11px] text-[#735E55]">
                        Document linked: {previewPaper.size || "1.2 MB"} • Ready for offline study
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(previewPaper)}
                        className="px-4 py-2 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Download size={14} />
                        <span>Download Full PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reader Footer Note */}
            <div className="py-2.5 px-4 sm:px-6 bg-[#FAF3E0] border-t border-[#dac1c1]/30 flex items-center justify-between text-[11px] text-[#735E55] shrink-0">
              <span className="truncate">
                Read Rabbit Academic Hub • {previewPaper.name}
              </span>
              <button
                type="button"
                onClick={() => handleCopyLink(previewPaper)}
                className="font-bold text-[#95491a] hover:text-[#40010d] flex items-center gap-1 cursor-pointer shrink-0 ml-2"
              >
                {copiedLinkPaperId === previewPaper.id ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN REQUIRED NOTICE MODAL */}
      {/* ========================================================================= */}
      {showAdminRequiredModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#dac1c1]/40 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
              <Lock size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-[#40010d]">Administrator Access Required</h3>
            <p className="text-xs text-[#544243] leading-relaxed">
              Uploading past question papers, exam blueprints, and modifying the question paper library is restricted to verified administrators and faculty members.
            </p>
            <p className="text-[11px] text-[#735E55] bg-[#FAF3E0] p-3 rounded-xl border border-[#D8C4AC]/40">
              Students and learners can freely explore, preview in full resolution, and download all papers in this repository without restrictions!
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdminRequiredModal(false)}
                className="w-full py-2.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Understood, Browse Papers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UPLOAD QUESTION PAPER MODAL (ADMIN ONLY) */}
      {/* ========================================================================= */}
      {isUploadModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-7 shadow-2xl border border-[#dac1c1]/40 my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#dac1c1]/20">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-[#fd9b65]/20 text-[#40010d] rounded-xl">
                  <Upload size={20} />
                </span>
                <div>
                  <h3 className="text-base md:text-lg font-extrabold text-[#40010d]">
                    Upload Previous Year Question Paper
                  </h3>
                  <p className="text-[11px] text-[#735E55]">
                    Stored permanently to Supabase Storage & Indexed across the library
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isUploading && setIsUploadModalOpen(false)}
                disabled={isUploading}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadPaper} className="space-y-4 text-xs font-sans">
              {/* Course & Semester Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#40010d] mb-1">Target Degree</label>
                  <select
                    value={uploadCourseId}
                    onChange={(e) => {
                      const newCId = e.target.value;
                      setUploadCourseId(newCId);
                      const targetC = courses.find((c) => c.id === newCId);
                      if (targetC && targetC.semesters.length > 0) {
                        setUploadSemId(targetC.semesters[0].id);
                        if (targetC.semesters[0].subjects.length > 0) {
                          setUploadSubjectId(targetC.semesters[0].subjects[0].id);
                        }
                      }
                    }}
                    className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs font-semibold text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 cursor-pointer"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#40010d] mb-1">Target Semester</label>
                  <select
                    value={uploadSemId}
                    onChange={(e) => {
                      const newSemId = parseInt(e.target.value, 10);
                      setUploadSemId(newSemId);
                      const targetSem = uploadTargetSemesters.find((s) => s.id === newSemId);
                      if (targetSem && targetSem.subjects.length > 0) {
                        setUploadSubjectId(targetSem.subjects[0].id);
                      } else {
                        setUploadSubjectId("");
                      }
                    }}
                    className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs font-semibold text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 cursor-pointer"
                  >
                    {uploadTargetSemesters.map((sem) => (
                      <option key={sem.id} value={sem.id}>
                        {sem.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">Select Subject</label>
                <select
                  value={uploadSubjectId}
                  onChange={(e) => setUploadSubjectId(e.target.value)}
                  className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs font-semibold text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 cursor-pointer"
                >
                  {availableSubjectsForUpload.length === 0 ? (
                    <option value="">No subjects found in this semester</option>
                  ) : (
                    availableSubjectsForUpload.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Exam Year & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#40010d] mb-1">Exam Year</label>
                  <input
                    type="text"
                    value={paperYear}
                    onChange={(e) => setPaperYear(e.target.value)}
                    placeholder="e.g. 2024, 2023, 2022"
                    className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#40010d] mb-1">Exam Session / Type</label>
                  <select
                    value={paperExamType}
                    onChange={(e) => setPaperExamType(e.target.value)}
                    className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs font-semibold text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 cursor-pointer"
                  >
                    <option value="Semester End Exam (Nov / Dec)">Semester End Exam (Nov / Dec)</option>
                    <option value="Semester End Exam (May / June)">Semester End Exam (May / June)</option>
                    <option value="Mid-Term / Internal CIE">Mid-Term / Internal CIE</option>
                    <option value="Model / Sample Question Paper">Model / Sample Question Paper</option>
                    <option value="Supplementary Exam">Supplementary Exam</option>
                    <option value="Solved Question Paper with Answers">Solved Question Paper with Answers</option>
                  </select>
                </div>
              </div>

              {/* Scheme / Pattern */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">Scheme / Pattern</label>
                <select
                  value={paperScheme}
                  onChange={(e) => setPaperScheme(e.target.value)}
                  className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs font-semibold text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 cursor-pointer"
                >
                  <option value="NEP 2020 Scheme (60 Marks)">NEP 2020 Scheme (60 Marks)</option>
                  <option value="CBCS Pattern (70 Marks)">CBCS Pattern (70 Marks)</option>
                  <option value="Traditional Scheme (100 Marks)">Traditional Scheme (100 Marks)</option>
                  <option value="Practical / Lab Exam Paper">Practical / Lab Exam Paper</option>
                </select>
              </div>

              {/* Paper Title with Auto-suggest Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#40010d]">
                    Paper Title <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSuggestTitle}
                    className="text-[10px] font-extrabold text-[#95491a] hover:text-[#40010d] flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={11} />
                    <span>Auto-Suggest Title</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="e.g. BCA 3rd Sem Operating Systems Dec 2023 Paper"
                  className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                />
              </div>

              {/* PDF File Upload Zone */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">Choose Question Paper PDF</label>
                <div className="border-2 border-dashed border-[#dac1c1] rounded-2xl p-5 text-center bg-[#FAF3E0]/30 hover:bg-[#FAF3E0]/60 transition-colors">
                  <input
                    type="file"
                    id="pyq-file-upload-dialog"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="pyq-file-upload-dialog" className="cursor-pointer block">
                    <FileText size={28} className="mx-auto text-[#95491a] mb-2" />
                    {uploadFile ? (
                      <div>
                        <p className="font-bold text-[#40010d] text-sm">{uploadFile.name}</p>
                        <p className="text-[11px] text-[#735E55]">
                          Size: {(uploadFile.size / 1024).toFixed(0)} KB • Ready to upload
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-[#40010d] text-sm">Click or Drag PDF file here</p>
                        <p className="text-[11px] text-[#735E55] mt-0.5">Supports PDF and Word documents</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">
                  Additional Notes / Solution Details <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={paperNotes}
                  onChange={(e) => setPaperNotes(e.target.value)}
                  placeholder="Includes complete Section A, B, C questions with scheme keys..."
                  className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                />
              </div>

              {/* Status / Errors / Progress Alerts */}
              {isUploading && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-900 text-xs font-bold animate-pulse">
                  <RefreshCw size={15} className="animate-spin text-amber-700 shrink-0" />
                  <span>{uploadProgressMsg || "Uploading Question Paper to Supabase Cloud Storage..."}</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs font-medium">
                  <AlertCircle size={15} className="shrink-0 text-red-500" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2.5 text-green-800 text-xs font-bold">
                  <CheckCircle size={15} className="shrink-0 text-green-600" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 flex justify-end gap-2.5 border-t border-[#dac1c1]/20">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFile}
                  className="px-6 py-2 bg-[#40010d] hover:bg-[#5a0213] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Store Question Paper</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
