import { motion } from "motion/react";
import { Course, Semester } from "../types";
import { BookOpen, Edit3, Lock, ChevronRight, ShieldCheck } from "lucide-react";

interface CurriculumRoadmapProps {
  courses: Course[];
  activeCourseId: string | null;
  onSelectSemester: (courseId: string, semesterId: number) => void;
  onShowPrereqs?: (semesterName: string) => void;
  onUnlockAll?: () => void;
  onOpenAdminPortal?: () => void;
}

export default function CurriculumRoadmap({ courses, activeCourseId, onSelectSemester, onShowPrereqs, onUnlockAll, onOpenAdminPortal }: CurriculumRoadmapProps) {
  // Check if there are any locked semesters across the active course
  const hasLockedSemesters = courses
    .filter(c => c.id === activeCourseId)
    .some(c => c.semesters.some(s => s.status === "Locked"));

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#2A1C18]">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#735E55] text-sm font-sans font-medium mb-8">
        <span className="hover:text-[#1E1412] cursor-pointer" onClick={() => window.location.reload()}>Home</span>
        <ChevronRight size={14} className="text-[#D97706]" />
        <span className="text-[#1E1412] font-bold">Semesters</span>
      </nav>

      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#1E1412] tracking-tight">
            Curriculum Roadmap
          </h2>
          <p className="text-[#2A1C18] text-sm md:text-base max-w-2xl font-sans leading-relaxed">
            We really shouldn't have to tell college students how to use a basic website, right? Pick your course, click a semester, and actually study for once. It's literally dummy-proof.
          </p>
        </div>
        {onUnlockAll && hasLockedSemesters && (
          <button
            onClick={onUnlockAll}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-3 bg-[#10B981] hover:bg-emerald-700 active:bg-emerald-800 text-white font-sans font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            id="btn_unlock_all_semesters"
          >
            <span>🔓</span> Unlock All Semesters
          </button>
        )}
      </header>

      {/* Courses Loop */}
      <div className="space-y-12">
        {courses.filter(course => course.id === activeCourseId).map((course) => {
          const isActive = course.id === activeCourseId;
          return (
            <div key={course.id} className="space-y-6">
              {/* Course Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2D4C3] pb-3">
                <div className="space-y-1">
                  <h3 className="font-sans text-xl font-black text-[#1E1412] tracking-tight flex items-center gap-2.5">
                    {course.name}
                    {isActive && (
                      <span className="bg-[#D97706] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-xs">
                        Active Study Course ☕
                      </span>
                    )}
                  </h3>
                  <p className="text-[#2A1C18] text-xs font-sans leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Semester Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {course.semesters.map((semester, index) => {
                  const isMastered = semester.status === "Mastered";
                  const isInProgress = semester.status === "In Progress";
                  const isLocked = semester.status === "Locked";

                  return (
                    <motion.div
                      key={`${course.id}_${semester.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                      onClick={() => {
                        if (!isLocked) {
                          onSelectSemester(course.id, semester.id);
                        }
                      }}
                      className={`group relative bg-white rounded-2xl p-6 soft-shadow soft-shadow-hover transition-all border-t-4 border-[#D97706] ${
                        isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold font-sans ${
                          isMastered ? "bg-[#10B981]/15 text-[#10B981]" : isInProgress ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#F4ECE1] text-[#735E55]"
                        }`}>
                          {semester.badgeText}
                        </span>

                        {isMastered && <BookOpen size={18} className="text-[#10B981]" />}
                        {isInProgress && <Edit3 size={18} className="text-[#D97706]" />}
                        {isLocked && <Lock size={18} className="text-[#735E55] opacity-60" />}
                      </div>

                      <h4 className={`font-sans text-lg font-bold text-[#1E1412] mb-2 ${isLocked ? "opacity-60" : ""}`}>
                        {semester.name}
                      </h4>
                      <p className={`text-[#2A1C18] text-xs font-sans ${isLocked ? "opacity-50" : ""}`}>
                        {semester.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with small Admin Workspace trigger */}
      <div className="mt-16 pt-8 border-t border-[#E2D4C3] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-[#735E55]">
        <div className="flex flex-col gap-1">
          <span>Read Rabbit Syllabus & Peer-Certified Materials • Study Sprint ☕</span>
          <span className="text-[#D97706] font-medium">
            Created with ☕ & 🍯 by <strong className="text-[#1E1412]">Umme Ruksar</strong>,{" "}
            <a
              href="https://www.instagram.com/_bharatvanshi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E1412] font-bold hover:text-[#95491a] transition-colors cursor-pointer"
            >
              Balaji C
            </a>{" "}
            &{" "}
            <a
              href="https://www.instagram.com/_itz_ganesh_466?igsi=MWo0dzM1dHQzMmxidA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E1412] font-bold hover:text-[#95491a] transition-colors cursor-pointer"
            >
              Ganesh S
            </a>
          </span>
        </div>
        {onOpenAdminPortal && (
          <button
            onClick={onOpenAdminPortal}
            className="flex items-center gap-1.5 bg-[#1E1412]/5 hover:bg-[#1E1412]/10 text-[#1E1412] px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border border-[#1E1412]/15"
          >
            <ShieldCheck size={13} /> Admin Workspace
          </button>
        )}
      </div>
    </div>
  );
}
