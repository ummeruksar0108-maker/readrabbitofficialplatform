import React, { useState, useEffect } from "react";
import { 
  X, 
  Star, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Bug, 
  MessageSquareHeart, 
  User, 
  Mail,
  GraduationCap
} from "lucide-react";
import { StudentFeedback, FeedbackCategory } from "../types";

interface StudentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: Omit<StudentFeedback, "id" | "timestamp" | "status" | "createdAt">) => Promise<boolean>;
  activeCourseName?: string | null;
  activeSemesterName?: string | null;
}

const CATEGORIES: Array<{
  id: FeedbackCategory;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  { id: "experience", label: "Study Experience", icon: Sparkles, description: "How you find using Read Rabbit" },
  { id: "materials", label: "Notes & PYQ Request", icon: BookOpen, description: "Ask for specific subjects or years" },
  { id: "suggestion", label: "Idea & Suggestion", icon: Lightbulb, description: "New features or improvements" },
  { id: "bug", label: "Report an Issue", icon: Bug, description: "Broken link, typo, or preview error" },
  { id: "other", label: "General Feedback", icon: MessageSquareHeart, description: "Anything else on your mind" }
];

const RATING_LABELS: Record<number, { text: string; emoji: string }> = {
  1: { text: "Needs Work", emoji: "😕" },
  2: { text: "Fair", emoji: "😐" },
  3: { text: "Good", emoji: "🙂" },
  4: { text: "Great Experience", emoji: "😊" },
  5: { text: "Loved It! 🥕", emoji: "✨" }
};

export default function StudentFeedbackModal({
  isOpen,
  onClose,
  onSubmitFeedback,
  activeCourseName,
  activeSemesterName
}: StudentFeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<FeedbackCategory>("experience");
  const [message, setMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setErrorMessage("");
      setMessage("");
      // Pre-fill student name & email from permanently saved profile
      const savedN = localStorage.getItem("read_rabbit_student_name");
      const savedE = localStorage.getItem("read_rabbit_student_email");
      if (savedN && savedN !== "Little Bunny") {
        setStudentName(savedN);
      }
      if (savedE) {
        setStudentEmail(savedE);
      }
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage("Please write a few words about your experience or suggestion.");
      return;
    }
    if (message.trim().length < 5) {
      setErrorMessage("Please provide a slightly more detailed message (at least 5 characters).");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const finalName = isAnonymous ? "Anonymous Student" : studentName.trim() || "Student";
      if (!isAnonymous && studentName.trim()) {
        localStorage.setItem("read_rabbit_student_name", studentName.trim());
      }

      const success = await onSubmitFeedback({
        rating,
        category,
        message: message.trim(),
        studentName: finalName,
        studentEmail: isAnonymous ? "" : studentEmail.trim(),
        courseName: activeCourseName || "General Curriculum",
        semesterName: activeSemesterName || ""
      });

      if (success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage("Failed to send feedback. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#dac1c1]/40 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FAF3E0] border-b border-[#dac1c1]/30 flex items-center justify-between gap-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#40010d] text-white flex items-center justify-center shadow-xs shrink-0">
              <MessageSquareHeart size={20} className="text-[#fd9b65]" />
            </div>
            <div>
              <h3 className="font-sans text-base sm:text-lg font-extrabold text-[#40010d]">
                Student Feedback & Experience
              </h3>
              <p className="text-xs text-[#735E55] mt-0.5">
                Delivered directly to the Burrow Administrator
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-500 hover:text-[#40010d] rounded-xl hover:bg-white/80 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        {isSubmitted ? (
          <div className="p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-[#40010d]">
                Thank You for Your Feedback! 🥕✨
              </h4>
              <p className="text-xs sm:text-sm text-[#544243] max-w-md mx-auto leading-relaxed">
                Your message has been delivered to the Burrow Admin Portal. We review student requests regularly to improve notes, previous year papers, and study tools!
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Done & Return to Studies
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-left">
            
            {/* Context Badge */}
            {activeCourseName && (
              <div className="flex items-center gap-2 text-xs font-bold text-[#95491a] bg-[#FAF3E0]/70 px-3 py-1.5 rounded-xl border border-[#dac1c1]/30">
                <GraduationCap size={14} />
                <span>Enrolled Program: {activeCourseName}</span>
                {activeSemesterName && <span>• {activeSemesterName}</span>}
              </div>
            )}

            {/* 1. Rating Stars */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#877272] uppercase tracking-wider">
                1. How is your learning experience on Read Rabbit?
              </label>
              <div className="flex items-center gap-2 sm:gap-3 p-3 bg-[#fff8f3] rounded-2xl border border-[#dac1c1]/40">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        title={`${star} Star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          size={24}
                          className={isFilled ? "fill-amber-400 text-amber-400 drop-shadow-xs" : "text-gray-300"}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="border-l border-[#dac1c1]/40 pl-3">
                  <span className="text-xs font-bold text-[#40010d]">
                    {RATING_LABELS[hoverRating || rating]?.text}{" "}
                    <span className="text-base">{RATING_LABELS[hoverRating || rating]?.emoji}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Category Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#877272] uppercase tracking-wider">
                2. Select Feedback Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? "bg-[#40010d] text-white border-[#40010d] shadow-xs"
                          : "bg-white text-[#544243] border-[#dac1c1]/40 hover:bg-[#fff8f3] hover:border-[#fd9b65]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Icon size={14} className={isSelected ? "text-[#fd9b65]" : "text-[#95491a]"} />
                        <span className="truncate">{cat.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Detailed Feedback Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">
                  3. Your Thoughts & Suggestions <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-[#877272]">{message.length} / 1000</span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                rows={4}
                required
                placeholder={
                  category === "materials"
                    ? "Mention the subject name, unit number, or specific question paper year you'd like added..."
                    : category === "bug"
                    ? "Describe what happened, the page, or the broken link you encountered..."
                    : category === "suggestion"
                    ? "Share your ideas for new study features, themes, or tools..."
                    : "Tell us what you like, how the platform helps your studies, or how we can improve..."
                }
                className="w-full bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:bg-white rounded-2xl p-3.5 text-xs text-[#231a0a] placeholder:text-[#877272]/70 focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* 4. Student Identity (Optional / Anonymous Toggle) */}
            <div className="space-y-2 pt-1 border-t border-[#dac1c1]/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#877272] uppercase tracking-wider">
                  4. Student Contact (Optional)
                </span>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#544243] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-[#40010d] focus:ring-[#fd9b65]"
                  />
                  <span>Submit Anonymously</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3 text-[#877272]" />
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Your Name (e.g. Alex)"
                      className="w-full pl-9 pr-3 py-2 bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:bg-white rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-[#877272]" />
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="Email (optional for replies)"
                      className="w-full pl-9 pr-3 py-2 bg-[#fff8f3]/60 border border-[#dac1c1] focus:border-[#fd9b65] focus:bg-white rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl font-bold border border-rose-100">
                {errorMessage}
              </p>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-[#544243] hover:text-[#231a0a] rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#40010d] hover:bg-[#5a0213] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Delivering...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
