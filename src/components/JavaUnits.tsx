import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Unit } from "../types";
import { ChevronRight, Code, Award, Users, BookOpenCheck, Lock, Play, RefreshCw, X } from "lucide-react";
import { Logo } from "./Logo";

interface JavaUnitsProps {
  units: Unit[];
  onSelectUnit: (unitId: string) => void;
  onSelectBreadcrumb: (view: string) => void;
}

// Flashcard data for interactive game
const flashcards = [
  {
    id: 1,
    question: "What is an 'if-else' conditional statement?",
    answer: "It executes one block of code if a specified condition evaluates to true, and optionally executes another block if it evaluates to false.",
  },
  {
    id: 2,
    question: "What is the key difference between a while loop and a do-while loop?",
    answer: "A 'while' loop checks the condition first before running any code. A 'do-while' loop runs the code block at least once before checking the condition.",
  },
  {
    id: 3,
    question: "What does the 'break' statement do inside a loop?",
    answer: "It immediately terminates the loop's execution, jumping the program flow to the first line of code following the loop block.",
  },
  {
    id: 4,
    question: "What does the 'continue' statement do inside a loop?",
    answer: "It skips the rest of the current loop iteration and proceeds immediately to evaluate the condition for the next iteration.",
  },
];

export default function JavaUnits({ units, onSelectUnit, onSelectBreadcrumb }: JavaUnitsProps) {
  const [isPlayingFlashcards, setIsPlayingFlashcards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);

  const startFlashcards = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingFlashcards(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudiedCount(0);
  };

  const handleNextCard = (known: boolean) => {
    if (known) {
      setStudiedCount((prev) => prev + 1);
    }
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        // Complete game
        alert(`You've finished the flashcard sprint! 🥕 You mastered ${studiedCount + (known ? 1 : 0)} out of ${flashcards.length} key control flow concepts.`);
        setIsPlayingFlashcards(false);
      }
    }, 200);
  };

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#231a0a] relative">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#544243] text-sm font-sans font-medium mb-8">
        <span onClick={() => onSelectBreadcrumb("home")} className="hover:text-[#95491a] cursor-pointer">
          Home
        </span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span onClick={() => onSelectBreadcrumb("semesters")} className="hover:text-[#95491a] cursor-pointer">
          Semester 1
        </span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span onClick={() => onSelectBreadcrumb("subjects")} className="hover:text-[#95491a] cursor-pointer">
          Java
        </span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span className="text-[#231a0a] font-bold">Units</span>
      </nav>

      {/* Hero Banner Section */}
      <section className="mb-10 bg-[#feebd0] rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border border-[#dac1c1]/20 shadow-xs">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 border-[16px] border-[#40010d] rounded-full"></div>
          <div className="absolute right-20 top-0 w-32 h-32 border-[8px] border-[#fd9b65] rounded-full"></div>
        </div>

        <div className="relative z-10 flex-1">
          <span className="bg-[#95491a] text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block font-sans">
            Course: Introduction to Java
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#40010d] leading-tight mb-4">
            Pick up where you <br />
            left off, little bunny.
          </h2>
          <p className="text-[#544243] text-sm md:text-base font-sans max-w-md mb-6">
            You've mastered the basics. Now let's burrow deeper into object-oriented concepts.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#ffdada] flex items-center justify-center text-xs font-bold text-[#40010d]">
                R
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#ffdbca] flex items-center justify-center text-xs font-bold text-[#341100]">
                B
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#c8eadd] flex items-center justify-center text-xs font-bold text-[#012019]">
                T
              </div>
            </div>
            <p className="text-[#544243] font-sans text-xs font-bold flex items-center gap-1">
              <Users size={14} className="text-[#95491a]" /> 124 friends studying Java today
            </p>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
          <Logo size="custom" className="w-full h-full rounded-2xl border-2 border-[#40010d]/10" />
        </div>
      </section>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit, index) => {
          const isMastered = unit.status === "Mastered";
          const isInProgress = unit.status === "In Progress";
          const isLocked = unit.status === "Locked";

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => {
                if (!isLocked) {
                  onSelectUnit(unit.id);
                }
              }}
              className={`bg-white rounded-3xl p-6 shadow-sm border-t-4 transition-all relative overflow-hidden flex flex-col justify-between min-h-[280px] ${
                isMastered ? "border-[#6b8a80]" : isInProgress ? "border-[#fd9b65]" : "border-[#877272]/50 opacity-80"
              } ${isLocked ? "cursor-not-allowed" : "cursor-pointer hover:shadow-lg hover:-translate-y-1"}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isMastered ? "bg-[#c8eadd] text-[#012019]" : isInProgress ? "bg-[#ffdbca] text-[#773203]" : "bg-[#f3e0c5] text-[#544243]"
                  }`}
                >
                  {isMastered ? <BookOpenCheck size={24} /> : <Code size={24} />}
                </div>
                <span className="font-mono text-sm font-bold text-[#877272]">{unit.number}</span>
              </div>

              <div>
                <h3 className="font-sans text-xl font-bold text-[#40010d] mb-2">{unit.name}</h3>
                <p className="text-[#544243] text-xs font-sans mb-6 leading-relaxed line-clamp-2">
                  {unit.description}
                </p>
              </div>

              {/* Progress Slider or Study Button */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-wider uppercase font-extrabold text-[#877272] font-sans">
                    Mastery
                  </span>
                  <span className="font-sans text-sm font-extrabold text-[#40010d]">
                    {unit.masteryPercent}%
                  </span>
                </div>
                <div className="w-full bg-[#f8e6cb] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isMastered ? "bg-[#6b8a80]" : "bg-[#fd9b65]"}`}
                    style={{ width: `${unit.masteryPercent}%` }}
                  ></div>
                </div>

                {isMastered && (
                  <div className="flex items-center gap-1.5 text-[#6b8a80] text-xs font-bold font-sans">
                    <Award size={14} className="fill-[#c8eadd]" /> Topic Mastered
                  </div>
                )}

                {isInProgress && (
                  <button
                    onClick={startFlashcards}
                    className="w-full py-2.5 bg-[#95491a] hover:bg-[#753101] text-white text-xs font-bold font-sans rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Play size={12} fill="white" /> Resume Session
                  </button>
                )}

                {isLocked && (
                  <div className="flex items-center gap-1.5 text-[#877272] text-xs font-semibold font-sans opacity-75">
                    <Lock size={12} /> Complete preceding topics to unlock
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Flashcard Modal Player */}
      <AnimatePresence>
        {isPlayingFlashcards && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#fff8f3] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-[#dac1c1]/40 flex flex-col justify-between min-h-[440px]"
            >
              {/* Top info and Exit */}
              <div className="flex justify-between items-center pb-4 border-b border-[#dac1c1]/30">
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] font-bold text-[#95491a] uppercase tracking-wider">
                    Interactive Flashcard Sprint
                  </span>
                  <span className="text-[#231a0a] text-xs font-medium">
                    Card {currentCardIndex + 1} of {flashcards.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsPlayingFlashcards(false)}
                  className="p-1.5 hover:bg-[#f8e6cb] rounded-full text-[#877272] hover:text-[#40010d] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-1.5 mt-4">
                {flashcards.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i < currentCardIndex
                        ? "bg-[#6b8a80]"
                        : i === currentCardIndex
                        ? "bg-[#fd9b65]"
                        : "bg-[#f8e6cb]"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Flipped Card Area */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="my-8 flex-1 flex items-center justify-center cursor-pointer min-h-[180px] p-4 rounded-2xl border-2 border-dashed border-[#dac1c1] bg-[#fff2e1]/40 hover:bg-[#fff2e1]/60 transition-all text-center relative select-none"
              >
                <div className="absolute bottom-2 right-3 text-[10px] text-[#877272] flex items-center gap-1 font-semibold">
                  <RefreshCw size={10} /> Click to flip
                </div>

                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ opacity: 0, rotateY: 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: -90 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-2 px-4"
                    >
                      <p className="text-sm font-sans font-bold text-[#877272] tracking-wider uppercase">
                        Question
                      </p>
                      <p className="font-sans text-lg font-bold text-[#40010d] md:text-xl">
                        {flashcards[currentCardIndex].question}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ opacity: 0, rotateY: -90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 90 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-2 px-4"
                    >
                      <p className="text-sm font-sans font-bold text-[#6b8a80] tracking-wider uppercase">
                        Answer / Concept
                      </p>
                      <p className="font-sans text-sm md:text-base text-[#231a0a] leading-relaxed">
                        {flashcards[currentCardIndex].answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#dac1c1]/30">
                <button
                  onClick={() => handleNextCard(false)}
                  className="py-3 font-sans font-bold text-xs bg-[#f8e6cb] hover:bg-[#dac1c1]/50 text-[#544243] rounded-xl transition-colors cursor-pointer"
                >
                  Still Reviewing 🥕
                </button>
                <button
                  onClick={() => handleNextCard(true)}
                  className="py-3 font-sans font-bold text-xs bg-[#40010d] hover:bg-[#7a2c35] text-white rounded-xl transition-colors cursor-pointer"
                >
                  Got it! 🎓
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
