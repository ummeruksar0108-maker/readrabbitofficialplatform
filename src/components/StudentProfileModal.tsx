import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Mail, Sparkles, Check, GraduationCap } from "lucide-react";
import { Logo } from "./Logo";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentEmail: string;
  onSaveProfile: (name: string, email: string) => void;
}

export default function StudentProfileModal({
  isOpen,
  onClose,
  studentName,
  studentEmail,
  onSaveProfile
}: StudentProfileModalProps) {
  const [nameInput, setNameInput] = useState(studentName === "Little Bunny" ? "" : studentName);
  const [emailInput, setEmailInput] = useState(studentEmail);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNameInput(studentName === "Little Bunny" ? "" : studentName);
      setEmailInput(studentEmail);
      setErrorMessage("");
      setSavedSuccess(false);
    }
  }, [isOpen, studentName, studentEmail]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    const cleanEmail = emailInput.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (cleanEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setErrorMessage("Please provide a valid email address.");
        return;
      }
    }

    setErrorMessage("");
    onSaveProfile(cleanName, cleanEmail);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  const displayName = nameInput.trim() || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1412]/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="bg-[#FDFBF7] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-[#D97706]/30 relative text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#735E55] hover:text-[#1E1412] hover:bg-[#E2D4C3]/40 transition-colors cursor-pointer"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Header with Avatar Preview */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E2D4C3]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FAF3E0] to-[#F4ECE1] border-2 border-[#D97706]/40 flex items-center justify-center shadow-xs text-xl font-black text-[#95491a]">
            {displayInitial}
          </div>
          <div>
            <h3 className="font-sans text-xl font-extrabold text-[#1E1412] flex items-center gap-1.5">
              Student Profile <Sparkles size={16} className="text-[#D97706]" />
            </h3>
            <p className="text-xs text-[#735E55]">
              Personalize your study desk, notes & feedback
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check size={16} className="text-emerald-600" />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#1E1412] mb-1.5 uppercase tracking-wider">
              Student Name <span className="text-red-500">*</span>
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
              Email Address <span className="text-gray-400 font-normal text-[11px]">(optional)</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#735E55]" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-[#E2D4C3] focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 text-sm font-medium text-[#1E1412] placeholder-gray-400 transition-all shadow-xs"
              />
            </div>
            <p className="text-[11px] text-[#735E55] mt-1.5">
              Saved permanently to your browser desk for notes, feedback & study tracking.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2D4C3]/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#735E55] hover:bg-[#E2D4C3]/40 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E1412] hover:bg-[#2C1E1B] text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-[#D97706]/30"
            >
              <Check size={14} className="text-[#FDE68A]" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
