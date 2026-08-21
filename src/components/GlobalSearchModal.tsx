import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Course, Semester, Subject, Unit, StudyMaterial } from "../types";
import {
  Search,
  X,
  BookOpen,
  Layers,
  FileText,
  FileDown,
  GraduationCap,
  HelpCircle,
  Video,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Eye,
  Download,
  CheckCircle,
  FileCheck,
  Tag,
  Clock,
  Maximize2
} from "lucide-react";

export type SearchResultType =
  | "subject"
  | "unit"
  | "material"
  | "textbook"
  | "pyq"
  | "question"
  | "youtube"
  | "lab";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  description?: string;
  courseId: string;
  courseName: string;
  semesterId: number;
  semesterName: string;
  subjectId: string;
  subjectName: string;
  unitId?: string;
  unitName?: string;
  material?: StudyMaterial;
  tags?: string[];
  meta?: string;
  url?: string;
  importance?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  initialQuery?: string;
  onNavigateToSubject: (courseId: string, semesterId: number, subjectId: string) => void;
  onNavigateToUnit?: (courseId: string, semesterId: number, subjectId: string, unitId: string) => void;
  onNavigateToLibrary?: (courseId?: string, query?: string) => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  courses,
  initialQuery = "",
  onNavigateToSubject,
  onNavigateToUnit,
  onNavigateToLibrary,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedCategory("all");
      setSelectedIndex(0);
      setPreviewMaterial(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  // Global Keydown shortcuts: Esc, Arrow keys, Enter
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewMaterial) {
          setPreviewMaterial(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, previewMaterial, onClose]);

  // Flatten and build comprehensive search index across entire curriculum
  const allSearchItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    const processUnit = (
      course: Course,
      sem: Semester,
      sub: Subject,
      unit: Unit,
      parentUnitName?: string
    ) => {
      // 1. Add Unit itself
      const topicsStr = Array.isArray(unit.topics) ? unit.topics.join(", ") : (unit.topics || "");
      items.push({
        id: `unit_${unit.id}`,
        type: "unit",
        title: `${unit.number}: ${unit.name}`,
        subtitle: parentUnitName ? `${parentUnitName} • ${sub.name}` : sub.name,
        description: topicsStr || unit.description || "Syllabus unit and modules.",
        courseId: course.id,
        courseName: course.name,
        semesterId: sem.id,
        semesterName: sem.name,
        subjectId: sub.id,
        subjectName: sub.name,
        unitId: unit.id,
        unitName: unit.name,
        meta: `Unit ${unit.number}`,
        tags: [course.name, sem.name, sub.name, "Unit", "Syllabus"]
      });

      // 2. Unit Materials & Notes
      (unit.materials || []).forEach((mat) => {
        const isPyq =
          mat.name.toLowerCase().includes("question paper") ||
          mat.name.toLowerCase().includes("pyq") ||
          mat.name.toLowerCase().includes("previous year") ||
          (mat.tag && mat.tag.toLowerCase().includes("paper"));

        items.push({
          id: `mat_${mat.id}`,
          type: isPyq ? "pyq" : "material",
          title: mat.name,
          subtitle: `${sub.name} • Unit ${unit.number} (${unit.name})`,
          description: mat.details || `${mat.type || "Document"} study resource for ${unit.name}.`,
          courseId: course.id,
          courseName: course.name,
          semesterId: sem.id,
          semesterName: sem.name,
          subjectId: sub.id,
          subjectName: sub.name,
          unitId: unit.id,
          unitName: unit.name,
          material: mat,
          meta: mat.size || mat.type || "PDF",
          tags: [course.name, sem.name, sub.name, mat.tag || "Note", mat.type || "PDF"]
        });
      });

      // 3. Unit Important Questions
      (unit.importantQuestions || []).forEach((iq, idx) => {
        items.push({
          id: `iq_${unit.id}_${idx}`,
          type: "question",
          title: iq.question,
          subtitle: `${sub.name} • Unit ${unit.number} (${unit.name})`,
          description: iq.answer ? iq.answer.slice(0, 140) + "..." : "Expected exam question with model answers.",
          courseId: course.id,
          courseName: course.name,
          semesterId: sem.id,
          semesterName: sem.name,
          subjectId: sub.id,
          subjectName: sub.name,
          unitId: unit.id,
          unitName: unit.name,
          importance: iq.importance || "High",
          meta: `${iq.importance || "High"} Priority`,
          tags: [course.name, sem.name, sub.name, "Important Question", "Exam"]
        });
      });

      // 4. Unit YouTube References
      (unit.youtubeLinks || []).forEach((yt) => {
        items.push({
          id: `yt_${yt.id}`,
          type: "youtube",
          title: yt.title,
          subtitle: `${sub.name} • Unit ${unit.number} Video Lecture`,
          description: `Video lecture for ${unit.name}`,
          courseId: course.id,
          courseName: course.name,
          semesterId: sem.id,
          semesterName: sem.name,
          subjectId: sub.id,
          subjectName: sub.name,
          unitId: unit.id,
          unitName: unit.name,
          url: yt.url,
          meta: "Video Lecture",
          tags: [course.name, sem.name, sub.name, "Video", "Lecture"]
        });
      });

      // 5. Nested children units (e.g. Kannada/Hindi Chapters)
      (unit.children || []).forEach((child) => {
        processUnit(course, sem, sub, child, unit.name);
      });
    };

    courses.forEach((course) => {
      course.semesters.forEach((sem) => {
        sem.subjects.forEach((sub) => {
          // A. Index Subject
          items.push({
            id: `sub_${sub.id}`,
            type: "subject",
            title: sub.name,
            subtitle: `${course.name} • ${sem.name}`,
            description: sub.description || `${sub.name} curriculum modules and study notes.`,
            courseId: course.id,
            courseName: course.name,
            semesterId: sem.id,
            semesterName: sem.name,
            subjectId: sub.id,
            subjectName: sub.name,
            meta: `${sub.modulesCount || (sub.units || []).length} Modules`,
            tags: [course.name, sem.name, sub.name, sub.difficulty || "Core", sub.isLab ? "Practical Lab" : "Theory"]
          });

          // B. Index Subject Textbooks
          (sub.textbooks || []).forEach((tb) => {
            items.push({
              id: `tb_${tb.id}`,
              type: "textbook",
              title: tb.name,
              subtitle: `${sub.name} • Prescribed Textbook`,
              description: tb.details || `Official prescribed reference textbook for ${sub.name}.`,
              courseId: course.id,
              courseName: course.name,
              semesterId: sem.id,
              semesterName: sem.name,
              subjectId: sub.id,
              subjectName: sub.name,
              material: tb,
              meta: tb.size || "PDF Textbook",
              tags: [course.name, sem.name, sub.name, "Textbook", "Reference"]
            });
          });

          // C. Index Subject-level general materials
          (sub.materials || []).forEach((mat) => {
            const isPyq =
              mat.name.toLowerCase().includes("question paper") ||
              mat.name.toLowerCase().includes("pyq") ||
              mat.name.toLowerCase().includes("previous year") ||
              (mat.tag && mat.tag.toLowerCase().includes("paper"));

            items.push({
              id: `submat_${mat.id}`,
              type: isPyq ? "pyq" : "material",
              title: mat.name,
              subtitle: `${sub.name} • Study Material`,
              description: mat.details || `Comprehensive study file for ${sub.name}.`,
              courseId: course.id,
              courseName: course.name,
              semesterId: sem.id,
              semesterName: sem.name,
              subjectId: sub.id,
              subjectName: sub.name,
              material: mat,
              meta: mat.size || mat.type || "PDF",
              tags: [course.name, sem.name, sub.name, mat.tag || "General", "Material"]
            });
          });

          // D. Index Subject Units
          (sub.units || []).forEach((unit) => {
            processUnit(course, sem, sub, unit);
          });
        });
      });
    });

    return items;
  }, [courses]);

  // Synonyms and acronym normalization mapping
  const normalizeText = (str: string): string => {
    return (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Filter and rank results
  const filteredResults = useMemo<SearchResultItem[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Empty query shows popular / top subjects
      return allSearchItems
        .filter((item) => {
          if (selectedCategory !== "all" && item.type !== selectedCategory) return false;
          return item.type === "subject" || item.type === "textbook" || item.type === "pyq";
        })
        .slice(0, 15);
    }

    const tokens = normalizeText(trimmed).split(" ").filter(Boolean);

    const scored = allSearchItems.map((item) => {
      const titleNorm = normalizeText(item.title);
      const subNorm = normalizeText(item.subtitle || "");
      const descNorm = normalizeText(item.description || "");
      const tagsNorm = normalizeText((item.tags || []).join(" "));
      const combined = `${titleNorm} ${subNorm} ${descNorm} ${tagsNorm}`;

      // Check if all search tokens match
      const allTokensMatch = tokens.every((token) => combined.includes(token));
      if (!allTokensMatch) {
        return { item, score: -1 };
      }

      let score = 0;

      // Exact phrase in title
      if (titleNorm.includes(normalizeText(trimmed))) {
        score += 100;
      }

      // Exact title match
      if (titleNorm === normalizeText(trimmed)) {
        score += 200;
      }

      // Title starts with token
      if (tokens.some((t) => titleNorm.startsWith(t))) {
        score += 50;
      }

      // Token in title
      tokens.forEach((t) => {
        if (titleNorm.includes(t)) score += 30;
        if (subNorm.includes(t)) score += 15;
        if (tagsNorm.includes(t)) score += 10;
        if (descNorm.includes(t)) score += 5;
      });

      // Boost specific types
      if (item.type === "subject") score += 15;
      if (item.type === "pyq") score += 10;
      if (item.type === "textbook") score += 8;

      return { item, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.item)
      .filter((item) => {
        if (selectedCategory === "all") return true;
        if (selectedCategory === "notes" && (item.type === "material" || item.type === "textbook")) return true;
        return item.type === selectedCategory;
      });
  }, [allSearchItems, query, selectedCategory]);

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      subject: 0,
      unit: 0,
      material: 0,
      pyq: 0,
      textbook: 0,
      question: 0,
    };

    const trimmed = query.trim();
    const tokens = trimmed ? normalizeText(trimmed).split(" ").filter(Boolean) : [];

    allSearchItems.forEach((item) => {
      let matches = true;
      if (tokens.length > 0) {
        const combined = `${normalizeText(item.title)} ${normalizeText(item.subtitle || "")} ${normalizeText(item.description || "")} ${normalizeText((item.tags || []).join(" "))}`;
        matches = tokens.every((token) => combined.includes(token));
      }

      if (matches) {
        counts.all = (counts.all || 0) + 1;
        counts[item.type] = (counts[item.type] || 0) + 1;
      }
    });

    return counts;
  }, [allSearchItems, query]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= filteredResults.length) {
      setSelectedIndex(0);
    }
  }, [filteredResults.length, selectedIndex]);

  // Handle action click on an item
  const handleItemClick = (item: SearchResultItem) => {
    if (item.type === "pyq") {
      if (onNavigateToLibrary) {
        onNavigateToLibrary(item.courseId, item.title);
        onClose();
        return;
      }
    }

    if (item.type === "unit" && onNavigateToUnit && item.unitId) {
      onNavigateToUnit(item.courseId, item.semesterId, item.subjectId, item.unitId);
      onClose();
      return;
    }

    // Default: navigate to subject hub
    onNavigateToSubject(item.courseId, item.semesterId, item.subjectId);
    onClose();
  };

  // Direct In-App Preview for PDFs & Textbooks
  const handleDirectPreview = (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();
    if (item.material) {
      setPreviewMaterial(item.material);
    } else {
      handleItemClick(item);
    }
  };

  // Direct Download handler
  const handleDirectDownload = (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();
    const mat = item.material;
    if (!mat) return;

    const fileUrl = mat.publicUrl || (mat as any).fileData;
    if (!fileUrl) return;

    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = mat.name.endsWith(".pdf") ? mat.name : `${mat.name}.pdf`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      window.open(fileUrl, "_blank");
    }
  };

  // Highlight matching characters in text
  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim() || !text) return text;

    const tokens = searchQuery
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    if (tokens.length === 0) return text;

    const regex = new RegExp(`(${tokens.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-[#fd9b65]/30 text-[#95491a] font-bold px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Type-specific icon and style metadata
  const getTypeMeta = (type: SearchResultType) => {
    switch (type) {
      case "subject":
        return {
          icon: BookOpen,
          badge: "Subject",
          bg: "bg-amber-100 text-amber-900 border-amber-200",
          tagBg: "bg-amber-50 text-amber-800"
        };
      case "unit":
        return {
          icon: Layers,
          badge: "Unit / Chapter",
          bg: "bg-orange-100 text-orange-900 border-orange-200",
          tagBg: "bg-orange-50 text-orange-800"
        };
      case "material":
        return {
          icon: FileText,
          badge: "Study Notes",
          bg: "bg-emerald-100 text-emerald-900 border-emerald-200",
          tagBg: "bg-emerald-50 text-emerald-800"
        };
      case "textbook":
        return {
          icon: BookOpen,
          badge: "Textbook PDF",
          bg: "bg-purple-100 text-purple-900 border-purple-200",
          tagBg: "bg-purple-50 text-purple-800"
        };
      case "pyq":
        return {
          icon: GraduationCap,
          badge: "Question Paper",
          bg: "bg-blue-100 text-blue-900 border-blue-200",
          tagBg: "bg-blue-50 text-blue-800"
        };
      case "question":
        return {
          icon: HelpCircle,
          badge: "Exam Question",
          bg: "bg-rose-100 text-rose-900 border-rose-200",
          tagBg: "bg-rose-50 text-rose-800"
        };
      case "youtube":
        return {
          icon: Video,
          badge: "Video Lecture",
          bg: "bg-red-100 text-red-900 border-red-200",
          tagBg: "bg-red-50 text-red-800"
        };
      case "lab":
        return {
          icon: Terminal,
          badge: "Lab Program",
          bg: "bg-teal-100 text-teal-900 border-teal-200",
          tagBg: "bg-teal-50 text-teal-800"
        };
      default:
        return {
          icon: FileText,
          badge: "Resource",
          bg: "bg-slate-100 text-slate-900 border-slate-200",
          tagBg: "bg-slate-50 text-slate-800"
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-3 sm:px-4 bg-[#210c0e]/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#dac1c1]/40 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3 bg-[#fffcf9]">
          <div className="w-10 h-10 rounded-2xl bg-[#fff2e1] text-[#95491a] flex items-center justify-center shrink-0 border border-[#dac1c1]/30">
            <Search size={20} />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search across all subjects, notes, units, textbooks, and PYQs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-base sm:text-lg font-sans font-medium text-[#40010d] placeholder-[#877272] focus:outline-none"
            />
          </div>

          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#877272] bg-gray-100 px-2.5 py-1 rounded-lg font-mono">
            <span>ESC</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-[#40010d] transition-colors cursor-pointer"
            title="Close Search (ESC)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="px-4 py-2.5 border-b border-gray-100 bg-[#faf6f0] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All Results", count: categoryCounts.all },
            { id: "subject", label: "Subjects", count: categoryCounts.subject },
            { id: "unit", label: "Units & Topics", count: categoryCounts.unit },
            { id: "material", label: "Notes & PDFs", count: categoryCounts.material },
            { id: "pyq", label: "PYQs (Papers)", count: categoryCounts.pyq },
            { id: "textbook", label: "Textbooks", count: categoryCounts.textbook },
            { id: "question", label: "Questions", count: categoryCounts.question },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#95491a] text-white shadow-xs"
                    : "bg-white text-[#544243] hover:bg-[#fff2e1] border border-gray-200/80"
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-[#877272]"
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Results List Container */}
        <div ref={listContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-gray-50">
          {filteredResults.length === 0 ? (
            <div className="py-14 px-4 text-center">
              <div className="w-14 h-14 bg-orange-50 text-[#95491a] rounded-3xl flex items-center justify-center mx-auto mb-3">
                <Search size={26} />
              </div>
              <h4 className="font-sans font-bold text-base text-[#40010d] mb-1">
                No matching academic resources found
              </h4>
              <p className="text-xs text-[#877272] max-w-sm mx-auto mb-4">
                We couldn't find any match for <span className="font-bold text-[#40010d]">"{query}"</span> in syllabus units, study files, or question papers.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs text-[#877272] self-center">Try searching for:</span>
                {["Data Structures", "Java", "Discrete Math", "Question Paper", "Unit 1", "Algorithm"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-2.5 py-1 bg-[#fff2e1] hover:bg-[#f8e6cb] text-[#95491a] rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const meta = getTypeMeta(item.type);
              const Icon = meta.icon;
              const hasFile = Boolean(item.material?.publicUrl || item.material?.fileData);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.2) }}
                  onClick={() => handleItemClick(item)}
                  className="p-3 sm:p-3.5 bg-white hover:bg-[#fff9f4] rounded-2xl border border-transparent hover:border-[#dac1c1]/40 transition-all cursor-pointer group flex items-start gap-3.5 relative"
                >
                  {/* Category Type Icon */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border mt-0.5 ${meta.bg}`}>
                    <Icon size={18} />
                  </div>

                  {/* Main Resource Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${meta.tagBg}`}>
                        {meta.badge}
                      </span>

                      {item.courseName && (
                        <span className="text-[11px] font-bold text-[#95491a] flex items-center gap-1">
                          {item.courseName}
                          <ChevronRight size={10} className="text-[#877272]" />
                          <span className="text-[#544243]">{item.semesterName}</span>
                        </span>
                      )}

                      {item.meta && (
                        <span className="text-[10px] text-gray-400 font-medium ml-auto">
                          {item.meta}
                        </span>
                      )}
                    </div>

                    <h4 className="font-sans font-bold text-sm text-[#40010d] group-hover:text-[#95491a] transition-colors leading-snug">
                      {highlightMatch(item.title, query)}
                    </h4>

                    {item.subtitle && (
                      <p className="text-xs font-semibold text-[#877272] mt-0.5 truncate">
                        {highlightMatch(item.subtitle, query)}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-xs text-[#544243] mt-1 line-clamp-2 leading-relaxed">
                        {highlightMatch(item.description, query)}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-center opacity-80 group-hover:opacity-100">
                    {hasFile && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleDirectPreview(e, item)}
                          className="p-2 bg-[#f8e6cb]/60 hover:bg-[#fd9b65] text-[#95491a] hover:text-white rounded-xl transition-all cursor-pointer"
                          title="Preview PDF in-app"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDirectDownload(e, item)}
                          className="p-2 bg-gray-100 hover:bg-emerald-600 text-gray-600 hover:text-white rounded-xl transition-all cursor-pointer"
                          title="Download Document"
                        >
                          <Download size={15} />
                        </button>
                      </>
                    )}

                    <div className="p-2 text-gray-400 group-hover:text-[#95491a] transition-transform group-hover:translate-x-0.5">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer Quick Navigation Hint */}
        <div className="p-3 bg-[#faf6f0] border-t border-gray-100 text-center sm:flex sm:justify-between sm:items-center text-[11px] text-[#877272] px-5">
          <div className="flex items-center gap-3 justify-center">
            <span>
              Found <strong className="text-[#40010d]">{filteredResults.length}</strong> resources
            </span>
            <span>•</span>
            <span className="hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono text-[10px]">Enter</kbd> to open
            </span>
          </div>

          <div className="mt-1 sm:mt-0 font-medium">
            Read Rabbit Smart Academic Index 🥕
          </div>
        </div>
      </motion.div>

      {/* In-App PDF Preview Modal */}
      <AnimatePresence>
        {previewMaterial && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex justify-between items-center text-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-sm sm:text-base text-slate-100 truncate">
                      {previewMaterial.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {previewMaterial.size || "PDF Document"} • In-App Fast Viewer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {previewMaterial.publicUrl && (
                    <a
                      href={previewMaterial.publicUrl}
                      download={previewMaterial.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl text-xs font-bold transition-all"
                    >
                      <Download size={14} />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  )}

                  <button
                    onClick={() => setPreviewMaterial(null)}
                    className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* PDF Preview Frame */}
              <div className="flex-1 bg-slate-950 relative">
                {previewMaterial.publicUrl || (previewMaterial as any).fileData ? (
                  <object
                    data={previewMaterial.publicUrl || (previewMaterial as any).fileData}
                    type="application/pdf"
                    className="w-full h-full border-none"
                  >
                    <iframe
                      src={previewMaterial.publicUrl || (previewMaterial as any).fileData}
                      title={previewMaterial.name}
                      className="w-full h-full border-none"
                    />
                  </object>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    No preview available for this document.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
