"use client";

import React from "react";
import { X, PiggyBank, Trophy, ShieldCheck, Sparkles, Lock, ArrowDownRight, RefreshCw } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full my-8 relative shadow-aura-lg border border-slate-200 text-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-black transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-aura-yellow text-black shadow-aura-yellow">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-black">How AuraPool Works</h3>
            <p className="text-xs text-slate-500 font-medium">The No-Loss, 100% Private Prize Savings Protocol</p>
          </div>
        </div>

        {/* 4 Clean Steps */}
        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-aura-yellow text-black font-black flex items-center justify-center text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-black text-sm">Deposit & Get Prize Tickets</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Deposit tokens into the savings vault. Every 1 cUSDT gives you 1 ticket in all upcoming daily prize draws.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-aura-yellow text-black font-black flex items-center justify-center text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-black text-sm">Collective Yield Creates Jackpots</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The pool generates 8.50% APY interest through DeFi lending (Aave). The accrued interest is pooled together into prize pots.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-aura-yellow text-black font-black flex items-center justify-center text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-black text-sm">Win Prizes in Total Privacy</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Draws pick winners fairly using confidential onchain randomness. Unlike traditional lotteries, nobody can see your savings or track your payouts.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-sm shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">Zero Loss &bull; Withdraw 100% Anytime</h4>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                You never spend your principal. Even if you don&apos;t win a draw, your money is completely safe and withdrawable at any moment.
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm transition-all shadow-aura-yellow"
        >
          Got It, Let&apos;s Save!
        </button>
      </div>
    </div>
  );
};
