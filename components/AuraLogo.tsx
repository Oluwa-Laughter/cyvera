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
      {/* Bespoke Cryptographic Shield Glyph */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`relative flex items-center justify-center ${iconDimensions} rounded-2xl bg-black shadow-aura-md border border-slate-800 p-1.5 overflow-hidden`}
      >
        {/* Glowing Amber Gradient Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 via-aura-yellow/20 to-transparent" />
        
        {/* Geometric Shield & Encrypted Aperture Vector */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <path
            d="M16 3L27 7.5V15C27 21.5 22.3 27.5 16 29C9.7 27.5 5 21.5 5 15V7.5L16 3Z"
            stroke="#FFD200"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 9C13.8 9 12 10.8 12 13V15H11C10.4 15 10 15.4 10 16V22C10 22.6 10.4 23 11 23H21C21.6 23 22 22.6 22 22V16C22 15.4 21.6 15 21 15H20V13C20 10.8 18.2 9 16 9ZM14 13C14 11.9 14.9 11 16 11C17.1 11 18 11.9 18 13V15H14V13Z"
            fill="#FFD200"
          />
          <circle cx="16" cy="18.5" r="1.3" fill="#0A0A0A" />
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight ${textSize}`}>
            <span className="text-black">Veil</span>
            <span className="text-amber-500">Pool</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-none">
            Confidential Prize Savings
          </span>
        </div>
      )}
    </div>
  );
};
