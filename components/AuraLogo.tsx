"use client";

import React from "react";

interface AuraLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({ size = "md", showText = true }) => {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  }[size];

  const textSize = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Radiant Yellow Brand Glyph */}
      <div className={`relative flex items-center justify-center ${iconDimensions} rounded-2xl bg-aura-yellow shadow-aura-yellow p-2 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-black"
        >
          {/* Modern geometric shield and crown/spark */}
          <path
            d="M12 2L4 6V12C4 17.52 7.42 22.5 12 23.93C16.58 22.5 20 17.52 20 12V6L12 2Z"
            fill="currentColor"
          />
          <circle cx="12" cy="12" r="3.5" fill="#FFD200" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold tracking-tight text-black ${textSize}`}>
              AuraPool
            </span>
            <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-aura-yellow text-black border border-black/10">
              NO-LOSS
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 leading-none">
            Private Prize Savings Vault
          </span>
        </div>
      )}
    </div>
  );
};
