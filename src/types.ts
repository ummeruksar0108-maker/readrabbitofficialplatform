export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  tag: string;
  targetAudience?: string;
}

export interface ImportantQuestion {
  id: string;
  question: string;
  answer?: string;
  importance?: "High" | "Medium" | "Low";
  yearTag?: string;
}

export interface YouTubeReference {
  id: string;
  title: string;
  url: string;
  channelName?: string;
  duration?: string;
}

export type UnitKind = "unit" | "chapter" | "language" | "lab" | "lab-section" | "textbook";

export interface Unit {
  id: string;
  number: string;
  name: string;
  description: string;
  masteryPercent: number;
  status: "Mastered" | "In Progress" | "Locked";
  topics?: string[];
  materials?: StudyMaterial[];
  textbooks?: StudyMaterial[];
  importantQuestions?: ImportantQuestion[];
  youtubeLinks?: YouTubeReference[];
  kind?: UnitKind;
  children?: Unit[];
}

export interface StudyMaterial {
  id: string;
  name: string;
  size: string;
  addedTime: string;
  type: "pdf" | "ppt" | "image" | "doc" | "code" | "question" | "youtube" | "other";
  isBookmarked: boolean;
  tag?: string;
  details?: string;
  cloudPath?: string;
  publicUrl?: string;
  uploadedAt?: string;
  courseId?: string;
  semesterId?: string;
  subjectId?: string;
  unitId?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  modulesCount: number;
  completedModules: number;
  difficulty: "Core" | "Intermediate" | "Advanced";
  icon: string; // lucide icon name
  bgColor: string; // e.g. "bg-secondary-fixed", "bg-tertiary-fixed", etc.
  textColor: string;
  progressPercent: number;
  units: Unit[];
  materials: StudyMaterial[];
  textbooks?: StudyMaterial[];
  contentMode?: "units" | "chapters" | "languages" | "labs";
  isLab?: boolean;
}

export interface Semester {
  id: number;
  name: string;
  description: string;
  status: "Mastered" | "In Progress" | "Locked";
  modulesCount: number;
  completedModules: number;
  progressPercent: number;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  subjects: Subject[];
}

export interface Course {
  id: string; // "general", "aiml", "ds"
  name: string; // "BCA GENERAL", "BCA AI/ML", "BCA DS"
  description: string;
  semesters: Semester[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

