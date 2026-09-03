"use client";

import React from "react";
import { motion } from "framer-motion";

interface CyveraLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const AuraLogo: React.FC<CyveraLogoProps> = ({ size = "md", showText = true }) => {
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
      {/* Precision Engineered Cyvera Cryptographic Cyber-Aperture Glyph */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className={`relative flex items-center justify-center ${iconDimensions} rounded-2xl bg-[#06080E] border border-cyan-500/40 p-1.5 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)]`}
      >
        {/* Ambient Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-blue-500/20 to-indigo-500/20" />
        
        {/* Geometric Hexagonal Cipher Aperture Vector */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          {/* Outer Cyber Hexagon */}
          <path
            d="M16 2.5L28 9.5V22.5L16 29.5L4 22.5V9.5L16 2.5Z"
            stroke="#22D3EE"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Encrypted Keyway & Prism */}
          <path
            d="M16 8L23 12V20L16 24L9 20V12L16 8Z"
            fill="url(#cyvera-grad)"
            opacity="0.9"
          />
          <circle cx="16" cy="16" r="2.2" fill="#06080E" stroke="#06B6D4" strokeWidth="1.5" />
          <defs>
            <linearGradient id="cyvera-grad" x1="9" y1="8" x2="23" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3EE" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight ${textSize}`}>
            <span className="text-foreground">Cy</span>
            <span className="text-cyan-400">vera</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase leading-none">
            Confidential Prize Protocol
          </span>
        </div>
      )}
    </div>
  );
};

export const CyveraLogo = AuraLogo;
