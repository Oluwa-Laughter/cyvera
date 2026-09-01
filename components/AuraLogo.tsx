"use client";

import React from "react";
import { motion } from "framer-motion";

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
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Bespoke Geometric Kinetic Cipher Prism Glyph */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`relative flex items-center justify-center ${iconDimensions} rounded-2xl bg-black shadow-aura-md border border-slate-800 p-2 overflow-hidden`}
      >
        {/* Glowing Ambient Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 via-aura-yellow/25 to-transparent" />
        
        {/* Geometric Cipher Aperture Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <path
            d="M12 2.5L21 19.5H3L12 2.5Z"
            stroke="#FFD200"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 9L16.5 17.5H7.5L12 9Z"
            fill="#FFD200"
          />
          <circle cx="12" cy="14" r="1.5" fill="#0A0A0A" />
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-black ${textSize}`}>
            AuraPool
          </span>
          <span className="text-[10px] font-semibold text-slate-500 leading-none">
            Confidential Prize Savings
          </span>
        </div>
      )}
    </div>
  );
};
