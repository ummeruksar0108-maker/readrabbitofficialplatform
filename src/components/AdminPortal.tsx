import React, { useState } from "react";
import { Course, Subject, Semester, Unit, StudyMaterial, AppNotification, StudentFeedback, FeedbackStatus, StudentVisitor } from "../types";
import { uploadFileToSupabaseStorage, deleteFileFromSupabaseStorage, insertMaterialToSupabaseDB, deleteMaterialFromSupabase, supabase } from "../lib/supabase";
import { loadStudentVisitorsFromFirestore, deleteStudentVisitorFromFirestore } from "../lib/firebase";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  BookOpen, 
  FolderPlus, 
  LogOut, 
  Layers, 
  Settings, 
  Info,
  Sliders,
  Sparkles,
  FileText,
  Bell,
  X,
  ChevronDown,
  ChevronUp,
  Upload,
  Save,
  CloudUpload,
  ArrowLeft,
  Download,
  RefreshCw,
  Share2,
  Search,
  Filter,
  Eye,
  EyeOff,
  HardDrive,
  Key,
  Users,
  Send,
  Zap,
  MessageSquareHeart,
  Star,
  MessageSquare,
  Check,
  CornerDownRight,
  GraduationCap,
  Lightbulb,
  Bug,
  UserCheck,
  Activity,
  FileSpreadsheet
} from "lucide-react";

interface AdminPortalProps {
  courses: Course[];
  onUpdateCourses: (updatedCourses: Course[]) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  onClose?: () => void;
  onSendNotification?: (title: string, message: string, tag?: string, targetAudience?: string) => void;
  notifications?: AppNotification[];
  onDeleteNotification?: (id: string) => void;
  onClearAllNotifications?: () => void;
  feedbackList?: StudentFeedback[];
  onUpdateFeedbackStatus?: (id: string, status: FeedbackStatus, adminNote?: string) => Promise<void>;
  onDeleteFeedback?: (id: string) => Promise<void>;
  onClearAllFeedback?: () => Promise<void>;
}

export default function AdminPortal({
  courses,
  onUpdateCourses,
  isAdmin,
  setIsAdmin,
  onClose,
  onSendNotification,
  notifications = [],
  onDeleteNotification,
  onClearAllNotifications,
  feedbackList = [],
  onUpdateFeedbackStatus,
  onDeleteFeedback,
  onClearAllFeedback,
}: AdminPortalProps) {
  // Login fields
  const [email, setEmail] = useState(() => (import.meta.env.VITE_ADMIN_EMAIL as string) || "thecodeorbitoffi@gmail.com");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Admin Dashboard main tab state: 'curriculum' | 'uploads' | 'sync' | 'semesters' | 'notifications' | 'feedback' | 'visitors' | 'security'
  const [activeAdminTab, setActiveAdminTab] = useState<"curriculum" | "uploads" | "sync" | "semesters" | "notifications" | "feedback" | "visitors" | "security">("curriculum");

  // Admin Uploads Directory States
  const [uploadSearch, setUploadSearch] = useState("");
  const [uploadTypeFilter, setUploadTypeFilter] = useState("all");
  const [uploadCourseFilter, setUploadCourseFilter] = useState("all");
  const [serverFiles, setServerFiles] = useState<Array<{ filename: string; url: string; sizeBytes: number; createdAt: string }>>([]);
  const [isLoadingServerFiles, setIsLoadingServerFiles] = useState(false);
  const [uploadDirectoryViewMode, setUploadDirectoryViewMode] = useState<"curriculum" | "server">("curriculum");

  // Fetch server disk files when Uploads tab is opened
  React.useEffect(() => {
    if (activeAdminTab === "uploads") {
      setIsLoadingServerFiles(true);
      fetch("/api/uploads")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setServerFiles(data);
        })
        .catch((err) => console.log("Failed fetching server uploads:", err))
        .finally(() => setIsLoadingServerFiles(false));
    }
  }, [activeAdminTab]);

  // Aggregate all uploaded study materials across all courses, semesters, subjects, and units
  const allUploadedMaterials = React.useMemo(() => {
    const list: Array<{
      material: StudyMaterial;
      courseName: string;
      courseId: string;
      semesterName: string;
      subjectName: string;
      subjectId: string;
      unitTitle?: string;
      unitId?: string;
    }> = [];

    courses.forEach((course) => {
      course.semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
          // Subject-level materials
          if (subject.materials && subject.materials.length > 0) {
            subject.materials.forEach((mat) => {
              list.push({
                material: mat,
                courseName: course.name,
                courseId: course.id,
                semesterName: semester.name,
                subjectName: subject.name,
                subjectId: subject.id,
              });
            });
          }
          // Unit-level materials
          if (subject.units && subject.units.length > 0) {
            subject.units.forEach((unit) => {
              if (unit.materials && unit.materials.length > 0) {
                unit.materials.forEach((mat) => {
                  list.push({
                    material: mat,
                    courseName: course.name,
                    courseId: course.id,
                    semesterName: semester.name,
                    subjectName: subject.name,
                    subjectId: subject.id,
                    unitTitle: `Unit ${unit.number}: ${unit.name}`,
                    unitId: unit.id,
                  });
                });
              }
            });
          }
        });
      });
    });

    return list;
  }, [courses]);

  // Filter materials based on search text and dropdown filters
  const filteredUploadedMaterials = allUploadedMaterials.filter((item) => {
    const matchesSearch =
      !uploadSearch ||
      item.material.name.toLowerCase().includes(uploadSearch.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(uploadSearch.toLowerCase()) ||
      (item.unitTitle && item.unitTitle.toLowerCase().includes(uploadSearch.toLowerCase()));

    const matchesType =
      uploadTypeFilter === "all" ||
      item.material.type.toLowerCase() === uploadTypeFilter.toLowerCase();

    const matchesCourse =
      uploadCourseFilter === "all" || item.courseId === uploadCourseFilter;

    return matchesSearch && matchesType && matchesCourse;
  });

  // Delete a study material from curriculum & cloud
  const handleDeleteMaterialFromAdmin = async (
    materialId: string,
    subjectId: string,
    unitId?: string,
    cloudPath?: string
  ) => {
    if (!isAdmin) {
      alert("Only an authenticated admin can delete study materials.");
      return;
    }
    if (!confirm("Are you sure you want to delete this upload from the curriculum? This cannot be undone.")) return;

    const delRes = await deleteMaterialFromSupabase(materialId, cloudPath);
    if (!delRes.success) {
      alert(`Deletion Failed: ${delRes.message}`);
      return;
    }

    const updatedCourses = courses.map((course) => ({
      ...course,
      semesters: course.semesters.map((semester) => ({
        ...semester,
        subjects: semester.subjects.map((subject) => {
          if (subject.id !== subjectId) return subject;

          if (unitId) {
            return {
              ...subject,
              units: subject.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  materials: (unit.materials || []).filter((m) => m.id !== materialId),
                };
              }),
            };
          } else {
            return {
              ...subject,
              materials: (subject.materials || []).filter((m) => m.id !== materialId),
            };
          }
        }),
      })),
    }));

    onUpdateCourses(updatedCourses);
    await handleSaveCurriculumToCloud(updatedCourses);

    alert("Study material deleted successfully from Supabase Storage and Database! 🥕");
  };

  // Delete raw file from server disk
  const handleDeleteServerFile = async (filename: string) => {
    if (!confirm(`Permanently delete "${filename}" from server storage?`)) return;
    try {
      const res = await fetch(`/api/files/${filename}`, { method: "DELETE" });
      if (res.ok) {
        setServerFiles((prev) => prev.filter((f) => f.filename !== filename));
        alert("File permanently removed from server disk storage.");
      } else {
        alert("Server returned error deleting file.");
      }
    } catch (e) {
      alert("Failed to delete file from server: " + e);
    }
  };

  // Load admin password from localStorage (default: "admin")
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem("read_rabbit_admin_password") || "admin";
  });

  // Selector state
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [selectedSemesterId, setSelectedSemesterId] = useState<number>(1);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  // Form Fields for Subject Metadata
  const [subName, setSubName] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subDiff, setSubDiff] = useState<"Core" | "Intermediate" | "Advanced">("Core");
  const [subIcon, setSubIcon] = useState("BookOpen");
  const [subIsLab, setSubIsLab] = useState(false);

  // Dynamic Units State for currently editing/adding subject
  const [formUnits, setFormUnits] = useState<Unit[]>([]);
  const [expandedUnitFileId, setExpandedUnitFileId] = useState<string | null>(null);

  // Unit PDF Inline form state
  const [newUnitPdfName, setNewUnitPdfName] = useState("");
  const [newUnitPdfSize, setNewUnitPdfSize] = useState("1.5 MB");
  const [newUnitPdfDetails, setNewUnitPdfDetails] = useState("");
  const [portalIsDragging, setPortalIsDragging] = useState(false);

  // Cloud Save State & Handler
  const [isAdminSavingWeb, setIsAdminSavingWeb] = useState(false);
  const [adminWebSaveSuccess, setAdminWebSaveSuccess] = useState(false);

  const handleSaveCurriculumToCloud = async (updatedCoursesList?: Course[]) => {
    setIsAdminSavingWeb(true);
    try {
      const targetCourses = updatedCoursesList || courses;
      onUpdateCourses(targetCourses);
      await fetch("/api/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: targetCourses })
      }).catch(() => {});
      setAdminWebSaveSuccess(true);
      setTimeout(() => setAdminWebSaveSuccess(false), 5000);
    } catch (err) {
      console.warn("[ADMIN SAVE ERROR]", err);
    } finally {
      setIsAdminSavingWeb(false);
    }
  };

  // Export Curriculum JSON function
  const handleExportCurriculumJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `read_rabbit_curriculum_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert("Curriculum backup exported! You can now import this file on your phone or any device to transfer all notes & PDFs. 🥕");
    } catch (e) {
      alert("Failed to export curriculum JSON file: " + e);
    }
  };

  // Import Curriculum JSON function
  const handleImportCurriculumJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onUpdateCourses(parsed);
            await handleSaveCurriculumToCloud(parsed);
            alert("Curriculum successfully imported and synchronized! All uploaded PDFs and subjects are now available. 🥕");
          } else {
            alert("Invalid curriculum JSON structure.");
          }
        } catch (err) {
          alert("Error parsing JSON file. Please ensure it is a valid Read Rabbit curriculum export.");
        }
      };
    }
  };

  // Semester addition fields
  const [newSemName, setNewSemName] = useState("");
  const [newSemDesc, setNewSemDesc] = useState("");

  // Notification fields
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifTag, setNotifTag] = useState("Exam Alert");
  const [notifAudience, setNotifAudience] = useState("All Enrolled Students & Faculty");

  // Security change password fields
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [securityError, setSecurityError] = useState("");

  // Helper to verify single configured admin email
  const isApprovedAdminEmail = (userEmail?: string | null): boolean => {
    if (!userEmail) return true; // Allow local password login if email field is simple or custom
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "thecodeorbitoffi@gmail.com").trim().toLowerCase();
    const clean = userEmail.trim().toLowerCase();
    return (
      clean === adminEmail ||
      clean === "thecodeorbitoffi@gmail.com" ||
      clean === "admin@readrabbit.com" ||
      clean === "admin" ||
      clean.includes("admin")
    );
  };

  // Handle Supabase Auth Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const inputPassword = password.trim();

    if (!trimmedEmail) {
      setLoginError("Please enter your registered administrator email address.");
      return;
    }

    if (!inputPassword) {
      setLoginError("Please enter your Supabase account password.");
      return;
    }

    setIsAuthLoading(true);
    setLoginError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: inputPassword,
      });

      if (error || !data?.session) {
        console.warn("[SUPABASE AUTH LOGIN NOTICE]", error?.message);
        const errMsg = error?.message?.toLowerCase().includes("invalid login credentials")
          ? "Invalid email or password. Please verify your credentials or click 'Forgot Password? Send Recovery Email' below to reset your password."
          : error?.message || "Invalid email or password. Please check your Supabase Auth credentials.";
        setLoginError(errMsg);
        setIsAuthLoading(false);
        return;
      }

      // Successfully authenticated with Supabase Auth session
      localStorage.setItem("read_rabbit_is_admin", "true");
      setIsAdmin(true);
      setLoginError("");
      setIsAuthLoading(false);
    } catch (err: any) {
      console.error("[SUPABASE AUTH LOGIN EXCEPTION]", err);
      setLoginError(err?.message || "Authentication failed. Please check your network connection and credentials.");
      setIsAuthLoading(false);
    }
  };

  // Handle Sending Supabase Auth Password Reset Email
  const handleResetPasswordEmail = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setLoginError("Please enter your registered administrator email address above first.");
      return;
    }
    setIsAuthLoading(true);
    setLoginError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: window.location.origin,
      });
      setIsAuthLoading(false);
      if (error) {
        setLoginError(error.message);
      } else {
        alert(`Password recovery link sent to ${trimmedEmail}! Check your email inbox and click the reset link.`);
      }
    } catch (err: any) {
      setIsAuthLoading(false);
      setLoginError(err?.message || "Failed to send password reset email.");
    }
  };

  // Handle Logout from Admin Portal
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("SignOut error:", e);
    }
    localStorage.removeItem("read_rabbit_is_admin");
    setIsAdmin(false);
    setEmail("");
    setPassword("");
  };

  // Find currently active objects
  const activeCourse = courses.find(c => c.id === selectedCourseId);
  const activeSemester = activeCourse?.semesters.find(s => s.id === selectedSemesterId);

  // Set form fields for editing subject
  const startEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubName(subject.name);
    setSubDesc(subject.description);
    setSubDiff(subject.difficulty);
    setSubIcon(subject.icon);
    setSubIsLab(!!subject.isLab);

    // Dynamic units load
    setFormUnits(subject.units || []);
    setIsAddingSubject(false);
    setExpandedUnitFileId(null);
  };

  // Set form fields for adding subject
  const startAddSubject = () => {
    setEditingSubject(null);
    setSubName("");
    setSubDesc("");
    setSubDiff("Core");
    setSubIcon("BookOpen");
    setSubIsLab(false);

    // Seed 4 initial units dynamically for the new subject
    setFormUnits([
      { id: "u1_" + Date.now(), number: "01", name: "Unit 1: Introduction", description: "Foundational theory and core terminology.", masteryPercent: 0, status: "Locked", topics: [], materials: [] },
      { id: "u2_" + Date.now(), number: "02", name: "Unit 2: Logic and Architecture", description: "Standard methodologies and algorithmic setups.", masteryPercent: 0, status: "Locked", topics: [], materials: [] },
      { id: "u3_" + Date.now(), number: "03", name: "Unit 3: Applied Systems", description: "Practical applications and case scenario assessments.", masteryPercent: 0, status: "Locked", topics: [], materials: [] },
      { id: "u4_" + Date.now(), number: "04", name: "Unit 4: Advanced Practice", description: "Syllabus synthesis and midterm preview review.", masteryPercent: 0, status: "Locked", topics: [], materials: [] }
    ]);
    setIsAddingSubject(true);
    setExpandedUnitFileId(null);
  };

  // Add Dynamic Unit Field
  const handleAddUnitField = () => {
    const nextNum = (formUnits.length + 1).toString().padStart(2, "0");
    setFormUnits([
      ...formUnits,
      {
        id: "u" + nextNum + "_" + Date.now(),
        number: nextNum,
        name: `Unit ${formUnits.length + 1}: New Syllabus Module`,
        description: "",
        masteryPercent: 0,
        status: "Locked",
        topics: [],
        materials: []
      }
    ]);
  };

  // Remove Dynamic Unit Field
  const handleRemoveUnitField = (index: number) => {
    if (formUnits.length <= 1) {
      alert("A subject must contain at least one unit/module.");
      return;
    }
    setFormUnits(formUnits.filter((_, i) => i !== index).map((u, i) => ({
      ...u,
      number: (i + 1).toString().padStart(2, "0")
    })));
  };

  // Save Subject (Add or Edit)
  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    if (formUnits.length === 0) {
      alert("You must define at least one syllabus unit.");
      return;
    }

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourseId) return course;

      return {
        ...course,
        semesters: course.semesters.map(sem => {
          if (sem.id !== selectedSemesterId) return sem;

          let updatedSubjects = [...sem.subjects];

          if (editingSubject) {
            // Edit existing subject
            updatedSubjects = updatedSubjects.map(sub => {
              if (sub.id === editingSubject.id) {
                return {
                  ...sub,
                  name: subName,
                  description: subDesc,
                  difficulty: subDiff,
                  icon: subIcon,
                  isLab: subIsLab,
                  modulesCount: formUnits.length,
                  units: formUnits
                };
              }
              return sub;
            });
          } else {
            // Add new subject
            const newSub: Subject = {
              id: "sub_" + Date.now(),
              name: subName,
              description: subDesc,
              modulesCount: formUnits.length,
              completedModules: 0,
              difficulty: subDiff,
              icon: subIcon,
              bgColor: subIsLab ? "bg-emerald-50 text-emerald-800" : "bg-orange-50 text-orange-800",
              textColor: subIsLab ? "text-emerald-800" : "text-orange-800",
              progressPercent: 0,
              units: formUnits,
              materials: [],
              isLab: subIsLab
            };
            updatedSubjects.push(newSub);
          }

          return {
            ...sem,
            subjects: updatedSubjects,
            modulesCount: updatedSubjects.reduce((acc, s) => acc + s.modulesCount, 0)
          };
        })
      };
    });

    onUpdateCourses(updatedCourses);
    handleSaveCurriculumToCloud(updatedCourses);
    setEditingSubject(null);
    setIsAddingSubject(false);
    alert(`Subject "${subName}" successfully saved with ${formUnits.length} dynamic units! 🥕`);
  };

  // Delete Subject
  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${subjectName}"? This cannot be undone.`)) return;

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourseId) return course;

      return {
        ...course,
        semesters: course.semesters.map(sem => {
          if (sem.id !== selectedSemesterId) return sem;

          const updatedSubjects = sem.subjects.filter(s => s.id !== subjectId);
          return {
            ...sem,
            subjects: updatedSubjects,
            modulesCount: updatedSubjects.reduce((acc, s) => acc + s.modulesCount, 0)
          };
        })
      };
    });

    onUpdateCourses(updatedCourses);
    handleSaveCurriculumToCloud(updatedCourses);
    if (editingSubject?.id === subjectId) {
      setEditingSubject(null);
    }
  };

  // Process drag/drop or selected file in AdminPortal with Supabase Cloud Storage upload
  const handleProcessPortalFile = async (file: File, unitId: string) => {
    if (!file) {
      console.error("[ADMIN UPLOAD STEP 1 ERROR] No file provided");
      return;
    }

    console.log(`[ADMIN UPLOAD STEP 1: File Selected] Name: ${file.name}, Size: ${file.size} bytes`);

    let cloudRes;
    try {
      console.log(`[ADMIN UPLOAD TO SUPABASE] Calling uploadFileToSupabaseStorage...`);
      cloudRes = await uploadFileToSupabaseStorage(
        file,
        {
          courseId: selectedCourseId,
          semesterId: String(selectedSemesterId),
          subjectId: editingSubject?.id || "subject",
          unitId: unitId
        }
      );
      console.log("[ADMIN UPLOAD SUPABASE SUCCESS] Permanent public URL:", cloudRes.publicUrl);

      // Save metadata to Supabase PostgreSQL table 'study_materials'
      try {
        await insertMaterialToSupabaseDB(cloudRes);
        console.log(`[SUPABASE DB INSERT SUCCESS] Record for "${cloudRes.name}" successfully inserted into study_materials table.`);
      } catch (dbErr: any) {
        console.error(`[SUPABASE DB INSERT FAILED] Failed to insert metadata for "${cloudRes.name}" into study_materials:`, dbErr);
        throw dbErr;
      }
    } catch (uploadErr: any) {
      console.error("[ADMIN CLOUD UPLOAD ERROR] Failed uploading to Supabase Storage or Database:", uploadErr);
      if (cloudRes?.cloudPath) {
        await deleteFileFromSupabaseStorage(cloudRes.cloudPath).catch(() => {});
      }
      alert(`Upload error: ${uploadErr.message || "Failed to upload file to cloud."}`);
      return;
    }

    try {
      const newMaterial: StudyMaterial = {
        id: cloudRes.id,
        name: cloudRes.name,
        size: cloudRes.size,
        addedTime: "Uploaded by Admin",
        type: cloudRes.type,
        isBookmarked: false,
        tag: "Unit File",
        details: cloudRes.publicUrl,
        cloudPath: cloudRes.cloudPath,
        publicUrl: cloudRes.publicUrl,
        uploadedAt: cloudRes.uploadedAt,
        courseId: cloudRes.courseId,
        semesterId: cloudRes.semesterId,
        subjectId: cloudRes.subjectId,
        unitId: cloudRes.unitId
      };

      const updatedFormUnits = formUnits.map(unit => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          materials: [...(unit.materials || []), newMaterial]
        };
      });

      setFormUnits(updatedFormUnits);

      if (editingSubject) {
        const updatedCourses = courses.map(course => {
          if (course.id !== selectedCourseId) return course;
          return {
            ...course,
            semesters: course.semesters.map(sem => {
              if (sem.id !== selectedSemesterId) return sem;
              return {
                ...sem,
                subjects: sem.subjects.map(sub => {
                  if (sub.id !== editingSubject.id) return sub;
                  return {
                    ...sub,
                    units: updatedFormUnits
                  };
                })
              };
            })
          };
        });
        onUpdateCourses(updatedCourses);
        setEditingSubject({
          ...editingSubject,
          units: updatedFormUnits
        });
      }

      alert(`"${cloudRes.name}" successfully uploaded and saved to Supabase study_materials table! 🥕`);
    } catch (err: any) {
      console.error("[ADMIN UPLOAD FATAL ERROR]", err);
      alert(`Upload failed: ${err.message || "Could not save file"}`);
    }
  };

  // Upload PDF study material directly inside a unit
  const handleUploadPdfToUnit = (unitId: string) => {
    if (!newUnitPdfName.trim()) {
      alert("Please specify a document/PDF name.");
      return;
    }

    const newMaterial: StudyMaterial = {
      id: "mat_unit_" + Date.now(),
      name: newUnitPdfName.trim(),
      size: newUnitPdfSize || "1.5 MB",
      addedTime: "Uploaded by Admin",
      type: "pdf",
      isBookmarked: false,
      tag: "Unit File",
      details: newUnitPdfDetails || "Curated reference notes specifically aligned to this syllabus module."
    };

    // Append material to targeted unit's materials array
    const updatedFormUnits = formUnits.map(unit => {
      if (unit.id !== unitId) return unit;
      return {
        ...unit,
        materials: [...(unit.materials || []), newMaterial]
      };
    });

    setFormUnits(updatedFormUnits);

    // Save back to full course state if editing an existing subject
    if (editingSubject) {
      const updatedCourses = courses.map(course => {
        if (course.id !== selectedCourseId) return course;
        return {
          ...course,
          semesters: course.semesters.map(sem => {
            if (sem.id !== selectedSemesterId) return sem;
            return {
              ...sem,
              subjects: sem.subjects.map(sub => {
                if (sub.id !== editingSubject.id) return sub;
                return {
                  ...sub,
                  units: updatedFormUnits
                };
              })
            };
          })
        };
      });
      onUpdateCourses(updatedCourses);
      handleSaveCurriculumToCloud(updatedCourses);
      
      // Keep local editing subject state in sync
      setEditingSubject({
        ...editingSubject,
        units: updatedFormUnits
      });
    } else {
      handleSaveCurriculumToCloud();
    }

    // Reset inline uploader state
    setNewUnitPdfName("");
    setNewUnitPdfDetails("");
    alert("PDF uploaded and successfully attached inside the unit! 🥕");
  };

  // Delete PDF study material from inside a unit
  const handleDeletePdfFromUnit = async (unitId: string, materialId: string) => {
    if (!isAdmin) {
      alert("Only an authenticated admin can delete study materials.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this PDF file from this unit?")) return;

    const targetUnit = formUnits.find(u => u.id === unitId);
    const targetMat = targetUnit?.materials?.find(m => m.id === materialId);

    const delRes = await deleteMaterialFromSupabase(materialId, targetMat?.cloudPath);
    if (!delRes.success) {
      alert(`Deletion Failed: ${delRes.message}`);
      return;
    }

    const updatedFormUnits = formUnits.map(unit => {
      if (unit.id !== unitId) return unit;
      return {
        ...unit,
        materials: (unit.materials || []).filter(m => m.id !== materialId)
      };
    });

    setFormUnits(updatedFormUnits);

    if (editingSubject) {
      const updatedCourses = courses.map(course => {
        if (course.id !== selectedCourseId) return course;
        return {
          ...course,
          semesters: course.semesters.map(sem => {
            if (sem.id !== selectedSemesterId) return sem;
            return {
              ...sem,
              subjects: sem.subjects.map(sub => {
                if (sub.id !== editingSubject.id) return sub;
                return {
                  ...sub,
                  units: updatedFormUnits
                };
              })
            };
          })
        };
      });
      onUpdateCourses(updatedCourses);

      setEditingSubject({
        ...editingSubject,
        units: updatedFormUnits
      });
    }
    alert("Study material deleted successfully from Supabase Storage and Database! 🥕");
  };

  // Add Dynamic Semester
  const handleAddSemester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSemName.trim()) return;

    const targetCourse = courses.find(c => c.id === selectedCourseId);
    if (!targetCourse) return;

    // Calculate next semester ID
    const nextSemId = targetCourse.semesters.length > 0 
      ? Math.max(...targetCourse.semesters.map(s => s.id)) + 1 
      : 1;

    const newSemester: Semester = {
      id: nextSemId,
      name: newSemName,
      description: newSemDesc || "Custom academic study roadmap.",
      status: "In Progress",
      modulesCount: 0,
      completedModules: 0,
      progressPercent: 0,
      borderClass: "border-[#fd9b65]",
      badgeBg: "bg-[#fff2e1] text-[#95491a]",
      badgeText: "Unlocked",
      icon: "BookOpen",
      subjects: []
    };

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourseId) return course;
      return {
        ...course,
        semesters: [...course.semesters, newSemester]
      };
    });

    onUpdateCourses(updatedCourses);
    setSelectedSemesterId(nextSemId);
    setNewSemName("");
    setNewSemDesc("");
    alert(`"${newSemName}" has been successfully added to ${targetCourse.name} as an unlocked roadmap! 🥕`);
  };

  // Delete Dynamic Semester
  const handleDeleteSemester = (semId: number, semName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${semName}"? This will delete all subjects and units within it. This cannot be undone.`)) return;

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourseId) return course;
      return {
        ...course,
        semesters: course.semesters.filter(s => s.id !== semId)
      };
    });

    onUpdateCourses(updatedCourses);

    // If the currently selected semester is the deleted one, reset it to the first available semester
    const targetCourse = courses.find(c => c.id === selectedCourseId);
    const remainingSems = targetCourse?.semesters.filter(s => s.id !== semId) || [];
    if (selectedSemesterId === semId) {
      if (remainingSems.length > 0) {
        setSelectedSemesterId(remainingSems[0].id);
      } else {
        setSelectedSemesterId(1);
      }
    }

    alert(`"${semName}" successfully deleted! 🥕`);
  };

  // Dispatch Notification
  const handleSendNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    if (onSendNotification) {
      onSendNotification(notifTitle.trim(), notifMessage.trim(), notifTag, notifAudience);
      setNotifTitle("");
      setNotifMessage("");
      alert("📢 Notification broadcasted to all students successfully! 🥕");
    } else {
      alert("Error: Notification service not integrated.");
    }
  };

  // Change Password Handler (Inside Authenticated Admin Portal)
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = localStorage.getItem("read_rabbit_admin_password") || "admin";
    
    if (oldPasswordInput !== currentPass) {
      setSecurityError("Current administrator password is incorrect.");
      setSecuritySuccess("");
      return;
    }
    if (!newPasswordInput.trim()) {
      setSecurityError("New password cannot be empty.");
      setSecuritySuccess("");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setSecurityError("New passwords do not match.");
      setSecuritySuccess("");
      return;
    }

    const updatedPass = newPasswordInput.trim();
    localStorage.setItem("read_rabbit_admin_password", updatedPass);
    setAdminPassword(updatedPass);
    setOldPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setSecurityError("");
    setSecuritySuccess("Administrator password updated successfully! 🥕");
  };

  // Feedback Tab States
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState("all");
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState("all");
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState("all");
  const [editingAdminNoteId, setEditingAdminNoteId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [isUpdatingFeedback, setIsUpdatingFeedback] = useState<string | null>(null);

  // Derived feedback metrics
  const unreadFeedbackCount = React.useMemo(() => {
    return feedbackList.filter(f => f.status === "unread").length;
  }, [feedbackList]);

  const averageRating = React.useMemo(() => {
    if (feedbackList.length === 0) return "5.0";
    const sum = feedbackList.reduce((acc, f) => acc + (f.rating || 5), 0);
    return (sum / feedbackList.length).toFixed(1);
  }, [feedbackList]);

  const materialsRequestsCount = React.useMemo(() => {
    return feedbackList.filter(f => f.category === "materials").length;
  }, [feedbackList]);

  // Filtered feedback items
  const filteredFeedbackList = React.useMemo(() => {
    return feedbackList.filter(item => {
      // Category filter
      if (feedbackCategoryFilter !== "all" && item.category !== feedbackCategoryFilter) {
        return false;
      }
      // Rating filter
      if (feedbackRatingFilter !== "all" && String(item.rating) !== feedbackRatingFilter) {
        return false;
      }
      // Status filter
      if (feedbackStatusFilter !== "all" && item.status !== feedbackStatusFilter) {
        return false;
      }
      // Search query
      if (feedbackSearch.trim()) {
        const q = feedbackSearch.toLowerCase();
        const matchesName = (item.studentName || "").toLowerCase().includes(q);
        const matchesEmail = (item.studentEmail || "").toLowerCase().includes(q);
        const matchesMessage = (item.message || "").toLowerCase().includes(q);
        const matchesCourse = (item.courseName || "").toLowerCase().includes(q);
        const matchesNote = (item.adminNote || "").toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesMessage && !matchesCourse && !matchesNote) {
          return false;
        }
      }
      return true;
    });
  }, [feedbackList, feedbackCategoryFilter, feedbackRatingFilter, feedbackStatusFilter, feedbackSearch]);

  // Status toggle handler
  const handleStatusChange = async (id: string, newStatus: FeedbackStatus) => {
    if (!onUpdateFeedbackStatus) return;
    setIsUpdatingFeedback(id);
    try {
      const item = feedbackList.find(f => f.id === id);
      await onUpdateFeedbackStatus(id, newStatus, item?.adminNote);
    } catch (e) {
      console.warn("Failed updating feedback status:", e);
    } finally {
      setIsUpdatingFeedback(null);
    }
  };

  // Save admin note
  const handleSaveAdminNote = async (id: string) => {
    if (!onUpdateFeedbackStatus) return;
    setIsUpdatingFeedback(id);
    try {
      const item = feedbackList.find(f => f.id === id);
      await onUpdateFeedbackStatus(id, item?.status || "reviewed", adminNoteInput.trim());
      setEditingAdminNoteId(null);
      setAdminNoteInput("");
    } catch (e) {
      console.warn("Failed saving admin note:", e);
    } finally {
      setIsUpdatingFeedback(null);
    }
  };

  // Delete feedback item
  const handleDeleteFeedbackItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this student feedback entry?")) return;
    if (onDeleteFeedback) {
      await onDeleteFeedback(id);
    }
  };

  // Export Feedback to JSON / CSV
  const handleExportFeedback = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbackList, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `read_rabbit_student_feedback_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Failed to export feedback: " + e);
    }
  };

  // ==========================================
  // STUDENT VISITORS & ACCESS DIRECTORY STATES
  // ==========================================
  const [visitorsList, setVisitorsList] = useState<StudentVisitor[]>([]);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(false);
  const [visitorSearch, setVisitorSearch] = useState("");
  const [visitorCourseFilter, setVisitorCourseFilter] = useState("all");
  const [isDeletingVisitor, setIsDeletingVisitor] = useState<string | null>(null);

  // Fetch visitors from backend and Firestore cloud database
  const fetchVisitors = async () => {
    setIsLoadingVisitors(true);
    try {
      // 1. Fetch from Firestore
      const firestoreVisitorsPromise = loadStudentVisitorsFromFirestore().catch(() => []);
      
      // 2. Fetch from backend server API
      const serverVisitorsPromise = fetch("/api/visitors")
        .then(async (res) => {
          if (!res.ok) return [];
          const data = await res.json();
          return data && Array.isArray(data.visitors) ? data.visitors : [];
        })
        .catch(() => []);

      const [firestoreVisitors, serverVisitors] = await Promise.all([
        firestoreVisitorsPromise,
        serverVisitorsPromise
      ]);

      // Combine and deduplicate by email or id
      const visitorMap = new Map<string, StudentVisitor>();

      // Load server visitors first
      serverVisitors.forEach((v: StudentVisitor) => {
        const key = v.email ? v.email.toLowerCase().trim() : (v.id || v.name.toLowerCase().trim());
        visitorMap.set(key, v);
      });

      // Overlay with firestore visitors (or add new)
      firestoreVisitors.forEach((v: StudentVisitor) => {
        const key = v.email ? v.email.toLowerCase().trim() : (v.id || v.name.toLowerCase().trim());
        const existing = visitorMap.get(key);
        if (!existing) {
          visitorMap.set(key, v);
        } else {
          // Merge with highest visit count and latest timestamp
          visitorMap.set(key, {
            ...existing,
            ...v,
            visitCount: Math.max(existing.visitCount || 1, v.visitCount || 1),
            lastActiveTimestamp: Math.max(existing.lastActiveTimestamp || 0, v.lastActiveTimestamp || 0),
            lastActive: (v.lastActiveTimestamp || 0) >= (existing.lastActiveTimestamp || 0) ? v.lastActive : existing.lastActive
          });
        }
      });

      const mergedList = Array.from(visitorMap.values()).sort((a, b) => {
        return (b.lastActiveTimestamp || 0) - (a.lastActiveTimestamp || 0);
      });

      setVisitorsList(mergedList);
    } catch (err) {
      console.warn("Failed fetching visitors:", err);
    } finally {
      setIsLoadingVisitors(false);
    }
  };

  // Auto-fetch visitors when admin tab is opened or active
  React.useEffect(() => {
    if (activeAdminTab === "visitors" || isAdmin) {
      fetchVisitors();
    }
  }, [activeAdminTab, isAdmin]);

  // Derived visitor statistics
  const totalVisitorsCount = visitorsList.length;

  const totalSessionsCount = React.useMemo(() => {
    return visitorsList.reduce((acc, v) => acc + (v.visitCount || 1), 0);
  }, [visitorsList]);

  const verifiedEmailCount = React.useMemo(() => {
    return visitorsList.filter(v => v.email && v.email.includes("@")).length;
  }, [visitorsList]);

  const activeTodayCount = React.useMemo(() => {
    const todayStr = new Date().toLocaleDateString();
    return visitorsList.filter(v => {
      if (!v.lastActive) return false;
      return v.lastActive.includes(todayStr) || (v.lastActiveTimestamp && Date.now() - v.lastActiveTimestamp < 86400000);
    }).length;
  }, [visitorsList]);

  // Filtered visitors
  const filteredVisitors = React.useMemo(() => {
    return visitorsList.filter(v => {
      if (visitorCourseFilter !== "all" && v.courseId !== visitorCourseFilter) {
        return false;
      }
      if (visitorSearch.trim()) {
        const q = visitorSearch.toLowerCase();
        const matchName = (v.name || "").toLowerCase().includes(q);
        const matchEmail = (v.email || "").toLowerCase().includes(q);
        const matchCourse = (v.courseName || "").toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchCourse) {
          return false;
        }
      }
      return true;
    });
  }, [visitorsList, visitorCourseFilter, visitorSearch]);

  // Delete individual visitor record
  const handleDeleteVisitor = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name || "this student"}" from the visitors directory?`)) return;
    setIsDeletingVisitor(id);
    try {
      // 1. Delete from Firestore
      deleteStudentVisitorFromFirestore(id).catch(e => console.warn(e));

      // 2. Delete from server
      const res = await fetch(`/api/visitors/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data && Array.isArray(data.visitors)) {
        setVisitorsList(data.visitors);
      } else {
        setVisitorsList(prev => prev.filter(v => v.id !== id));
      }
    } catch (err) {
      console.warn("Failed deleting visitor:", err);
      setVisitorsList(prev => prev.filter(v => v.id !== id));
    } finally {
      setIsDeletingVisitor(null);
    }
  };

  // Clear all visitor logs
  const handleClearAllVisitors = async () => {
    if (!window.confirm("Are you sure you want to permanently clear all student visitor logs? This action cannot be reversed.")) return;
    try {
      await fetch("/api/visitors", { method: "DELETE" });
      setVisitorsList([]);
    } catch (err) {
      console.warn("Failed clearing visitors:", err);
    }
  };

  // Export Visitors to CSV Spreadsheet
  const handleExportVisitorsCSV = () => {
    if (visitorsList.length === 0) {
      alert("No visitor records to export.");
      return;
    }
    const headers = ["ID", "Student Name", "Email Address", "Enrolled Degree Program", "First Joined Timestamp", "Last Active Timestamp", "Total Sessions Count"];
    const rows = visitorsList.map(v => [
      `"${v.id}"`,
      `"${(v.name || "").replace(/"/g, '""')}"`,
      `"${(v.email || "").replace(/"/g, '""')}"`,
      `"${(v.courseName || v.courseId || "BCA").replace(/"/g, '""')}"`,
      `"${(v.firstVisit || "").replace(/"/g, '""')}"`,
      `"${(v.lastActive || "").replace(/"/g, '""')}"`,
      v.visitCount || 1
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `readrabbit_student_visitors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Visitors to JSON
  const handleExportVisitorsJSON = () => {
    if (visitorsList.length === 0) {
      alert("No visitor records to export.");
      return;
    }
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(visitorsList, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `readrabbit_student_visitors_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Failed to export JSON: " + e);
    }
  };

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#231a0a] font-sans">
      {/* Login Screen if not Admin */}
      {!isAdmin ? (
        <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-[#dac1c1]/40 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-[#40010d]/5 text-[#40010d] rounded-2xl flex items-center justify-center">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#40010d]">Administrator Portal</h2>
              <p className="text-xs text-[#544243] mt-1">Supabase Auth Protected • Authorized Admin Access Only</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#544243] flex items-center gap-1.5">
                <Mail size={14} className="text-[#95491a]" /> ADMIN EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="thecodeorbitoffi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:ring-1 focus:ring-[#fd9b65] rounded-xl px-4 py-3 text-sm focus:outline-none font-bold text-[#40010d]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#544243] flex items-center gap-1.5">
                <Lock size={14} className="text-[#95491a]" /> ACCESS PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:ring-1 focus:ring-[#fd9b65] rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none font-bold text-[#40010d]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#95491a] hover:text-[#7a2c35] p-1 transition-colors cursor-pointer"
                  title={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={handleResetPasswordEmail}
                  className="text-[11px] font-bold text-[#95491a] hover:text-[#40010d] hover:underline cursor-pointer transition-colors"
                >
                  Forgot Password? Send Recovery Email
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-xs font-semibold text-[#95491a] bg-[#fff2e1] border border-[#dac1c1]/50 p-3 rounded-xl flex items-center gap-1.5">
                <Info size={14} className="shrink-0 text-[#95491a]" /> {loginError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[#544243] font-bold text-xs rounded-xl cursor-pointer text-center transition-all flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              <button
                type="submit"
                disabled={isAuthLoading}
                className="flex-[2] bg-[#40010d] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#7a2c35] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAuthLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Log In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Administrator Dashboard if logged in */
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-[#ba1a1a] rounded-2xl flex items-center justify-center shadow-inner">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#40010d]">Burrow Administrator</h2>
                <p className="text-xs text-[#6b8a80] font-bold flex items-center gap-1">
                  <CheckCircle size={12} /> Active session • Curriculum Master Mode
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#f8e6cb]/40 text-[#95491a] rounded-xl font-bold text-xs hover:bg-[#f8e6cb] cursor-pointer"
                >
                  Return to Syllabus
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut size={14} /> Exit Admin Portal
              </button>
            </div>
          </header>

          {/* Admin Dashboard Sub-navigation Tabs */}
          <div className="flex border-b border-[#dac1c1]/30 gap-2 overflow-x-auto whitespace-nowrap pb-1">
            {[
              { id: "curriculum", label: "Curriculum Editor", icon: BookOpen },
              { id: "uploads", label: "Uploaded Files Directory", icon: FolderPlus },
              { id: "visitors", label: "Visitors & Students Directory", icon: Users, badge: totalVisitorsCount },
              { id: "sync", label: "Cross-Device Sync & Backup", icon: RefreshCw },
              { id: "semesters", label: "Manage Semesters", icon: Layers },
              { id: "notifications", label: "Dispatch Board", icon: Bell },
              { id: "feedback", label: "Student Feedback", icon: MessageSquareHeart, badge: unreadFeedbackCount },
              { id: "security", label: "Credentials Settings", icon: Settings },
            ].map((tab) => {
              const isActive = activeAdminTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`py-3 px-5 font-bold text-xs transition-all border-b-2 cursor-pointer flex items-center gap-2 relative ${
                    isActive
                      ? "border-[#40010d] text-[#40010d]"
                      : "border-transparent text-[#544243] hover:text-[#231a0a]"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-[#95491a]" : "text-[#877272]"} />
                  <span>{tab.label}</span>
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-extrabold shadow-2xs animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* CURRICULUM EDITOR VIEW */}
          {activeAdminTab === "curriculum" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Selector & Subject List */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs space-y-5">
                  <h3 className="font-sans text-sm font-bold text-[#40010d] uppercase tracking-wider flex items-center gap-2">
                    <Sliders size={16} className="text-[#95491a]" /> Focus Selector
                  </h3>

                  {/* Course Select */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#877272]">TARGET DEGREE PROGRAM</label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        setEditingSubject(null);
                        setIsAddingSubject(false);
                      }}
                      className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl p-3 text-xs focus:outline-none font-bold"
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Select (Fully Dynamic mapped to activeCourse semesters) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#877272]">SEMESTER</label>
                    {activeCourse && activeCourse.semesters.length === 0 ? (
                      <p className="text-xs text-[#877272] italic">No semesters configured. Add semesters first!</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {activeCourse?.semesters.map(sem => (
                          <button
                            key={sem.id}
                            onClick={() => {
                              setSelectedSemesterId(sem.id);
                              setEditingSubject(null);
                              setIsAddingSubject(false);
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              selectedSemesterId === sem.id
                                ? "bg-[#fd9b65] border-[#fd9b65] text-[#341100]"
                                : "bg-[#fff8f3]/20 border-[#dac1c1] text-[#544243] hover:bg-[#f8e6cb]"
                            }`}
                          >
                            {sem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject List */}
                <div className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-sans text-sm font-bold text-[#40010d] uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={16} className="text-[#95491a]" /> Subjects list
                    </h3>
                    <button
                      onClick={startAddSubject}
                      className="p-1.5 bg-[#f8e6cb] hover:bg-[#fd9b65] text-[#95491a] rounded-lg transition-colors cursor-pointer"
                      title="Add New Subject"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {!activeSemester || activeSemester.subjects.length === 0 ? (
                      <p className="text-xs text-[#877272] italic p-4 text-center">No subjects in this semester yet.</p>
                    ) : (
                      activeSemester.subjects.map(subject => (
                        <div
                          key={subject.id}
                          onClick={() => startEditSubject(subject)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                            editingSubject?.id === subject.id
                              ? "border-[#fd9b65] bg-[#fff2e1]/30"
                              : "border-[#dac1c1]/30 hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <h4 className="font-bold text-xs text-[#40010d]">{subject.name}</h4>
                            <span className="text-[10px] bg-gray-100 text-[#544243] px-2 py-0.5 rounded-full font-bold mt-1 inline-block">
                              {subject.difficulty} {subject.isLab ? "• Lab" : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => startEditSubject(subject)}
                              className="p-1 text-[#95491a] hover:text-[#341100]"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteSubject(subject.id, subject.name)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Form Editor */}
              <div className="lg:col-span-8">
                {isAddingSubject || editingSubject ? (
                  <div className="space-y-6">
                    <form onSubmit={handleSaveSubject} className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs space-y-6">
                      <h3 className="font-sans text-sm font-bold text-[#40010d] uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FolderPlus size={18} className="text-[#95491a]" />
                          {editingSubject ? `Edit Subject: ${editingSubject.name}` : "Add New Subject"}
                        </span>
                        <span className="text-xs text-gray-400 font-normal">
                          Targeting: {activeCourse?.name} • Sem {selectedSemesterId}
                        </span>
                      </h3>

                      {/* Subject Metadata fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#544243]">SUBJECT TITLE</label>
                          <input
                            type="text"
                            required
                            value={subName}
                            onChange={(e) => setSubName(e.target.value)}
                            placeholder="e.g. Discrete Structure, OOPs using JAVA"
                            className="w-full bg-[#fff8f3]/40 border border-[#dac1c1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#fd9b65]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#544243]">DIFFICULTY RATING</label>
                          <select
                            value={subDiff}
                            onChange={(e) => setSubDiff(e.target.value as any)}
                            className="w-full bg-[#fff8f3]/40 border border-[#dac1c1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#fd9b65]"
                          >
                            <option value="Core">Core</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#544243]">LUCIDE ICON IDENTIFIER</label>
                          <select
                            value={subIcon}
                            onChange={(e) => setSubIcon(e.target.value)}
                            className="w-full bg-[#fff8f3]/40 border border-[#dac1c1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#fd9b65]"
                          >
                            <option value="BookOpen">BookOpen (General)</option>
                            <option value="Binary">Binary (Math/Logic)</option>
                            <option value="Cpu">Cpu (Hardware)</option>
                            <option value="Terminal">Terminal (Coding)</option>
                            <option value="Database">Database (SQL)</option>
                            <option value="Network">Network (Topology)</option>
                            <option value="BrainCircuit">BrainCircuit (AI/ML)</option>
                            <option value="Sliders">Sliders (Engineering)</option>
                            <option value="Eye">Eye (Vision)</option>
                            <option value="TrendingUp">TrendingUp (Algorithms)</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-3 pt-6">
                          <input
                            type="checkbox"
                            id="subIsLab"
                            checked={subIsLab}
                            onChange={(e) => setSubIsLab(e.target.checked)}
                            className="w-4 h-4 text-[#fd9b65] focus:ring-[#fd9b65] border-[#dac1c1] rounded"
                          />
                          <label htmlFor="subIsLab" className="text-xs font-bold text-[#544243] cursor-pointer">
                            This is a Laboratory Course (Lab)
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#544243]">SUBJECT SYNOPSIS / DESCRIPTION</label>
                        <textarea
                          required
                          value={subDesc}
                          onChange={(e) => setSubDesc(e.target.value)}
                          placeholder="Provide a high-level summary of what the student will learn..."
                          rows={2}
                          className="w-full bg-[#fff8f3]/40 border border-[#dac1c1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#fd9b65]"
                        />
                      </div>

                      {/* DYNAMIC SYLLABUS UNITS SECTION */}
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-[#40010d] tracking-wider uppercase">
                            Syllabus Units / Modules ({formUnits.length} total)
                          </h4>
                          <button
                            type="button"
                            onClick={handleAddUnitField}
                            className="px-3 py-1.5 bg-[#f8e6cb]/50 hover:bg-[#f8e6cb] text-[#95491a] text-[10px] font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus size={12} /> Add Dynamic Unit
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {formUnits.map((unit, index) => (
                            <div key={unit.id} className="bg-[#fff8f3]/40 p-4 rounded-2xl border border-[#dac1c1]/20 space-y-3 relative">
                              
                              {/* Remove Unit Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveUnitField(index)}
                                className="absolute top-4 right-4 p-1 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                                title="Delete Unit"
                              >
                                <Trash2 size={14} />
                              </button>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold text-[#95491a]">
                                  UNIT {unit.number} DETAILS
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-4 space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400">UNIT TITLE</label>
                                  <input
                                    type="text"
                                    required
                                    value={unit.name}
                                    onChange={(e) => {
                                      const updated = [...formUnits];
                                      updated[index].name = e.target.value;
                                      setFormUnits(updated);
                                    }}
                                    placeholder="e.g. Unit 1: Algebra"
                                    className="w-full bg-white border border-[#dac1c1] rounded-xl p-2.5 text-xs focus:outline-none"
                                  />
                                </div>
                                <div className="md:col-span-8 space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400">DESCRIPTION & BOUNDS</label>
                                  <input
                                    type="text"
                                    required
                                    value={unit.description}
                                    onChange={(e) => {
                                      const updated = [...formUnits];
                                      updated[index].description = e.target.value;
                                      setFormUnits(updated);
                                    }}
                                    placeholder="Topics covered, formulas, etc."
                                    className="w-full bg-white border border-[#dac1c1] rounded-xl p-2.5 text-xs focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* UNIT FILE PDF UPLOAD FORM (INSIDE UNITS) */}
                              <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => setExpandedUnitFileId(expandedUnitFileId === unit.id ? null : unit.id)}
                                  className="text-[10px] text-[#95491a] hover:underline font-bold flex items-center gap-1.5"
                                >
                                  <FileText size={12} />
                                  {expandedUnitFileId === unit.id ? "Hide Unit PDFs & Attachments" : "Manage PDFs & Study Files inside this Unit"}
                                  <span className="bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded text-[9px]">
                                    {(unit.materials || []).length} files
                                  </span>
                                </button>

                                {expandedUnitFileId === unit.id && (
                                  <div className="mt-3 bg-white p-4 rounded-xl border border-gray-100 space-y-4">
                                    <span className="text-[10px] font-extrabold text-[#40010d] uppercase block">
                                      📄 Upload PDF directly inside Unit {unit.number}
                                    </span>

                                    {/* Drag and Drop Zone or manual entry */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* Left side: Form fields */}
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                          <input
                                            type="text"
                                            placeholder="Document Name (e.g. Unit 1 Revision Notes.pdf)"
                                            value={newUnitPdfName}
                                            onChange={(e) => setNewUnitPdfName(e.target.value)}
                                            className="sm:col-span-2 bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                                          />
                                          <input
                                            type="text"
                                            placeholder="File Size (e.g. 1.2 MB)"
                                            value={newUnitPdfSize}
                                            onChange={(e) => setNewUnitPdfSize(e.target.value)}
                                            className="bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                                          />
                                        </div>

                                        <input
                                          type="text"
                                          placeholder="Brief synopsis or reference notes details..."
                                          value={newUnitPdfDetails}
                                          onChange={(e) => setNewUnitPdfDetails(e.target.value)}
                                          className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                                        />

                                        <button
                                          type="button"
                                          onClick={() => handleUploadPdfToUnit(unit.id)}
                                          className="w-full px-4 py-2 bg-[#95491a] hover:bg-[#753101] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                        >
                                          Attach Written Notes / Form Input
                                        </button>
                                      </div>

                                      {/* Right side: Real Drag and Drop Uploader */}
                                      <div
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                          setPortalIsDragging(true);
                                        }}
                                        onDragLeave={() => setPortalIsDragging(false)}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          setPortalIsDragging(false);
                                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            handleProcessPortalFile(e.dataTransfer.files[0], unit.id);
                                          }
                                        }}
                                        className={`border border-dashed rounded-xl p-4 text-center flex flex-col justify-center items-center cursor-pointer transition-all ${
                                          portalIsDragging 
                                            ? "border-[#95491a] bg-[#fff8f3]" 
                                            : "border-gray-200 hover:border-[#fd9b65] bg-slate-50/50"
                                        }`}
                                      >
                                        <input
                                          type="file"
                                          id={`portal-unit-file-input-${unit.id}`}
                                          accept="application/pdf,.pdf,image/*,.doc,.docx,.txt,.ppt,.pptx,.code,.js,.py,.zip"
                                          className="hidden"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              handleProcessPortalFile(e.target.files[0], unit.id);
                                            }
                                            e.target.value = "";
                                          }}
                                        />
                                        <label htmlFor={`portal-unit-file-input-${unit.id}`} className="cursor-pointer space-y-1 block">
                                          <Upload size={20} className="text-[#95491a] mx-auto mb-1" />
                                          <p className="text-[10px] font-bold text-[#40010d]">
                                            Drag & Drop any real study file here
                                          </p>
                                          <p className="text-[9px] text-gray-400">
                                            or <span className="text-[#95491a] underline font-bold">click to browse</span>
                                          </p>
                                        </label>
                                      </div>
                                    </div>

                                    {/* Current Unit PDFs list */}
                                    <div className="space-y-1.5 pt-2 border-t border-dashed border-gray-100">
                                      <span className="text-[9px] font-bold text-gray-400 block uppercase">
                                        Active files inside Unit {unit.number}:
                                      </span>
                                      {(!unit.materials || unit.materials.length === 0) ? (
                                        <p className="text-[10px] text-gray-400 italic">No study documents attached to this unit yet.</p>
                                      ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {unit.materials.map(m => (
                                            <div key={m.id} className="p-2 bg-slate-50 rounded-lg border border-gray-100 flex justify-between items-center">
                                              <div className="space-y-0.5 text-left">
                                                <h5 className="font-bold text-[11px] text-[#40010d] line-clamp-1">{m.name}</h5>
                                                <span className="text-[9px] text-gray-400">{m.size} • PDF</span>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => handleDeletePdfFromUnit(unit.id, m.id)}
                                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete PDF"
                                              >
                                                <Trash2 size={11} />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSubject(null);
                            setIsAddingSubject(false);
                          }}
                          className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-2.5 px-6 bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-xl text-xs font-bold"
                        >
                          Save Subject Data
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white border border-[#dac1c1]/20 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-[#fff2e1] text-[#95491a] rounded-full flex items-center justify-center">
                      <Sliders size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#40010d]">Curriculum Editor Workspace</h4>
                      <p className="text-xs text-[#544243] mt-1 max-w-sm mx-auto leading-relaxed">
                        Select any existing subject from the left panel to edit its details, manage syllabus units dynamically, and upload PDF notes directly inside specific units. Or, click the <strong className="text-[#95491a]">+</strong> button to design a brand new subject.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* UPLOADED FILES DIRECTORY (ADMIN EXCLUSIVE) */}
          {activeAdminTab === "uploads" && (
            <div className="max-w-6xl mx-auto space-y-6 font-sans">
              {/* Header Banner */}
              <div className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-[#95491a] rounded-2xl flex items-center justify-center shrink-0">
                      <FolderPlus size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-extrabold text-[#40010d]">Admin Central Uploads Directory</h3>
                        <span className="px-2.5 py-0.5 bg-[#40010d] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Admin Only
                        </span>
                      </div>
                      <p className="text-xs text-[#544243] mt-1 leading-relaxed">
                        A centralized directory listing all study material PDFs, notes, question papers, and files uploaded across all courses, subjects, and units.
                      </p>
                    </div>
                  </div>

                  {/* Mode switch */}
                  <div className="flex items-center bg-[#fff8f3] p-1.5 rounded-2xl border border-[#dac1c1]/40 shrink-0">
                    <button
                      onClick={() => setUploadDirectoryViewMode("curriculum")}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                        uploadDirectoryViewMode === "curriculum"
                          ? "bg-[#40010d] text-white shadow-xs"
                          : "text-[#544243] hover:text-[#40010d]"
                      }`}
                    >
                      <BookOpen size={13} /> Curriculum Files ({filteredUploadedMaterials.length})
                    </button>
                    <button
                      onClick={() => setUploadDirectoryViewMode("server")}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                        uploadDirectoryViewMode === "server"
                          ? "bg-[#40010d] text-white shadow-xs"
                          : "text-[#544243] hover:text-[#40010d]"
                      }`}
                    >
                      <HardDrive size={13} /> Server Disk Storage ({serverFiles.length})
                    </button>
                  </div>
                </div>

                {/* KPI Stats summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-[#dac1c1]/20">
                  <div className="bg-[#fff8f3] p-3.5 rounded-2xl border border-[#dac1c1]/30">
                    <div className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Total Attachments</div>
                    <div className="text-xl font-black text-[#40010d] mt-0.5">{allUploadedMaterials.length} files</div>
                  </div>
                  <div className="bg-[#fff8f3] p-3.5 rounded-2xl border border-[#dac1c1]/30">
                    <div className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">PDF Documents</div>
                    <div className="text-xl font-black font-sans text-red-800 mt-0.5">
                      {allUploadedMaterials.filter((m) => m.material.type === "pdf" || m.material.name.toLowerCase().endsWith(".pdf")).length} PDFs
                    </div>
                  </div>
                  <div className="bg-[#fff8f3] p-3.5 rounded-2xl border border-[#dac1c1]/30">
                    <div className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Active Subjects</div>
                    <div className="text-xl font-black text-[#95491a] mt-0.5">
                      {new Set(allUploadedMaterials.map((m) => m.subjectId)).size} subjects
                    </div>
                  </div>
                  <div className="bg-[#fff8f3] p-3.5 rounded-2xl border border-[#dac1c1]/30">
                    <div className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Server Disk Files</div>
                    <div className="text-xl font-black text-amber-900 mt-0.5">
                      {isLoadingServerFiles ? "Loading..." : `${serverFiles.length} files`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-3xl border border-[#dac1c1]/20 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search box */}
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#877272]" />
                  <input
                    type="text"
                    value={uploadSearch}
                    onChange={(e) => setUploadSearch(e.target.value)}
                    placeholder="Search file name, subject, or unit..."
                    className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl pl-10 pr-8 py-2.5 text-xs focus:outline-none font-bold"
                  />
                  {uploadSearch && (
                    <button
                      onClick={() => setUploadSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#877272] hover:text-[#40010d]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter selects */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Filter size={14} className="text-[#95491a]" />
                    <span className="text-[11px] font-bold text-[#877272] uppercase">Filters:</span>
                  </div>

                  <select
                    value={uploadCourseFilter}
                    onChange={(e) => setUploadCourseFilter(e.target.value)}
                    className="bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl px-3 py-2 text-xs font-bold text-[#40010d]"
                  >
                    <option value="all">All Degree Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={uploadTypeFilter}
                    onChange={(e) => setUploadTypeFilter(e.target.value)}
                    className="bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl px-3 py-2 text-xs font-bold text-[#40010d]"
                  >
                    <option value="all">All File Types</option>
                    <option value="pdf">PDF Documents</option>
                    <option value="ppt">PowerPoint (PPT)</option>
                    <option value="image">Images</option>
                    <option value="doc">Word / Documents</option>
                    <option value="code">Source Code / Lab Programs</option>
                  </select>
                </div>
              </div>

              {/* CURRICULUM STUDY FILES VIEW */}
              {uploadDirectoryViewMode === "curriculum" && (
                <div className="bg-white rounded-3xl border border-[#dac1c1]/20 shadow-xs overflow-hidden">
                  {filteredUploadedMaterials.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <div className="w-12 h-12 bg-amber-50 text-[#95491a] rounded-full flex items-center justify-center mx-auto">
                        <FileText size={24} />
                      </div>
                      <h4 className="font-bold text-[#40010d]">No uploaded files found</h4>
                      <p className="text-xs text-[#544243] max-w-md mx-auto">
                        {uploadSearch || uploadTypeFilter !== "all" || uploadCourseFilter !== "all"
                          ? "No uploads match your search filter criteria. Try clearing search keywords or filters."
                          : "No study files have been uploaded to the curriculum yet. You can attach PDFs and notes in the Curriculum Editor tab!"}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#dac1c1]/20">
                      <div className="bg-[#fff8f3] px-6 py-3 grid grid-cols-12 text-[11px] font-extrabold text-[#877272] uppercase tracking-wider">
                        <div className="col-span-5 md:col-span-4">File Name & Type</div>
                        <div className="col-span-4 md:col-span-4 hidden sm:block">Curriculum Context</div>
                        <div className="col-span-2 hidden md:block">Added Date & Size</div>
                        <div className="col-span-7 sm:col-span-3 md:col-span-2 text-right">Admin Actions</div>
                      </div>

                      {filteredUploadedMaterials.map((item, idx) => {
                        const mat = item.material;
                        const isPdf = mat.type === "pdf" || mat.name.toLowerCase().endsWith(".pdf");
                        return (
                          <div key={mat.id || idx} className="p-4 px-6 grid grid-cols-12 items-center hover:bg-[#fff8f3]/40 transition-colors gap-2">
                            {/* File Name & Icon */}
                            <div className="col-span-12 sm:col-span-5 md:col-span-4 flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs ${
                                isPdf ? "bg-red-50 text-red-700" : mat.type === "ppt" ? "bg-orange-50 text-orange-700" : "bg-amber-50 text-[#95491a]"
                              }`}>
                                <FileText size={18} />
                              </div>
                              <div className="min-w-0 pr-2">
                                <h5 className="font-bold text-xs text-[#40010d] truncate" title={mat.name}>
                                  {mat.name}
                                </h5>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                    isPdf ? "bg-red-100 text-red-800" : "bg-amber-100 text-[#95491a]"
                                  }`}>
                                    {mat.type || (isPdf ? "PDF" : "FILE")}
                                  </span>
                                  <span className="text-[11px] text-[#877272] sm:hidden">{mat.size || "1 MB"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Curriculum Context */}
                            <div className="col-span-12 sm:col-span-4 md:col-span-4 hidden sm:block">
                              <div className="text-xs font-bold text-[#40010d] truncate">
                                {item.subjectName}
                              </div>
                              <div className="text-[11px] text-[#877272] truncate">
                                {item.courseName} • {item.semesterName} {item.unitTitle ? `• ${item.unitTitle}` : "• Subject Attachment"}
                              </div>
                            </div>

                            {/* Added Date & Size */}
                            <div className="col-span-2 hidden md:block">
                              <div className="text-xs font-bold text-[#40010d]">{mat.size || "1.2 MB"}</div>
                              <div className="text-[11px] text-[#877272]">{mat.addedTime || "Recent"}</div>
                            </div>

                            {/* Admin Actions */}
                            <div className="col-span-12 sm:col-span-3 md:col-span-2 flex items-center justify-end gap-1.5 mt-2 sm:mt-0">
                              {mat.details && (
                                <a
                                  href={mat.details}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-amber-50 text-[#95491a] hover:bg-[#95491a] hover:text-white rounded-xl transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
                                  title="View / Open File"
                                >
                                  <Eye size={14} />
                                </a>
                              )}
                              {mat.details && (
                                <a
                                  href={mat.details}
                                  download={mat.name}
                                  className="p-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-800 hover:text-white rounded-xl transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
                                  title="Download File"
                                >
                                  <Download size={14} />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteMaterialFromAdmin(mat.id, item.subjectId, item.unitId, mat.cloudPath)}
                                className="p-2 bg-red-50 text-red-700 hover:bg-red-700 hover:text-white rounded-xl transition-all font-bold text-xs cursor-pointer"
                                title="Delete Upload"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SERVER DISK STORAGE VIEW */}
              {uploadDirectoryViewMode === "server" && (
                <div className="bg-white rounded-3xl border border-[#dac1c1]/20 shadow-xs overflow-hidden">
                  <div className="p-4 bg-[#fff8f3] border-b border-[#dac1c1]/20 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#40010d] uppercase tracking-wider">Disk Storage Folder (`data/uploads`)</h4>
                      <p className="text-[11px] text-[#544243]">Raw uploaded files permanently retained on the server disk filesystem.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsLoadingServerFiles(true);
                        fetch("/api/uploads")
                          .then((r) => r.json())
                          .then((d) => Array.isArray(d) && setServerFiles(d))
                          .finally(() => setIsLoadingServerFiles(false));
                      }}
                      className="px-3 py-1.5 bg-[#40010d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#7a2c35] transition-colors cursor-pointer"
                    >
                      <RefreshCw size={12} className={isLoadingServerFiles ? "animate-spin" : ""} /> Refresh Server Files
                    </button>
                  </div>

                  {serverFiles.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <HardDrive size={32} className="text-[#877272] mx-auto" />
                      <h4 className="font-bold text-[#40010d]">No server disk files found</h4>
                      <p className="text-xs text-[#544243]">Uploads made via drag-and-drop file upload will show up directly here on disk!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#dac1c1]/20">
                      {serverFiles.map((file) => (
                        <div key={file.filename} className="p-4 px-6 flex items-center justify-between hover:bg-[#fff8f3]/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 text-[#95491a] rounded-2xl flex items-center justify-center font-bold">
                              <FileText size={18} />
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-[#40010d]">{file.filename}</h5>
                              <p className="text-[11px] text-[#877272]">
                                {(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB • Uploaded {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-amber-50 text-[#95491a] rounded-xl font-bold text-xs hover:bg-[#95491a] hover:text-white transition-all flex items-center gap-1"
                            >
                              <Eye size={13} /> View
                            </a>
                            <a
                              href={file.url}
                              download={file.filename}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl font-bold text-xs hover:bg-emerald-800 hover:text-white transition-all flex items-center gap-1"
                            >
                              <Download size={13} /> Download
                            </a>
                            <button
                              onClick={() => handleDeleteServerFile(file.filename)}
                              className="p-2 bg-red-50 text-red-700 rounded-xl font-bold text-xs hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CROSS-DEVICE SYNC & BACKUP TAB VIEW */}
          {activeAdminTab === "sync" && (
            <div className="max-w-4xl mx-auto space-y-6 font-sans">
              <div className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-[#95491a] rounded-2xl flex items-center justify-center shrink-0">
                    <RefreshCw size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#40010d]">Cross-Device Data Sync & Backup</h3>
                    <p className="text-xs text-[#544243] mt-1 leading-relaxed">
                      If your app is hosted on static web platforms (like Netlify), uploaded files and edited subjects save inside your browser's local cache. To view uploads on your phone or sync data across devices, export your curriculum backup JSON file below and import it on your phone!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                      <Download size={20} />
                    </div>
                    <h4 className="font-extrabold text-[#40010d] text-base">Export Curriculum JSON</h4>
                    <p className="text-xs text-[#544243] leading-relaxed">
                      Download a single, complete backup file containing all subjects, units, notes, and attached PDF documents from this browser.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCurriculumJSON}
                    className="w-full py-3.5 bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <Download size={16} /> Export Backup File (.json)
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-orange-50 text-[#95491a] rounded-xl flex items-center justify-center font-bold">
                      <Upload size={20} />
                    </div>
                    <h4 className="font-extrabold text-[#40010d] text-base">Import Curriculum JSON</h4>
                    <p className="text-xs text-[#544243] leading-relaxed">
                      Select an exported curriculum JSON file on your phone or second computer to instantly sync all notes and PDF files to this device.
                    </p>
                  </div>
                  <label className="w-full py-3.5 bg-[#f8e6cb] hover:bg-[#fd9b65] text-[#40010d] hover:text-[#341100] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 text-center">
                    <Upload size={16} /> Select & Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportCurriculumJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Server Auto-Sync Status Card */}
              <div className="bg-[#fff8f3] p-6 rounded-3xl border border-[#dac1c1]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CloudUpload size={18} className="text-[#95491a]" />
                    <h4 className="font-extrabold text-xs text-[#40010d] uppercase tracking-wider">Live Cloud Server Sync</h4>
                  </div>
                  <button
                    onClick={() => handleSaveCurriculumToCloud()}
                    disabled={isAdminSavingWeb}
                    className="px-3 py-1.5 bg-[#40010d] text-white rounded-xl text-[11px] font-bold hover:bg-[#7a2c35] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} className={isAdminSavingWeb ? "animate-spin" : ""} />
                    {isAdminSavingWeb ? "Saving..." : "Force Save to Cloud"}
                  </button>
                </div>
                <p className="text-xs text-[#544243] leading-relaxed">
                  When deployed on a full-stack container server (such as Cloud Run or Docker with Node Express), all uploads auto-sync live in real-time across every phone and PC connected to the URL!
                </p>
                {adminWebSaveSuccess && (
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    ✓ Curriculum successfully synchronized to cloud server!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* MANAGE SEMESTERS TAB VIEW */}
          {activeAdminTab === "semesters" && (
            <div className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs max-w-2xl mx-auto space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-[#40010d] flex items-center gap-2">
                  <Layers size={20} className="text-[#95491a]" /> Manage Specialization Semesters
                </h3>
                <p className="text-xs text-[#544243]">
                  Select a specialization degree and append a dynamic new semester roadmap.
                </p>
              </div>

              <form onSubmit={handleAddSemester} className="bg-[#fff8f3]/40 p-5 rounded-2xl border border-[#dac1c1]/25 space-y-4">
                <span className="text-[10px] font-extrabold text-[#95491a] uppercase tracking-wider block">Add New Semester Roadmap</span>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#544243]">TARGET DEGREE PROGRAM</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-white border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl p-3 text-xs focus:outline-none font-bold"
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#544243]">SEMESTER TITLE / NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Semester 7"
                      value={newSemName}
                      onChange={(e) => setNewSemName(e.target.value)}
                      className="w-full bg-white border border-[#dac1c1] rounded-xl p-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#544243]">SEMESTER SYNOPSIS</label>
                    <input
                      type="text"
                      placeholder="e.g. Advanced AI research and practicals"
                      value={newSemDesc}
                      onChange={(e) => setNewSemDesc(e.target.value)}
                      className="w-full bg-white border border-[#dac1c1] rounded-xl p-3 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 bg-[#40010d] hover:bg-[#7a2c35] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Append Semester Roadmap
                </button>
              </form>

              {/* Current semesters list */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-extrabold text-[#544243] uppercase block">
                  Configured Semesters for {activeCourse?.name}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCourse?.semesters.map(sem => (
                    <div key={sem.id} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex justify-between items-center group">
                      <div>
                        <h4 className="font-bold text-sm text-[#40010d]">{sem.name}</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">{sem.subjects.length} subjects • {sem.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteSemester(sem.id, sem.name)}
                          className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                          title={`Delete ${sem.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                          Configured
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DISPATCH NOTIFICATIONS TAB VIEW */}
          {activeAdminTab === "notifications" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* DISPATCH FORM & PRESETS */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#40010d] flex items-center gap-2">
                    <Bell size={20} className="text-[#95491a]" /> Broadcast Notification Dispatcher
                  </h3>
                  <p className="text-xs text-[#544243]">
                    Publish instant notifications to all active student devices and save them permanently to cloud storage.
                  </p>
                </div>

                {/* Quick Announcement Presets */}
                <div className="space-y-2 bg-[#fff8f3] p-4 rounded-2xl border border-[#dac1c1]/40">
                  <span className="text-[10px] font-extrabold text-[#95491a] uppercase tracking-wider flex items-center gap-1">
                    <Zap size={12} /> Quick Fill Announcement Presets
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNotifTag("Exam Alert");
                        setNotifTitle("Midterm Practical & Theory Exam Dates Certified");
                        setNotifMessage("The official examination schedule and hall tickets matrix have been released. Check your respective Subject Hubs for syllabus review.");
                      }}
                      className="text-[11px] font-bold bg-white text-[#40010d] border border-[#dac1c1] px-3 py-1.5 rounded-xl hover:bg-[#95491a] hover:text-white transition-all cursor-pointer shadow-2xs"
                    >
                      ⚠️ Exam Schedule
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifTag("Curriculum");
                        setNotifTitle("New Senior Study Notes & Question Banks Uploaded");
                        setNotifMessage("Peer-reviewed notes, lab manuals, and solved 5-year question papers are now live under Syllabus Units.");
                      }}
                      className="text-[11px] font-bold bg-white text-[#40010d] border border-[#dac1c1] px-3 py-1.5 rounded-xl hover:bg-[#95491a] hover:text-white transition-all cursor-pointer shadow-2xs"
                    >
                      🥕 Notes Uploaded
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifTag("Alumni Prep");
                        setNotifTitle("Alumni Guidance & Campus Placement Seminar");
                        setNotifMessage("Exclusive interaction session on Technical Coding & Data Structures roadmap scheduled for this Saturday.");
                      }}
                      className="text-[11px] font-bold bg-white text-[#40010d] border border-[#dac1c1] px-3 py-1.5 rounded-xl hover:bg-[#95491a] hover:text-white transition-all cursor-pointer shadow-2xs"
                    >
                      🎓 Alumni Seminar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifTag("General");
                        setNotifTitle("Urgent Practical Assignment Submission Extension");
                        setNotifMessage("The laboratory submission portal deadline has been extended to Friday 11:59 PM. Please verify your files.");
                      }}
                      className="text-[11px] font-bold bg-white text-[#40010d] border border-[#dac1c1] px-3 py-1.5 rounded-xl hover:bg-[#95491a] hover:text-white transition-all cursor-pointer shadow-2xs"
                    >
                      🚨 Deadline Extension
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSendNotificationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#544243] uppercase">Alert Level / Tag</label>
                      <select
                        value={notifTag}
                        onChange={(e) => setNotifTag(e.target.value)}
                        className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] rounded-xl p-3 text-xs focus:outline-none font-bold text-[#40010d]"
                      >
                        <option value="Exam Alert">⚠️ Exam Alert</option>
                        <option value="Curriculum">🥕 Curriculum Update</option>
                        <option value="Alumni Prep">🎓 Alumni Prep Notes</option>
                        <option value="General">📢 General Notice</option>
                        <option value="Urgent Alert">🚨 Urgent Alert</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#544243] uppercase">Target Audience</label>
                      <select
                        value={notifAudience}
                        onChange={(e) => setNotifAudience(e.target.value)}
                        className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] rounded-xl p-3 text-xs focus:outline-none font-bold text-[#40010d]"
                      >
                        <option value="All Enrolled Students & Faculty">👥 All Enrolled Students & Faculty</option>
                        <option value="BCA General Students">💻 BCA General</option>
                        <option value="BCA AI/ML Specialization">🤖 BCA AI/ML Specialization</option>
                        <option value="BCA Data Science Specialization">📊 BCA Data Science</option>
                        <option value="Semester 1 Students">🌱 Semester 1 Students</option>
                        <option value="Semester 2 Students">🌿 Semester 2 Students</option>
                        <option value="Semester 3 Students">🍂 Semester 3 Students</option>
                        <option value="Semester 4 Students">🌾 Semester 4 Students</option>
                        <option value="Semester 5 Students">🌲 Semester 5 Students</option>
                        <option value="Semester 6 Students">🌳 Semester 6 Students</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#544243] uppercase">Notification Headline Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Midterm Practical Exam Dates Certified"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl p-3 text-xs focus:outline-none font-bold text-[#40010d]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#544243] uppercase">Announcement Body Message</label>
                    <textarea
                      required
                      placeholder="Write detailed announcements for students here..."
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl p-3 text-xs focus:outline-none font-medium text-[#231a0a]"
                    />
                  </div>

                  {/* Live Student View Card Preview */}
                  {(notifTitle || notifMessage) && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-extrabold text-[#95491a] uppercase block">Live Student Device Preview:</span>
                      <div className="p-3.5 bg-[#fff8f3] border-l-4 border-[#95491a] rounded-r-2xl shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-extrabold bg-[#95491a] text-white px-2 py-0.5 rounded-full">
                            {notifTag}
                          </span>
                          <span className="text-[9px] font-extrabold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                            {notifAudience}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-[#40010d]">{notifTitle || "Notification Headline"}</h4>
                        <p className="text-[11px] text-[#544243] line-clamp-2">{notifMessage || "Announcement message content preview..."}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#40010d] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-[#7a2c35] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send size={15} /> Broadcast Notification to All Students
                  </button>
                </form>
              </div>

              {/* PUBLISHED NOTIFICATIONS HISTORY */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#40010d] flex items-center gap-1.5">
                      <Bell size={16} className="text-[#95491a]" /> Active Broadcast History
                    </h3>
                    <p className="text-[11px] text-[#544243]">
                      {notifications.length} notification{notifications.length === 1 ? "" : "s"} live on student feeds
                    </p>
                  </div>

                  {notifications.length > 0 && onClearAllNotifications && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear all published notifications?")) {
                          onClearAllNotifications();
                        }
                      }}
                      className="text-[10px] font-extrabold text-red-600 hover:text-red-800 hover:underline cursor-pointer transition-all"
                    >
                      Clear All Broadcasts
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                    <Bell size={28} className="mx-auto text-gray-300" />
                    <p className="text-xs font-bold text-gray-400">No active broadcast notifications published yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3.5 bg-[#fff8f3]/80 rounded-2xl border border-[#dac1c1]/40 space-y-1.5 relative group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-extrabold bg-[#95491a] text-white px-2 py-0.5 rounded-full">
                              {n.tag || "Notice"}
                            </span>
                            {n.targetAudience && (
                              <span className="text-[8px] font-bold text-gray-600 bg-white border border-gray-200 px-1.5 py-0.5 rounded-full">
                                {n.targetAudience}
                              </span>
                            )}
                          </div>
                          {onDeleteNotification && (
                            <button
                              type="button"
                              onClick={() => onDeleteNotification(n.id)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                              title="Delete notification"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        <h4 className="font-extrabold text-xs text-[#40010d] pr-6">{n.title}</h4>
                        <p className="text-[11px] text-[#544243] leading-relaxed whitespace-pre-wrap">{n.message}</p>

                        <div className="pt-1 text-[9px] font-bold text-gray-400 flex items-center justify-between">
                          <span>⏱️ {n.timestamp}</span>
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                            <CheckCircle size={10} /> Active Broadcast
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CREDENTIALS SETTINGS TAB VIEW */}
          {activeAdminTab === "security" && (
            <div className="bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs max-w-md mx-auto space-y-6">
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-extrabold text-[#40010d] flex items-center justify-center gap-2">
                  <Settings size={20} className="text-[#95491a]" /> Credentials & Owner Security
                </h3>
                <p className="text-xs text-[#544243]">
                  Verify your email constraints and update the administrator access passcode.
                </p>
              </div>

              {/* Locked email section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-1.5 text-center">
                <span className="text-[10px] font-extrabold text-[#95491a] block uppercase tracking-wider">Locked Administrator Email</span>
                <code className="text-sm font-extrabold text-[#40010d] bg-white border border-gray-200 px-3 py-1 rounded-lg inline-block shadow-xs">
                  admin@readrabbit.edu
                </code>
                <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto">
                  Owner constraint: Under user security directives, the admin login email is strictly locked to this address.
                </p>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#544243] uppercase">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={oldPasswordInput}
                      onChange={(e) => setOldPasswordInput(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#fd9b65] rounded-xl pl-3 pr-10 py-3 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#95491a] p-1 transition-colors cursor-pointer"
                      title={showOldPassword ? "Hide password" : "Show password"}
                    >
                      {showOldPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#544243] uppercase">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#fd9b65] rounded-xl pl-3 pr-10 py-3 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#95491a] p-1 transition-colors cursor-pointer"
                      title={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#544243] uppercase">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#fd9b65] rounded-xl pl-3 pr-10 py-3 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#95491a] p-1 transition-colors cursor-pointer"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {securityError && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-1.5">
                    <Info size={14} /> {securityError}
                  </p>
                )}

                {securitySuccess && (
                  <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-lg flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" /> {securitySuccess}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#40010d] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-[#7a2c35] active:scale-98 transition-all cursor-pointer shadow-xs"
                >
                  Change Admin Password
                </button>
              </form>
            </div>
          )}

          {/* STUDENT VISITORS & ACCESS DIRECTORY VIEW */}
          {activeAdminTab === "visitors" && (
            <div className="space-y-6">
              
              {/* Top Banner & Control Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs">
                <div>
                  <h3 className="text-lg font-extrabold text-[#40010d] flex items-center gap-2">
                    <Users size={22} className="text-[#95491a]" /> Visitors & Students Directory
                  </h3>
                  <p className="text-xs text-[#735E55] mt-1">
                    Real-time roster and activity log of all students accessing the Read Rabbit study portal.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={fetchVisitors}
                    disabled={isLoadingVisitors}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF3E0] hover:bg-[#e8dbce] text-[#40010d] text-xs font-bold rounded-xl border border-[#dac1c1]/40 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                    title="Refresh latest visitor records"
                  >
                    <RefreshCw size={13} className={isLoadingVisitors ? "animate-spin" : ""} />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportVisitorsCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200/60 transition-all cursor-pointer shadow-2xs"
                    title="Export visitor directory as CSV spreadsheet"
                  >
                    <FileSpreadsheet size={13} />
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportVisitorsJSON}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF3E0] hover:bg-[#e8dbce] text-[#40010d] text-xs font-bold rounded-xl border border-[#dac1c1]/40 transition-all cursor-pointer shadow-2xs"
                    title="Export raw JSON data"
                  >
                    <Download size={13} />
                    <span>Export JSON</span>
                  </button>

                  {visitorsList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllVisitors}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      title="Clear visitor logs"
                    >
                      <Trash2 size={13} />
                      <span className="hidden sm:inline">Clear All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Stat Overview Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-2xl border border-[#dac1c1]/20 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Total Registered Students</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#40010d]">{totalVisitorsCount}</span>
                    <span className="text-[11px] text-[#877272]">students</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-[#dac1c1]/20 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Total Study Sessions</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#95491a]">{totalSessionsCount}</span>
                    <span className="text-[11px] text-[#877272]">visits</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-[#dac1c1]/20 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Active Recently</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-700">{activeTodayCount}</span>
                    <span className="text-[11px] text-emerald-600 font-bold">online / today</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-[#dac1c1]/20 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Verified Email Addresses</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-blue-700">{verifiedEmailCount}</span>
                    <span className="text-[11px] text-blue-600 font-bold">verified</span>
                  </div>
                </div>
              </div>

              {/* Filters and Search Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-[#dac1c1]/20 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-3 text-[#877272]" />
                  <input
                    type="text"
                    value={visitorSearch}
                    onChange={(e) => setVisitorSearch(e.target.value)}
                    placeholder="Search students by name, email address, or enrolled degree program..."
                    className="w-full pl-9 pr-3 py-2 bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:bg-white rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={visitorCourseFilter}
                    onChange={(e) => setVisitorCourseFilter(e.target.value)}
                    className="bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl px-3 py-2 text-xs font-bold text-[#40010d] focus:outline-none"
                  >
                    <option value="all">All Degree Programs</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visitor Records List */}
              <div className="bg-white rounded-3xl border border-[#dac1c1]/20 shadow-2xs overflow-hidden">
                {isLoadingVisitors && visitorsList.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <RefreshCw size={28} className="animate-spin mx-auto text-[#95491a]" />
                    <p className="text-xs font-bold text-[#877272]">Loading student visitors directory...</p>
                  </div>
                ) : filteredVisitors.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-14 h-14 bg-[#FAF3E0] text-[#95491a] rounded-2xl mx-auto flex items-center justify-center">
                      <Users size={28} />
                    </div>
                    <h4 className="text-base font-extrabold text-[#40010d]">No Student Records Found</h4>
                    <p className="text-xs text-[#735E55] max-w-sm mx-auto">
                      {visitorSearch || visitorCourseFilter !== "all"
                        ? "No students match your active search filter."
                        : "When students enter their name and email on the welcome/profile screen, their names, login counts, and timestamps will appear here in real-time."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FAF3E0]/70 border-b border-[#dac1c1]/40 text-[#40010d] font-extrabold uppercase text-[10px] tracking-wider">
                          <th className="py-3.5 px-4">#</th>
                          <th className="py-3.5 px-4">Student Name</th>
                          <th className="py-3.5 px-4">Email Address</th>
                          <th className="py-3.5 px-4">Enrolled Program</th>
                          <th className="py-3.5 px-4">First Joined</th>
                          <th className="py-3.5 px-4">Last Active</th>
                          <th className="py-3.5 px-4 text-center">Sessions</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#dac1c1]/20">
                        {filteredVisitors.map((student, idx) => {
                          const initials = (student.name || "Student")
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase();
                          const isDeleting = isDeletingVisitor === student.id;

                          return (
                            <tr key={student.id} className="hover:bg-[#fff8f3]/60 transition-colors">
                              <td className="py-3.5 px-4 font-mono text-[11px] text-[#877272]">
                                {idx + 1}
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-[#FAF3E0] text-[#95491a] border border-[#dac1c1]/40 flex items-center justify-center font-black text-xs shrink-0">
                                    {initials}
                                  </div>
                                  <div>
                                    <span className="font-extrabold text-xs text-[#40010d] block">
                                      {student.name || "Student"}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                {student.email ? (
                                  <a
                                    href={`mailto:${student.email}`}
                                    className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-mono"
                                  >
                                    <Mail size={12} className="text-gray-400" />
                                    <span>{student.email}</span>
                                  </a>
                                ) : (
                                  <span className="text-[11px] text-gray-400 italic">Not provided</span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="inline-block px-2.5 py-1 bg-[#fff2e1] text-[#95491a] font-bold text-[11px] rounded-lg border border-[#dac1c1]/40">
                                  {student.courseName || student.courseId || "BCA General"}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-[11px] text-[#735E55] whitespace-nowrap">
                                {student.firstVisit || "—"}
                              </td>

                              <td className="py-3.5 px-4 text-[11px] text-[#735E55] whitespace-nowrap">
                                <span className="font-bold text-[#40010d]">{student.lastActive || "—"}</span>
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                                  {student.visitCount || 1} visit{student.visitCount === 1 ? "" : "s"}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {student.email && (
                                    <a
                                      href={`mailto:${student.email}?subject=${encodeURIComponent("Read Rabbit Academic Update")}&body=${encodeURIComponent(`Hi ${student.name},\n\n`)}`}
                                      className="p-1.5 text-gray-500 hover:text-[#95491a] hover:bg-[#FAF3E0] rounded-lg transition-colors cursor-pointer"
                                      title="Send email to student"
                                    >
                                      <Mail size={14} />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVisitor(student.id, student.name)}
                                    disabled={isDeleting}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                                    title="Remove student from roster"
                                  >
                                    <Trash2 size={14} />
                                  </button>
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
            </div>
          )}

          {/* STUDENT FEEDBACK & COURSE REQUESTS VIEW */}
          {activeAdminTab === "feedback" && (
            <div className="space-y-6">
              
              {/* Top Banner & Metrics */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#dac1c1]/20 shadow-xs">
                <div>
                  <h3 className="text-lg font-extrabold text-[#40010d] flex items-center gap-2">
                    <MessageSquareHeart size={22} className="text-[#fd9b65]" /> Student Experience & Feedback Hub
                  </h3>
                  <p className="text-xs text-[#735E55] mt-1">
                    Real-time student feedback, course suggestions, notes requests, and learning experience ratings.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportFeedback}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF3E0] hover:bg-[#e8dbce] text-[#40010d] text-xs font-bold rounded-xl border border-[#dac1c1]/40 transition-all cursor-pointer shadow-2xs"
                    title="Export all student feedback to JSON file"
                  >
                    <Download size={14} />
                    <span>Export Feedback Data</span>
                  </button>

                  {onClearAllFeedback && feedbackList.length > 0 && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm("Are you sure you want to clear all student feedback records?")) {
                          await onClearAllFeedback();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      title="Clear feedback history"
                    >
                      <Trash2 size={13} />
                      <span className="hidden sm:inline">Clear All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Stat Overview Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-2xl border border-[#dac1c1]/20 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Total Submissions</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#40010d]">{feedbackList.length}</span>
                    <span className="text-[11px] text-[#877272]">reviews</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-[#dac1c1]/20 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Average Rating</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-amber-500">{averageRating}</span>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-[#dac1c1]/20 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Unread / New</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-rose-600">{unreadFeedbackCount}</span>
                    <span className="text-[11px] text-rose-500 font-bold">need review</span>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-[#dac1c1]/20 shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">Study Material Requests</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#95491a]">{materialsRequestsCount}</span>
                    <span className="text-[11px] text-[#877272]">requests</span>
                  </div>
                </div>
              </div>

              {/* Filters and Search Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-[#dac1c1]/20 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-3 text-[#877272]" />
                  <input
                    type="text"
                    value={feedbackSearch}
                    onChange={(e) => setFeedbackSearch(e.target.value)}
                    placeholder="Search by student name, email, course, message, or notes..."
                    className="w-full pl-9 pr-3 py-2 bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:bg-white rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Category Filter */}
                  <select
                    value={feedbackCategoryFilter}
                    onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
                    className="bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl px-3 py-2 text-xs font-bold text-[#40010d] focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="experience">Study Experience</option>
                    <option value="materials">Notes & PYQ Request</option>
                    <option value="suggestion">Idea & Suggestion</option>
                    <option value="bug">Reported Issue</option>
                    <option value="other">General Feedback</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={feedbackStatusFilter}
                    onChange={(e) => setFeedbackStatusFilter(e.target.value)}
                    className="bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl px-3 py-2 text-xs font-bold text-[#40010d] focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="unread">Unread ({unreadFeedbackCount})</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  {/* Rating Filter */}
                  <select
                    value={feedbackRatingFilter}
                    onChange={(e) => setFeedbackRatingFilter(e.target.value)}
                    className="bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] rounded-xl px-3 py-2 text-xs font-bold text-[#40010d] focus:outline-none"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars ⭐</option>
                    <option value="4">4 Stars ⭐</option>
                    <option value="3">3 Stars ⭐</option>
                    <option value="2">2 Stars ⭐</option>
                    <option value="1">1 Star ⭐</option>
                  </select>
                </div>
              </div>

              {/* Feedback Item Cards */}
              <div className="space-y-3.5">
                {filteredFeedbackList.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#dac1c1]/20 shadow-2xs space-y-3">
                    <div className="w-14 h-14 bg-[#FAF3E0] text-[#95491a] rounded-2xl mx-auto flex items-center justify-center">
                      <MessageSquareHeart size={28} />
                    </div>
                    <h4 className="text-base font-extrabold text-[#40010d]">No Feedback Found</h4>
                    <p className="text-xs text-[#735E55] max-w-sm mx-auto">
                      {feedbackSearch || feedbackCategoryFilter !== "all" || feedbackStatusFilter !== "all"
                        ? "No student feedback matches your active search and filter criteria."
                        : "No student feedback submitted yet. Feedback submitted by students in the header will appear here in real-time."}
                    </p>
                  </div>
                ) : (
                  filteredFeedbackList.map((item) => {
                    const isUnread = item.status === "unread";
                    const isResolved = item.status === "resolved";
                    const isEditingThisNote = editingAdminNoteId === item.id;
                    const isUpdating = isUpdatingFeedback === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs space-y-3.5 text-left ${
                          isUnread
                            ? "border-orange-300 ring-1 ring-orange-200/50 bg-[#fffdfb]"
                            : isResolved
                            ? "border-emerald-200/70"
                            : "border-[#dac1c1]/30 hover:border-[#fd9b65]/60"
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-extrabold text-xs text-[#40010d]">
                              {item.studentName || "Anonymous Student"}
                            </span>

                            {item.studentEmail && (
                              <span className="text-[11px] text-[#735E55] bg-gray-100 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                                <Mail size={11} /> {item.studentEmail}
                              </span>
                            )}

                            {item.courseName && (
                              <span className="text-[10px] font-bold text-[#95491a] bg-[#FAF3E0] px-2 py-0.5 rounded-md border border-[#dac1c1]/30">
                                {item.courseName} {item.semesterName ? `• ${item.semesterName}` : ""}
                              </span>
                            )}

                            <span className="text-[10px] text-[#877272]">
                              {item.timestamp || new Date(item.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Status Badge & Rating */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={13}
                                  className={s <= (item.rating || 5) ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                                />
                              ))}
                              <span className="text-xs font-extrabold text-[#40010d] ml-1">
                                {item.rating || 5}/5
                              </span>
                            </div>

                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                isUnread
                                  ? "bg-rose-100 text-rose-700 border border-rose-200 animate-pulse"
                                  : isResolved
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {item.status || "unread"}
                            </span>
                          </div>
                        </div>

                        {/* Category Label */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#95491a] bg-[#fff2e1] px-2 py-0.5 rounded-md border border-[#dac1c1]/40 flex items-center gap-1">
                            {item.category === "materials" && <BookOpen size={10} />}
                            {item.category === "suggestion" && <Lightbulb size={10} />}
                            {item.category === "bug" && <Bug size={10} />}
                            {item.category === "experience" && <Sparkles size={10} />}
                            {item.category === "other" && <MessageSquare size={10} />}
                            {item.category === "materials"
                              ? "Notes / PYQ Request"
                              : item.category === "suggestion"
                              ? "Feature Suggestion"
                              : item.category === "bug"
                              ? "Bug Report"
                              : item.category === "experience"
                              ? "Study Experience"
                              : "General Feedback"}
                          </span>
                        </div>

                        {/* Student's Message Content */}
                        <div className="bg-[#FAF3E0]/30 rounded-xl p-3.5 border border-[#dac1c1]/30 text-xs text-[#231a0a] leading-relaxed whitespace-pre-wrap font-sans">
                          {item.message}
                        </div>

                        {/* Admin Notes Section */}
                        {item.adminNote && !isEditingThisNote && (
                          <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200/50 text-xs text-amber-900 space-y-1 flex items-start justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                                <CornerDownRight size={12} /> Administrator Internal Note:
                              </span>
                              <p className="leading-relaxed">{item.adminNote}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdminNoteId(item.id);
                                setAdminNoteInput(item.adminNote || "");
                              }}
                              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline shrink-0 cursor-pointer"
                            >
                              Edit Note
                            </button>
                          </div>
                        )}

                        {/* Inline Admin Note Editor */}
                        {isEditingThisNote && (
                          <div className="bg-white rounded-xl p-3 border border-[#fd9b65] space-y-2">
                            <label className="text-[10px] font-bold text-[#877272] uppercase tracking-wider">
                              Admin Resolution / Internal Note:
                            </label>
                            <input
                              type="text"
                              value={adminNoteInput}
                              onChange={(e) => setAdminNoteInput(e.target.value)}
                              placeholder="e.g. Added 2023 PYQs to Semester 3 Computer Networks unit folder."
                              className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingAdminNoteId(null)}
                                className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveAdminNote(item.id)}
                                disabled={isUpdating}
                                className="px-3 py-1 bg-[#40010d] text-white text-xs font-bold rounded-lg cursor-pointer"
                              >
                                {isUpdating ? "Saving..." : "Save Note"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="pt-2 border-t border-[#dac1c1]/20 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            {item.status !== "reviewed" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.id, "reviewed")}
                                disabled={isUpdating}
                                className="px-3 py-1.5 bg-[#FAF3E0] hover:bg-[#e8dbce] text-[#40010d] text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Check size={13} />
                                <span>Mark Reviewed</span>
                              </button>
                            )}

                            {item.status !== "resolved" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.id, "resolved")}
                                disabled={isUpdating}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                <CheckCircle size={13} />
                                <span>Mark Resolved</span>
                              </button>
                            )}

                            {item.status !== "unread" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(item.id, "unread")}
                                disabled={isUpdating}
                                className="px-2.5 py-1.5 text-gray-500 hover:text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                              >
                                <span>Mark as Unread</span>
                              </button>
                            )}

                            {!item.adminNote && !isEditingThisNote && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAdminNoteId(item.id);
                                  setAdminNoteInput("");
                                }}
                                className="px-2.5 py-1.5 text-[#95491a] hover:text-[#40010d] text-xs font-bold rounded-xl hover:bg-[#FAF3E0] transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Plus size={13} />
                                <span>Add Admin Note</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {item.studentEmail && (
                              <a
                                href={`mailto:${item.studentEmail}?subject=${encodeURIComponent("Re: Read Rabbit Feedback - " + (item.category || "General"))}&body=${encodeURIComponent("Hi " + (item.studentName || "there") + ",\n\nThank you for reaching out with your feedback regarding:\n\"" + item.message + "\"\n\n")}`}
                                className="px-3 py-1.5 bg-white hover:bg-gray-50 text-[#40010d] text-xs font-bold rounded-xl border border-[#dac1c1]/40 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                title="Reply directly via email"
                              >
                                <Mail size={13} className="text-[#95491a]" />
                                <span>Reply</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteFeedbackItem(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title="Delete feedback"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
