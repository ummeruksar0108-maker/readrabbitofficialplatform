import React, { useState, useEffect } from "react";
import { 
  subscribeDiagnostics, 
  getDiagnosticsState, 
  FirebaseDiagnostics, 
  loadCoursesFromFirestore,
  saveCoursesToFirestore
} from "../lib/firebase";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Database, 
  HardDrive, 
  Clock, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Terminal,
  ShieldCheck,
  Server,
  FileText
} from "lucide-react";

export default function FirebaseDiagnosticsPanel({ coursesData }: { coursesData?: any[] }) {
  const [diag, setDiag] = useState<FirebaseDiagnostics>(getDiagnosticsState());
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeDiagnostics((updatedDiag) => {
      setDiag(updatedDiag);
    });
    return () => unsubscribe();
  }, []);

  const handleManualTestRead = async () => {
    setIsTesting(true);
    await loadCoursesFromFirestore();
    setIsTesting(false);
  };

  const handleManualTestWrite = async () => {
    if (!coursesData) return;
    setIsTesting(true);
    try {
      await saveCoursesToFirestore(coursesData);
    } catch (e) {}
    setIsTesting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> SUCCESS
          </span>
        );
      case "FIRESTORE_DOC":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
            <FileText className="w-3 h-3 text-blue-600" /> FIRESTORE DOC
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" /> FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
            <Clock className="w-3 h-3 text-gray-500" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      {/* Trigger Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-lg border border-emerald-600/40 text-xs font-medium transition-all hover:scale-105"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              diag.readStatus === "SUCCESS" && diag.writeStatus !== "FAILED" ? "bg-emerald-400" : "bg-rose-400"
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              diag.readStatus === "SUCCESS" && diag.writeStatus !== "FAILED" ? "bg-emerald-500" : "bg-rose-500"
            }`}></span>
          </span>
          <Database className="w-3.5 h-3.5 text-emerald-300" />
          <span>Cloud Diagnostics</span>
          {diag.writeStatus === "SUCCESS" && (
            <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded text-emerald-100 font-mono">
              Synced
            </span>
          )}
        </button>
      )}

      {/* Main Expanded Diagnostics Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] max-h-[85vh] bg-white text-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-900 text-white border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold tracking-wide uppercase text-zinc-100">
                  Firebase Cloud Debugger
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[220px]">
                  {diag.projectId} / {diag.databaseId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleManualTestRead}
                disabled={isTesting}
                title="Refresh Cloud Data"
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin text-emerald-400" : ""}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Diagnostic Metrics Body */}
          <div className="p-3.5 space-y-3 overflow-y-auto text-xs font-mono">
            
            {/* 1. Firestore Read Status */}
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-blue-500" />
                  Firestore Read Status
                </span>
                {getStatusBadge(diag.readStatus)}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-zinc-600">
                <div>Source: <span className="text-zinc-800">{diag.readSource}</span></div>
                <div>Doc: <span className="text-zinc-800 font-bold">{diag.readDocPath}</span></div>
                <div>Last Read: <span className="text-zinc-800">{diag.lastReadTime}</span></div>
                <div>Courses: <span className="text-zinc-800 font-bold">{diag.readCourseCount}</span></div>
              </div>
              {diag.readError && (
                <div className="mt-1.5 p-1.5 bg-rose-500/10 text-rose-600 text-[10px] rounded break-all border border-rose-500/20">
                  ⚠️ Error: {diag.readError}
                </div>
              )}
            </div>

            {/* 2. Firebase Storage Upload Status */}
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                  Firebase Storage Upload
                </span>
                {getStatusBadge(diag.storageStatus)}
              </div>
              {diag.storageUrl ? (
                <div className="mt-1 p-1.5 bg-zinc-100 rounded text-[10px] break-all border border-zinc-200 text-emerald-600">
                  <span className="font-bold text-zinc-500 uppercase block text-[9px]">Exact Download URL / Ref:</span>
                  {diag.storageUrl}
                </div>
              ) : (
                <div className="text-[11px] text-zinc-500 italic">No file upload initiated in this session</div>
              )}
              {diag.storageError && (
                <div className="mt-1.5 p-1.5 bg-amber-500/10 text-amber-600 text-[10px] rounded break-all border border-amber-500/20">
                  ⚠️ Storage Fail Note: {diag.storageError}
                </div>
              )}
            </div>

            {/* 3. Firestore Write / Persistence Status */}
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Firestore Write Status
                </span>
                {getStatusBadge(diag.writeStatus)}
              </div>
              <div className="text-[11px] text-zinc-600">
                Target Doc: <span className="font-bold text-zinc-800">{diag.writeDocPath}</span>
              </div>
              {diag.writeTimestamp && (
                <div className="text-[11px] text-zinc-600 mt-0.5">
                  Updated ISO: <span className="text-emerald-600 font-bold">{diag.writeTimestamp}</span>
                </div>
              )}
              {diag.writeError && (
                <div className="mt-1.5 p-1.5 bg-rose-500/10 text-rose-600 text-[10px] rounded break-all border border-rose-500/20">
                  ❌ Write Error: {diag.writeError}
                </div>
              )}
            </div>

            {/* 4. Live Log Console */}
            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3" /> Event Log Console
                </span>
                <button
                  onClick={handleManualTestWrite}
                  disabled={isTesting}
                  className="text-[10px] text-emerald-600 hover:underline font-normal"
                >
                  Test Write Sync
                </button>
              </div>
              <div className="h-32 overflow-y-auto p-2 bg-zinc-950 text-zinc-300 rounded-xl font-mono text-[10px] space-y-1 border border-zinc-800">
                {diag.logs.length === 0 ? (
                  <div className="text-zinc-600 italic">No events logged yet...</div>
                ) : (
                  diag.logs.map((log) => (
                    <div key={log.id} className="flex gap-1.5 items-start leading-tight">
                      <span className="text-zinc-500 shrink-0">{log.time}</span>
                      <span className={`break-all ${
                        log.level === "success" ? "text-emerald-400 font-semibold" :
                        log.level === "error" ? "text-rose-400 font-semibold" :
                        log.level === "warn" ? "text-amber-400" : "text-zinc-300"
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="p-2.5 bg-zinc-100 border-t border-zinc-200 text-[10px] text-center text-zinc-500">
            Cloud database active across PC, Mobile, and Netlify.
          </div>

        </div>
      )}
    </div>
  );
}
