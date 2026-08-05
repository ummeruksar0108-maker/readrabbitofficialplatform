import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { initialCourses } from "./data";
import { Course, Subject, Semester, Unit, StudyMaterial } from "./types";

// Import Components
import Sidebar from "./components/Sidebar";
import Splash from "./components/Splash";
import CourseSelection from "./components/CourseSelection";
import CurriculumRoadmap from "./components/CurriculumRoadmap";
import CuratedSubjects from "./components/CuratedSubjects";
import SubjectHub from "./components/SubjectHub";
import ExtraTabs from "./components/ExtraTabs";
import AdminPortal from "./components/AdminPortal";
import AddSubjectModal from "./components/AddSubjectModal";
import FirebaseDiagnosticsPanel from "./components/FirebaseDiagnosticsPanel";
import { Logo } from "./components/Logo";
import { logDiagnostic } from "./lib/firebase";
import { supabase } from "./lib/supabase";

// Icons for Responsive Top Bar
import { Menu, Search, X, Sparkles, Layers, ShieldCheck, Settings, HelpCircle, Bell, BookOpen, RefreshCw, ArrowLeft, LogOut, Palette, Check } from "lucide-react";
import { bgPresets } from "./components/ExtraTabs";


const CURRICULUM_STORAGE_KEY = "read_rabbit_curriculum_v5";

const hasAllDefaultCourses = (value: unknown): value is Course[] => {
  if (!Array.isArray(value)) return false;

  const savedCourseIds = new Set(
    value
      .filter((course): course is Course => Boolean(course && typeof course === "object" && "id" in course))
      .map((course) => course.id)
  );

  return initialCourses.every((course) => savedCourseIds.has(course.id));
};

export default function App() {
  // Website Background Color State with Local Storage persistence
  const [bgColor, setBgColor] = useState<string>(() => {
    return localStorage.getItem("read_rabbit_bg_color") || "#FAF3E0";
  });
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);

  // Sync background color to document body
  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
    localStorage.setItem("read_rabbit_bg_color", bgColor);
  }, [bgColor]);

  // Splash Screen State - always show initial loading display on web page open
  const [isSplash, setIsSplash] = useState(true);

  // Core Courses State with Local Storage persistence
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(CURRICULUM_STORAGE_KEY);

    if (!saved) return initialCourses;

    try {
      const parsed: unknown = JSON.parse(saved);

      // Reject stale curriculum snapshots that are missing a default course,
      // such as BCA DS, and restore the complete curriculum from data.ts.
      if (!hasAllDefaultCourses(parsed)) {
        localStorage.removeItem(CURRICULUM_STORAGE_KEY);
        return initialCourses;
      }

      return parsed;
    } catch {
      localStorage.removeItem(CURRICULUM_STORAGE_KEY);
      return initialCourses;
    }
  });

  // Active state tracks
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(() => {
    return localStorage.getItem("read_rabbit_selected_course_id") || null;
  });
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(() => {
    const savedSem = localStorage.getItem("read_rabbit_selected_semester_id");
    return savedSem ? parseInt(savedSem, 10) : null;
  });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(() => {
    return localStorage.getItem("read_rabbit_selected_subject_id") || null;
  });

  // Sidebar tab control: semesters, library, settings, admin
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("read_rabbit_active_tab");
    if (savedTab) return savedTab;
    const savedSubject = localStorage.getItem("read_rabbit_selected_subject_id");
    if (savedSubject) return "units";
    const savedSem = localStorage.getItem("read_rabbit_selected_semester_id");
    if (savedSem) return "subjects";
    return "semesters";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [isAdmin, setIsAdmin] = useState(false);
  // Modal control states
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Student Profile Info
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem("read_rabbit_student_name") || "Little Bunny";
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Persistent dynamic notifications state
  interface AppNotification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    tag: string;
  }

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("read_rabbit_notifications_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      {
        id: "n1",
        title: "Senior Notes Certified 🥕",
        message: "Discrete Structures Set Theory and Factoring Methods have been peer-reviewed and fully certified for the midterm syllabus sprint!",
        timestamp: "Jul 21, 10:42 AM",
        isRead: false,
        tag: "Curriculum"
      },
      {
        id: "n2",
        title: "Midterm Practicals Guide",
        message: "The 8085 Assembly programming guide and solutions are now published under Computer Architecture Lab unit folder.",
        timestamp: "Jul 20, 04:15 PM",
        isRead: false,
        tag: "Lab Alert"
      }
    ];
  });

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Sync notifications to localStorage
  useEffect(() => {
    localStorage.setItem("read_rabbit_notifications_v1", JSON.stringify(notifications));
  }, [notifications]);

  // Derived unread check
  const hasUnreadNotifications = useMemo(() => {
    return notifications.some(n => !n.isRead);
  }, [notifications]);

  // Add Notification callback
  const handleSendNotification = (title: string, message: string, tag?: string) => {
    const newNotif: AppNotification = {
      id: "notif_" + Date.now(),
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " " + new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
      isRead: false,
      tag: tag || "General"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Mark all notifications as read
  const handleMarkAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Clear all notifications
  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  // Secret admin backdoor trigger
  const handleSecretAdminTrigger = () => {
    if (!selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
    setActiveTab("admin");
    alert("🥕 Welcome, Owner! The hidden entrance to the Administrator Portal is now unlocked.");
  };

  // Sync status state for UI feedback
  const [isSyncingServer, setIsSyncingServer] = useState(false);
  const [lastSyncSuccessTime, setLastSyncSuccessTime] = useState<string>("");
  const isInitialServerFetchDone = useRef(false);
  const isFetchingFromServer = useRef(false);
  const lastLocalMutationTime = useRef<number>(0);

  // Helper function to save curriculum structure locally
  const saveCurriculumToServer = async (coursesToSave: Course[]): Promise<boolean> => {
    lastLocalMutationTime.current = Date.now();
    try {
      localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(coursesToSave));
      setLastSyncSuccessTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      return true;
    } catch (e) {
      console.warn("[LOCALSTORAGE SAVE WARN]", e);
      return false;
    }
  };

  // Helper function to fetch latest curriculum from local storage
  const fetchCurriculumFromServer = async (isManualCall = false) => {
    if (isManualCall) setIsSyncingServer(true);
    isFetchingFromServer.current = true;
    try {
      const saved = localStorage.getItem(CURRICULUM_STORAGE_KEY);

      if (!saved) {
        setCourses(initialCourses);
        return;
      }

      const parsed: unknown = JSON.parse(saved);

      if (hasAllDefaultCourses(parsed)) {
        setCourses(parsed);
      } else {
        // A stale snapshot is overriding data.ts and hiding one or more courses.
        // Replace it with the complete default curriculum.
        localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(initialCourses));
        setCourses(initialCourses);
      }

      setLastSyncSuccessTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (err) {
      console.warn("[CURRICULUM FETCH WARN]", err);
    } finally {
      isInitialServerFetchDone.current = true;
      setTimeout(() => {
        isFetchingFromServer.current = false;
        if (isManualCall) setIsSyncingServer(false);
      }, 300);
    }
  };

  // Load initial curriculum state on component mount
  useEffect(() => {
    fetchCurriculumFromServer();
  }, []);

  // Persist State Changes to Server and Local Storage
  useEffect(() => {
    if (!isInitialServerFetchDone.current) {
      return;
    }

    saveCurriculumToServer(courses);
  }, [courses]);

  useEffect(() => {
    if (selectedCourseId) {
      localStorage.setItem("read_rabbit_selected_course_id", selectedCourseId);
    } else {
      localStorage.removeItem("read_rabbit_selected_course_id");
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedSemesterId !== null) {
      localStorage.setItem("read_rabbit_selected_semester_id", selectedSemesterId.toString());
    } else {
      localStorage.removeItem("read_rabbit_selected_semester_id");
    }
  }, [selectedSemesterId]);

  useEffect(() => {
    if (selectedSubjectId) {
      localStorage.setItem("read_rabbit_selected_subject_id", selectedSubjectId);
    } else {
      localStorage.removeItem("read_rabbit_selected_subject_id");
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    localStorage.setItem("read_rabbit_is_splash", isSplash ? "true" : "false");
  }, [isSplash]);

  useEffect(() => {
    localStorage.setItem("read_rabbit_active_tab", activeTab);
  }, [activeTab]);

  
  // Helper to verify single configured admin email
  const isApprovedAdminEmail = (userEmail?: string | null): boolean => {
    if (!userEmail) return false;
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "thecodeorbitoffi@gmail.com").trim().toLowerCase();
    return userEmail.trim().toLowerCase() === adminEmail;
  };

  // Sync Supabase Auth session with isAdmin state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const userEmail = session?.user?.email;
      if (session?.user && isApprovedAdminEmail(userEmail)) {
        setIsAdmin(true);
      } else {
        if (session?.user) {
          supabase.auth.signOut();
        }
        setIsAdmin(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userEmail = session?.user?.email;
      if (session?.user && isApprovedAdminEmail(userEmail)) {
        setIsAdmin(true);
      } else {
        if (session?.user) {
          supabase.auth.signOut();
        }
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("read_rabbit_student_name", studentName);
  }, [studentName]);

  // Browser History & Navigation Synchronization System
  const pushAppHistory = (
    courseId: string | null,
    semesterId: number | null,
    subjectId: string | null,
    tab: string,
    splashVal: boolean = false
  ) => {
    const newState = {
      isSplash: splashVal,
      selectedCourseId: courseId,
      selectedSemesterId: semesterId,
      selectedSubjectId: subjectId,
      activeTab: tab
    };

    const current = window.history.state;
    if (
      !current ||
      current.selectedCourseId !== courseId ||
      current.selectedSemesterId !== semesterId ||
      current.selectedSubjectId !== subjectId ||
      current.activeTab !== tab ||
      current.isSplash !== splashVal
    ) {
      window.history.pushState(newState, "");
    }
  };

  // Synchronize popstate event (Browser Back / Mobile Back Gesture)
  useEffect(() => {
    // Save initial state into history
    const initialHist = {
      isSplash,
      selectedCourseId,
      selectedSemesterId,
      selectedSubjectId,
      activeTab
    };
    if (!window.history.state) {
      window.history.replaceState(initialHist, "");
    }

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state && typeof state === "object") {
        if (typeof state.isSplash === "boolean") {
          setIsSplash(state.isSplash);
        }
        setSelectedCourseId(state.selectedCourseId ?? null);
        setSelectedSemesterId(state.selectedSemesterId ?? null);
        setSelectedSubjectId(state.selectedSubjectId ?? null);
        if (state.activeTab) {
          setActiveTab(state.activeTab);
        }
      } else {
        // Fallback for root state
        setIsSplash(false);
        setSelectedSubjectId(null);
        setSelectedSemesterId(null);
        setActiveTab("semesters");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Derived Active Models
  const activeCourse = useMemo(() => {
    return courses.find(c => c.id === selectedCourseId) || courses[0] || null;
  }, [courses, selectedCourseId]);

  const activeSemester = useMemo(() => {
    if (!activeCourse) return null;
    if (selectedSemesterId !== null) {
      const found = activeCourse.semesters.find(s => s.id === selectedSemesterId);
      if (found) return found;
    }
    if (selectedSubjectId) {
      const foundSem = activeCourse.semesters.find(s =>
        s.subjects.some(sub => sub.id === selectedSubjectId)
      );
      if (foundSem) return foundSem;
    }
    return null;
  }, [activeCourse, selectedSemesterId, selectedSubjectId]);

  const activeSubject = useMemo(() => {
    if (!selectedSubjectId || !activeCourse) return null;
    if (activeSemester) {
      const found = activeSemester.subjects.find(s => s.id === selectedSubjectId);
      if (found) return found;
    }
    for (const sem of activeCourse.semesters) {
      const found = sem.subjects.find(s => s.id === selectedSubjectId);
      if (found) return found;
    }
    return null;
  }, [activeCourse, activeSemester, selectedSubjectId]);

  // Dynamic universal back-navigation helpers
  const canGoBack = useMemo(() => {
    return activeTab !== "semesters" || selectedSemesterId !== null || selectedSubjectId !== null;
  }, [activeTab, selectedSemesterId, selectedSubjectId]);

  const handleGoBack = () => {
    const targetSemId = selectedSemesterId ?? activeSemester?.id ?? null;
    if (activeTab === "units" || selectedSubjectId !== null) {
      if (targetSemId !== null) {
        setSelectedSemesterId(targetSemId);
      }
      setSelectedSubjectId(null);
      setActiveTab("subjects");
      pushAppHistory(selectedCourseId, targetSemId, null, "subjects");
    } else if (activeTab === "subjects" || selectedSemesterId !== null) {
      setSelectedSemesterId(null);
      setSelectedSubjectId(null);
      setActiveTab("semesters");
      pushAppHistory(selectedCourseId, null, null, "semesters");
    } else if (activeTab !== "semesters") {
      setSelectedSemesterId(null);
      setSelectedSubjectId(null);
      setActiveTab("semesters");
      pushAppHistory(selectedCourseId, null, null, "semesters");
    }
  };

  // Navigation handlers
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedSemesterId(null);
    setSelectedSubjectId(null);
    setActiveTab("semesters");
    pushAppHistory(courseId, null, null, "semesters");
  };

  const handleChangeCourseClick = () => {
    setSelectedCourseId(null);
    setSelectedSemesterId(null);
    setSelectedSubjectId(null);
    pushAppHistory(null, null, null, "semesters");
  };

  const handleSelectSemester = (courseId: string, semesterId: number) => {
    setSelectedCourseId(courseId);
    setSelectedSemesterId(semesterId);
    setSelectedSubjectId(null);
    setActiveTab("subjects"); // Sub-navigation state to render subject cards
    pushAppHistory(courseId, semesterId, null, "subjects");
  };

  const handleUnlockAllSemesters = () => {
    const updatedCourses = courses.map(course => ({
      ...course,
      semesters: course.semesters.map(semester => {
        const isLockedSem = semester.status === "Locked";
        const newStatus = isLockedSem ? ("In Progress" as const) : semester.status;
        const newBorder = isLockedSem ? "border-[#fd9b65]" : semester.borderClass;
        const newBadgeBg = isLockedSem ? "bg-[#fff2e1] text-[#95491a]" : semester.badgeBg;
        const newBadgeText = isLockedSem ? "Unlocked" : semester.badgeText;
        const newIcon = isLockedSem ? "BookOpen" : semester.icon;

        return {
          ...semester,
          status: newStatus,
          borderClass: newBorder,
          badgeBg: newBadgeBg,
          badgeText: newBadgeText,
          icon: newIcon,
          subjects: semester.subjects.map(subject => ({
            ...subject,
            units: subject.units.map(unit => ({
              ...unit,
              status: unit.status === "Locked" ? ("In Progress" as const) : unit.status
            }))
          }))
        };
      })
    }));
    setCourses(updatedCourses);
    handleSendNotification(
      "All Semesters Unlocked! 🔓",
      "Every single semester and learning unit is now fully open for research and exam preparation in the Burrow.",
      "Curriculum"
    );
    alert("Unlock Success 🥕 All semesters and modules across all courses are now unlocked for you!");
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveTab("units"); // Sub-navigation state to render subject hub
    pushAppHistory(selectedCourseId, selectedSemesterId, subjectId, "units");
  };

  // Admin handlers
  const handleUpdateCourses = async (updatedCourses: Course[]): Promise<boolean> => {
    lastLocalMutationTime.current = Date.now();
    setCourses(updatedCourses);
    return await saveCurriculumToServer(updatedCourses);
  };

  const handleUpdateSubject = async (updatedSubject: Subject): Promise<boolean> => {
    lastLocalMutationTime.current = Date.now();
    let found = false;

    const nextCourses = courses.map(course => {
      let containsSubject = false;
      const updatedSemesters = course.semesters.map(sem => {
        const subIndex = sem.subjects.findIndex(s => s.id === updatedSubject.id);
        if (subIndex === -1) return sem;
        
        containsSubject = true;
        found = true;
        const updatedSubjects = sem.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s);
        const totalModules = updatedSubjects.reduce((acc, s) => acc + s.modulesCount, 0);
        const completedModules = updatedSubjects.reduce((acc, s) => acc + s.completedModules, 0);
        const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
        
        return {
          ...sem,
          subjects: updatedSubjects,
          completedModules,
          progressPercent
        };
      });
      
      return containsSubject ? { ...course, semesters: updatedSemesters } : course;
    });

    if (found) {
      setCourses(nextCourses);
      return await saveCurriculumToServer(nextCourses);
    }
    return false;
  };

  const handleAddSubject = async (newSubject: Subject): Promise<boolean> => {
    lastLocalMutationTime.current = Date.now();
    const cId = selectedCourseId || courses[0]?.id;
    const sId = selectedSemesterId ?? 1;

    const nextCourses = courses.map(course => {
      if (course.id !== cId) return course;
      return {
        ...course,
        semesters: course.semesters.map(sem => {
          if (sem.id !== sId) return sem;
          
          const updatedSubjects = [...sem.subjects, newSubject];
          const totalModules = updatedSubjects.reduce((acc, s) => acc + s.modulesCount, 0);
          const completedModules = updatedSubjects.reduce((acc, s) => acc + s.completedModules, 0);
          
          return {
            ...sem,
            subjects: updatedSubjects,
            modulesCount: totalModules,
            completedModules,
            progressPercent: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
          };
        })
      };
    });

    setCourses(nextCourses);
    return await saveCurriculumToServer(nextCourses);
  };

  const handleDeleteSubject = async (subjectId: string): Promise<boolean> => {
    lastLocalMutationTime.current = Date.now();
    const nextCourses = courses.map(course => ({
      ...course,
      semesters: course.semesters.map(sem => {
        const updatedSubjects = sem.subjects.filter(s => s.id !== subjectId);
        const totalModules = updatedSubjects.reduce((acc, s) => acc + s.modulesCount, 0);
        const completedModules = updatedSubjects.reduce((acc, s) => acc + s.completedModules, 0);
        
        return {
          ...sem,
          subjects: updatedSubjects,
          modulesCount: totalModules,
          completedModules,
          progressPercent: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
        };
      })
    }));

    setCourses(nextCourses);
    return await saveCurriculumToServer(nextCourses);
  };

  // Exit App handler (Splash trigger)
  const handleExitApp = () => {
    setIsSplash(true);
    setSelectedCourseId(null);
    setSelectedSemesterId(null);
    setSelectedSubjectId(null);
    setIsAdmin(false);
  };

  // 1. Splash Screen
  if (isSplash) {
    return (
      <Splash
        onEnter={() => {
          setSelectedCourseId(null);
          setSelectedSemesterId(null);
          setSelectedSubjectId(null);
          setIsSplash(false);
        }}
      />
    );
  }

  // 2. Course Selection Screen (if no course is selected yet)
  if (!selectedCourseId) {
    return (
      <CourseSelection
        courses={courses}
        onSelectCourse={handleSelectCourse}
        onOpenAdminPortal={() => {
          setSelectedCourseId(courses[0].id); // default to first course to enter workspace
          setActiveTab("admin");
        }}
        isAdmin={isAdmin}
        onSecretTrigger={handleSecretAdminTrigger}
      />
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col md:flex-row relative" style={{ backgroundColor: bgColor }}>
      {/* Background ambient blurring light circles */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#fd9b65]/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#accec2]/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Persistent Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab === "subjects" || activeTab === "units" ? "semesters" : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
          if (tab === "semesters") {
            // reset subject/sem state to view semesters roadmap
            setSelectedSemesterId(null);
            setSelectedSubjectId(null);
            pushAppHistory(selectedCourseId, null, null, tab);
          } else {
            pushAppHistory(selectedCourseId, selectedSemesterId, selectedSubjectId, tab);
          }
        }}
        selectedCourseName={activeCourse?.name || null}
        onChangeCourse={handleChangeCourseClick}
        isAdmin={isAdmin}
        onSecretTrigger={handleSecretAdminTrigger}
      />

      {/* Main Study Desk Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        
        {/* Unified Responsive Header */}
        <header className="sticky top-0 z-30 flex justify-between items-center px-4 md:px-8 py-4 bg-[#fff8f3]/90 backdrop-blur-md border-b border-[#dac1c1]/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#544243] hover:text-[#231a0a] md:hidden rounded-lg hover:bg-[#f8e6cb]/40 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {canGoBack && (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f8e6cb]/30 text-[#40010d] hover:text-[#ba1a1a] rounded-xl border border-[#dac1c1]/40 hover:border-[#fd9b65] transition-all text-xs font-bold cursor-pointer shadow-xs"
                title="Go back to previous page"
              >
                <ArrowLeft size={14} className="text-[#95491a]" />
                <span>Back</span>
              </button>
            )}
            
            <div className="flex items-center gap-2 md:hidden">
              <Logo size="sm" />
              <h1 className="font-sans text-base font-extrabold text-[#40010d]">
                READ RABBIT
              </h1>
            </div>
            
            {/* Desktop Quick Header indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs font-sans font-semibold text-[#877272]">
              <span>Specialization:</span>
              <span className="text-[#95491a] font-extrabold">{activeCourse?.name}</span>
            </div>
          </div>

          {/* Quick AI Search & Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#fff2e1]/60 px-3 py-1.5 rounded-xl border border-[#dac1c1]/40 focus-within:border-[#fd9b65] transition-colors max-w-xs">
              <Search size={16} className="text-[#877272]" />
              <input
                type="text"
                placeholder="Search syllabus & notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs font-sans focus:outline-none placeholder-[#877272] w-44"
              />
            </div>



            {/* Notification trigger with custom drawer popup */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-[#877272] hover:text-[#40010d] rounded-xl hover:bg-[#f8e6cb]/40 relative cursor-pointer"
                title="Academic Notifications"
              >
                {hasUnreadNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                )}
                <Bell size={20} />
              </button>

              {/* Notifications Dropdown Panel */}
              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotifOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 z-50 w-80 bg-white rounded-2xl border border-[#dac1c1]/30 p-4 shadow-xl space-y-3 text-left"
                    >
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-xs font-sans font-extrabold text-[#40010d] tracking-wider uppercase flex items-center gap-1.5">
                          <Bell size={14} className="text-[#95491a]" /> Burrow Announcements
                        </span>
                        <button 
                          onClick={() => setIsNotifOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-[11px] text-[#877272] italic py-4 text-center">No active academic notices.</p>
                        ) : (
                          notifications.map(n => (
                            <div 
                              key={n.id} 
                              className={`p-2.5 rounded-xl border text-left space-y-1 relative transition-colors ${
                                n.isRead 
                                  ? "bg-slate-50/50 border-gray-100" 
                                  : "bg-orange-50/40 border-orange-100/50"
                              }`}
                            >
                              {!n.isRead && (
                                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                              )}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[8px] bg-[#95491a]/10 text-[#95491a] px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                                  {n.tag}
                                </span>
                                <span className="text-[9px] text-gray-400 font-medium">{n.timestamp}</span>
                              </div>
                              <h4 className="font-sans font-bold text-xs text-[#40010d]">{n.title}</h4>
                              <p className="font-sans text-[11px] text-[#544243] leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="flex gap-2 justify-between pt-1 text-[10px] font-sans font-bold border-t border-gray-100">
                          <button 
                            onClick={() => {
                              handleMarkAllNotifsRead();
                              setIsNotifOpen(false);
                            }}
                            className="text-[#95491a] hover:underline"
                          >
                            Mark all as read
                          </button>
                          <button 
                            onClick={handleClearAllNotifs}
                            className="text-red-500 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Cloud Server Live Sync Button */}
            <button
              onClick={() => fetchCurriculumFromServer(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 rounded-xl transition-all text-xs font-bold cursor-pointer active:scale-95 shadow-2xs"
              title={`Synced with Web Cloud Server${lastSyncSuccessTime ? ` at ${lastSyncSuccessTime}` : ""}. Click to re-sync.`}
            >
              <RefreshCw size={13} className={`text-emerald-700 ${isSyncingServer ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">
                {isSyncingServer ? "Syncing..." : "Cloud Synced"}
              </span>
            </button>

            {/* Profile badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-[#dac1c1]/20 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-[#f8e6cb] flex items-center justify-center font-sans text-xs font-bold text-[#95491a]">
                {studentName.charAt(0)}
              </div>
              <span className="hidden md:inline font-sans text-xs font-bold text-[#544243]">
                {studentName}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar overlay drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#40010d]/30 backdrop-blur-xs md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-72 max-w-[85vw] h-full max-h-screen overflow-y-auto bg-[#fffcf9] p-6 shadow-2xl flex flex-col justify-between space-y-6 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <Logo size="sm" />
                      <h2 className="font-sans text-lg font-bold text-[#40010d]">READ RABBIT</h2>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X size={20} className="text-[#877272]" />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {[
                      { id: "semesters", label: "My Semesters", icon: Layers },
                      { id: "library", label: "The Library", icon: BookOpen },
                      ...(isAdmin ? [{ id: "admin", label: "Admin Portal", icon: ShieldCheck, badge: "Active" }] : []),
                      { id: "settings", label: "Settings", icon: Settings },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id || (item.id === "semesters" && ["subjects", "units"].includes(activeTab));
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                            if (item.id === "semesters") {
                              setSelectedSemesterId(null);
                              setSelectedSubjectId(null);
                            }
                          }}
                          className={`w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors cursor-pointer ${
                            isActive
                              ? "bg-[#fd9b65] text-[#341100] font-bold"
                              : "text-[#544243] hover:bg-[#f8e6cb]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} />
                            <span className="text-sm font-sans">{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="bg-[#6b8a80] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        handleChangeCourseClick();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[#95491a] hover:bg-[#f8e6cb] mt-4 font-bold border border-dashed border-[#fd9b65]/20 text-left cursor-pointer"
                    >
                      <RefreshCw size={18} />
                      <span className="text-sm font-sans">Switch Course</span>
                    </button>
                  </nav>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#dac1c1]/30">
                  <button
                    onClick={() => {
                      setActiveTab("help");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-left text-xs font-sans text-[#544243] flex items-center gap-3 px-4 hover:bg-[#f8e6cb] rounded-xl font-semibold cursor-pointer"
                  >
                    <HelpCircle size={18} className="text-[#877272]" /> Help & Support
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("logout");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-left text-xs font-sans text-red-700 flex items-center gap-3 px-4 hover:bg-red-50 rounded-xl font-bold cursor-pointer"
                  >
                    <LogOut size={18} className="text-red-500" /> Logout / Exit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Inner Tab Router */}
        <main className="flex-1 overflow-x-hidden">
          
          {/* SEMESTERS ROADMAP GRID */}
          {activeTab === "semesters" && selectedSemesterId === null && (
            <CurriculumRoadmap
              courses={courses}
              activeCourseId={selectedCourseId}
              onSelectSemester={handleSelectSemester}
              onShowPrereqs={(name) => alert(`Unlock prerequisite: 🥕 Complete all preceding course modules to start studying ${name}.`)}
              onUnlockAll={handleUnlockAllSemesters}
              onOpenAdminPortal={() => {
                if (!selectedCourseId && courses.length > 0) {
                  setSelectedCourseId(courses[0].id);
                }
                setActiveTab("admin");
              }}
            />
          )}

          {/* SUBJECTS LIST OF SELECTED SEMESTER */}
          {activeTab === "subjects" && selectedSubjectId === null && (
            <CuratedSubjects
              subjects={activeSemester?.subjects || []}
              onSelectSubject={handleSelectSubject}
              onAddSubjectClick={() => setIsAddSubjectOpen(true)}
              onDeleteSubject={handleDeleteSubject}
              overallProgress={activeSemester?.progressPercent || 0}
              isAdmin={isAdmin}
              onBack={() => {
                setSelectedSemesterId(null);
                setSelectedSubjectId(null);
                setActiveTab("semesters");
                pushAppHistory(selectedCourseId, null, null, "semesters");
              }}
              semesterName={activeSemester?.name || "Semester"}
            />
          )}

          {/* INTERACTIVE DYNAMIC SUBJECT HUB (Syllabus, Study materials, Practicals) */}
          {activeTab === "units" && activeSubject !== null && (
            <SubjectHub
              courseName={activeCourse?.name || ""}
              semesterName={activeSemester?.name || ""}
              subject={activeSubject}
              isAdmin={isAdmin}
              onBackToSubjects={() => {
                const targetSemId = selectedSemesterId ?? activeSemester?.id ?? null;
                if (targetSemId !== null) {
                  setSelectedSemesterId(targetSemId);
                }
                setSelectedSubjectId(null);
                setActiveTab("subjects");
                pushAppHistory(selectedCourseId, targetSemId, null, "subjects");
              }}
              onUpdateSubject={handleUpdateSubject}
            />
          )}

          {/* THE LIBRARY & GENERAL SETTINGS PANEL */}
          {["library", "settings"].includes(activeTab) && (
            <ExtraTabs
              activeTab={activeTab}
              onNavigateToSyllabus={() => {
                setSelectedSemesterId(null);
                setSelectedSubjectId(null);
                setActiveTab("semesters");
              }}
              studentName={studentName}
              setStudentName={setStudentName}
              bgColor={bgColor}
              setBgColor={setBgColor}
            />
          )}

          {/* THE MASTER ADMINISTRATOR PORTAL */}
          {activeTab === "admin" && (
            <AdminPortal
              courses={courses}
              onUpdateCourses={handleUpdateCourses}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              onSendNotification={handleSendNotification}
              onClose={() => {
                setActiveTab("semesters");
                setSelectedSemesterId(null);
                setSelectedSubjectId(null);
              }}
            />
          )}

          {/* STUDY COMPANION ASSISTANCE */}
          {activeTab === "help" && (
            <div className="p-8 max-w-lg mx-auto text-center font-sans mt-12 bg-white rounded-3xl border border-[#dac1c1]/20">
              <h3 className="text-2xl font-extrabold text-[#40010d] mb-3">Academic Burrow Assistance</h3>
              <p className="text-sm text-[#544243] leading-relaxed mb-6">
                Need guidance navigating your spec's modules or assembly practicals? Explore the Syllabus Units and Study Files inside any Subject Hub to access notes, solved papers, and algorithms!
              </p>
            </div>
          )}

          {/* BURROW EXIT / LOGOUT SCREEN */}
          {activeTab === "logout" && (
            <div className="p-8 max-w-md mx-auto text-center font-sans border border-[#dac1c1]/20 bg-white rounded-3xl mt-12">
              <h3 className="text-xl font-extrabold text-[#ba1a1a] mb-2">Leaving the Burrow?</h3>
              <p className="text-xs text-[#544243] mb-6">
                Make sure you have nibbled enough carrots before leaving. Your study sprint, mastery metrics, and custom administrator configurations are fully persistent.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setActiveTab("semesters")} className="py-2.5 px-5 bg-gray-100 text-[#544243] text-xs font-bold rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleExitApp} className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">
                  Exit Burrow
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Custom Subject creation modal inside Semester subjects view */}
      <AnimatePresence>
        {isAddSubjectOpen && (
          <AddSubjectModal
            isOpen={isAddSubjectOpen}
            onClose={() => setIsAddSubjectOpen(false)}
            onAddSubject={handleAddSubject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
