"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Lock, 
  Trophy, 
  Dices, 
  Timer, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Coins, 
  History,
  Eye,
  EyeOff,
  KeyRound,
  Droplets
} from "lucide-react";
import { DrawRecordView } from "@/components/PrizeDrawCard";

interface DashboardViewProps {
  account: string | null;
  walletBalance: string;
  decryptedBalance: string | null;
  decryptedWinnings: string | null;
  totalDeposits: string;
  totalPrizeReserve: string;
  totalPrizesAwarded: string;
  depositorsCount: number;
  lastDrawTime: number;
  drawInterval: number;
  currentDrawId: number;
  drawHistory: DrawRecordView[];
  onNavigateTab: (tab: "vault" | "draws" | "rewards" | "yield") => void;
  onOpenFaucet: () => void;
  onDecryptBalance: () => void;
  isDecryptingBalance: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  account,
  walletBalance,
  decryptedBalance,
  decryptedWinnings,
  totalDeposits,
  totalPrizeReserve,
  totalPrizesAwarded,
  depositorsCount,
  lastDrawTime,
  drawInterval,
  currentDrawId,
  drawHistory,
  onNavigateTab,
  onOpenFaucet,
  onDecryptBalance,
  isDecryptingBalance,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number }>({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const next = lastDrawTime + drawInterval;
      const diff = Math.max(0, next - now);
      setTimeLeft({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastDrawTime, drawInterval]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* 1. Top Metrics Banner Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Prize Pot */}
        <div className="zama-card p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span>Current Prize Pot</span>
            <Trophy className="w-4 h-4 text-zama-yellow" />
          </div>
          <div className="text-3xl font-black font-mono text-zama-yellow glow-text-yellow flex items-baseline gap-1.5">
            <span>{totalPrizeReserve}</span>
            <span className="text-xs text-zinc-400">cUSDT</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Draw #{currentDrawId + 1}</span>
            <button 
              onClick={() => onNavigateTab("draws")}
              className="text-zama-yellow hover:underline flex items-center gap-1"
            >
              <span>View Draw</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Countdown */}
        <div className="zama-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span>Next Draw In</span>
            <Timer className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1">
            <span>{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>FHE Random Winner Selection</span>
          </div>
        </div>

        {/* Total TVL */}
        <div className="zama-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span>Total Vault TVL</span>
            <Shield className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1.5">
            <span>{totalDeposits}</span>
            <span className="text-xs text-zinc-400">cUSDT</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <Users className="w-3.5 h-3.5" />
            <span>{depositorsCount} confidential savers</span>
          </div>
        </div>

        {/* Dynamic APY */}
        <div className="zama-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span>Yield APY Stream</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400 flex items-baseline gap-1.5">
            <span>8.50%</span>
            <span className="text-xs text-emerald-400/80">APY</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Mock Aave V3</span>
            <button 
              onClick={() => onNavigateTab("yield")}
              className="text-zama-yellow hover:underline flex items-center gap-1"
            >
              <span>Strategy</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Personal Portfolio Capsule */}
      <div className="zama-card p-8 bg-gradient-to-br from-zama-card to-zama-black">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-zinc-400">Your Confidential Balance</span>
            <div className="flex items-baseline gap-3">
              <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                {decryptedBalance !== null ? (
                  <span className="text-zama-yellow glow-text-yellow">
                    {decryptedBalance} <span className="text-sm text-zama-yellow">cUSDT</span>
                  </span>
                ) : (
                  <span className="text-zinc-500 tracking-widest">
                    •••••••• <span className="text-sm text-zinc-600">cUSDT</span>
                  </span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptBalance}
                  disabled={isDecryptingBalance}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 transition-all"
                >
                  {isDecryptingBalance ? (
                    <span>Signing EIP-712...</span>
                  ) : decryptedBalance !== null ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5 text-zama-yellow" />
                      <span>Decrypt (EIP-712)</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Individual deposit amount is encrypted onchain via Zama euint64.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs w-full md:w-auto">
            <button
              onClick={() => onNavigateTab("vault")}
              className="flex-1 md:flex-none px-6 py-3.5 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-bold transition-all shadow-zama-glow"
            >
              Deposit & Save
            </button>
            <button
              onClick={() => onNavigateTab("rewards")}
              className="flex-1 md:flex-none px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold transition-all"
            >
              Check Winnings
            </button>
          </div>
        </div>

        {/* Quick Info Badges */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>100% Principal Withdrawable Anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zama-yellow" />
            <span>Provably Fair Deposit-Weighted Draws</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Zero Whale Tracking & Odds Leaks</span>
          </div>
        </div>
      </div>

      {/* 3. Recent Activity & Draw History Ledger */}
      <div className="zama-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 font-mono">
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-zama-yellow" />
            <h3 className="text-sm font-bold text-white uppercase">Recent Completed Draws</h3>
          </div>
          <button
            onClick={() => onNavigateTab("draws")}
            className="text-xs text-zama-yellow hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {drawHistory.map((draw) => (
            <div
              key={draw.drawId}
              className="p-3.5 rounded-xl bg-zama-dark border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-black font-bold text-zama-yellow">
                  Draw #{draw.drawId}
                </span>
                <span className="text-zinc-400">{draw.totalParticipants} Participants</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-emerald-400">+{draw.prizeAmount} cUSDT Awarded</span>
                <span className="text-zinc-500 hidden sm:inline">Winner: {draw.winner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
