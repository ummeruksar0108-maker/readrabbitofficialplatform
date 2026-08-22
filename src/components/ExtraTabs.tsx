import React, { useState } from "react";
import { StudyMaterial } from "../types";
import { Book, Bookmark, Settings, Check, User, Mail, Target, Compass, Sparkles, Sliders, Palette } from "lucide-react";

// Types for ExtraTabs
interface ExtraTabsProps {
  activeTab: string;
  onNavigateToSyllabus: () => void;
  studentName: string;
  setStudentName: (name: string) => void;
  studentEmail?: string;
  setStudentEmail?: (email: string) => void;
  bgColor?: string;
  setBgColor?: (color: string) => void;
}

export const bgPresets = [
  { id: "amber", name: "Honey Amber", hex: "#FAF3E0", desc: "Cozy golden glow (Default)" },
  { id: "honey", name: "Honey Cream", hex: "#FEF3C7", desc: "Warm bright honey" },
  { id: "ivory", name: "Ivory Cream", hex: "#FDFBF7", desc: "Light paper tone" },
  { id: "parchment", name: "Warm Parchment", hex: "#F4ECE1", desc: "Rich warm sand" },
  { id: "sage", name: "Sage Matcha", hex: "#F2F5F1", desc: "Calm green tea" },
  { id: "blush", name: "Blush Velvet", hex: "#FAF0F2", desc: "Subtle soft rose" },
  { id: "sky", name: "Misty Slate", hex: "#F0F4F8", desc: "Clean slate blue" },
  { id: "midnight", name: "Midnight Espresso", hex: "#120C0B", desc: "Dark coffee roast" },
  { id: "obsidian", name: "Velvet Obsidian", hex: "#0B0B0C", desc: "Deep dark luxury" },
];

export default function ExtraTabs({
  activeTab,
  onNavigateToSyllabus,
  studentName,
  setStudentName,
  studentEmail = "",
  setStudentEmail,
  bgColor = "#FAF3E0",
  setBgColor,
}: ExtraTabsProps) {
  const [localName, setLocalName] = useState(studentName);
  const [localEmail, setLocalEmail] = useState(studentEmail);
  const [studyGoal, setStudyGoal] = useState("2 Hours");
  const [activeMood, setActiveMood] = useState("Focus Burrow");
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentName(localName);
    if (setStudentEmail) {
      setStudentEmail(localEmail);
    }
    localStorage.setItem("read_rabbit_student_name", localName);
    localStorage.setItem("read_rabbit_student_email", localEmail);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  if (activeTab === "library") {
    return (
      <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#231a0a] font-sans">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[#40010d] mb-2">The Burrow Library</h2>
          <p className="text-[#544243] text-sm">
            Discover solved exam papers, handwritten reference notes, and textbook compilations archived by previous batches.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border border-[#dac1c1]/20 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-orange-100 text-[#95491a] rounded-xl flex items-center justify-center mb-4">
                <Book size={20} />
              </div>
              <h3 className="font-bold text-[#40010d] text-lg mb-1">Discrete Structures</h3>
              <p className="text-xs text-[#877272] mb-3">4 Chapters • Handwritten Revision Notes</p>
              <p className="text-xs text-[#544243] leading-relaxed">
                Foundations of truth tables, set operators, permutations, and graph theories. Perfect prep for midterms!
              </p>
            </div>
            <button
              onClick={onNavigateToSyllabus}
              className="mt-6 w-full py-2.5 bg-[#f8e6cb] hover:bg-[#fd9b65] hover:text-[#341100] text-[#95491a] text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              Open Active Course Unit
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border border-[#dac1c1]/20 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-4">
                <Compass size={20} />
              </div>
              <h3 className="font-bold text-[#40010d] text-lg mb-1">Java OOPs Foundations</h3>
              <p className="text-xs text-[#877272] mb-3">8 Chapters • Alumni Blueprints</p>
              <p className="text-xs text-[#544243] leading-relaxed">
                Inheritance, packages, custom event handling, interfaces, and exception hierarchies.
              </p>
            </div>
            <button
              onClick={onNavigateToSyllabus}
              className="mt-6 w-full py-2.5 bg-[#f8e6cb] hover:bg-[#fd9b65] hover:text-[#341100] text-[#95491a] text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              Open Active Course Unit
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border border-[#dac1c1]/20 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-[#40010d] text-lg mb-1">Alumni Interview Blueprints</h3>
              <p className="text-xs text-[#877272] mb-3">24 Pages • Top-tier Advice</p>
              <p className="text-xs text-[#544243] leading-relaxed">
                Core database design, algorithms, and micro-processor assembly tips compiled by senior engineers.
              </p>
            </div>
            <button
              onClick={() => alert("Interview blueprints are generating! Check back soon for updated career guides.")}
              className="mt-6 w-full py-2.5 bg-[#40010d] hover:bg-[#7a2c35] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
            >
              Browse Blueprint
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "settings") {
    return (
      <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#231a0a] font-sans max-w-2xl">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-[#40010d] mb-2">Burrow Settings</h2>
          <p className="text-[#544243] text-sm">
            Customize your studying metadata, avatar preferences, and learning objectives.
          </p>
        </header>

        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 shadow-sm border border-[#dac1c1]/20 space-y-6">
          {/* Student Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User size={18} className="text-[#95491a]" />
              <h3 className="font-bold text-[#40010d] text-sm tracking-wider uppercase">Burrow Profile</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#544243] mb-1.5 uppercase">STUDENT NAME</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#877272]" />
                  <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-[#fff8f3]/50 pl-10 pr-4 py-3 rounded-xl border border-[#dac1c1] focus:outline-none focus:border-[#fd9b65] text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#544243] mb-1.5 uppercase">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#877272]" />
                  <input
                    type="email"
                    value={localEmail}
                    onChange={(e) => setLocalEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-[#fff8f3]/50 pl-10 pr-4 py-3 rounded-xl border border-[#dac1c1] focus:outline-none focus:border-[#fd9b65] text-sm font-medium"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#877272]">
              Permanently saved to your device. Used to personalize your study notes, feedback submissions, and senior question paper requests.
            </p>
          </div>

          {/* Goals */}
          <div className="space-y-4 pt-6 border-t border-[#dac1c1]/30">
            <div className="flex items-center gap-3">
              <Target size={18} className="text-[#95491a]" />
              <h3 className="font-bold text-[#40010d] text-sm tracking-wider uppercase">Academic Targets</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#544243] mb-2">DAILY STUDY GOAL</label>
              <div className="grid grid-cols-4 gap-2">
                {["30 Min", "1 Hour", "2 Hours", "4 Hours"].map((goal) => (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => setStudyGoal(goal)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      studyGoal === goal
                        ? "bg-[#fd9b65] border-[#fd9b65] text-[#341100]"
                        : "bg-[#fff8f3]/20 border-[#dac1c1] text-[#544243] hover:bg-[#f8e6cb]"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Focus Modes */}
          <div className="space-y-4 pt-6 border-t border-[#dac1c1]/30">
            <div className="flex items-center gap-3">
              <Sliders size={18} className="text-[#95491a]" />
              <h3 className="font-bold text-[#40010d] text-sm tracking-wider uppercase">Focus Modes</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Focus Burrow", desc: "Classic offline atmosphere with subtle lighting" },
                { name: "Pomodoro Sprint", desc: "Short 25 minute bursts of hyper-studying" },
              ].map((mood) => (
                <button
                  type="button"
                  key={mood.name}
                  onClick={() => setActiveMood(mood.name)}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    activeMood === mood.name
                      ? "border-[#fd9b65] bg-[#fff2e1]/40"
                      : "border-[#dac1c1] bg-white text-[#544243]"
                  }`}
                >
                  <h4 className="font-bold text-xs text-[#40010d]">{mood.name}</h4>
                  <p className="text-[10px] text-[#877272] mt-1 leading-snug">{mood.desc}</p>
                </button>
              ))}
            </div>
          </div>



          <div className="pt-6 border-t border-[#dac1c1]/30 flex justify-end">
            <button
              type="submit"
              className="py-3 px-6 bg-[#40010d] hover:bg-[#7a2c35] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <Check size={14} /> Profile Saved!
                </>
              ) : (
                "Save Preferences"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}
