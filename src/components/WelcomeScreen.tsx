import { motion } from "motion/react";
import { BookOpen, Award, Zap, ArrowRight, Compass, Sparkles, UserCheck, RefreshCw } from "lucide-react";
import { Logo } from "./Logo";
import { Course } from "../types";

interface WelcomeScreenProps {
  studentName?: string;
  selectedCourse?: Course | null;
  isReturningUser: boolean;
  onContinue: () => void;
  onChangeCourse?: () => void;
}

export default function WelcomeScreen({
  studentName,
  selectedCourse,
  isReturningUser,
  onContinue,
  onChangeCourse,
}: WelcomeScreenProps) {
  const hasValidProfile = Boolean(studentName && studentName.trim() && studentName !== "Little Bunny");

  return (
    <div
      id="welcome-screen"
      className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 relative overflow-hidden text-left"
    >
      {/* Soft atmospheric background blur blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#D97706]/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#1E1412]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl w-full text-center z-10 flex flex-col items-center px-4"
      >
        {/* Academic Category Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4ECE1] text-[#2A1C18] mb-6 shadow-xs border border-[#E2D4C3]">
          <Compass size={16} className="text-[#D97706]" />
          <span className="text-xs font-sans font-extrabold tracking-wider uppercase">
            Curated Academic Guides
          </span>
        </div>

        {/* Brand Logo */}
        <div className="mb-6 transform hover:scale-105 transition-all duration-300">
          <Logo size="lg" className="shadow-md border-2 border-[#1E1412]/15" />
        </div>

        {/* Personalized Greeting or Standard Welcome */}
        {isReturningUser && hasValidProfile ? (
          <div className="mb-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#95491a] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-[#D97706]/30">
              <UserCheck size={14} />
              <span>Welcome Back, {studentName}! 🥕</span>
            </div>
            <h2 className="font-sans text-4xl md:text-5xl font-extrabold text-[#1E1412] tracking-tight leading-tight">
              Ready for your next study session?
            </h2>
            {selectedCourse && (
              <p className="text-sm font-sans text-[#735E55] font-semibold">
                Your selected course:{" "}
                <span className="text-[#D97706] font-extrabold">{selectedCourse.name}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="font-sans text-4xl md:text-6xl font-extrabold text-[#1E1412] tracking-tight leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E1412] via-[#2C1E1B] to-[#D97706]">READ RABBIT</span>
            </h2>
            <p className="font-sans text-base md:text-lg text-[#2A1C18] mt-3 max-w-xl mx-auto leading-relaxed">
              Knowledge stored by <span className="text-[#1E1412] font-extrabold underline decoration-[#D97706] decoration-2">seniors</span>, discovered by <span className="text-[#D97706] font-extrabold underline decoration-[#1E1412]/30 decoration-2">juniors</span>.
            </p>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <button
            id="btn_welcome_continue"
            onClick={onContinue}
            className="group relative inline-flex items-center justify-center px-10 py-4.5 bg-[#1E1412] text-white rounded-2xl overflow-hidden shadow-xl hover:bg-[#2C1E1B] transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer font-sans font-bold text-base md:text-lg border border-[#D97706]/30"
          >
            <div className="absolute inset-0 bg-[#D97706] opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <span className="flex items-center gap-3">
              {isReturningUser && selectedCourse
                ? `Enter ${selectedCourse.name}`
                : "Enter The Burrow"}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-2 duration-200 text-[#FDE68A]" />
            </span>
          </button>

          {isReturningUser && onChangeCourse && (
            <button
              id="btn_welcome_change_course"
              onClick={onChangeCourse}
              className="inline-flex items-center gap-2 px-5 py-4 bg-white hover:bg-[#F4ECE1] text-[#1E1412] rounded-2xl border border-[#E2D4C3] shadow-sm font-sans font-bold text-sm cursor-pointer transition-all hover:scale-102 active:scale-98"
            >
              <RefreshCw size={15} className="text-[#D97706]" />
              <span>Change Specialization</span>
            </button>
          )}
        </div>

        {/* Feature Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left"
        >
          {/* Card 1 */}
          <div className="bg-[#F4ECE1] p-6 rounded-2xl border border-[#E2D4C3] hover:border-[#D97706] transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#1E1412] flex items-center justify-center text-[#D97706] mb-4">
              <BookOpen size={20} />
            </div>
            <h3 className="font-sans text-base font-bold text-[#1E1412] mb-1.5">The Library</h3>
            <p className="font-sans text-xs text-[#2A1C18] leading-relaxed">
              Curated handwritten note sets and lab codes verified by college toppers.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F4ECE1] p-6 rounded-2xl border border-[#E2D4C3] hover:border-[#D97706] transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 flex items-center justify-center text-[#1E1412] mb-4">
              <Award size={20} />
            </div>
            <h3 className="font-sans text-base font-bold text-[#1E1412] mb-1.5">Senior Advice</h3>
            <p className="font-sans text-xs text-[#2A1C18] leading-relaxed">
              Real-world exam blueprints and chapter insights to ace your university papers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F4ECE1] p-6 rounded-2xl border border-[#E2D4C3] hover:border-[#D97706] transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309] mb-4">
              <Zap size={20} />
            </div>
            <h3 className="font-sans text-base font-bold text-[#1E1412] mb-1.5">Study Sprints</h3>
            <p className="font-sans text-xs text-[#2A1C18] leading-relaxed">
              Structured semester roadmaps and interactive subject hubs to track syllabus progress.
            </p>
          </div>
        </motion.div>

        {/* Creator Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="mt-12 text-xs font-sans text-[#735E55] tracking-wider"
        >
          Created with ☕ & 🍯 by <span className="font-bold text-[#1E1412]">Umme Ruksar</span>,{" "}
          <a
            href="https://www.instagram.com/_bharatvanshi"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#1E1412] hover:text-[#95491a] transition-colors cursor-pointer"
          >
            Balaji C
          </a>{" "}
          &{" "}
          <a
            href="https://www.instagram.com/_itz_ganesh_466?igsi=MWo0dzM1dHQzMmxidA=="
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#1E1412] hover:text-[#95491a] transition-colors cursor-pointer"
          >
            Ganesh S
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
