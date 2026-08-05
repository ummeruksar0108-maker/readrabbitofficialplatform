import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Coffee, Network, Settings, Sparkles } from "lucide-react";
import { Subject } from "../types";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubject: (subject: Subject) => void;
}

export default function AddSubjectModal({ isOpen, onClose, onAddSubject }: AddSubjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Core" | "Intermediate" | "Advanced">("Intermediate");
  const [icon, setIcon] = useState("Coffee");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert("Please fill in both the Subject Name and Description fields!");
      return;
    }

    // Assign styles based on icon choice
    let bgColor = "bg-secondary-fixed text-on-secondary-fixed";
    let textColor = "text-secondary";
    if (icon === "Network") {
      bgColor = "bg-tertiary-fixed text-on-tertiary-fixed";
      textColor = "text-on-tertiary-fixed-variant";
    } else if (icon === "Settings") {
      bgColor = "bg-surface-variant text-on-surface-variant";
      textColor = "text-on-surface-variant";
    }

    const newSubject: Subject = {
      id: "subj-" + Date.now(),
      name: name.trim(),
      description: description.trim(),
      modulesCount: 4,
      completedModules: 0,
      difficulty,
      icon,
      bgColor,
      textColor,
      progressPercent: 0,
      units: [
        { id: "u1_" + Date.now(), number: "01", name: "Unit 1: Introduction", description: `Foundational insights of ${name.trim()}`, masteryPercent: 0, status: "Locked" },
        { id: "u2_" + Date.now(), number: "02", name: "Unit 2: Standard Concepts", description: `Core practices and mechanisms of ${name.trim()}`, masteryPercent: 0, status: "Locked" },
        { id: "u3_" + Date.now(), number: "03", name: "Unit 3: Applied Practice", description: `Intermediate problem solving and labs for ${name.trim()}`, masteryPercent: 0, status: "Locked" },
        { id: "u4_" + Date.now(), number: "04", name: "Unit 4: Advanced Systems", description: `Theoretical models and future trends in ${name.trim()}`, masteryPercent: 0, status: "Locked" }
      ],
      materials: []
    };

    onAddSubject(newSubject);
    
    // Reset state
    setName("");
    setDescription("");
    setDifficulty("Intermediate");
    setIcon("Coffee");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#40010d]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#fff8f3] w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-[#dac1c1]/40"
      >
        <div className="flex justify-between items-center border-b border-[#dac1c1]/30 pb-4 mb-5">
          <h3 className="font-sans text-xl font-extrabold text-[#40010d] flex items-center gap-2">
            Create Custom Subject <Sparkles size={18} className="text-[#fd9b65]" />
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#f8e6cb] rounded-full text-[#877272] hover:text-[#40010d] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {/* Subject Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#544243] mb-2">
              Subject Name
            </label>
            <input
              type="text"
              placeholder="e.g., Computer Architecture"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#dac1c1] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#fd9b65]"
              maxLength={40}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#544243] mb-2">
              Description
            </label>
            <textarea
              placeholder="e.g., Fundamentals of digital logic, ALU design, memory pipelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-[#dac1c1] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#fd9b65] h-20 resize-none"
              maxLength={120}
            />
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#544243] mb-2">
              Academic Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Core", "Intermediate", "Advanced"] as const).map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    difficulty === diff
                      ? "bg-[#fd9b65] border-[#fd9b65] text-[#341100]"
                      : "bg-white border-[#dac1c1] text-[#544243] hover:bg-[#f8e6cb]"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Choice */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#544243] mb-2">
              Symbol/Icon
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Coffee", label: "Cozy Coffee", icon: Coffee, bg: "bg-secondary-fixed" },
                { name: "Network", label: "Data Map", icon: Network, bg: "bg-tertiary-fixed" },
                { name: "Settings", label: "Core Mech", icon: Settings, bg: "bg-surface-variant" },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setIcon(item.name)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      icon === item.name
                        ? "border-[#fd9b65] bg-[#fff2e1]/60 text-[#40010d]"
                        : "border-[#dac1c1] bg-white text-[#877272] hover:bg-[#f8e6cb]"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                      <IconComponent size={18} />
                    </div>
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#dac1c1]/30">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 text-xs font-bold text-[#544243] bg-white hover:bg-[#f8e6cb] rounded-xl transition-colors cursor-pointer border border-[#dac1c1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-5 text-xs font-bold text-white bg-[#40010d] hover:bg-[#7a2c35] rounded-xl transition-colors cursor-pointer"
            >
              Add to Burrow
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
