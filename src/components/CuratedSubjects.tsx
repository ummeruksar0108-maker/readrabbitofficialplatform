import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Subject } from "../types";
import * as LucideIcons from "lucide-react";
import { ChevronRight, Plus, CheckCircle, Trash2, ArrowLeft, Terminal, Folder, Search, X } from "lucide-react";

interface CuratedSubjectsProps {
  subjects: Subject[];
  onSelectSubject: (subjectId: string) => void;
  onAddSubjectClick: () => void;
  onDeleteSubject: (subjectId: string) => void;
  overallProgress: number;
  isAdmin: boolean;
  onBack?: () => void;
  semesterName?: string;
}

export default function CuratedSubjects({
  subjects,
  onSelectSubject,
  onAddSubjectClick,
  onDeleteSubject,
  overallProgress,
  isAdmin,
  onBack,
  semesterName = "Semester",
}: CuratedSubjectsProps) {
  const [viewingPracticalLabs, setViewingPracticalLabs] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const isLabSubject = (subject: Subject) => {
    return (
      subject.isLab ||
      subject.contentMode === "labs" ||
      subject.name.toLowerCase().includes("lab") ||
      subject.id.includes("lab")
    );
  };

  const theorySubjects = useMemo(() => {
    return subjects
      .filter((s) => !isLabSubject(s))
      .filter((s) => {
        if (!localSearch.trim()) return true;
        const q = localSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
      });
  }, [subjects, localSearch]);

  const labSubjects = useMemo(() => {
    return subjects
      .filter((s) => isLabSubject(s))
      .filter((s) => {
        if (!localSearch.trim()) return true;
        const q = localSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
      });
  }, [subjects, localSearch]);

  if (viewingPracticalLabs) {
    return (
      <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#2A1C18]">
        {/* Page Back Action */}
        <button
          onClick={() => setViewingPracticalLabs(false)}
          className="mb-6 flex items-center gap-1.5 text-xs text-[#1E1412] hover:text-[#D97706] font-bold transition-all cursor-pointer bg-[#F4ECE1] hover:bg-[#E2D4C3]/60 px-3.5 py-2 rounded-xl border border-[#E2D4C3] shadow-xs"
        >
          <ArrowLeft size={14} /> Back to Subjects list
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#735E55] text-sm font-sans font-medium mb-8">
          <span onClick={onBack} className="hover:text-[#1E1412] cursor-pointer">Home</span>
          <ChevronRight size={14} className="text-[#D97706]" />
          <span onClick={onBack} className="hover:text-[#1E1412] cursor-pointer">{semesterName}</span>
          <ChevronRight size={14} className="text-[#D97706]" />
          <span onClick={() => setViewingPracticalLabs(false)} className="hover:text-[#1E1412] cursor-pointer">Subjects</span>
          <ChevronRight size={14} className="text-[#D97706]" />
          <span className="text-[#1E1412] font-bold">📁 Practical Labs</span>
        </nav>

        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#1E1412] mb-2">📁 Practical Labs</h2>
            <p className="text-[#2A1C18] text-sm md:text-base max-w-lg mt-1 font-sans">
              Select a practical lab subject to access Manuals, Program Outputs, and Viva Questions for {semesterName}.
            </p>
          </div>

          {/* Quick Search for Labs */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#E2D4C3] shadow-xs max-w-xs w-full">
            <Search size={16} className="text-[#735E55]" />
            <input
              type="text"
              placeholder="Filter practical labs..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-transparent border-none text-xs font-sans focus:outline-none placeholder-[#735E55] w-full"
            />
            {localSearch && (
              <button onClick={() => setLocalSearch("")} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Lab Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labSubjects.map((subject, index) => {
            const IconComponent = (LucideIcons as any)[subject.icon] || Terminal;
            const isDone = subject.completedModules === subject.modulesCount;

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onClick={() => onSelectSubject(subject.id)}
                className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-[#E2D4C3] hover:border-[#D97706] cursor-pointer overflow-hidden flex flex-col justify-between min-h-[260px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center font-bold">
                      <IconComponent size={24} />
                    </div>

                    {isAdmin ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSubject(subject.id);
                        }}
                        className="p-2 text-[#C62828] hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove Subject"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <ChevronRight size={18} className="text-[#735E55] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    )}
                  </div>

                  <h3 className="font-sans text-xl font-bold text-[#1E1412] mb-1 group-hover:text-[#D97706] transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-[#2A1C18] text-xs font-sans mb-6 leading-relaxed line-clamp-2">
                    {subject.description || `Practical laboratory for ${subject.name}.`}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#F4ECE1] text-[#1E1412] rounded-full text-[11px] font-bold font-sans">
                      3 Options
                    </span>
                    <span className="px-3 py-1 bg-[#FEF3C7] text-[#B45309] rounded-full text-[11px] font-bold font-sans">
                      Practical Lab
                    </span>
                  </div>

                  <div className="pt-4 border-t border-[#E2D4C3] flex items-center justify-between">
                    <span className="text-xs font-sans text-[#735E55] font-semibold">
                      Manual • Outputs • Viva
                    </span>
                    {isDone ? (
                      <span className="text-[#10B981] flex items-center gap-1 text-xs font-bold font-sans">
                        <CheckCircle size={14} className="fill-[#10B981]/20" /> Completed
                      </span>
                    ) : (
                      <ChevronRight size={16} className="text-[#D97706]" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#2A1C18]">
      {/* Page Back Action */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-1.5 text-xs text-[#1E1412] hover:text-[#D97706] font-bold transition-all cursor-pointer bg-[#F4ECE1] hover:bg-[#E2D4C3]/60 px-3.5 py-2 rounded-xl border border-[#E2D4C3] shadow-xs"
        >
          <ArrowLeft size={14} /> Back to Semester Roadmap
        </button>
      )}

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#735E55] text-sm font-sans font-medium mb-8">
        <span onClick={onBack} className="hover:text-[#1E1412] cursor-pointer">Home</span>
        <ChevronRight size={14} className="text-[#D97706]" />
        <span onClick={onBack} className="hover:text-[#1E1412] cursor-pointer">{semesterName}</span>
        <ChevronRight size={14} className="text-[#D97706]" />
        <span className="text-[#1E1412] font-bold">Subjects</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#1E1412] mb-2">Curated Subjects</h2>
          <p className="text-[#2A1C18] text-sm md:text-base max-w-lg mt-1 font-sans">
            Select a subject to dive back into your focused study burrow. Your progress is saved automatically.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Quick Filter Search */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-[#E2D4C3] shadow-xs w-full sm:w-64">
            <Search size={16} className="text-[#735E55] shrink-0" />
            <input
              type="text"
              placeholder="Search subjects in semester..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-transparent border-none text-xs font-sans focus:outline-none placeholder-[#735E55] w-full"
            />
            {localSearch && (
              <button onClick={() => setLocalSearch("")} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Overall Semester Progress */}
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-[#E2D4C3] shrink-0">
            <span className="font-sans text-xs font-bold text-[#735E55] tracking-wider uppercase">
              Progress
            </span>
            <div className="w-24 h-2.5 bg-[#F4ECE1] rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#D97706] to-[#1E1412] rounded-full" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <span className="font-sans text-xs font-extrabold text-[#D97706]">{overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theorySubjects.map((subject, index) => {
          const IconComponent = (LucideIcons as any)[subject.icon] || LucideIcons.BookOpen;
          const isDone = subject.completedModules === subject.modulesCount;

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => onSelectSubject(subject.id)}
              className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-[#E2D4C3] hover:border-[#D97706] cursor-pointer overflow-hidden flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4ECE1] text-[#D97706] flex items-center justify-center font-bold">
                    <IconComponent size={24} />
                  </div>
                  
                  {isAdmin ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSubject(subject.id);
                      }}
                      className="p-2 text-[#C62828] hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                      title="Remove Subject"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <ChevronRight size={18} className="text-[#735E55] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  )}
                </div>

                <h3 className="font-sans text-xl font-bold text-[#1E1412] mb-1 group-hover:text-[#D97706] transition-colors">
                  {subject.name}
                </h3>
                <p className="text-[#2A1C18] text-xs font-sans mb-6 leading-relaxed line-clamp-2">
                  {subject.description}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#F4ECE1] text-[#1E1412] rounded-full text-[11px] font-bold font-sans">
                    {subject.modulesCount} Modules
                  </span>
                  <span className="px-3 py-1 bg-[#FEF3C7] text-[#B45309] rounded-full text-[11px] font-bold font-sans">
                    {subject.difficulty}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#E2D4C3] flex items-center justify-between">
                  <span className="text-xs font-sans text-[#735E55] font-semibold">
                    {subject.completedModules}/{subject.modulesCount} Completed
                  </span>
                  {isDone ? (
                    <span className="text-[#10B981] flex items-center gap-1 text-xs font-bold font-sans">
                      <CheckCircle size={14} className="fill-[#10B981]/20" /> Completed
                    </span>
                  ) : (
                    <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 rounded-full border border-white bg-[#E2D4C3]"></div>
                      <div className="w-5 h-5 rounded-full border border-white bg-[#D97706]"></div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* ONE Parent Card for ALL Practical Labs in this semester */}
        {labSubjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: theorySubjects.length * 0.05, duration: 0.4 }}
            onClick={() => setViewingPracticalLabs(true)}
            className="group relative bg-gradient-to-br from-white via-[#FFFBF5] to-[#FEF3C7]/40 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 border-2 border-[#D97706]/40 hover:border-[#D97706] cursor-pointer overflow-hidden flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center font-bold shadow-sm">
                  <Folder size={24} />
                </div>
                <ChevronRight size={18} className="text-[#D97706] group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="font-sans text-xl font-extrabold text-[#1E1412] mb-1 group-hover:text-[#D97706] transition-colors flex items-center gap-2">
                📁 Practical Labs
              </h3>
              <p className="text-[#2A1C18] text-xs font-sans mb-6 leading-relaxed">
                Access all practical laboratory subjects, manuals, program outputs, and viva questions for {semesterName}.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#D97706] text-white rounded-full text-[11px] font-extrabold font-sans">
                  {labSubjects.length} Lab Subjects
                </span>
                <span className="px-3 py-1 bg-[#FEF3C7] text-[#B45309] rounded-full text-[11px] font-bold font-sans">
                  Practical
                </span>
              </div>

              <div className="pt-4 border-t border-[#E2D4C3] flex items-center justify-between">
                <span className="text-xs font-sans text-[#735E55] font-semibold">
                  Manuals • Outputs • Viva Questions
                </span>
                <span className="text-[#D97706] text-xs font-bold font-sans flex items-center gap-1">
                  Open Labs →
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty "Add" Card - only visible to Admins */}
        {isAdmin && (
          <motion.div
            onClick={onAddSubjectClick}
            className="flex flex-col items-center justify-center bg-[#FDFBF7] border-2 border-dashed border-[#E2D4C3] rounded-3xl p-6 group hover:border-[#D97706] hover:bg-[#F4ECE1]/50 transition-all duration-300 cursor-pointer min-h-[260px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#F4ECE1] flex items-center justify-center mb-4 group-hover:bg-[#D97706] group-hover:text-white transition-colors">
              <Plus size={20} className="text-[#1E1412] group-hover:text-white" />
            </div>
            <span className="font-sans text-sm font-bold text-[#2A1C18] group-hover:text-[#1E1412] transition-colors">
              Add Subject
            </span>
            <span className="font-sans text-xs text-[#735E55] mt-1">Expand your curriculum roadmap</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

