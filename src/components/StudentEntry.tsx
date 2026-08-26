import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { User, Mail, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Shield } from "lucide-react";
import { Logo } from "./Logo";

interface StudentEntryProps {
  initialName?: string;
  initialEmail?: string;
  onSubmit: (name: string, email: string) => void;
  onBack: () => void;
}

export default function StudentEntry({
  initialName = "",
  initialEmail = "",
  onSubmit,
  onBack,
}: StudentEntryProps) {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your name to personalize your study workspace.");
      return;
    }

    if (!cleanEmail) {
      setErrorMessage("Please provide your student email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage("Please provide a valid email address (e.g. name@student.edu).");
      return;
    }

    setErrorMessage("");
    onSubmit(cleanName, cleanEmail);
  };

  const displayName = name.trim() || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div
      id="student-entry-page"
      className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden text-left"
    >
      {/* Ambient background blur blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#D97706]/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#1E1412]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl w-full z-10 space-y-8"
      >
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#735E55] hover:text-[#1E1412] px-3 py-1.5 rounded-xl hover:bg-[#F4ECE1] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-[#D97706]" />
            <span>Back to Welcome</span>
          </button>

          <div className="inline-flex items-center gap-1.5 bg-[#F4ECE1] text-[#95491a] px-3 py-1 rounded-full text-xs font-extrabold border border-[#E2D4C3]">
            <span>Step 1 of 2</span>
            <span className="text-[#735E55] font-normal">• Student Profile</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="inline-block transform hover:scale-105 transition-transform">
              <Logo size="md" className="border border-[#E2D4C3] shadow-xs" />
            </div>
            <h2 className="font-sans text-2xl font-bold text-[#1E1412] tracking-tight">
              Student Registration
            </h2>
            <p className="text-xs sm:text-sm text-[#735E55] max-w-md mx-auto">
              Please enter your name and student email to continue.
            </p>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div>
              <label
                htmlFor="student_name_input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="student_name_input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="Enter your name"
                  autoFocus
                  required
                  className="w-full bg-white pl-10 pr-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1E1412] focus:ring-1 focus:ring-[#1E1412] text-sm text-gray-900 placeholder-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Student Email */}
            <div>
              <label
                htmlFor="student_email_input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="student_email_input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white pl-10 pr-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1E1412] focus:ring-1 focus:ring-[#1E1412] text-sm text-gray-900 placeholder-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="btn_submit_student_profile"
                type="submit"
                className="w-full group inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1E1412] hover:bg-[#2C1E1B] text-white rounded-xl font-sans font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer active:scale-98"
              >
                <span>Continue to Course Selection</span>
                <ArrowRight size={16} className="text-[#FDE68A] transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-[#735E55]">
          You can update your name and email address anytime from the top-bar profile menu.
        </p>
      </motion.div>
    </div>
  );
}
