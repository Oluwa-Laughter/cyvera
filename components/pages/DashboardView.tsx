"use client";

import React, { useState, useEffect } from "react";
import { 
  PiggyBank, 
  Trophy, 
  Timer, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Eye, 
  EyeOff, 
  History,
  ShieldCheck
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
  onOpenConnectModal: () => void;
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
  onOpenConnectModal,
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
    <div className="space-y-8 w-full max-w-5xl mx-auto text-black">
      {/* 1. Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Prize Pot */}
        <div className="aura-card p-6 relative overflow-hidden bg-gradient-to-br from-white to-amber-50/50">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Current Prize Pot</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-black flex items-baseline gap-1.5">
            <span>${totalPrizeReserve}</span>
            <span className="text-xs text-amber-700 font-bold">cUSDT</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Draw #{currentDrawId + 1}</span>
            <button 
              onClick={() => onNavigateTab("draws")}
              className="text-amber-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>View Draw</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Countdown */}
        <div className="aura-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Next Draw In</span>
            <Timer className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-black flex items-baseline gap-1 font-mono">
            <span>{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Automatic Winner Draw</span>
          </div>
        </div>

        {/* Total TVL */}
        <div className="aura-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Total Vault TVL</span>
            <PiggyBank className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-black flex items-baseline gap-1.5">
            <span>${totalDeposits}</span>
            <span className="text-xs text-slate-500 font-bold">cUSDT</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5" />
            <span>{depositorsCount} Private Savers</span>
          </div>
        </div>

        {/* APY */}
        <div className="aura-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Yield APY Stream</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 flex items-baseline gap-1.5">
            <span>8.50%</span>
            <span className="text-xs text-emerald-700 font-bold">APY</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Aave V3 Strategy</span>
            <button 
              onClick={() => onNavigateTab("yield")}
              className="text-amber-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>Strategy</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Personal Savings Box */}
      <div className="aura-card p-8 bg-gradient-to-br from-white via-slate-50 to-amber-50/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Savings Balance</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                100% Private
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-4xl font-black text-black">
                {account ? (
                  decryptedBalance !== null ? (
                    <span className="text-black">
                      ${decryptedBalance} <span className="text-base text-slate-500 font-medium">cUSDT</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 tracking-widest text-3xl">
                      •••••••• <span className="text-base text-slate-400">cUSDT</span>
                    </span>
                  )
                ) : (
                  <span className="text-slate-400 text-2xl font-bold">Connect Wallet</span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptBalance}
                  disabled={isDecryptingBalance}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-sm"
                >
                  {isDecryptingBalance ? (
                    <span>Verifying...</span>
                  ) : decryptedBalance !== null ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reveal Balance</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Your deposit is encrypted — no observer on the blockchain can view your savings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
            {account ? (
              <>
                <button
                  onClick={() => onNavigateTab("vault")}
                  className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold shadow-aura-yellow transition-all hover:scale-105"
                >
                  Deposit & Save
                </button>
                <button
                  onClick={() => onNavigateTab("rewards")}
                  className="flex-1 md:flex-none px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold transition-all shadow-sm"
                >
                  Check Winnings
                </button>
              </>
            ) : (
              <button
                onClick={onOpenConnectModal}
                className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold shadow-aura-yellow transition-all"
              >
                Connect Wallet to Save
              </button>
            )}
          </div>
        </div>

        {/* Reassurance Grid */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% Principal Withdrawable Anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Automatic Daily Draw Participation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Zero Exposure to Whale Trackers</span>
          </div>
        </div>
      </div>

      {/* 3. Recent Activity Ledger */}
      <div className="aura-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-black uppercase tracking-wide">Recent Prize Draws</h3>
          </div>
          <button
            onClick={() => onNavigateTab("draws")}
            className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          {drawHistory.map((draw) => (
            <div
              key={draw.drawId}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white font-black text-black border border-slate-200 shadow-sm">
                  Draw #{draw.drawId}
                </span>
                <span className="text-slate-500">{draw.totalParticipants} Participants</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-extrabold text-emerald-700 text-sm">
                  +${draw.prizeAmount} cUSDT Awarded
                </span>
                <span className="text-slate-400 hidden sm:inline font-mono">Winner: {draw.winner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
