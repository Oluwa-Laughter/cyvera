"use client";

import React from "react";

interface ZamaLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const ZamaLogo: React.FC<ZamaLogoProps> = ({ size = "md", showText = true }) => {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  }[size];

  const textSize = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Custom Geometric Zama 'Z' Shield Icon */}
      <div className={`relative flex items-center justify-center ${iconDimensions} rounded-xl bg-zama-yellow p-1.5 shadow-zama-glow-sm transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-black"
        >
          {/* Bold geometric folded 'Z' cipher glyph */}
          <path
            d="M4 5H20L10 14H20V19H4L14 10H4V5Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight text-white ${textSize}`}>
              VeilPrize
            </span>
            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-zama-yellow text-black">
              ZAMA
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 leading-none">
            Confidential Prize Savings
          </span>
        </div>
      )}
    </div>
  );
};
