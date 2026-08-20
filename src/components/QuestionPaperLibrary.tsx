import React, { useState, useMemo, useEffect } from "react";
import { Course, StudyMaterial } from "../types";
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
  Sparkles,
  Share2,
  Copy,
  FolderPlus,
  Link as LinkIcon,
  X,
  Maximize2
} from "lucide-react";
import { uploadFileToCloud } from "../lib/firebase";
import { insertMaterialToSupabaseDB } from "../lib/supabase";

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
  year?: string;
  examType?: string;
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

// Pre-seeded comprehensive Question Papers across semesters
const SEEDED_DEFAULT_PYQS: QuestionPaperItem[] = [
  // SEMESTER 1
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 1,
    semesterName: "Semester 1",
    subjectId: "bca_s1_sub1",
    subjectName: "Problem Solving Using C",
    paper: {
      id: "seed_pyq_c_2024",
      name: "C Programming University Exam Paper 2024 (Set A)",
      type: "question",
      size: "1.4 MB",
      addedTime: "June 2024",
      isBookmarked: false,
      tag: "PYQ 2024 • Semester End Exam",
      details: "Official university end-semester examination question paper with Section A, B & C questions covering pointers, structures, file handling, and dynamic memory allocation.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 1,
    semesterName: "Semester 1",
    subjectId: "bca_s1_sub1",
    subjectName: "Problem Solving Using C",
    paper: {
      id: "seed_pyq_c_2023",
      name: "C Programming University Exam Paper 2023",
      type: "question",
      size: "1.2 MB",
      addedTime: "June 2023",
      isBookmarked: false,
      tag: "PYQ 2023 • Semester End Exam",
      details: "Previous year regular examination paper covering algorithms, control structures, arrays, and recursion problems.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 1,
    semesterName: "Semester 1",
    subjectId: "bca_s1_sub2",
    subjectName: "Discrete Mathematical Structures",
    paper: {
      id: "seed_pyq_dms_2024",
      name: "Discrete Mathematics Exam Paper 2024",
      type: "question",
      size: "1.8 MB",
      addedTime: "June 2024",
      isBookmarked: false,
      tag: "PYQ 2024 • Semester End Exam",
      details: "Comprehensive mathematical question paper covering Set Theory, Predicate Calculus, Graph Theory, and Combinatorics with step-by-step model hints.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 1,
    semesterName: "Semester 1",
    subjectId: "bca_s1_sub3",
    subjectName: "Computer Architecture & Organization",
    paper: {
      id: "seed_pyq_cao_2023",
      name: "Computer Architecture Question Paper 2023",
      type: "question",
      size: "1.5 MB",
      addedTime: "June 2023",
      isBookmarked: false,
      tag: "PYQ 2023 • Semester End Exam",
      details: "Covers ALU design, Von Neumann architecture, Instruction cycles, memory hierarchy, cache mapping, and pipeline hazards.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },

  // SEMESTER 2
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 2,
    semesterName: "Semester 2",
    subjectId: "bca_s2_sub1",
    subjectName: "Object Oriented Programming Using Java",
    paper: {
      id: "seed_pyq_java_2024",
      name: "Java Programming End Semester Exam 2024",
      type: "question",
      size: "2.1 MB",
      addedTime: "Dec 2024",
      isBookmarked: false,
      tag: "PYQ 2024 • Semester End Exam",
      details: "Full theory and coding questions including OOP principles, Exception Handling, Multithreading, Generics, Collections Framework, and Swing GUI components.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 2,
    semesterName: "Semester 2",
    subjectId: "bca_s2_sub1",
    subjectName: "Object Oriented Programming Using Java",
    paper: {
      id: "seed_pyq_java_2023",
      name: "Java Midterm Assessment Paper 2023",
      type: "question",
      size: "950 KB",
      addedTime: "Oct 2023",
      isBookmarked: false,
      tag: "PYQ 2023 • Mid-Term Exam",
      details: "Mid-term internal exam testing Classes, Inheritance, Interfaces, Packages, and Custom Exception mechanisms.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 2,
    semesterName: "Semester 2",
    subjectId: "bca_s2_sub2",
    subjectName: "Data Structures & Algorithms",
    paper: {
      id: "seed_pyq_dsa_2024",
      name: "Data Structures University Exam 2024",
      type: "question",
      size: "1.7 MB",
      addedTime: "Dec 2024",
      isBookmarked: false,
      tag: "PYQ 2024 • Semester End Exam",
      details: "Detailed analytical exam paper covering Stacks, Queues, Linked Lists, Binary Search Trees, AVL Trees, Graph Traversals (BFS/DFS), and Quick/Merge sort time complexity.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },

  // SEMESTER 3
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 3,
    semesterName: "Semester 3",
    subjectId: "bca_s3_sub1",
    subjectName: "Database Management Systems (DBMS)",
    paper: {
      id: "seed_pyq_dbms_2024",
      name: "DBMS University Examination Paper 2024",
      type: "question",
      size: "1.9 MB",
      addedTime: "June 2024",
      isBookmarked: false,
      tag: "PYQ 2024 • Semester End Exam",
      details: "Covers Relational Algebra, SQL Queries, Normalization up to BCNF, ACID properties, Transaction Concurrency Control, and B+ Trees.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 3,
    semesterName: "Semester 3",
    subjectId: "bca_s3_sub2",
    subjectName: "Operating Systems Principles",
    paper: {
      id: "seed_pyq_os_2023",
      name: "Operating Systems Final Exam 2023",
      type: "question",
      size: "1.6 MB",
      addedTime: "June 2023",
      isBookmarked: false,
      tag: "PYQ 2023 • Semester End Exam",
      details: "Questions on CPU scheduling algorithms, Deadlock Banker's algorithm, Semaphore synchronization, Virtual Memory, and Page Replacement policies.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },

  // SEMESTER 4
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 4,
    semesterName: "Semester 4",
    subjectId: "bca_s4_sub1",
    subjectName: "Web Technologies & Frameworks",
    paper: {
      id: "seed_pyq_web_2024",
      name: "Web Technologies University Exam 2024",
      type: "question",
      size: "1.5 MB",
      addedTime: "Dec 2024",
      isBookmarked: false,
      tag: "PYQ 2024 • Semester End Exam",
      details: "HTML5/CSS3, JavaScript ES6+, DOM Manipulation, RESTful APIs, Node.js, Express backend architecture, and Responsive Design.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 4,
    semesterName: "Semester 4",
    subjectId: "bca_s4_sub2",
    subjectName: "Computer Networks & Security",
    paper: {
      id: "seed_pyq_cn_2023",
      name: "Computer Networks Question Paper 2023",
      type: "question",
      size: "1.4 MB",
      addedTime: "Dec 2023",
      isBookmarked: false,
      tag: "PYQ 2023 • Semester End Exam",
      details: "OSI and TCP/IP models, IP addressing and subnetting, Routing algorithms (Dijkstra, Bellman-Ford), Cryptography, and RSA algorithm.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },

  // SEMESTER 5 & 6
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 5,
    semesterName: "Semester 5",
    subjectId: "bca_s5_sub1",
    subjectName: "Software Engineering & Agile Methodologies",
    paper: {
      id: "seed_pyq_se_2024",
      name: "Software Engineering End Sem Exam 2024",
      type: "question",
      size: "1.3 MB",
      addedTime: "June 2024",
      isBookmarked: false,
      tag: "PYQ 2024 • Semester End Exam",
      details: "SDLC Models, Agile Scrum, SRS documentation, UML Diagrams, Software Testing (Black-box & White-box), and CI/CD pipelines.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  },
  {
    courseId: "bca",
    courseName: "BCA GENERAL",
    semesterId: 6,
    semesterName: "Semester 6",
    subjectId: "bca_s6_sub1",
    subjectName: "Cloud Computing & DevOps",
    paper: {
      id: "seed_pyq_cloud_2024",
      name: "Cloud Computing & DevOps University Exam 2024",
      type: "question",
      size: "2.0 MB",
      addedTime: "Dec 2024",
      isBookmarked: false,
      tag: "PYQ 2024 • Semester End Exam",
      details: "IaaS/PaaS/SaaS architectures, Virtualization, Docker containerization, Kubernetes orchestration, Serverless computing, and AWS/GCP services.",
      publicUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  }
];

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

  // Search query & year filter & exam type filter
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");

  // Document Viewer / Previewer State
  const [activePreviewPaper, setActivePreviewPaper] = useState<QuestionPaperItem | null>(null);
  const [copiedLinkPaperId, setCopiedLinkPaperId] = useState<string | null>(null);

  // Local persistent custom stored question papers
  const [customStoredPapers, setCustomStoredPapers] = useState<QuestionPaperItem[]>(() => {
    try {
      const saved = localStorage.getItem("read_rabbit_custom_pyqs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [selectedCourseId, selectedSemesterId]);

  // Upload / Store Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadExternalUrl, setUploadExternalUrl] = useState<string>("");
  const [uploadSemId, setUploadSemId] = useState<number>(1);
  const [uploadSubjectId, setUploadSubjectId] = useState<string>("");
  const [customSubjectName, setCustomSubjectName] = useState<string>("");
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

  // Combine papers from course curriculum + custom stored papers + pre-seeded papers
  const allQuestionPapers = useMemo(() => {
    if (!currentCourse) return [];
    const collected: QuestionPaperItem[] = [];
    const seenIds = new Set<string>();

    // 1. Collect from live course state
    currentCourse.semesters.forEach((sem) => {
      sem.subjects.forEach((sub) => {
        (sub.materials || []).forEach((mat) => {
          const isPYQ =
            mat.type === "question" ||
            mat.tag?.toLowerCase().includes("pyq") ||
            mat.tag?.toLowerCase().includes("question") ||
            mat.tag?.toLowerCase().includes("exam") ||
            mat.name?.toLowerCase().includes("question paper") ||
            mat.name?.toLowerCase().includes("qp") ||
            mat.name?.toLowerCase().includes("202");

          if (isPYQ && !seenIds.has(mat.id)) {
            seenIds.add(mat.id);
            collected.push({
              paper: mat,
              courseId: currentCourse.id,
              courseName: currentCourse.name,
              semesterId: sem.id,
              semesterName: sem.name,
              subjectId: sub.id,
              subjectName: sub.name,
              year: mat.tag?.match(/20\d\d/)?.[0] || mat.name?.match(/20\d\d/)?.[0] || "2024",
              examType: mat.tag?.includes("Mid-Term") ? "Mid-Term Exam" : "Semester End Exam"
            });
          }
        });

        (sub.units || []).forEach((unit) => {
          (unit.materials || []).forEach((mat) => {
            const isPYQ =
              mat.type === "question" ||
              mat.tag?.toLowerCase().includes("pyq") ||
              mat.tag?.toLowerCase().includes("exam") ||
              mat.name?.toLowerCase().includes("question paper");

            if (isPYQ && !seenIds.has(mat.id)) {
              seenIds.add(mat.id);
              collected.push({
                paper: mat,
                courseId: currentCourse.id,
                courseName: currentCourse.name,
                semesterId: sem.id,
                semesterName: sem.name,
                subjectId: sub.id,
                subjectName: sub.name,
                unitId: unit.id,
                unitName: unit.name,
                year: mat.tag?.match(/20\d\d/)?.[0] || mat.name?.match(/20\d\d/)?.[0] || "2024",
                examType: mat.tag?.includes("Mid-Term") ? "Mid-Term Exam" : "Semester End Exam"
              });
            }
          });
        });
      });
    });

    // 2. Add custom user-stored papers for this course
    customStoredPapers.forEach((cp) => {
      if (cp.courseId === currentCourse.id && !seenIds.has(cp.paper.id)) {
        seenIds.add(cp.paper.id);
        collected.push(cp);
      }
    });

    // 3. Add default pre-seeded papers
    SEEDED_DEFAULT_PYQS.forEach((sp) => {
      if (!seenIds.has(sp.paper.id)) {
        seenIds.add(sp.paper.id);
        collected.push({
          ...sp,
          courseId: currentCourse.id,
          courseName: currentCourse.name,
          year: sp.paper.tag?.match(/20\d\d/)?.[0] || "2024",
          examType: sp.paper.tag?.includes("Mid-Term") ? "Mid-Term Exam" : "Semester End Exam"
        });
      }
    });

    return collected;
  }, [currentCourse, customStoredPapers]);

  // Extract distinct years available
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allQuestionPapers.forEach((p) => {
      const match = p.paper.name.match(/\b(20\d{2})\b/) || p.paper.tag?.match(/\b(20\d{2})\b/);
      if (match) {
        years.add(match[1]);
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [allQuestionPapers]);

  // Filtered papers
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
        const hasYear =
          item.paper.name.includes(yearFilter) ||
          item.paper.tag?.includes(yearFilter) ||
          item.paper.details?.includes(yearFilter) ||
          item.year === yearFilter;
        if (!hasYear) return false;
      }

      // Exam Type filter
      if (examTypeFilter !== "all") {
        const text = `${item.paper.tag || ""} ${item.paper.details || ""} ${item.examType || ""}`.toLowerCase();
        if (examTypeFilter === "end" && !text.includes("end") && !text.includes("final")) return false;
        if (examTypeFilter === "midterm" && !text.includes("mid")) return false;
        if (examTypeFilter === "model" && !text.includes("model")) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.paper.name.toLowerCase().includes(q);
        const matchesSubject = item.subjectName.toLowerCase().includes(q);
        const matchesSem = item.semesterName.toLowerCase().includes(q);
        const matchesTag = item.paper.tag?.toLowerCase().includes(q);
        const matchesDetails = item.paper.details?.toLowerCase().includes(q);
        return matchesName || matchesSubject || matchesSem || matchesTag || matchesDetails;
      }

      return true;
    });
  }, [allQuestionPapers, selectedSemesterId, selectedSubjectId, yearFilter, examTypeFilter, searchQuery]);

  // Group papers by Semester and then by Subject
  const groupedPapers = useMemo(() => {
    const groups: Record<number, SemesterPaperGroup> = {};

    filteredPapers.forEach((item) => {
      if (!groups[item.semesterId]) {
        groups[item.semesterId] = {
          semesterName: item.semesterName,
          subjects: {},
        };
      }

      const semGroup = groups[item.semesterId];
      if (!semGroup.subjects[item.subjectId]) {
        semGroup.subjects[item.subjectId] = {
          subjectName: item.subjectName,
          papers: [],
        };
      }

      semGroup.subjects[item.subjectId].papers.push(item);
    });

    return groups;
  }, [filteredPapers]);

  // Handle uploading and storing a Question Paper
  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadMode === "file" && !uploadFile) {
      setUploadError("Please select a valid question paper document (PDF/Word/Image).");
      return;
    }
    if (uploadMode === "url" && !uploadExternalUrl.trim()) {
      setUploadError("Please provide a valid document URL or Google Drive link.");
      return;
    }

    const semObj = currentSemesters.find((s) => s.id === uploadSemId);
    let subObj = semObj?.subjects.find((s) => s.id === uploadSubjectId);
    
    let finalSubjectName = subObj?.name || customSubjectName.trim() || "Core Subject";
    let finalSubjectId = uploadSubjectId || `sub_${Date.now()}`;

    const defaultTitle = uploadMode === "file" 
      ? uploadFile?.name.replace(/\.[^/.]+$/, "") 
      : `${finalSubjectName} Question Paper ${paperYear}`;
    const finalTitle = paperTitle.trim() || `${finalSubjectName} ${paperExamType} (${paperYear})`;

    setIsUploading(true);
    setUploadError("");
    setUploadProgressMsg("Storing and cataloging Question Paper...");

    try {
      let filePublicUrl = uploadExternalUrl.trim();
      let fileCloudPath = "";
      let fileSize = "1.5 MB";

      if (uploadMode === "file" && uploadFile) {
        setUploadProgressMsg("Uploading PDF to cloud storage...");
        const res = await uploadFileToCloud(
          uploadFile, 
          "question_papers",
          (pct, status) => {
            setUploadProgressMsg(`${status} (${pct}%)`);
          }, 
          {
            courseId: selectedCourseId,
            semesterId: String(uploadSemId),
            subjectId: finalSubjectId,
            unitId: "pyq_vault"
          }
        );

        filePublicUrl = res.publicUrl;
        fileCloudPath = res.cloudPath;
        fileSize = res.size || `${(uploadFile.size / 1024).toFixed(0)} KB`;
      }

      // Format StudyMaterial object
      const newPaperMaterial: StudyMaterial = {
        id: `pyq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: finalTitle,
        size: fileSize,
        addedTime: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        type: "question",
        isBookmarked: false,
        tag: `PYQ ${paperYear} • ${paperExamType}`,
        details: paperNotes.trim() || `Previous Year Question Paper for ${paperYear} examination (${paperExamType}).`,
        publicUrl: filePublicUrl,
        cloudPath: fileCloudPath,
        uploadedAt: new Date().toISOString(),
        courseId: selectedCourseId,
        semesterId: String(uploadSemId),
        subjectId: finalSubjectId,
        unitId: "pyq_vault",
      };

      // Create QuestionPaperItem for local storage
      const newPaperItem: QuestionPaperItem = {
        paper: newPaperMaterial,
        courseId: selectedCourseId,
        courseName: currentCourse?.name || "BCA",
        semesterId: uploadSemId,
        semesterName: semObj?.name || `Semester ${uploadSemId}`,
        subjectId: finalSubjectId,
        subjectName: finalSubjectName,
        year: paperYear,
        examType: paperExamType,
      };

      // Save to Supabase SQL Database
      try {
        await insertMaterialToSupabaseDB({
          id: newPaperMaterial.id,
          name: newPaperMaterial.name,
          type: newPaperMaterial.type,
          size: newPaperMaterial.size,
          cloudPath: fileCloudPath,
          publicUrl: filePublicUrl,
          uploadedAt: newPaperMaterial.uploadedAt || new Date().toISOString(),
          courseId: selectedCourseId,
          semesterId: String(uploadSemId),
          subjectId: finalSubjectId,
          unitId: "pyq_vault",
        });
      } catch (dbErr) {
        console.warn("[SUPABASE DB INSERT NON-BLOCKING]", dbErr);
      }

      // Save to persistent local state
      const updatedCustom = [newPaperItem, ...customStoredPapers];
      setCustomStoredPapers(updatedCustom);
      try {
        localStorage.setItem("read_rabbit_custom_pyqs", JSON.stringify(updatedCustom));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }

      // Update Courses hierarchy state
      const updatedCourses = courses.map((course) => {
        if (course.id !== selectedCourseId) return course;

        const updatedSemesters = course.semesters.map((sem) => {
          if (sem.id !== uploadSemId) return sem;

          const updatedSubjects = sem.subjects.map((sub) => {
            if (sub.id !== finalSubjectId) return sub;

            return {
              ...sub,
              materials: [newPaperMaterial, ...(sub.materials || [])],
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
      setUploadSuccess(`🎉 Successfully stored "${finalTitle}" in the Question Papers Vault!`);
      setUploadFile(null);
      setUploadExternalUrl("");
      setPaperTitle("");
      setPaperNotes("");

      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadSuccess("");
        setUploadProgressMsg("");
      }, 1200);
    } catch (err: any) {
      console.error("[UPLOAD PYQ ERROR]", err);
      setUploadError(err.message || "Failed to store question paper. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Question Paper
  const handleDeletePaper = (paperId: string, courseId: string, semId: number, subId: string) => {
    if (!window.confirm("Are you sure you want to remove this question paper from your vault?")) {
      return;
    }

    // 1. Remove from custom stored papers
    const updatedCustom = customStoredPapers.filter((p) => p.paper.id !== paperId);
    setCustomStoredPapers(updatedCustom);
    try {
      localStorage.setItem("read_rabbit_custom_pyqs", JSON.stringify(updatedCustom));
    } catch (e) {
      console.warn("Could not update localStorage", e);
    }

    // 2. Remove from courses hierarchy
    const updatedCourses = courses.map((course) => {
      if (course.id !== courseId) return course;

      const updatedSemesters = course.semesters.map((sem) => {
        if (sem.id !== semId) return sem;

        const updatedSubjects = sem.subjects.map((sub) => {
          if (sub.id !== subId) return sub;

          return {
            ...sub,
            materials: (sub.materials || []).filter((m) => m.id !== paperId),
            units: (sub.units || []).map((u) => ({
              ...u,
              materials: (u.materials || []).filter((m) => m.id !== paperId),
            })),
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

  // Copy Paper Link
  const handleCopyLink = (paper: StudyMaterial) => {
    const url = paper.publicUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLinkPaperId(paper.id);
    setTimeout(() => setCopiedLinkPaperId(null), 2500);
  };

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-[#dac1c1]/30 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 bg-[#fd9b65]/20 text-[#40010d] rounded-2xl">
                <GraduationCap size={24} className="text-[#40010d]" />
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#40010d] tracking-tight">
                Question Papers Vault
              </h2>
            </div>
            <p className="text-sm text-[#544243] font-medium leading-relaxed max-w-2xl">
              Store, view, and organize previous years university examination papers, model question banks, and answer keys across semesters and subjects.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Quick Upload Button */}
            <button
              onClick={() => {
                setUploadSemId(selectedSemesterId || 1);
                const targetSem = currentSemesters.find((s) => s.id === (selectedSemesterId || 1));
                if (targetSem && targetSem.subjects.length > 0) {
                  setUploadSubjectId(targetSem.subjects[0].id);
                }
                setIsUploadModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Plus size={16} />
              <span>Store Question Paper</span>
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#dac1c1]/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fd9b65]/20 flex items-center justify-center text-[#40010d] font-bold">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#40010d]">{allQuestionPapers.length}</p>
              <p className="text-[11px] font-bold text-[#735E55]">Total Question Papers</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#dac1c1]/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6b8a80]/20 flex items-center justify-center text-[#2d5045] font-bold">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#40010d]">{currentSemesters.length} Semesters</p>
              <p className="text-[11px] font-bold text-[#735E55]">All Sems Covered</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#dac1c1]/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e5a025]/20 flex items-center justify-center text-[#95491a] font-bold">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#40010d]">2020 - 2024</p>
              <p className="text-[11px] font-bold text-[#735E55]">Exam Years Archive</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#dac1c1]/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#95491a]/20 flex items-center justify-center text-[#95491a] font-bold">
              <FolderPlus size={20} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#40010d]">{customStoredPapers.length}</p>
              <p className="text-[11px] font-bold text-[#735E55]">Custom Stored</p>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS TOOLBAR */}
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-[#dac1c1]/30 shadow-xs space-y-4">
          {/* Semester Selector Tabs */}
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

          {/* SEARCH & YEAR & EXAM TYPE FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-[#dac1c1]/20">
            <div className="md:col-span-2 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#877272]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question papers by subject, year (2024, 2023), exam type..."
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

            <div>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full py-2 px-3 bg-[#F4ECE1]/40 border border-[#dac1c1]/40 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 font-medium"
              >
                <option value="all">All Exam Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Exam Year {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={examTypeFilter}
                onChange={(e) => setExamTypeFilter(e.target.value)}
                className="w-full py-2 px-3 bg-[#F4ECE1]/40 border border-[#dac1c1]/40 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20 font-medium"
              >
                <option value="all">All Exam Types</option>
                <option value="end">Semester End Exams</option>
                <option value="midterm">Mid-Term / Internals</option>
                <option value="model">Model Papers</option>
              </select>
            </div>
          </div>
        </div>

        {/* QUESTION PAPERS LIST / GRID VIEW */}
        {filteredPapers.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center border border-[#dac1c1]/30 max-w-xl mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 bg-[#fd9b65]/20 text-[#40010d] rounded-2xl flex items-center justify-center mx-auto">
              <FileText size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#40010d]">No Question Papers Found</h3>
            <p className="text-xs text-[#544243] leading-relaxed">
              {searchQuery || yearFilter !== "all" || selectedSemesterId !== null
                ? "No previous year question papers matched your search criteria. Try adjusting your filters or search terms."
                : "No question papers in this view. Store your first past university question paper using the button below."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setYearFilter("all");
                setExamTypeFilter("all");
                setIsUploadModalOpen(true);
              }}
              className="px-6 py-2.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Store Question Paper</span>
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

                    <button
                      onClick={() => {
                        setUploadSemId(semId);
                        const sem = currentSemesters.find((s) => s.id === semId);
                        if (sem && sem.subjects.length > 0) {
                          setUploadSubjectId(sem.subjects[0].id);
                        }
                        setIsUploadModalOpen(true);
                      }}
                      className="text-xs font-bold text-[#95491a] hover:text-[#40010d] flex items-center gap-1.5 px-3 py-1.5 bg-[#F4ECE1] hover:bg-[#e8dbce] rounded-xl transition-all cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add to Sem {semId}</span>
                    </button>
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
                        </div>

                        {/* Papers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {subData.papers.map((item) => {
                            const { paper } = item;
                            const isCopied = copiedLinkPaperId === paper.id;
                            return (
                              <div
                                key={paper.id}
                                className="bg-[#FAF3E0]/70 hover:bg-[#FAF3E0] rounded-2xl p-4.5 border border-[#dac1c1]/30 transition-all flex flex-col justify-between hover:shadow-md hover:border-[#fd9b65]/50 group"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="p-2 bg-[#40010d]/10 text-[#40010d] rounded-xl shrink-0 group-hover:bg-[#40010d] group-hover:text-white transition-colors">
                                        <FileText size={18} />
                                      </div>
                                      <div className="min-w-0">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#95491a] block truncate">
                                          {paper.tag || "PREVIOUS YEAR PAPER"}
                                        </span>
                                        <h5 className="text-xs font-bold text-[#40010d] truncate" title={paper.name}>
                                          {paper.name}
                                        </h5>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => handleCopyLink(paper)}
                                        title={isCopied ? "Link Copied!" : "Copy Share Link"}
                                        className="text-[#735E55] hover:text-[#40010d] p-1 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
                                      >
                                        {isCopied ? <CheckCircle size={13} className="text-green-600" /> : <Share2 size={13} />}
                                      </button>
                                      
                                      {(isAdmin || paper.id.startsWith("pyq_")) && (
                                        <button
                                          onClick={() => handleDeletePaper(paper.id, selectedCourseId, semId, subId)}
                                          title="Remove from Library"
                                          className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {paper.details && (
                                    <p className="text-[11px] text-[#544243] line-clamp-2 leading-relaxed mb-3">
                                      {paper.details}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-3 text-[10px] text-[#877272] mb-3 font-medium">
                                    <span>Size: {paper.size || "PDF"}</span>
                                    <span>•</span>
                                    <span>Added: {paper.addedTime || "Recent"}</span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 border-t border-[#dac1c1]/20 flex items-center gap-2">
                                  <button
                                    onClick={() => setActivePreviewPaper(item)}
                                    className="flex-1 py-2 px-3 bg-[#40010d] hover:bg-[#5a0213] text-white text-[11px] font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                                  >
                                    <Eye size={13} />
                                    <span>Preview Paper</span>
                                  </button>

                                  {paper.publicUrl && (
                                    <a
                                      href={paper.publicUrl}
                                      download={paper.name}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-white hover:bg-[#F4ECE1] text-[#40010d] border border-[#dac1c1]/40 rounded-xl text-center transition-colors cursor-pointer"
                                      title="Download Paper"
                                    >
                                      <FileDown size={14} />
                                    </a>
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

      {/* IN-APP QUESTION PAPER PREVIEW MODAL */}
      {activePreviewPaper && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#dac1c1]/30 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#dac1c1]/20 bg-[#FAF3E0]/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#40010d] text-white rounded-xl">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#95491a] text-white px-2 py-0.5 rounded-full">
                      {activePreviewPaper.paper.tag || "QUESTION PAPER"}
                    </span>
                    <span className="text-xs text-[#735E55] font-semibold">
                      {activePreviewPaper.semesterName} • {activePreviewPaper.subjectName}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#40010d] mt-0.5">
                    {activePreviewPaper.paper.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activePreviewPaper.paper.publicUrl && (
                  <a
                    href={activePreviewPaper.paper.publicUrl}
                    download={activePreviewPaper.paper.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white hover:bg-[#F4ECE1] text-[#40010d] border border-[#dac1c1]/40 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Download size={14} />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                )}
                <button
                  onClick={() => setActivePreviewPaper(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 font-bold transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col items-center justify-center min-h-[400px]">
              {activePreviewPaper.paper.publicUrl ? (
                <div className="w-full h-[500px] bg-white rounded-2xl shadow-inner border border-gray-200 overflow-hidden relative">
                  <iframe
                    src={`${activePreviewPaper.paper.publicUrl}#toolbar=1`}
                    title={activePreviewPaper.paper.name}
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-[#dac1c1] max-w-md">
                  <FileText size={40} className="text-[#95491a] mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-[#40010d] mb-1">Document Content Preview</h4>
                  <p className="text-xs text-[#544243] mb-4 leading-relaxed">
                    {activePreviewPaper.paper.details || "University past exam paper available for download and offline review."}
                  </p>
                  <span className="text-[11px] bg-[#FAF3E0] text-[#95491a] px-3 py-1 rounded-full font-bold inline-block">
                    Size: {activePreviewPaper.paper.size}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer Notes */}
            <div className="p-4 bg-white border-t border-[#dac1c1]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-[#544243]">
                <span className="font-bold text-[#40010d]">Subject:</span> {activePreviewPaper.subjectName} |{" "}
                <span className="font-bold text-[#40010d]">Exam Type:</span> {activePreviewPaper.examType || "Semester End Exam"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(activePreviewPaper.paper)}
                  className="px-3 py-1.5 bg-[#FAF3E0] hover:bg-[#f8e6cb] text-[#40010d] font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>{copiedLinkPaperId === activePreviewPaper.paper.id ? "Copied!" : "Share Link"}</span>
                </button>
                <button
                  onClick={() => setActivePreviewPaper(null)}
                  className="px-4 py-1.5 bg-[#40010d] hover:bg-[#5a0213] text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / STORE QUESTION PAPER MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#dac1c1]/30 my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#dac1c1]/20">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-[#fd9b65]/20 text-[#40010d] rounded-xl">
                  <Upload size={18} />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#40010d]">Store Past Year Question Paper</h3>
                  <p className="text-[11px] text-[#735E55]">Saved permanently to Question Papers Vault</p>
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
                    <option value="Solved Question Paper">Solved Question Paper</option>
                  </select>
                </div>
              </div>

              {/* Upload Mode Switcher (File vs URL) */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1.5">Upload Method</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`flex-1 py-1.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      uploadMode === "file"
                        ? "bg-[#40010d] text-white shadow-xs"
                        : "bg-[#FAF3E0] text-[#544243] hover:bg-[#f8e6cb]"
                    }`}
                  >
                    <Upload size={13} />
                    <span>Upload Document File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`flex-1 py-1.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      uploadMode === "url"
                        ? "bg-[#40010d] text-white shadow-xs"
                        : "bg-[#FAF3E0] text-[#544243] hover:bg-[#f8e6cb]"
                    }`}
                  >
                    <LinkIcon size={13} />
                    <span>Web / Drive URL Link</span>
                  </button>
                </div>
              </div>

              {/* File Input */}
              {uploadMode === "file" ? (
                <div>
                  <label className="block font-bold text-[#40010d] mb-1">Choose Question Paper PDF</label>
                  <div className="border-2 border-dashed border-[#dac1c1] rounded-2xl p-4 text-center bg-[#FAF3E0]/30 hover:bg-[#FAF3E0]/60 transition-colors">
                    <input
                      type="file"
                      id="pyq-file-upload"
                      accept=".pdf,.doc,.docx,image/*"
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
                          <p className="text-[10px] text-[#735E55]">Supports PDF, DOC, and Image formats</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-[#40010d] mb-1">Direct PDF or Google Drive URL</label>
                  <input
                    type="url"
                    value={uploadExternalUrl}
                    onChange={(e) => setUploadExternalUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or https://example.com/paper.pdf"
                    className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                  />
                </div>
              )}

              {/* Paper Title (Optional) */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">
                  Custom Paper Title <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="e.g. University Main Examination Paper Set A"
                  className="w-full py-2 px-3 bg-[#FAF3E0]/50 border border-[#dac1c1]/50 rounded-xl text-xs text-[#40010d] focus:outline-none focus:ring-2 focus:ring-[#40010d]/20"
                />
              </div>

              {/* Notes / Description */}
              <div>
                <label className="block font-bold text-[#40010d] mb-1">
                  Additional Notes / Answer Key Details <span className="text-gray-400 font-normal">(Optional)</span>
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
                  <span>{uploadProgressMsg || "Storing Question Paper..."}</span>
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
                  disabled={isUploading || (uploadMode === "file" && !uploadFile) || (uploadMode === "url" && !uploadExternalUrl.trim())}
                  className="px-5 py-2 bg-[#40010d] hover:bg-[#5a0213] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Save in Vault</span>
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
