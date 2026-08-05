import { useState } from "react";
import { Layers, BookOpen, Settings, HelpCircle, LogOut, ShieldCheck, RefreshCw, Sparkles } from "lucide-react";
import { Logo } from "./Logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCourseName: string | null;
  onChangeCourse: () => void;
  isAdmin: boolean;
  onSecretTrigger?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  selectedCourseName,
  onChangeCourse,
  isAdmin,
  onSecretTrigger,
}: SidebarProps) {
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 5) {
      setLogoClicks(0);
      if (onSecretTrigger) {
        onSecretTrigger();
      }
    } else {
      setLogoClicks(nextClicks);
      // Automatically reset click count after 3 seconds of inactivity
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  const navItems = [
    { id: "semesters", label: "My Semesters", icon: Layers },
    { id: "library", label: "The Library", icon: BookOpen },
    ...(isAdmin ? [{ id: "admin", label: "Admin Portal", icon: ShieldCheck, badge: "Active" }] : []),
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen max-h-screen overflow-y-auto py-6 pb-8 border-r border-[#E2D4C3] bg-[#F4ECE1]/90 w-64 fixed left-0 top-0 text-[#2A1C18] justify-between z-40 backdrop-blur-md">
      <div>
        {/* Logo and Course Info */}
        <div className="px-6 mb-8 flex flex-col items-center text-center space-y-3">
          <div 
            onClick={handleLogoClick}
            className="hover:scale-105 transition-transform duration-250 cursor-pointer"
            title="Read Rabbit Logo"
          >
            <Logo size="md" />
          </div>
          <div>
            <h2 className="font-sans text-lg font-extrabold tracking-tight text-[#1E1412]">
              READ RABBIT
            </h2>
            {selectedCourseName ? (
              <span className="text-[10px] bg-[#D97706] text-white px-2.5 py-0.5 rounded-full font-bold inline-block mt-1 shadow-xs">
                {selectedCourseName}
              </span>
            ) : (
              <span className="text-[10px] text-[#735E55] font-sans font-medium opacity-90">
                A Burrow of Knowledge
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-250 cursor-pointer ${
                  isActive
                    ? "bg-[#1E1412] text-white font-bold shadow-md transform translate-x-1 border border-[#D97706]/30"
                    : "text-[#2A1C18] hover:bg-[#E2D4C3]/40 hover:text-[#1E1412]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-[#FEF3C7]" : "text-[#735E55]"} />
                  <span className="text-sm font-sans font-semibold">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-[#D97706] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Course Switcher Button */}
          {selectedCourseName && (
            <button
              onClick={onChangeCourse}
              className="w-[calc(100%-8px)] mx-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[#1E1412] hover:bg-[#E2D4C3]/50 transition-all cursor-pointer border border-dashed border-[#E2D4C3] mt-4 text-left"
            >
              <RefreshCw size={18} className="text-[#D97706]" />
              <span className="text-sm font-sans font-bold">Switch Course</span>
            </button>
          )}
        </nav>
      </div>

      <div className="px-2 space-y-1">
        <button
          onClick={() => setActiveTab("help")}
          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
            activeTab === "help"
              ? "bg-[#D97706]/20 text-[#1E1412] font-semibold"
              : "text-[#2A1C18] hover:bg-[#E2D4C3]/40"
          }`}
        >
          <HelpCircle size={18} className="text-[#735E55]" />
          <span className="text-sm font-sans">Help</span>
        </button>

        <button
          onClick={() => setActiveTab("logout")}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[#C62828] hover:bg-red-50 transition-all cursor-pointer"
        >
          <LogOut size={18} className="text-[#C62828]" />
          <span className="text-sm font-sans">Logout</span>
        </button>
      </div>
    </aside>
  );
}
