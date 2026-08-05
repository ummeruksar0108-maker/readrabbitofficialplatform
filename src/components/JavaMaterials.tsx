import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StudyMaterial } from "../types";
import {
  ChevronRight,
  FileText,
  Bookmark,
  Download,
  AlertCircle,
  Code,
  Sparkles,
  Play,
  Terminal,
  X,
  CheckCircle2,
} from "lucide-react";

interface JavaMaterialsProps {
  materials: StudyMaterial[];
  onToggleBookmark: (materialId: string) => void;
  onSelectBreadcrumb: (view: string) => void;
}

export default function JavaMaterials({
  materials,
  onToggleBookmark,
  onSelectBreadcrumb,
}: JavaMaterialsProps) {
  // Download simulation states
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Expanded code state
  const [selectedCodeFile, setSelectedCodeFile] = useState<StudyMaterial | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  // Selected question paper state
  const [selectedQuestionFile, setSelectedQuestionFile] = useState<StudyMaterial | null>(null);

  // Trigger simulated download
  const handleDownload = (material: StudyMaterial) => {
    if (downloadingId) return;
    setDownloadingId(material.id);
    setDownloadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        setDownloadProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setDownloadingId(null);
          alert(`Study companion! 🥕 "${material.name}" has been successfully saved to your device.`);
        }, 400);
      } else {
        setDownloadProgress(progress);
      }
    }, 150);
  };

  // Run/simulate java code
  const handleRunCode = (code: string) => {
    setIsRunningCode(true);
    setConsoleOutput(["Compiling in the Burrow...", "Executing JVM instance..."]);
    
    setTimeout(() => {
      if (code.includes("Barnaby") || code.includes("Bunny")) {
        setConsoleOutput((prev) => [
          ...prev,
          "Output:",
          "Read Rabbit studied inside the Burrow for 1 hours! 🥕",
          "Read Rabbit studied inside the Burrow for 2 hours! 🥕",
          "--------------------------------",
          "Execution completed successfully."
        ]);
      } else {
        setConsoleOutput((prev) => [
          ...prev,
          "Output:",
          "Flopsie ate a carrot. Total consumed in Burrow: 1",
          "Cottontail ate a carrot. Total consumed in Burrow: 2",
          "--------------------------------",
          "Execution completed successfully."
        ]);
      }
      setIsRunningCode(false);
    }, 1000);
  };

  const pdfFiles = materials.filter((m) => m.type === "pdf");
  const questionFiles = materials.filter((m) => m.type === "question");
  const codeFiles = materials.filter((m) => m.type === "code");

  return (
    <div className="flex-1 min-h-screen px-4 md:px-8 py-8 pb-32 text-[#231a0a]">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#544243] text-sm font-sans font-medium mb-8 overflow-x-auto whitespace-nowrap">
        <span onClick={() => onSelectBreadcrumb("home")} className="hover:text-[#95491a] cursor-pointer">Home</span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span onClick={() => onSelectBreadcrumb("semesters")} className="hover:text-[#95491a] cursor-pointer">Semester 1</span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span onClick={() => onSelectBreadcrumb("subjects")} className="hover:text-[#95491a] cursor-pointer">Java</span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span onClick={() => onSelectBreadcrumb("units")} className="hover:text-[#95491a] cursor-pointer">Unit 1</span>
        <ChevronRight size={14} className="text-[#877272]" />
        <span className="text-[#231a0a] font-bold">Materials</span>
      </nav>

      {/* Header section with active dynamic badge */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-[#40010d] mb-2 leading-tight">
            Java Programming
          </h2>
          <p className="text-[#544243] text-sm md:text-base max-w-xl font-sans">
            Curated study materials for Unit 1: Foundations of OOP. Dive deep into classes, objects, and core principles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-[#c8eadd] text-[#012019] px-4 py-1.5 rounded-full text-xs font-bold font-sans flex items-center gap-2 shadow-xs">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            3 New Items Added
          </span>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Notes (PDFs) section */}
        <section className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden border border-[#dac1c1]/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ffebeb] text-[#ba1a1a] rounded-xl flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="font-sans text-xl font-bold text-[#40010d]">Core Note Guides</h3>
            </div>
            <span className="text-xs font-sans text-[#877272] font-semibold">2 documents</span>
          </div>

          <div className="space-y-4">
            {pdfFiles.map((pdf) => (
              <div
                key={pdf.id}
                className="flex items-center justify-between p-4 bg-[#fff8f3]/40 rounded-2xl hover:bg-[#fff2e1]/40 transition-colors border border-[#dac1c1]/20 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-bold text-[#231a0a] group-hover:text-[#95491a] transition-colors">
                      {pdf.name}
                    </p>
                    <p className="text-[#877272] text-[11px] font-sans font-medium">
                      {pdf.size} • {pdf.addedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleBookmark(pdf.id)}
                    className="p-2 hover:bg-[#f8e6cb] rounded-full text-[#877272] hover:text-[#40010d] active:scale-90 transition-all cursor-pointer"
                    title={pdf.isBookmarked ? "Remove Bookmark" : "Bookmark Material"}
                  >
                    <Bookmark size={18} className={pdf.isBookmarked ? "fill-[#fd9b65] text-[#95491a]" : ""} />
                  </button>

                  <button
                    onClick={() => handleDownload(pdf)}
                    className="p-2 hover:bg-[#f8e6cb] rounded-full text-[#877272] hover:text-[#40010d] active:scale-90 transition-all cursor-pointer"
                    title="Download Note"
                  >
                    {downloadingId === pdf.id ? (
                      <span className="w-4 h-4 border-2 border-[#95491a] border-t-transparent rounded-full animate-spin block"></span>
                    ) : (
                      <Download size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Questions Section */}
        <section className="lg:col-span-5 bg-[#fff2e1]/40 rounded-3xl p-6 shadow-xs border border-[#dac1c1]/20 flex flex-col justify-between h-full min-h-[295px]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#feebd0] text-[#95491a] rounded-xl flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-sans text-xl font-bold text-[#40010d]">Exam Questions</h3>
            </div>

            <div className="space-y-3">
              {questionFiles.map((q) => (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuestionFile(q)}
                  className="p-4 bg-white rounded-2xl border-l-4 border-[#fd9b65] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] bg-[#ffdada] text-[#ba1a1a] px-2 py-0.5 rounded font-extrabold tracking-wider uppercase font-sans">
                        {q.tag}
                      </span>
                    </div>
                    <p className="font-sans text-sm font-bold text-[#231a0a]">{q.name}</p>
                    <p className="text-[11px] font-sans text-[#877272] mt-0.5">{q.size}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#877272] opacity-70" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Practicals Interactive Panel */}
        <section className="lg:col-span-12 bg-[#012019] text-[#accec2] rounded-[32px] p-6 shadow-lg relative overflow-hidden">
          {/* Glowing matrix style grid background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="h-full w-full bg-[radial-gradient(#accec2_1px,transparent_1px)] bg-[size:16px_16px]"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#accec2]/20 text-[#accec2] rounded-2xl flex items-center justify-center">
                <Code size={24} />
              </div>
              <div>
                <h3 className="font-sans text-xl font-bold text-white flex items-center gap-2">
                  Interactive Lab Practicals <Sparkles size={16} className="text-[#fd9b65]" />
                </h3>
                <p className="text-[#accec2]/70 text-xs font-sans mt-0.5">
                  Select a lab code file to compile and simulate directly inside the burrow.
                </p>
              </div>
            </div>

            {/* Code Tabs */}
            <div className="flex gap-2">
              {codeFiles.map((cf) => (
                <button
                  key={cf.id}
                  onClick={() => {
                    setSelectedCodeFile(cf);
                    setConsoleOutput([]);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                    selectedCodeFile?.id === cf.id
                      ? "bg-[#accec2] text-[#012019] shadow-sm"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {cf.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Java Compiler Simulation */}
          <div className="mt-6">
            {selectedCodeFile ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Editor code box */}
                <div className="md:col-span-7 bg-black/40 rounded-2xl p-4 border border-white/10">
                  <div className="flex justify-between items-center text-xs text-[#accec2]/60 pb-3 border-b border-white/10 mb-3">
                    <span className="font-mono">Java IDE Workspace</span>
                    <span className="bg-[#accec2]/10 text-[#accec2] px-2 py-0.5 rounded text-[10px]">JDK 21</span>
                  </div>
                  <pre className="font-mono text-xs text-white/90 overflow-x-auto leading-relaxed max-h-[220px] custom-scrollbar select-text whitespace-pre">
                    {selectedCodeFile.details}
                  </pre>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => handleRunCode(selectedCodeFile.details || "")}
                      disabled={isRunningCode}
                      className="px-5 py-2.5 bg-[#accec2] text-[#012019] rounded-xl text-xs font-sans font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Play size={12} fill="#012019" /> {isRunningCode ? "Running..." : "Simulate Code"}
                    </button>
                  </div>
                </div>

                {/* Simulated console output */}
                <div className="md:col-span-5 bg-black/80 rounded-2xl p-4 border border-white/10 flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center gap-2 text-xs text-white/60 font-mono pb-2 border-b border-white/5">
                    <Terminal size={14} className="text-[#accec2]" />
                    <span>Rabbit Burrow Console Output</span>
                  </div>

                  <div className="flex-1 font-mono text-[11px] text-[#accec2] mt-3 space-y-1.5 overflow-y-auto max-h-[160px]">
                    {consoleOutput.length === 0 ? (
                      <p className="text-white/40 italic">Click "Simulate Code" to execute compiler.</p>
                    ) : (
                      consoleOutput.map((out, idx) => (
                        <p key={idx} className={out.startsWith("Error") ? "text-red-400" : ""}>
                          {out}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-white/50 bg-black/20 rounded-2xl border border-white/10">
                <p className="text-sm font-sans font-medium">Please select a Lab Practical file from the tabs above to inspect and compile.</p>
              </div>
            )}
          </div>
        </section>

        {/* Previous Year Papers */}
        <section className="lg:col-span-12 bg-white rounded-3xl p-6 shadow-sm border border-[#dac1c1]/20">
          <h3 className="font-sans text-xl font-bold text-[#40010d] mb-6">Previous Year Exam Blueprints</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Winter 2023", "Summer 2023", "Winter 2022", "Summer 2022"].map((paper) => (
              <button
                key={paper}
                onClick={() => alert(`Study companion! 🥕 Curated Solutions and Question Blueprints for "${paper}" are preparing. Hop back shortly!`)}
                className="flex flex-col items-center justify-center p-6 bg-[#fff8f3]/20 border border-[#dac1c1]/40 rounded-2xl hover:border-[#fd9b65] hover:bg-[#fff2e1]/30 transition-all cursor-pointer group"
              >
                <FileText size={24} className="text-[#95491a] mb-3 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-sans text-sm font-bold text-[#40010d]">{paper}</span>
                <span className="text-[10px] text-[#877272] mt-1 font-sans">Curated Solved PDF</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Interactive Question Detail Modal */}
      <AnimatePresence>
        {selectedQuestionFile && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#fff8f3] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-[#dac1c1]/40"
            >
              <div className="flex justify-between items-start border-b border-[#dac1c1]/30 pb-4 mb-4">
                <div>
                  <span className="text-[10px] bg-[#ffdada] text-[#ba1a1a] px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider font-sans">
                    {selectedQuestionFile.tag}
                  </span>
                  <h3 className="font-sans text-lg font-bold text-[#40010d] mt-2">{selectedQuestionFile.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedQuestionFile(null)}
                  className="p-1.5 hover:bg-[#f8e6cb] rounded-full text-[#877272] hover:text-[#40010d] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="font-sans text-sm text-[#544243] leading-relaxed mb-6">
                {selectedQuestionFile.details}
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-[#dac1c1]/40">
                  <p className="font-sans text-sm font-bold text-[#40010d]">Q1: Explain Class vs Object with an example.</p>
                  <p className="font-sans text-xs text-[#544243] mt-2 leading-relaxed">
                    A Class is a blueprint or template from which objects are created. An Object is an instance of a class. Example: Class 'Rabbit' defines attributes (name, age), while object 'rabbit1' is a specific rabbit with name="Read Rabbit" and age=2.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#dac1c1]/40">
                  <p className="font-sans text-sm font-bold text-[#40010d]">Q2: What are the 4 main pillars of OOP?</p>
                  <p className="font-sans text-xs text-[#544243] mt-2 leading-relaxed">
                    1. Encapsulation (data hiding), 2. Inheritance (reusability), 3. Polymorphism (dynamic behavior), 4. Abstraction (complexity reduction).
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dac1c1]/30 flex justify-end">
                <button
                  onClick={() => setSelectedQuestionFile(null)}
                  className="px-5 py-2.5 bg-[#40010d] text-white rounded-xl text-xs font-sans font-bold hover:bg-[#7a2c35] transition-colors cursor-pointer"
                >
                  Close Blueprint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
