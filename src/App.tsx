import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { initialCourses, ensureAllLanguageCardsExist } from "./data";
import { Course, Subject, Semester, Unit, StudyMaterial, AppNotification, StudentFeedback, FeedbackStatus } from "./types";

// Import Components
import Sidebar from "./components/Sidebar";
import LoadingScreen from "./components/LoadingScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import StudentEntry from "./components/StudentEntry";
import CourseSelection from "./components/CourseSelection";
import CurriculumRoadmap from "./components/CurriculumRoadmap";
import CuratedSubjects from "./components/CuratedSubjects";
import SubjectHub from "./components/SubjectHub";
import ExtraTabs from "./components/ExtraTabs";
import QuestionPaperLibrary from "./components/QuestionPaperLibrary";
import AdminPortal from "./components/AdminPortal";
import AddSubjectModal from "./components/AddSubjectModal";
import PasswordResetModal from "./components/PasswordResetModal";
import GlobalSearchModal from "./components/GlobalSearchModal";
import StudentFeedbackModal from "./components/StudentFeedbackModal";
import StudentProfileModal from "./components/StudentProfileModal";
import FirebaseDiagnosticsPanel from "./components/FirebaseDiagnosticsPanel";
import { Logo } from "./components/Logo";
import { logDiagnostic, saveCoursesToFirestore, loadCoursesFromFirestore, subscribeCoursesFromFirestore, saveNotificationsToFirestore, subscribeNotificationsFromFirestore, saveFeedbackToFirestore, subscribeFeedbackFromFirestore } from "./lib/firebase";
import { supabase, fetchAllMaterialsFromSupabaseDB, mergeSupabaseMaterialsIntoCourses } from "./lib/supabase";

// Icons for Responsive Top Bar
import { Menu, Search, X, Sparkles, Layers, ShieldCheck, Settings, HelpCircle, Bell, BookOpen, RefreshCw, ArrowLeft, LogOut, Palette, Check, MessageSquareHeart } from "lucide-react";
import { bgPresets } from "./components/ExtraTabs";


const CURRICULUM_STORAGE_KEY = "read_rabbit_curriculum_v6";

const hasAllDefaultCourses = (value: unknown): value is Course[] => {
  if (!Array.isArray(value)) return false;

  const savedCourseIds = new Set(
    value
      .filter((course): course is Course => Boolean(course && typeof course === "object" && "id" in course))
      .map((course) => course.id)
  );

  return initialCourses.every((course) => savedCourseIds.has(course.id));
};

export type AppPhase = "loading" | "welcome" | "profile_entry" | "course_selection" | "main";

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

  // Initial navigation state restored from URL Hash or LocalStorage
  const initialHashState = useMemo(() => {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return null;
    if (hash === "loading") {
      return { phase: "loading" as AppPhase, courseId: null, semId: null, subId: null, tab: "semesters" };
    }
    if (hash === "welcome") {
      return { phase: "welcome" as AppPhase, courseId: null, semId: null, subId: null, tab: "semesters" };
    }
    if (hash === "profile-setup" || hash === "profile") {
      return { phase: "profile_entry" as AppPhase, courseId: null, semId: null, subId: null, tab: "semesters" };
    }
    if (hash === "select-course") {
      return { phase: "course_selection" as AppPhase, courseId: null, semId: null, subId: null, tab: "semesters" };
    }
    const params = new URLSearchParams(hash);
    const courseId = params.get("course") || null;
    const semStr = params.get("sem");
    const semId = semStr ? parseInt(semStr, 10) : null;
    const subId = params.get("subject") || null;
    const tab = params.get("tab") || (subId ? "units" : semId ? "subjects" : "semesters");
    return {
      phase: "loading" as AppPhase, // Always begin with loading sequence on fresh load
      courseId,
      semId: Number.isNaN(semId) ? null : semId,
      subId,
      tab
    };
  }, []);

  // Multi-step Application Phase: loading -> welcome -> profile_entry -> course_selection -> main
  const [appPhase, setAppPhase] = useState<AppPhase>("loading");

  // Track if user has completed student identification and chosen their first course
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const flag = localStorage.getItem("read_rabbit_onboarded") === "true";
    const name = localStorage.getItem("read_rabbit_student_name");
    const email = localStorage.getItem("read_rabbit_student_email");
    const courseId = localStorage.getItem("read_rabbit_selected_course_id");
    return flag && Boolean(name && name.trim() && name !== "Little Bunny") && Boolean(email && email.trim()) && Boolean(courseId);
  });

  // Core Courses State with Local Storage persistence
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(CURRICULUM_STORAGE_KEY);

    if (!saved) return ensureAllLanguageCardsExist(initialCourses);

    try {
      const parsed: unknown = JSON.parse(saved);

      // Reject stale curriculum snapshots that are missing a default course,
      // such as BCA DS, and restore the complete curriculum from data.ts.
      if (!hasAllDefaultCourses(parsed)) {
        localStorage.removeItem(CURRICULUM_STORAGE_KEY);
        return ensureAllLanguageCardsExist(initialCourses);
      }

      return ensureAllLanguageCardsExist(parsed as Course[]);
    } catch {
      localStorage.removeItem(CURRICULUM_STORAGE_KEY);
      return ensureAllLanguageCardsExist(initialCourses);
    }
  });

  // Active state tracks
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(() => {
    if (initialHashState && initialHashState.courseId) return initialHashState.courseId;
    return localStorage.getItem("read_rabbit_selected_course_id") || "general";
  });
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(() => {
    if (initialHashState && initialHashState.semId !== null) return initialHashState.semId;
    const savedSem = localStorage.getItem("read_rabbit_selected_semester_id");
    return savedSem ? parseInt(savedSem, 10) : null;
  });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(() => {
    if (initialHashState && initialHashState.subId) return initialHashState.subId;
    return localStorage.getItem("read_rabbit_selected_subject_id") || null;
  });

  // Sidebar tab control: semesters, library, settings, admin
  const [activeTab, setActiveTab] = useState(() => {
    if (initialHashState && initialHashState.tab) return initialHashState.tab;
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
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("read_rabbit_is_admin") === "true";
  });
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  // Modal control states
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Student Profile Info (permanently saved)
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem("read_rabbit_student_name") || "Little Bunny";
  });
  const [studentEmail, setStudentEmail] = useState(() => {
    return localStorage.getItem("read_rabbit_student_email") || "";
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSaveStudentProfile = (name: string, email: string) => {
    setStudentName(name);
    setStudentEmail(email);
    localStorage.setItem("read_rabbit_student_name", name);
    localStorage.setItem("read_rabbit_student_email", email);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcut for Search (Ctrl+K, Cmd+K, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Persistent dynamic notifications state
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

  // Real-time Firestore notification listener & server sync
  useEffect(() => {
    // 1. Initial fetch from Express server disk
    fetch("/api/notifications")
      .then(res => res.ok ? res.json() : [])
      .then(serverNotifs => {
        if (Array.isArray(serverNotifs) && serverNotifs.length > 0) {
          setNotifications(prev => {
            const combined = [...serverNotifs];
            prev.forEach(p => {
              if (!combined.some(c => c.id === p.id)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      })
      .catch(() => {});

    // 2. Real-time Firestore notifications listener
    const unsubscribe = subscribeNotificationsFromFirestore((remoteNotifs) => {
      if (Array.isArray(remoteNotifs) && remoteNotifs.length > 0) {
        setNotifications(prev => {
          const combined = [...remoteNotifs];
          prev.forEach(p => {
            if (!combined.some(c => c.id === p.id)) {
              combined.push(p);
            }
          });
          return combined;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Derived unread check
  const hasUnreadNotifications = useMemo(() => {
    return notifications.some(n => !n.isRead);
  }, [notifications]);

  // Add Notification callback (dispatches to local state, Express server & Firestore cloud)
  const handleSendNotification = (title: string, message: string, tag?: string, targetAudience?: string) => {
    const newNotif: AppNotification = {
      id: "notif_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " " + new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
      isRead: false,
      tag: tag || "General",
      targetAudience: targetAudience || "All Enrolled Students & Faculty"
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      // Sync full list to Express Server
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }).catch(err => console.warn("[Server Notif Sync Fail]", err));

      // Sync to Firestore Cloud
      saveNotificationsToFirestore(updated);
      return updated;
    });
  };

  // Delete a single notification
  const handleDeleteNotification = (notifId: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notifId);
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }).catch(err => console.warn("[Server Notif Delete Fail]", err));

      saveNotificationsToFirestore(updated);
      return updated;
    });
  };

  // Mark all notifications as read
  const handleMarkAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Clear all notifications
  const handleClearAllNotifs = () => {
    setNotifications([]);
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([])
    }).catch(err => console.warn("[Server Notif Clear Fail]", err));
    saveNotificationsToFirestore([]);
  };

  // Student Feedback State
  const [feedbackList, setFeedbackList] = useState<StudentFeedback[]>(() => {
    const saved = localStorage.getItem("read_rabbit_feedback_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse feedback from storage:", e);
      }
    }
    return [
      {
        id: "fb_seed_1",
        studentName: "Priya Sharma",
        studentEmail: "priya.s@student.edu",
        courseName: "BCA GENERAL",
        semesterName: "Semester 3",
        rating: 5,
        category: "experience",
        message: "The subject roadmaps and in-app PDF viewer made revising for midterms so much smoother! Love the rabbit aesthetic and clean UI.",
        timestamp: "Yesterday, 3:20 PM",
        status: "reviewed",
        adminNote: "Positive review acknowledged. Encouraged to explore PYQs library.",
        createdAt: Date.now() - 86400000
      },
      {
        id: "fb_seed_2",
        studentName: "Rahul Varma",
        studentEmail: "rahul.v@student.edu",
        courseName: "BCA AI/ML",
        semesterName: "Semester 2",
        rating: 4,
        category: "materials",
        message: "Could you please add more solved question papers for 8085 Microprocessor Assembly language lab programs from 2022-2023?",
        timestamp: "Today, 11:15 AM",
        status: "unread",
        adminNote: "",
        createdAt: Date.now() - 14400000
      }
    ];
  });

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Sync feedback to localStorage
  useEffect(() => {
    localStorage.setItem("read_rabbit_feedback_v1", JSON.stringify(feedbackList));
  }, [feedbackList]);

  // Real-time Firestore feedback listener & server sync
  useEffect(() => {
    // 1. Initial fetch from Express server disk
    fetch("/api/feedback")
      .then(res => res.ok ? res.json() : [])
      .then(serverFeedback => {
        if (Array.isArray(serverFeedback) && serverFeedback.length > 0) {
          setFeedbackList(prev => {
            const combined = [...serverFeedback];
            prev.forEach(p => {
              if (!combined.some(c => c.id === p.id)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      })
      .catch(() => {});

    // 2. Real-time Firestore feedback listener
    const unsubscribe = subscribeFeedbackFromFirestore((remoteFeedback) => {
      if (Array.isArray(remoteFeedback) && remoteFeedback.length > 0) {
        setFeedbackList(prev => {
          const combined = [...remoteFeedback];
          prev.forEach(p => {
            if (!combined.some(c => c.id === p.id)) {
              combined.push(p);
            }
          });
          return combined;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Submit new feedback handler
  const handleSubmitFeedback = async (
    data: Omit<StudentFeedback, "id" | "timestamp" | "status" | "createdAt">
  ): Promise<boolean> => {
    const newFeedback: StudentFeedback = {
      ...data,
      id: "fb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", " + new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
      status: "unread",
      createdAt: Date.now()
    };

    setFeedbackList(prev => {
      const updated = [newFeedback, ...prev];
      // Sync to Express Server
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }).catch(err => console.warn("[Server Feedback Sync Fail]", err));

      // Sync to Firestore Cloud
      saveFeedbackToFirestore(updated);
      return updated;
    });

    return true;
  };

  // Update feedback status & admin note
  const handleUpdateFeedbackStatus = async (
    id: string,
    status: FeedbackStatus,
    adminNote?: string
  ): Promise<void> => {
    setFeedbackList(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status,
            adminNote: adminNote !== undefined ? adminNote : item.adminNote
          };
        }
        return item;
      });

      // Sync to Express Server
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }).catch(err => console.warn("[Server Feedback Sync Fail]", err));

      // Sync to Firestore Cloud
      saveFeedbackToFirestore(updated);
      return updated;
    });
  };

  // Delete feedback item
  const handleDeleteFeedback = async (id: string): Promise<void> => {
    setFeedbackList(prev => {
      const updated = prev.filter(f => f.id !== id);
      fetch(`/api/feedback/${id}`, { method: "DELETE" }).catch(() => {});
      saveFeedbackToFirestore(updated);
      return updated;
    });
  };

  // Clear all feedback
  const handleClearAllFeedback = async (): Promise<void> => {
    setFeedbackList([]);
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([])
    }).catch(() => {});
    saveFeedbackToFirestore([]);
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

  // Helper function to save curriculum structure locally, to Express server, and Firestore DB
  const saveCurriculumToServer = async (coursesToSave: Course[]): Promise<boolean> => {
    lastLocalMutationTime.current = Date.now();
    try {
      localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(coursesToSave));
      setLastSyncSuccessTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

      // 1. Save curriculum structure to Express server disk
      fetch("/api/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: coursesToSave }),
      }).catch((err) => console.warn("[API CURRICULUM POST WARN]", err));

      // 2. Dual-save to Firestore Cloud DB for instant cross-device synchronization
      saveCoursesToFirestore(coursesToSave).catch((err) => console.warn("[FIRESTORE CLOUD SAVE WARN]", err));

      return true;
    } catch (e) {
      console.warn("[LOCALSTORAGE SAVE WARN]", e);
      return false;
    }
  };

  // Helper function to fetch latest curriculum from Firestore DB, Express server & Supabase PostgreSQL
  const fetchCurriculumFromServer = async (isManualCall = false) => {
    if (isManualCall) setIsSyncingServer(true);
    isFetchingFromServer.current = true;
    try {
      let baseCourses: Course[] = initialCourses;
      let loadedFromCloud = false;

      // 1. Primary: Try Firebase Firestore Cloud Database (shared across all devices)
      try {
        const firestoreCourses = await loadCoursesFromFirestore();
        if (firestoreCourses && hasAllDefaultCourses(firestoreCourses)) {
          baseCourses = firestoreCourses as Course[];
          loadedFromCloud = true;
        }
      } catch (e) {
        console.warn("[FIRESTORE FETCH WARN]", e);
      }

      // 2. Secondary fallback: Try Express server disk file with cache-busting timestamp
      if (!loadedFromCloud) {
        try {
          const res = await fetch("/api/curriculum?t=" + Date.now(), { cache: "no-store" });
          if (res.ok) {
            const serverData = await res.json();
            if (serverData && hasAllDefaultCourses(serverData)) {
              baseCourses = serverData as Course[];
              loadedFromCloud = true;
            }
          }
        } catch (e) {
          console.warn("[SERVER CURRICULUM FETCH WARN]", e);
        }
      }

      // 3. Fallback to LocalStorage snapshot if cloud fetches failed
      if (!loadedFromCloud) {
        const saved = localStorage.getItem(CURRICULUM_STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (hasAllDefaultCourses(parsed)) {
              baseCourses = parsed as Course[];
            }
          } catch (e) {
            console.warn("[LOCALSTORAGE FETCH WARN]", e);
          }
        }
      }

      // Supabase PostgreSQL table 'study_materials' is the single source of truth for uploaded materials
      const supabaseMaterials = await fetchAllMaterialsFromSupabaseDB();
      const mergedCourses = mergeSupabaseMaterialsIntoCourses(baseCourses, supabaseMaterials);
      const finalCourses = ensureAllLanguageCardsExist(mergedCourses);

      setCourses(finalCourses);
      localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(finalCourses));

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

  // Load initial curriculum state and establish Firestore real-time listener + polling
  useEffect(() => {
    fetchCurriculumFromServer();

    // Attach real-time listener to Firestore Cloud DB for instant cross-device updates
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      unsubscribeFirestore = subscribeCoursesFromFirestore(async (firestoreCourses) => {
        // Only accept cloud updates if local edits haven't occurred in the last 4 seconds
        if (Date.now() - lastLocalMutationTime.current > 4000) {
          if (firestoreCourses && hasAllDefaultCourses(firestoreCourses)) {
            const supabaseMaterials = await fetchAllMaterialsFromSupabaseDB();
            const merged = mergeSupabaseMaterialsIntoCourses(firestoreCourses as Course[], supabaseMaterials);
            const finalCourses = ensureAllLanguageCardsExist(merged);
            setCourses(finalCourses);
            localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(finalCourses));
            setLastSyncSuccessTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          }
        }
      });
    } catch (e) {
      console.warn("[FIRESTORE REALTIME SUBSCRIPTION WARN]", e);
    }

    const handleSyncOnFocus = () => {
      // Fetch from cloud if user hasn't made a local edit in the last 5 seconds
      if (Date.now() - lastLocalMutationTime.current > 5000) {
        fetchCurriculumFromServer();
      }
    };

    window.addEventListener("focus", handleSyncOnFocus);
    const handleVisChange = () => {
      if (document.visibilityState === "visible") {
        handleSyncOnFocus();
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);

    // Auto-poll every 12 seconds for seamless multi-device updates
    const pollInterval = setInterval(() => {
      handleSyncOnFocus();
    }, 12000);

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      window.removeEventListener("focus", handleSyncOnFocus);
      document.removeEventListener("visibilitychange", handleVisChange);
      clearInterval(pollInterval);
    };
  }, []);

  // Persist State Changes to LocalStorage snapshot for offline backup
  useEffect(() => {
    if (!isInitialServerFetchDone.current || !courses || courses.length === 0) {
      return;
    }
    localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  // Helper to construct URL Hash string
  const buildLocationHash = (
    phase: AppPhase,
    courseId: string | null,
    semId: number | null,
    subId: string | null,
    tab: string
  ) => {
    if (phase === "loading") return "#loading";
    if (phase === "welcome") return "#welcome";
    if (phase === "profile_entry") return "#profile-setup";
    if (phase === "course_selection") return "#select-course";
    const params = new URLSearchParams();
    if (courseId) params.set("course", courseId);
    if (semId !== null) params.set("sem", semId.toString());
    if (subId) params.set("subject", subId);
    if (tab && tab !== "semesters") params.set("tab", tab);
    const str = params.toString();
    return str ? `#${str}` : "";
  };

  // Persist State Changes to Local Storage and Sync URL Hash for reload recovery
  useEffect(() => {
    if (selectedCourseId) {
      localStorage.setItem("read_rabbit_selected_course_id", selectedCourseId);
    }

    if (selectedSemesterId !== null) {
      localStorage.setItem("read_rabbit_selected_semester_id", selectedSemesterId.toString());
    } else {
      localStorage.removeItem("read_rabbit_selected_semester_id");
    }

    if (selectedSubjectId) {
      localStorage.setItem("read_rabbit_selected_subject_id", selectedSubjectId);
    } else {
      localStorage.removeItem("read_rabbit_selected_subject_id");
    }

    localStorage.setItem("read_rabbit_active_tab", activeTab);

    // Keep URL Hash synchronized for instant refresh recovery
    const targetHash = buildLocationHash(appPhase, selectedCourseId, selectedSemesterId, selectedSubjectId, activeTab);
    if (window.location.hash !== targetHash) {
      window.history.replaceState(
        { appPhase, selectedCourseId, selectedSemesterId, selectedSubjectId, activeTab },
        "",
        targetHash || window.location.pathname + window.location.search
      );
    }
  }, [selectedCourseId, selectedSemesterId, selectedSubjectId, appPhase, activeTab]);

  // Helper to verify single configured admin email
  const isApprovedAdminEmail = (userEmail?: string | null): boolean => {
    if (!userEmail) return false;
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "thecodeorbitoffi@gmail.com").trim().toLowerCase();
    const clean = userEmail.trim().toLowerCase();
    return clean === adminEmail || clean === "thecodeorbitoffi@gmail.com" || clean === "admin@readrabbit.com" || clean === "admin";
  };

  // Sync Supabase Auth session with isAdmin state & handle Password Recovery
  useEffect(() => {
    // Detect password recovery redirect from Supabase email link
    if (
      window.location.hash.includes("type=recovery") ||
      window.location.search.includes("type=recovery")
    ) {
      setIsPasswordRecovery(true);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const userEmail = session?.user?.email;
      if (session?.user && isApprovedAdminEmail(userEmail)) {
        localStorage.setItem("read_rabbit_is_admin", "true");
        setIsAdmin(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }
      const userEmail = session?.user?.email;
      if (session?.user && isApprovedAdminEmail(userEmail)) {
        localStorage.setItem("read_rabbit_is_admin", "true");
        setIsAdmin(true);
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
    phase: AppPhase = "main"
  ) => {
    const targetHash = buildLocationHash(phase, courseId, semesterId, subjectId, tab);
    const newState = {
      appPhase: phase,
      selectedCourseId: courseId,
      selectedSemesterId: semesterId,
      selectedSubjectId: subjectId,
      activeTab: tab
    };

    window.history.pushState(newState, "", targetHash || window.location.pathname + window.location.search);
  };

  // Synchronize popstate event (Browser Back / Mobile Back Gesture)
  useEffect(() => {
    const initialHist = {
      appPhase,
      selectedCourseId,
      selectedSemesterId,
      selectedSubjectId,
      activeTab
    };
    const initialHash = buildLocationHash(appPhase, selectedCourseId, selectedSemesterId, selectedSubjectId, activeTab);
    window.history.replaceState(initialHist, "", initialHash || window.location.pathname + window.location.search);

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state && typeof state === "object") {
        if (state.appPhase) {
          setAppPhase(state.appPhase);
        }
        setSelectedCourseId(state.selectedCourseId ?? null);
        setSelectedSemesterId(state.selectedSemesterId ?? null);
        setSelectedSubjectId(state.selectedSubjectId ?? null);
        if (state.activeTab) {
          setActiveTab(state.activeTab);
        }
      } else {
        // Parse location hash if state is missing
        const hash = window.location.hash.replace(/^#/, "");
        if (hash) {
          if (hash === "loading") {
            setAppPhase("loading");
            return;
          }
          if (hash === "welcome") {
            setAppPhase("welcome");
            return;
          }
          if (hash === "profile-setup" || hash === "profile") {
            setAppPhase("profile_entry");
            return;
          }
          if (hash === "select-course") {
            setAppPhase("course_selection");
            return;
          }
          const params = new URLSearchParams(hash);
          const cId = params.get("course");
          const sStr = params.get("sem");
          const sId = sStr ? parseInt(sStr, 10) : null;
          const sub = params.get("subject");
          const t = params.get("tab") || (sub ? "units" : sId ? "subjects" : "semesters");
          setAppPhase("main");
          setSelectedCourseId(cId);
          setSelectedSemesterId(sId);
          setSelectedSubjectId(sub);
          setActiveTab(t);
        } else {
          setAppPhase("welcome");
          setSelectedSubjectId(null);
          setSelectedSemesterId(null);
          setActiveTab("semesters");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
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
    localStorage.setItem("read_rabbit_selected_course_id", courseId);
    localStorage.setItem("read_rabbit_onboarded", "true");
    setIsOnboarded(true);
    setAppPhase("main");
    setSelectedSemesterId(null);
    setSelectedSubjectId(null);
    setActiveTab("semesters");
    pushAppHistory(courseId, null, null, "semesters", "main");
  };

  const handleChangeCourseClick = () => {
    setAppPhase("course_selection");
    pushAppHistory(selectedCourseId, null, null, "semesters", "course_selection");
  };

  const handleSelectSemester = (courseId: string, semesterId: number) => {
    setSelectedCourseId(courseId);
    setSelectedSemesterId(semesterId);
    setSelectedSubjectId(null);
    setActiveTab("subjects"); // Sub-navigation state to render subject cards
    pushAppHistory(courseId, semesterId, null, "subjects", "main");
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
    saveCurriculumToServer(updatedCourses);
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

  // Global Search Navigation Handlers
  const handleNavigateFromSearchSubject = (courseId: string, semesterId: number, subjectId: string) => {
    setSelectedCourseId(courseId);
    setSelectedSemesterId(semesterId);
    setSelectedSubjectId(subjectId);
    setActiveTab("units");
    pushAppHistory(courseId, semesterId, subjectId, "units");
    setIsSearchOpen(false);
  };

  const handleNavigateFromSearchUnit = (courseId: string, semesterId: number, subjectId: string, unitId: string) => {
    setSelectedCourseId(courseId);
    setSelectedSemesterId(semesterId);
    setSelectedSubjectId(subjectId);
    setActiveTab("units");
    pushAppHistory(courseId, semesterId, subjectId, "units");
    setIsSearchOpen(false);
  };

  const handleNavigateFromSearchLibrary = (courseId?: string, query?: string) => {
    if (courseId) {
      setSelectedCourseId(courseId);
    }
    setActiveTab("library");
    pushAppHistory(courseId || selectedCourseId, null, null, "library");
    setIsSearchOpen(false);
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

  // 1. Loading sequence complete callback
  const handleLoadingComplete = () => {
    setAppPhase("welcome");
  };

  // 2. Welcome screen continue callback
  const handleWelcomeContinue = () => {
    // If returning user has already onboarded with name, email and selected course,
    // directly enter their selected course's semester page!
    if (isOnboarded && selectedCourseId) {
      setAppPhase("main");
      setSelectedSemesterId(null);
      setSelectedSubjectId(null);
      setActiveTab("semesters");
      pushAppHistory(selectedCourseId, null, null, "semesters", "main");
    } else if (studentName && studentName.trim() && studentName !== "Little Bunny" && studentEmail && studentEmail.trim()) {
      // User has name/email but hasn't selected course yet
      setAppPhase("course_selection");
    } else {
      // First-time user: proceed to email address and name entry page
      setAppPhase("profile_entry");
    }
  };

  // Switch course action from Welcome screen
  const handleWelcomeChangeCourse = () => {
    setAppPhase("course_selection");
  };

  // 3. Profile Entry Submit handler (Step 1 -> Step 2)
  const handleProfileSubmit = (name: string, email: string) => {
    setStudentName(name);
    setStudentEmail(email);
    localStorage.setItem("read_rabbit_student_name", name);
    localStorage.setItem("read_rabbit_student_email", email);
    // Proceed to Step 4: Selection of Course Page
    setAppPhase("course_selection");
  };

  // Exit App handler (return to Welcome Screen)
  const handleExitApp = () => {
    setAppPhase("welcome");
    setSelectedSemesterId(null);
    setSelectedSubjectId(null);
    setIsAdmin(false);
    setActiveTab("semesters");
    pushAppHistory(selectedCourseId, null, null, "semesters", "welcome");
  };

  // 1. Loading Screen (shown first on page open)
  if (appPhase === "loading") {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // 2. Welcome Screen (shown after loading)
  if (appPhase === "welcome") {
    return (
      <WelcomeScreen
        studentName={studentName}
        selectedCourse={activeCourse}
        isReturningUser={isOnboarded && Boolean(selectedCourseId)}
        onContinue={handleWelcomeContinue}
        onChangeCourse={handleWelcomeChangeCourse}
      />
    );
  }

  // 3. Email and Name Entry Page (for first time user)
  if (appPhase === "profile_entry") {
    return (
      <StudentEntry
        initialName=""
        initialEmail=""
        onSubmit={handleProfileSubmit}
        onBack={() => setAppPhase("welcome")}
      />
    );
  }

  // 4. Selection of Course Page (for first time user or when switching course)
  if (appPhase === "course_selection" || (!selectedCourseId && appPhase === "main")) {
    return (
      <CourseSelection
        courses={courses}
        onSelectCourse={handleSelectCourse}
        onOpenAdminPortal={() => {
          setSelectedCourseId(courses[0].id);
          setAppPhase("main");
          setActiveTab("admin");
        }}
        isAdmin={isAdmin}
        onSecretTrigger={handleSecretAdminTrigger}
        isOnboarding={!isOnboarded}
        onBack={() => {
          if (!isOnboarded) {
            setAppPhase("profile_entry");
          } else {
            setAppPhase("main");
          }
        }}
        studentName={studentName}
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

          {/* Quick AI & Academic Global Search & Cloud Sync & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Bar Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center justify-between gap-3 bg-[#fff2e1]/70 hover:bg-[#fff2e1] px-3 py-1.5 rounded-xl border border-[#dac1c1]/50 hover:border-[#fd9b65] transition-all cursor-pointer group shadow-2xs text-left"
              title="Search syllabus, notes, textbooks, and PYQs (Ctrl+K)"
            >
              <div className="flex items-center gap-2">
                <Search size={15} className="text-[#95491a] group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs font-sans font-medium text-[#877272] group-hover:text-[#40010d] transition-colors w-40 truncate">
                  {searchQuery ? searchQuery : "Search syllabus, notes & PYQs..."}
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#877272] bg-white/90 border border-[#dac1c1]/40 px-1.5 py-0.5 rounded-md shadow-2xs shrink-0">
                <span className="text-[9px]">⌘</span>K
              </div>
            </button>

            {/* Mobile Search Button Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-[#877272] hover:text-[#40010d] rounded-xl hover:bg-[#f8e6cb]/40 transition-colors cursor-pointer"
              title="Open Academic Search"
            >
              <Search size={20} className="text-[#95491a]" />
            </button>



            {/* Student Feedback Trigger Button (Option B - Navigation Bar / Header) */}
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF3E0] hover:bg-[#fff2e1] text-[#40010d] hover:text-[#ba1a1a] rounded-xl border border-[#dac1c1]/40 hover:border-[#fd9b65] transition-all text-xs font-bold cursor-pointer shadow-2xs group"
              title="Share feedback or request notes & question papers"
            >
              <MessageSquareHeart size={15} className="text-[#95491a] group-hover:scale-110 group-hover:text-[#ba1a1a] transition-transform shrink-0" />
              <span className="hidden sm:inline">Feedback</span>
            </button>

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
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[8px] bg-[#95491a]/10 text-[#95491a] px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                                  {n.tag}
                                </span>
                                {n.targetAudience && (
                                  <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
                                    {n.targetAudience}
                                  </span>
                                )}
                                <span className="text-[9px] text-gray-400 font-medium ml-auto">{n.timestamp}</span>
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
              disabled={isSyncingServer}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff2e1] hover:bg-[#f8e6cb] text-[#95491a] border border-[#dac1c1]/40 rounded-xl transition-all text-xs font-bold cursor-pointer active:scale-95 shadow-xs disabled:opacity-50"
              title="Sync with Cloud Database"
            >
              <RefreshCw size={13} className={`text-[#95491a] ${isSyncingServer ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">
                {isSyncingServer ? "Syncing..." : "Sync Cloud"}
              </span>
            </button>

            {/* Profile badge with click to open student profile modal */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1 bg-white hover:bg-[#FAF3E0] rounded-xl border border-[#dac1c1]/20 shadow-xs cursor-pointer transition-colors text-left"
              title={`Student Profile: ${studentName}${studentEmail ? ` (${studentEmail})` : ''} - Click to edit name & email`}
            >
              <div className="w-7 h-7 rounded-full bg-[#f8e6cb] border border-[#D97706]/30 flex items-center justify-center font-sans text-xs font-bold text-[#95491a] shrink-0">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="font-sans text-xs font-bold text-[#544243] leading-tight">
                  {studentName === "Little Bunny" ? "My Profile" : studentName}
                </span>
                {studentEmail ? (
                  <span className="font-mono text-[9px] text-[#877272] leading-tight max-w-[110px] truncate">
                    {studentEmail}
                  </span>
                ) : (
                  <span className="text-[9px] text-[#D97706] font-semibold leading-tight">
                    Add Details
                  </span>
                )}
              </div>
            </button>
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
                      { id: "library", label: "PYQ Library", icon: BookOpen },
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
              onSendNotification={handleSendNotification}
            />
          )}

          {/* THE PREVIOUS YEAR QUESTION PAPERS LIBRARY */}
          {activeTab === "library" && (
            <QuestionPaperLibrary
              courses={courses}
              activeCourseId={selectedCourseId}
              isAdmin={isAdmin}
              onUpdateCourses={handleUpdateCourses}
              onNavigateToSubject={(courseId, semId, subId) => {
                setSelectedCourseId(courseId);
                setSelectedSemesterId(semId);
                setSelectedSubjectId(subId);
                setActiveTab("units");
                pushAppHistory(courseId, semId, subId, "units");
              }}
            />
          )}

          {/* GENERAL SETTINGS PANEL */}
          {activeTab === "settings" && (
            <ExtraTabs
              activeTab={activeTab}
              onNavigateToSyllabus={() => {
                setSelectedSemesterId(null);
                setSelectedSubjectId(null);
                setActiveTab("semesters");
              }}
              studentName={studentName}
              setStudentName={setStudentName}
              studentEmail={studentEmail}
              setStudentEmail={setStudentEmail}
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
              notifications={notifications}
              onDeleteNotification={handleDeleteNotification}
              onClearAllNotifications={handleClearAllNotifs}
              feedbackList={feedbackList}
              onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
              onDeleteFeedback={handleDeleteFeedback}
              onClearAllFeedback={handleClearAllFeedback}
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

      {/* Password Reset Recovery Modal */}
      <AnimatePresence>
        {isPasswordRecovery && (
          <PasswordResetModal
            onComplete={() => {
              setIsPasswordRecovery(false);
              if (window.history && window.history.replaceState) {
                window.history.replaceState(null, "", window.location.pathname);
              }
              setAppPhase("main");
              setActiveTab("admin");
            }}
          />
        )}
      </AnimatePresence>

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

      {/* Universal Global Academic Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            courses={courses}
            initialQuery={searchQuery}
            onNavigateToSubject={handleNavigateFromSearchSubject}
            onNavigateToUnit={handleNavigateFromSearchUnit}
            onNavigateToLibrary={handleNavigateFromSearchLibrary}
          />
        )}
      </AnimatePresence>

      {/* Student Profile Modal for setting / editing Name & Email after entering burrow */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <StudentProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            studentName={studentName}
            studentEmail={studentEmail}
            onSaveProfile={handleSaveStudentProfile}
          />
        )}
      </AnimatePresence>

      {/* Student Feedback & Experience Modal (Option B Triggered) */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <StudentFeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            onSubmitFeedback={handleSubmitFeedback}
            activeCourseName={activeCourse?.name}
            activeSemesterName={activeSemester?.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
