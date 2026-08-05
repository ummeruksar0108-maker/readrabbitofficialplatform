import React, { useState } from "react";
import { LOGO_DATA_URL } from "../assets/logoDataUrl";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "custom";
  alt?: string;
  vectorOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  alt = "Read Rabbit Logo",
  vectorOnly = false,
}) => {
  const [imgError, setImgError] = useState(false);

  let sizeClasses = "w-12 h-12 rounded-xl";

  if (size === "sm") {
    sizeClasses = "w-8 h-8 rounded-lg";
  } else if (size === "md") {
    sizeClasses = "w-16 h-16 rounded-xl";
  } else if (size === "lg") {
    sizeClasses = "w-28 h-28 rounded-2xl";
  } else if (size === "xl") {
    sizeClasses = "w-40 h-40 rounded-2xl";
  } else if (size === "custom") {
    sizeClasses = "";
  }

  const renderSvgVector = () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDFBF7" />
          <stop offset="1" stopColor="#F4ECE1" />
        </linearGradient>
        <linearGradient id="earGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#D97706" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1E1412" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background Badge */}
      <rect width="100" height="100" rx="20" fill="url(#bgGrad)" />
      
      {/* Outer Border */}
      <rect x="1" y="1" width="98" height="98" rx="19" stroke="#1E1412" strokeWidth="2" strokeOpacity="0.15" fill="none" />

      {/* Left Rabbit Ear */}
      <g transform="rotate(-12 38 30)">
        <path d="M 32,38 C 26,20 28,6 38,6 C 48,6 48,20 44,38 Z" fill="#FDFBF7" stroke="#1E1412" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 34,35 C 30,22 32,10 38,10 C 44,10 44,22 42,35 Z" fill="#FDE68A" />
      </g>

      {/* Right Rabbit Ear */}
      <g transform="rotate(12 62 30)">
        <path d="M 56,38 C 52,20 52,6 62,6 C 72,6 74,20 68,38 Z" fill="#FDFBF7" stroke="#1E1412" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 58,35 C 56,22 56,10 62,10 C 68,10 70,22 66,35 Z" fill="#FDE68A" />
      </g>

      {/* Rabbit Head */}
      <ellipse cx="50" cy="46" rx="26" ry="22" fill="#FDFBF7" stroke="#1E1412" strokeWidth="2.5" />

      {/* Rosy Cheeks */}
      <circle cx="33" cy="51" r="5" fill="#D97706" fillOpacity="0.35" />
      <circle cx="67" cy="51" r="5" fill="#D97706" fillOpacity="0.35" />

      {/* Eyes */}
      <circle cx="38" cy="44" r="3.5" fill="#1E1412" />
      <circle cx="39" cy="42.5" r="1.2" fill="#FFFFFF" />
      <circle cx="62" cy="44" r="3.5" fill="#1E1412" />
      <circle cx="63" cy="42.5" r="1.2" fill="#FFFFFF" />

      {/* Spectacles / Glasses */}
      <circle cx="38" cy="44" r="7.5" stroke="#1E1412" strokeWidth="2" fill="none" />
      <circle cx="62" cy="44" r="7.5" stroke="#1E1412" strokeWidth="2" fill="none" />
      <line x1="45.5" y1="44" x2="54.5" y2="44" stroke="#1E1412" strokeWidth="2" />
      <path d="M 30.5 44 L 25 43" stroke="#1E1412" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 69.5 44 L 75 43" stroke="#1E1412" strokeWidth="1.5" strokeLinecap="round" />

      {/* Nose & Mouth */}
      <path d="M 48 50 L 52 50 L 50 52.5 Z" fill="#D97706" stroke="#1E1412" strokeWidth="1" />
      <path d="M 50 52.5 L 50 55 M 50 55 C 48 57 45 57 44 55 M 50 55 C 52 57 55 57 56 55" stroke="#1E1412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Open Textbook at bottom */}
      <g filter="url(#softShadow)">
        {/* Book Cover Back */}
        <path d="M 18 68 C 34 62 50 65 50 70 C 50 65 66 62 82 68 L 82 86 C 66 80 50 83 50 88 C 50 83 34 80 18 86 Z" fill="#1E1412" />
        {/* Book Pages Left */}
        <path d="M 20 67 C 34 62 48 64 49 69 L 49 85 C 48 80 34 78 20 83 Z" fill="#FFFFFF" stroke="#1E1412" strokeWidth="1" />
        {/* Book Pages Right */}
        <path d="M 80 67 C 66 62 52 64 51 69 L 51 85 C 52 80 66 78 80 83 Z" fill="#FFFFFF" stroke="#1E1412" strokeWidth="1" />
        {/* Spine Divider */}
        <line x1="50" y1="69" x2="50" y2="87" stroke="#D97706" strokeWidth="2" />
        {/* Bookmark Ribbon */}
        <path d="M 50 69 L 50 92 L 53 89 L 56 92 L 56 69 Z" fill="#D97706" />
        {/* Text lines on pages */}
        <line x1="26" y1="71" x2="43" y2="69" stroke="#E2D4C3" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="25" y1="75" x2="40" y2="73" stroke="#E2D4C3" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="57" y1="69" x2="74" y2="71" stroke="#E2D4C3" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="60" y1="73" x2="75" y2="75" stroke="#E2D4C3" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );

  return (
    <div
      className={`overflow-hidden bg-[#fffaf5] border border-[#40010d]/15 shadow-sm shrink-0 flex items-center justify-center select-none ${sizeClasses} ${className}`}
      title={alt}
    >
      {!vectorOnly && !imgError && LOGO_DATA_URL ? (
        <img
          src={LOGO_DATA_URL}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="sync"
          onError={() => setImgError(true)}
        />
      ) : (
        renderSvgVector()
      )}
    </div>
  );
};
