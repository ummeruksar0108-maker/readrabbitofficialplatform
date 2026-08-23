import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Logo } from "./Logo";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Burrowing into Read Rabbit...");

  useEffect(() => {
    const messages = [
      "Burrowing into Read Rabbit...",
      "Gathering senior notes & study blueprints...",
      "Calibrating semester syllabi & PYQ library...",
      "Polishing study materials...",
      "Welcome to the Burrow!"
    ];

    const interval = setInterval(() => {
      setPercent((prev) => {
        const next = prev + Math.floor(Math.random() * 12) + 6;
        if (next >= 100) {
          clearInterval(interval);
          setLoadingMessage(messages[messages.length - 1]);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }

        const msgIndex = Math.min(
          Math.floor((next / 100) * (messages.length - 1)),
          messages.length - 2
        );
        setLoadingMessage(messages[msgIndex]);
        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 z-50 bg-[#1E1412] flex flex-col justify-center items-center p-6 select-none text-white overflow-hidden"
    >
      {/* Soft atmospheric background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#accec2]/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-sm w-full text-center"
      >
        {/* Animated Logo with Halo */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-[#D97706]/30 rounded-3xl blur-xl animate-pulse"></div>
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            <Logo size="xl" className="shadow-2xl border-4 border-[#D97706]/40 bg-[#2C1E1B]" />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="font-sans text-3xl md:text-4xl font-black text-[#FEF3C7] tracking-tight">
          READ RABBIT
        </h1>
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#D97706] font-extrabold mt-2">
          A Burrow of Knowledge
        </p>

        {/* Progress Bar Container */}
        <div className="w-64 sm:w-72 mt-10">
          <div className="w-full h-2 bg-[#2C1E1B] rounded-full overflow-hidden border border-[#D97706]/30 shadow-inner p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#FEF3C7] rounded-full shadow-md transition-all duration-100 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-3 text-xs font-mono">
            <span className="text-[#E2D4C3] font-sans text-xs truncate max-w-[200px]">
              {loadingMessage}
            </span>
            <span className="text-[#FDE68A] font-bold">{percent}%</span>
          </div>
        </div>

        {/* Sub-tag */}
        <p className="text-[10px] font-sans text-[#A8988B] mt-12 tracking-wider">
          Curated Academic Workspace © 2026
        </p>
      </motion.div>
    </div>
  );
}
