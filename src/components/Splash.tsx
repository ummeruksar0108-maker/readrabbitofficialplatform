import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Award, Zap, ArrowRight, Compass, User, Mail, Sparkles, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";

interface SplashProps {
  onEnter: (name?: string, email?: string) => void;
  savedName?: string;
  savedEmail?: string;
}

export default function Splash({ onEnter, savedName = "", savedEmail = "" }: SplashProps) {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Onboarding Modal State for Name & Email
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [nameInput, setNameInput] = useState(savedName === "Little Bunny" ? "" : savedName);
  const [emailInput, setEmailInput] = useState(savedEmail);
  const [errorMessage, setErrorMessage] = useState("");

  const hasValidProfile = Boolean(
    savedName && 
    savedName.trim() !== "" && 
    savedName !== "Little Bunny" && 
    savedEmail && 
    savedEmail.trim().includes("@")
  );

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      } else {
        current += Math.floor(Math.random() * 15) + 5;
        setLoadingPercent(Math.min(current, 100));
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleMainButtonClick = () => {
    if (hasValidProfile) {
      // User already has permanent name & email saved -> enter directly to semester page
      onEnter(savedName, savedEmail);
    } else {
      // New user or incomplete profile -> prompt for Name and Email
      setNameInput(savedName === "Little Bunny" ? "" : savedName);
      setEmailInput(savedEmail);
      setErrorMessage("");
      setIsOnboardingOpen(true);
    }
  };

  const handleSubmitOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage("Please enter your name to personalize your study profile.");
      return;
    }
    if (cleanName.length < 2) {
      setErrorMessage("Name must be at least 2 characters long.");
      return;
    }
    if (!cleanEmail) {
      setErrorMessage("Please enter your email ID.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage("Please provide a valid email address (e.g. name@student.com).");
      return;
    }

    setErrorMessage("");
    setIsOnboardingOpen(false);
    onEnter(cleanName, cleanEmail);
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-9999 bg-gradient-to-br from-[#1E1412] via-[#2C1E1B] to-[#1E1412] flex flex-col justify-center items-center p-6 select-none text-white">
        <div className="relative mb-8 flex justify-center items-center">
          <div className="absolute -inset-6 bg-[#D97706]/20 rounded-full blur-xl animate-pulse"></div>
          {/* Stylized Rabbit Logo Card */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <Logo size="xl" className="shadow-2xl border-4 border-[#D97706]/30" />
          </div>
        </div>

        <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-[#FEF3C7] tracking-tight text-center">
          READ RABBIT
        </h1>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#D97706] font-semibold mt-3 text-center">
          A Burrow of Knowledge
        </p>

        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-[#2C1E1B] rounded-full mt-12 overflow-hidden shadow-inner border border-[#D97706]/20">
          <div
            className="h-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] transition-all duration-150 ease-out rounded-full shadow-lg"
            style={{ width: `${loadingPercent}%` }}
          ></div>
        </div>
        <span className="text-xs font-mono mt-2 text-[#E2D4C3]">{loadingPercent}%</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Soft atmospheric background blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#D97706]/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#1E1412]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl text-center z-10 flex flex-col items-center px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4ECE1] text-[#2A1C18] mb-6 shadow-xs border border-[#E2D4C3]">
          <Compass size={16} className="text-[#D97706]" />
          <span className="text-xs font-sans font-bold tracking-wider uppercase">Curated Academic Guides</span>
        </div>

        <div className="mb-6 transform hover:scale-105 transition-all duration-300">
          <Logo size="lg" className="shadow-md border-2 border-[#1E1412]/15" />
        </div>

        <h2 className="font-sans text-4xl md:text-6xl font-extrabold text-[#1E1412] mb-4 tracking-tight leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E1412] via-[#2C1E1B] to-[#D97706]">READ RABBIT</span>
        </h2>
        <p className="font-sans text-lg md:text-xl text-[#2A1C18] mb-8 max-w-xl leading-relaxed">
          Knowledge stored by <span className="text-[#1E1412] font-extrabold underline decoration-[#D97706] decoration-2">seniors</span>, discovered by <span className="text-[#D97706] font-extrabold underline decoration-[#1E1412]/30 decoration-2">juniors</span>.
        </p>

        {/* Personalized Welcome Badge if user previously saved profile */}
        {hasValidProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center gap-3 px-4 py-2 bg-[#FAF3E0] border border-[#D97706]/40 rounded-2xl shadow-xs"
          >
            <div className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-sm">
              {savedName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#1E1412] flex items-center gap-1.5">
                Welcome back, {savedName} <Sparkles size={13} className="text-[#D97706]" />
              </p>
              <p className="text-[11px] text-[#735E55] font-mono">{savedEmail}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setNameInput(savedName);
                setEmailInput(savedEmail);
                setIsOnboardingOpen(true);
              }}
              className="text-[10px] font-bold text-[#D97706] hover:text-[#92400E] underline ml-2 cursor-pointer"
            >
              Edit
            </button>
          </motion.div>
        )}

        {/* Enter Burrow Button */}
        <button
          onClick={handleMainButtonClick}
          className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#1E1412] text-white rounded-2xl overflow-hidden shadow-xl hover:bg-[#2C1E1B] transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer font-sans font-bold text-lg border border-[#D97706]/30"
        >
          <div className="absolute inset-0 bg-[#D97706] opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="flex items-center gap-3">
            Enter The Burrow
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-2 duration-200 text-[#FDE68A]" />
          </span>
        </button>

        {/* Feature Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
        >
          {/* Card 1 */}
          <div className="bg-[#F4ECE1] p-6 rounded-2xl border border-[#E2D4C3] hover:border-[#D97706] transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#1E1412] flex items-center justify-center text-[#D97706] mb-4">
              <BookOpen size={20} />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#1E1412] mb-2">The Library</h3>
            <p className="font-sans text-sm text-[#2A1C18] leading-relaxed">
              Over 1,200 curated note sets and code guides from top-tier alumni.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F4ECE1] p-6 rounded-2xl border border-[#E2D4C3] hover:border-[#D97706] transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 flex items-center justify-center text-[#1E1412] mb-4">
              <Award size={20} />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#1E1412] mb-2">Senior Advice</h3>
            <p className="font-sans text-sm text-[#2A1C18] leading-relaxed">
              Real-world advice and blueprints for navigating the trickiest exams.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F4ECE1] p-6 rounded-2xl border border-[#E2D4C3] hover:border-[#D97706] transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309] mb-4">
              <Zap size={20} />
            </div>
            <h3 className="font-sans text-lg font-bold text-[#1E1412] mb-2">Study Sprints</h3>
            <p className="font-sans text-sm text-[#2A1C18] leading-relaxed">
              Interactive sessions to help you master concepts and test your knowledge.
            </p>
          </div>
        </motion.div>

        {/* Creator Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 text-xs font-sans text-[#735E55] tracking-wider"
        >
          Created with ☕ & 🍯 by <span className="font-bold text-[#1E1412]">Umme Ruksar</span> &{" "}
          <a
            href="https://www.instagram.com/_bharatvanshi"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#1E1412] hover:text-[#95491a] transition-colors cursor-pointer"
          >
            Balaji C
          </a>
        </motion.p>
      </motion.div>

      {/* Profile Onboarding Modal for New Users or Profile Edit */}
      <AnimatePresence>
        {isOnboardingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1412]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#FDFBF7] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-[#D97706]/30 relative text-left"
            >
              {/* Header with Rabbit branding */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E2D4C3]">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF3E0] border border-[#D97706]/30 flex items-center justify-center shadow-xs">
                  <Logo size="sm" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-extrabold text-[#1E1412]">
                    Enter The Burrow 🥕
                  </h3>
                  <p className="text-xs text-[#735E55]">
                    Tell us who's studying today to personalize your academic desk
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmitOnboarding} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#1E1412] mb-1.5 uppercase tracking-wider">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#735E55]" />
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter your name"
                      autoFocus
                      required
                      className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-[#E2D4C3] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 text-sm font-medium text-[#1E1412] placeholder-gray-400 transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1E1412] mb-1.5 uppercase tracking-wider">
                    Student Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#735E55]" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-[#E2D4C3] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 text-sm font-medium text-[#1E1412] placeholder-gray-400 transition-all shadow-xs"
                    />
                  </div>
                  <p className="text-[11px] text-[#735E55] mt-1.5">
                    Your name & email are stored permanently on your browser profile for notes, feedback & semesters.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  {hasValidProfile && (
                    <button
                      type="button"
                      onClick={() => setIsOnboardingOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#735E55] hover:bg-[#E2D4C3]/40 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-3 bg-[#1E1412] hover:bg-[#2C1E1B] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D97706]/30"
                  >
                    <span>Hop into Burrow</span>
                    <ArrowRight size={16} className="text-[#FDE68A]" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

