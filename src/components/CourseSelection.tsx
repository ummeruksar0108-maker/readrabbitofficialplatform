import { useState } from "react";
import { motion } from "motion/react";
import { Course } from "../types";
import { Brain, Database, BookOpen, ShieldCheck, ArrowLeft, Sparkles, Layers } from "lucide-react";
import { Logo } from "./Logo";

interface CourseSelectionProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onOpenAdminPortal: () => void;
  isAdmin: boolean;
  onSecretTrigger?: () => void;
  isOnboarding?: boolean;
  onBack?: () => void;
  studentName?: string;
}

export default function CourseSelection({
  courses,
  onSelectCourse,
  onOpenAdminPortal,
  isAdmin,
  onSecretTrigger,
  isOnboarding = false,
  onBack,
  studentName,
}: CourseSelectionProps) {
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 5) {
      setLogoClicks(0);
      if (onSecretTrigger) {
        onSecretTrigger();
      }
    } else {
      setLogoClicks(nextClicks);
      // Reset clicks after 3 seconds of inactivity
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  const hasName = Boolean(studentName && studentName.trim() && studentName !== "Little Bunny");

  return (
    <div
      id="course-selection-page"
      className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden text-left"
    >
      {/* Ambient background blur circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#D97706]/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#1E1412]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full text-center z-10 space-y-8">
        {/* Navigation & Step Indicator (if in onboarding or onBack provided) */}
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#735E55] hover:text-[#1E1412] px-3 py-1.5 rounded-xl hover:bg-[#F4ECE1] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} className="text-[#D97706]" />
              <span>{isOnboarding ? "Back to Student Info" : "Back"}</span>
            </button>
          ) : (
            <div></div>
          )}

          {isOnboarding && (
            <div className="inline-flex items-center gap-1.5 bg-[#F4ECE1] text-[#95491a] px-3 py-1 rounded-full text-xs font-extrabold border border-[#E2D4C3]">
              <span>Step 2 of 2</span>
              <span className="text-[#735E55] font-normal">• Specialization Selection</span>
            </div>
          )}
        </div>

        {/* Read Rabbit Logo Header */}
        <div className="flex flex-col items-center space-y-2">
          <div 
            onClick={handleLogoClick}
            className="hover:scale-105 transition-transform duration-300 cursor-pointer"
            title="Read Rabbit Logo"
          >
            <Logo size="lg" className="border-2 border-[#E2D4C3] shadow-md" />
          </div>
          <div>
            <h1 className="font-sans text-2xl md:text-3xl font-extrabold text-[#1E1412] tracking-tight">
              READ RABBIT
            </h1>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#D97706] font-semibold">
              A Burrow of Knowledge
            </p>
          </div>
        </div>

        {/* Course Intro */}
        <div className="space-y-2">
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#1E1412]">
            {hasName ? `${studentName}, Select Your Specialization` : "Select Your Specialization"}
          </h2>
          <p className="text-[#2A1C18] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Choose your undergraduate degree program. We'll automatically load that course's semester roadmap, syllabus modules, notes, and previous year question papers.
          </p>
        </div>

        {/* Course Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {courses.map((course, index) => {
            const isAIML = course.id === "aiml";
            const isDS = course.id === "ds";

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => onSelectCourse(course.id)}
                className="group bg-white rounded-3xl p-6 border-2 border-[#E2D4C3] shadow-sm hover:border-[#D97706] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between relative overflow-hidden"
              >
                {/* Visual Accent Badge */}
                {isAIML && (
                  <span className="absolute top-4 right-4 bg-[#D97706] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Specialization
                  </span>
                )}
                {isDS && (
                  <span className="absolute top-4 right-4 bg-[#6b8a80] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Analytics
                  </span>
                )}

                <div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-[#F4ECE1] text-[#D97706] group-hover:bg-[#1E1412] group-hover:text-[#FEF3C7] transition-colors">
                    {isAIML ? <Brain size={24} /> : isDS ? <Database size={24} /> : <BookOpen size={24} />}
                  </div>

                  <h3 className="font-sans text-xl font-bold text-[#1E1412] group-hover:text-[#D97706] transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-[#2A1C18] text-xs font-sans mt-3 leading-relaxed min-h-[48px]">
                    {course.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-[#735E55]">
                    <Layers size={13} className="text-[#D97706]" />
                    <span>{course.semesters?.length || 6} Semesters Syllabus & PYQs</span>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#E2D4C3] flex items-center justify-between text-[#D97706] font-sans text-xs font-bold group-hover:text-[#1E1412] transition-colors">
                  <span>Explore Semester Roadmap</span>
                  <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info tag with small admin portal option */}
        <div className="pt-6 border-t border-[#E2D4C3] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-[#735E55]">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span>Read Rabbit Academic Portal © 2026. All study resources are peer-certified.</span>
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
          <button
            onClick={onOpenAdminPortal}
            className="flex items-center gap-1.5 bg-[#1E1412]/5 hover:bg-[#1E1412]/10 text-[#1E1412] px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border border-[#1E1412]/15"
          >
            <ShieldCheck size={13} /> Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}
