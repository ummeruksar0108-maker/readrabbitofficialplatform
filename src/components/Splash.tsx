import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, Award, Zap, ArrowRight, Compass } from "lucide-react";
import { Logo } from "./Logo";

interface SplashProps {
  onEnter: () => void;
}

export default function Splash({ onEnter }: SplashProps) {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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
        <p className="font-sans text-lg md:text-xl text-[#2A1C18] mb-12 max-w-xl leading-relaxed">
          Knowledge stored by <span className="text-[#1E1412] font-extrabold underline decoration-[#D97706] decoration-2">seniors</span>, discovered by <span className="text-[#D97706] font-extrabold underline decoration-[#1E1412]/30 decoration-2">juniors</span>.
        </p>

        {/* Enter Burrow Button */}
        <button
          onClick={onEnter}
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
          Created with ☕ & 🍯 by <span className="font-bold text-[#1E1412]">Umme Ruksar</span> & <span className="font-bold text-[#1E1412]">Balaji C</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
