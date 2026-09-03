"use client";

import React from "react";
import { X, PiggyBank, Trophy, ShieldCheck, Sparkles, Lock, ArrowDownRight, RefreshCw } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterVault?: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, onEnterVault }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 relative shadow-2xl border border-slate-200 dark:border-slate-800 text-foreground">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-black dark:hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">How Cyvera Works</h3>
            <p className="text-xs text-slate-400 font-normal">The Zero-Loss, 100% Private Prize Savings Protocol</p>
          </div>
        </div>

        {/* 4 Clean Steps */}
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-2xl bg-[#101524] border border-white/[0.06] flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Deposit & Get Prize Tickets</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-normal">
                Deposit tokens into the savings vault. Every $1.00 in cUSDT or cUSDC gives you 1 ticket in recurring prize draws.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#101524] border border-white/[0.06] flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Accrued Interest Creates Prize Pots</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-normal">
                The pool generates 8.50% - 12.00% APY yield through decentralized money markets. This yield funds recurring prize pots with zero principal risk.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#101524] border border-white/[0.06] flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Win Prizes in Total Privacy</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-normal">
                Draws pick winners fairly using verifiable onchain randomness. Nobody can see your savings or track your winning payouts.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-emerald-400 text-xs">Zero Loss • Withdraw 100% Anytime</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-normal">
                You never wager your principal. Even if you don&apos;t win a draw, your initial deposit is completely safe and withdrawable at any moment.
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={onEnterVault || onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all"
        >
          Got It, Let&apos;s Save!
        </button>
      </div>
    </div>
  );
};
