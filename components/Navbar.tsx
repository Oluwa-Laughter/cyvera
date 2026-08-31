"use client";

import React, { useState } from "react";
import { Shield, Lock, Wallet, Sparkles, HelpCircle, ExternalLink, RefreshCw } from "lucide-react";

interface NavbarProps {
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenFaucet: () => void;
  onOpenArchitecture: () => void;
  isConnecting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
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
    <header className="w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-glow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-950">
              <Lock className="w-2.5 h-2.5 text-slate-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                VeilPrize
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Zama FHE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Confidential No-Loss Prize Savings Protocol
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Network Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ethereum Sepolia</span>
          </div>

          {/* Architecture / How it works */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-300 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">How It Works</span>
          </button>

          {/* Faucet Button */}
          <button
            onClick={onOpenFaucet}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-xs font-semibold text-emerald-300 transition-all shadow-glowEmerald"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>cUSDT Faucet</span>
          </button>

          {/* Wallet Connection */}
          {account ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onDisconnect}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-cyan-500/30 text-xs font-mono text-cyan-300 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{formatAddress(account)}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-glow disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
