import React, { useState, useMemo } from "react";
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
  GraduationCap
} from "lucide-react";
import { uploadFileToCloud } from "../lib/firebase";
import { insertMaterialToSupabaseDB, UploadResult } from "../lib/supabase";

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

  // Search query & year filter
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSemId, setUploadSemId] = useState<number>(1);
  const [uploadSubjectId, setUploadSubjectId] = useState<string>("");
  const [paperYear, setPaperYear] = useState<string>(new Date().getFullYear().toString());
  const [paperExamType, setPaperExamType] = useState<string>("Semester End Exam");
  const [paperTitle, setPaperTitle] = useState<string>("");
  const [paperNotes, setPaperNotes] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<string>("");

  // Get active course object
  const currentCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0] || null;
  }, [courses, selectedCourseId]);

  // List of semesters for current course
  const currentSemesters = useMemo(() => {
    return currentCourse?.semesters || [];
  }, [currentCourse]);

  // List of subjects available for upload / filtering based on uploadSemId or selectedSemesterId
  const availableSubjectsForUpload = useMemo(() => {
    const sem = currentSemesters.find((s) => s.id === uploadSemId);
    return sem?.subjects || [];
  }, [currentSemesters, uploadSemId]);

  const availableSubjectsForFilter = useMemo(() => {
    if (!selectedSemesterId) return [];
    const sem = currentSemesters.find((s) => s.id === selectedSemesterId);
    return sem?.subjects || [];
  }, [currentSemesters, selectedSemesterId]);

  // Extract all Previous Year Question Papers from the course hierarchy
  // An item is recognized as a PYQ if its type is "question", or tag includes "pyq" / "exam" / "question paper", or belongs to materials with question format
  const allQuestionPapers = useMemo(() => {
    if (!currentCourse) return [];
    const papers: Array<{
      paper: StudyMaterial;
      courseId: string;
      courseName: string;
      semesterId: number;
      semesterName: string;
      subjectId: string;
      subjectName: string;
      unitId?: string;
      unitName?: string;
    }> = [];

    currentCourse.semesters.forEach((sem) => {
      sem.subjects.forEach((sub) => {
        // Collect from subject level materials
        (sub.materials || []).forEach((mat) => {
          const isPYQ =
            mat.type === "question" ||
            mat.tag?.toLowerCase().includes("pyq") ||
            mat.tag?.toLowerCase().includes("question") ||
            mat.tag?.toLowerCase().includes("exam") ||
            mat.name?.toLowerCase().includes("question paper") ||
            mat.name?.toLowerCase().includes("qp") ||
            mat.name?.toLowerCase().includes("202") ||
            mat.name?.toLowerCase().includes("201") ||
            mat.name?.toLowerCase().includes("exam") ||
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

        // Also collect from unit level materials
        (sub.units || []).forEach((unit) => {
          (unit.materials || []).forEach((mat) => {
            const isPYQ =
              mat.type === "question" ||
              mat.tag?.toLowerCase().includes("pyq") ||
              mat.tag?.toLowerCase().includes("question") ||
              mat.tag?.toLowerCase().includes("exam") ||
              mat.name?.toLowerCase().includes("question paper") ||
              mat.name?.toLowerCase().includes("qp") ||
              mat.name?.toLowerCase().includes("202") ||
              mat.name?.toLowerCase().includes("201") ||
              mat.name?.toLowerCase().includes("exam");

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
        });
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

  // Filtered Question Papers
  const filteredPapers = useMemo(() => {
    return allQuestionPapers.filter((item) => {
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
  }, [allQuestionPapers, selectedSemesterId, selectedSubjectId, yearFilter, searchQuery]);

  // Group papers by Semester & Subject for an organized academic layout
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

  // Handle Question Paper Upload
  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Please select a PDF or Document file to upload.");
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
      setUploadProgressMsg("Uploading Question Paper to Supabase Cloud Storage...");

      // 1. Upload file using Cloud storage engine with retry resilience
      const finalTitle = paperTitle.trim()
        ? `${paperTitle.trim()} (${paperYear || "PYQ"})`
        : uploadFile.name.replace(/\.[^/.]+$/, "") + ` - ${paperYear}`;

      const res = await uploadFileToCloud(
        uploadFile,
        `pyq/${selectedCourseId}/sem_${uploadSemId}/${uploadSubjectId}`,
        (pct, statusMsg) => {
          setUploadProgressMsg(`⏳ ${pct}% - ${statusMsg}`);
        },
        {
          courseId: selectedCourseId,
          semesterId: String(uploadSemId),
          subjectId: uploadSubjectId,
          unitId: "pyq_library",
        }
      );

      // 2. Format StudyMaterial object
      const newPaper: StudyMaterial = {
        id: `pyq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: finalTitle,
        size: res.size || `${(uploadFile.size / 1024).toFixed(0)} KB`,
        addedTime: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        type: "question",
        isBookmarked: false,
        tag: `PYQ ${paperYear} • ${paperExamType}`,
        details: paperNotes.trim() || `Previous Year Question Paper for ${paperYear} examination (${paperExamType}).`,
        publicUrl: res.publicUrl,
        cloudPath: res.cloudPath,
        uploadedAt: new Date().toISOString(),
        courseId: selectedCourseId,
        semesterId: String(uploadSemId),
        subjectId: uploadSubjectId,
        unitId: "pyq_library",
      };

      // 3. Save to Supabase SQL Database
      try {
        await insertMaterialToSupabaseDB({
          id: newPaper.id,
          name: newPaper.name,
          type: newPaper.type,
          size: newPaper.size,
          cloudPath: res.cloudPath,
          publicUrl: res.publicUrl,
          uploadedAt: newPaper.uploadedAt || new Date().toISOString(),
          courseId: selectedCourseId,
          semesterId: String(uploadSemId),
          subjectId: uploadSubjectId,
          unitId: "pyq_library",
        });
      } catch (dbErr) {
        console.warn("[SUPABASE DB INSERT NON-BLOCKING]", dbErr);
      }

      // 4. Update Courses hierarchy state
      const updatedCourses = courses.map((course) => {
        if (course.id !== selectedCourseId) return course;

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
      setUploadSuccess(`🎉 Successfully uploaded and organized "${finalTitle}"!`);
      setUploadFile(null);
      setPaperTitle("");
      setPaperNotes("");

      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadSuccess("");
        setUploadProgressMsg("");
      }, 1500);
    } catch (err: any) {
      console.error("[UPLOAD PYQ ERROR]", err);
      setUploadError(err.message || "Failed to upload question paper. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Question Paper
  const handleDeletePaper = (courseId: string, semId: number, subId: string, paperId: string) => {
    if (!window.confirm("Are you sure you want to remove this question paper from the library?")) {
      return;
    }

    const updatedCourses = courses.map((course) => {
      if (course.id !== courseId) return course;

      const updatedSemesters = course.semesters.map((sem) => {
        if (sem.id !== semId) return sem;

        const updatedSubjects = sem.subjects.map((sub) => {
          if (sub.id !== subId) return sub;

          // Filter from subject level
          const filteredSubMaterials = (sub.materials || []).filter((m) => m.id !== paperId);

          // Filter from unit level
          const filteredUnits = (sub.units || []).map((u) => ({
            ...u,
            materials: (u.materials || []).filter((m) => m.id !== paperId),
          }));

          return {
            ...sub,
            materials: filteredSubMaterials,
            units: filteredUnits,
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
  };

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-[#dac1c1]/30 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-[#fd9b65]/20 text-[#40010d] rounded-xl">
                <GraduationCap size={22} className="text-[#40010d]" />
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#40010d] tracking-tight">
                Previous Year Question Papers Library
              </h2>
            </div>
            <p className="text-sm text-[#544243] font-medium leading-relaxed">
              Explore, download, and contribute past university exam papers and model question banks organized by semester and subject.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Upload Button */}
            <button
              onClick={() => {
                if (currentSemesters.length > 0) {
                  setUploadSemId(currentSemesters[0].id);
                  if (currentSemesters[0].subjects.length > 0) {
                    setUploadSubjectId(currentSemesters[0].subjects[0].id);
                  }
                }
                setUploadError("");
                setUploadSuccess("");
                setIsUploadModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-2xl shadow-md transition-all transform active:scale-95 cursor-pointer"
            >
              <Upload size={15} />
              <span>Upload Question Paper</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* COURSE & SEMESTER SELECTOR TABS */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-[#dac1c1]/30 shadow-xs space-y-4">
          {/* Course Tabs */}
          {courses.length > 1 && (
            <div className="flex items-center gap-2 pb-3 border-b border-[#dac1c1]/20 overflow-x-auto">
              <span className="text-xs font-bold text-[#735E55] uppercase tracking-wider px-1">Degree:</span>
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setSelectedSemesterId(null);
                    setSelectedSubjectId(null);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedSemesterId === null
                  ? "bg-[#fd9b65] text-[#40010d] shadow-sm font-extrabold"
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
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedSemesterId === sem.id
                      ? "bg-[#40010d] text-white shadow-sm"
                      : "bg-[#F4ECE1]/80 text-[#544243] hover:bg-[#e8dbce]"
                  }`}
                >
                  <span>{sem.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedSemesterId === sem.id ? "bg-white/20 text-white" : "bg-black/10 text-[#544243]"
                    }`}
                  >
                    {semPaperCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subject Filter (Visible when a semester is chosen) */}
          {selectedSemesterId !== null && availableSubjectsForFilter.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#dac1c1]/20">
              <span className="text-[11px] font-bold text-[#735E55] uppercase tracking-wider whitespace-nowrap">
                Subject:
              </span>
              <button
                onClick={() => setSelectedSubjectId(null)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
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
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
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

          {/* SEARCH & YEAR FILTER ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="md:col-span-2 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#877272]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question papers by subject, year (e.g., 2023, 2024), unit, or keyword..."
                className="w-full pl-10 pr-4 py-2 bg-[#F4ECE1]/40 border border-[#dac1c1]/40 rounded-xl text-xs text-[#40010d] placeholder:text-[#877272] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 focus:border-[#40010d]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#877272] hover:text-[#40010d]"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter size={15} className="text-[#877272] shrink-0" />
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full py-2 px-3 bg-[#F4ECE1]/40 border border-[#dac1c1]/40 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
              >
                <option value="all">All Exam Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Year {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* QUESTION PAPERS ORGANIZED BY SEMESTERS & SUBJECTS */}
        {filteredPapers.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center border border-[#dac1c1]/30 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-[#fd9b65]/20 text-[#40010d] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#40010d] mb-2">No Question Papers Found</h3>
            <p className="text-xs text-[#544243] leading-relaxed mb-6">
              {searchQuery || yearFilter !== "all" || selectedSemesterId !== null
                ? "No previous year question papers matched your search criteria. Try adjusting your filters or search terms."
                : "No question papers uploaded yet. Be the first to upload previous year question papers for your peers!"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setYearFilter("all");
                setSelectedSemesterId(null);
                setSelectedSubjectId(null);
                setIsUploadModalOpen(true);
              }}
              className="px-6 py-2.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Upload size={14} />
              <span>Upload Question Paper Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {(Object.entries(groupedPapers) as [string, SemesterPaperGroup][]).map(([semIdStr, semData]) => {
              const semId = parseInt(semIdStr, 10);
              return (
                <div
                  key={semId}
                  className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-[#dac1c1]/30 shadow-xs space-y-6"
                >
                  {/* Semester Section Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#dac1c1]/20">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#40010d] text-white flex items-center justify-center text-xs font-extrabold">
                        S{semId}
                      </span>
                      <div>
                        <h3 className="text-lg font-extrabold text-[#40010d]">{semData.semesterName}</h3>
                        <p className="text-[11px] text-[#735E55] font-medium">
                          {Object.keys(semData.subjects).length} Subjects with Previous Year Papers
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subjects Sub-sections */}
                  <div className="space-y-6">
                    {(Object.entries(semData.subjects) as [string, SubjectPaperGroup][]).map(([subId, subData]) => (
                      <div key={subId} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-[#95491a]" />
                            <h4 className="text-sm font-bold text-[#40010d]">{subData.subjectName}</h4>
                            <span className="text-[10px] bg-[#F4ECE1] text-[#544243] px-2 py-0.5 rounded-md font-semibold">
                              {subData.papers.length} Papers
                            </span>
                          </div>

                          {onNavigateToSubject && (
                            <button
                              onClick={() => onNavigateToSubject(selectedCourseId, semId, subId)}
                              className="text-[11px] font-bold text-[#95491a] hover:text-[#40010d] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Open Subject Hub</span>
                              <ExternalLink size={12} />
                            </button>
                          )}
                        </div>

                        {/* Papers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {subData.papers.map(({ paper }) => {
                            const isPdf = paper.name.toLowerCase().endsWith(".pdf") || paper.type === "pdf";
                            return (
                              <div
                                key={paper.id}
                                className="bg-[#FAF3E0]/60 hover:bg-[#FAF3E0] rounded-2xl p-4.5 border border-[#dac1c1]/30 transition-all flex flex-col justify-between hover:shadow-sm"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="p-2 bg-red-100 text-red-700 rounded-xl shrink-0">
                                        <FileText size={18} />
                                      </div>
                                      <div className="min-w-0">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#95491a] block truncate">
                                          {paper.tag || "QUESTION PAPER"}
                                        </span>
                                        <h5 className="text-xs font-bold text-[#40010d] truncate" title={paper.name}>
                                          {paper.name}
                                        </h5>
                                      </div>
                                    </div>

                                    {isAdmin && (
                                      <button
                                        onClick={() => handleDeletePaper(selectedCourseId, semId, subId, paper.id)}
                                        title="Delete Question Paper"
                                        className="text-red-400 hover:text-red-600 p-1 transition-colors cursor-pointer shrink-0"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </div>

                                  {paper.details && (
                                    <p className="text-[11px] text-[#544243] line-clamp-2 leading-relaxed mb-3">
                                      {paper.details}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-3 text-[10px] text-[#877272] mb-3">
                                    <span>Size: {paper.size}</span>
                                    <span>•</span>
                                    <span>Added: {paper.addedTime || "Recent"}</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-[#dac1c1]/20 flex items-center gap-2">
                                  {paper.publicUrl ? (
                                    <>
                                      <a
                                        href={paper.publicUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-1.5 px-3 bg-[#40010d] hover:bg-[#5a0213] text-white text-[11px] font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                                      >
                                        <Eye size={12} />
                                        <span>View PDF</span>
                                      </a>
                                      <a
                                        href={paper.publicUrl}
                                        download={paper.name}
                                        className="p-1.5 bg-[#F4ECE1] hover:bg-[#e8dbce] text-[#40010d] rounded-xl text-center transition-colors"
                                        title="Download PDF"
                                      >
                                        <FileDown size={14} />
                                      </a>
                                    </>
                                  ) : (
                                    <button
                                      disabled
                                      className="w-full py-1.5 px-3 bg-gray-100 text-gray-400 text-[11px] font-bold rounded-xl text-center cursor-not-allowed"
                                    >
                                      File Not Linked
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* UPLOAD QUESTION PAPER MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#dac1c1]/30 my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#dac1c1]/20">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-[#fd9b65]/20 text-[#40010d] rounded-xl">
                  <Upload size={18} />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#40010d]">Upload Previous Year Question Paper</h3>
                  <p className="text-[11px] text-[#735E55]">Saved directly to curriculum database</p>
                </div>
              </div>
              <button
                onClick={() => !isUploading && setIsUploadModalOpen(false)}
                disabled={isUploading}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadPaper} className="space-y-4 text-xs font-sans">
              {/* Semester & Subject Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#40010d] mb-1">Select Semester</label>
                  <select
                    value={uploadSemId}
                    onChange={(e) => {
                      const newSemId = parseInt(e.target.value, 10);
                      setUploadSemId(newSemId);
                      const targetSem = currentSemesters.find((s) => s.id === newSemId);
                      if (targetSem && targetSem.subjects.length > 0) {
                        setUploadSubjectId(targetSem.subjects[0].id);
                      } else {
                        setUploadSubjectId("");
                      }
                    }}
                    className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                  >
                    {currentSemesters.map((sem) => (
                      <option key={sem.id} value={sem.id}>
                        {sem.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#40010d] mb-1">Select Subject</label>
                  <select
                    value={uploadSubjectId}
                    onChange={(e) => setUploadSubjectId(e.target.value)}
                    className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                  >
                    {availableSubjectsForUpload.length === 0 ? (
                      <option value="">No subjects found</option>
                    ) : (
                      availableSubjectsForUpload.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Exam Year & Exam Type */}
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
                  <label className="block font-bold text-[#40010d] mb-1">Exam Category</label>
                  <select
                    value={paperExamType}
                    onChange={(e) => setPaperExamType(e.target.value)}
                    className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                  >
                    <option value="Semester End Exam">Semester End Exam</option>
                    <option value="Mid-Term / Internal">Mid-Term / Internal</option>
                    <option value="Supplementary Exam">Supplementary Exam</option>
                    <option value="Model Question Paper">Model Question Paper</option>
                  </select>
                </div>
              </div>

              {/* Paper Title (Optional) */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">
                  Paper Title <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="e.g. Main Examination Paper Set A"
                  className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                />
              </div>

              {/* File Input */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">Choose Question Paper PDF</label>
                <div className="border-2 border-dashed border-[#dac1c1] rounded-2xl p-4 text-center bg-[#FAF3E0]/30 hover:bg-[#FAF3E0]/60 transition-colors">
                  <input
                    type="file"
                    id="pyq-file-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="pyq-file-upload" className="cursor-pointer block">
                    <FileText size={24} className="mx-auto text-[#95491a] mb-1.5" />
                    {uploadFile ? (
                      <div>
                        <p className="font-bold text-[#40010d]">{uploadFile.name}</p>
                        <p className="text-[10px] text-[#735E55]">{(uploadFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-[#40010d]">Click or Drag PDF file here</p>
                        <p className="text-[10px] text-[#735E55]">Supports PDF and document formats</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Notes / Description */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">
                  Additional Notes / Solution Details <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={paperNotes}
                  onChange={(e) => setPaperNotes(e.target.value)}
                  placeholder="Includes complete answer keys or specific question markings..."
                  className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                />
              </div>

              {/* Status / Errors / Progress */}
              {isUploading && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-900 text-xs font-bold animate-pulse">
                  <RefreshCw size={15} className="animate-spin text-amber-700 shrink-0" />
                  <span>{uploadProgressMsg || "Uploading Question Paper..."}</span>
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
              <div className="pt-3 flex justify-end gap-2 border-t border-[#dac1c1]/20">
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
                  className="px-5 py-2 bg-[#40010d] hover:bg-[#5a0213] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Save Question Paper</span>
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
