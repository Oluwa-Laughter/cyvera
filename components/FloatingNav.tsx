"use client";

import React, { useState } from "react";
import { Shield, Lock, Wallet, Sparkles, HelpCircle, ArrowUpRight, Droplets, RefreshCw, Cpu, Layers } from "lucide-react";

interface FloatingNavProps {
  currentView: "landing" | "app";
  onSelectView: (view: "landing" | "app") => void;
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenFaucet: () => void;
  onOpenArchitecture: () => void;
  isConnecting: boolean;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  currentView,
  onSelectView,
  account,
  onConnect,
  onDisconnect,
  onOpenFaucet,
  onOpenArchitecture,
  isConnecting,
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-full bg-void-950/90 border border-white/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.8)] backdrop-blur-2xl max-w-5xl w-full">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectView("landing")} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-zama-violet to-zama-emerald p-[1px] transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full bg-void-950 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-zama-cyan" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-zama-emerald flex items-center justify-center border-2 border-void-950">
              <Lock className="w-2 h-2 text-void-950" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-zama-cyan via-white to-zama-emerald bg-clip-text text-transparent">
                VeilPrize
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-zama-violet/20 border border-zama-violet/40 text-zama-violet font-semibold hidden md:inline-block">
                FHE
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono">
          <button
            onClick={() => onSelectView("landing")}
            className={`px-3 sm:px-4 py-1 rounded-full transition-all duration-300 font-medium ${
              currentView === "landing"
                ? "bg-white/15 text-white shadow-inner-bezel"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Vision
          </button>
          <button
            onClick={() => onSelectView("app")}
            className={`px-3 sm:px-4 py-1 rounded-full transition-all duration-300 font-medium flex items-center gap-1.5 ${
              currentView === "app"
                ? "bg-gradient-to-r from-zama-cyan/20 to-zama-emerald/20 text-zama-emerald border border-zama-emerald/30 shadow-inner-bezel"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zama-emerald animate-pulse" />
            <span>Launch App</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Architecture Modal */}
          <button
            onClick={onOpenArchitecture}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-zama-cyan" />
            <span>Specs</span>
          </button>

          {/* Faucet Trigger */}
          <button
            onClick={onOpenFaucet}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-zama-emerald/10 hover:bg-zama-emerald/20 border border-zama-emerald/30 text-xs font-mono text-zama-emerald font-semibold transition-all shadow-glow-emerald"
          >
            <Droplets className="w-3.5 h-3.5 text-zama-emerald" />
            <span>Faucet</span>
          </button>

          {/* Wallet Button with Button-in-Button */}
          {account ? (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-zama-emerald" />
              <span>{formatAddress(account)}</span>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-slate-400">
                ✕
              </div>
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-zama-cyan to-zama-emerald hover:opacity-95 text-void-950 font-bold text-xs tracking-tight transition-all shadow-glow-cyan active:scale-[0.98]"
            >
              <span>{isConnecting ? "Connecting..." : "Connect"}</span>
              <div className="w-6 h-6 rounded-full bg-void-950/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                {isConnecting ? (
                  <RefreshCw className="w-3 h-3 text-void-950 animate-spin" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-void-950" />
                )}
              </div>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
