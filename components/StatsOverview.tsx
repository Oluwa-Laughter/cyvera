"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Trophy, Timer, TrendingUp, Users, Coins } from "lucide-react";

interface StatsOverviewProps {
  totalDeposits: string;
  totalPrizeReserve: string;
  lastDrawTime: number;
  drawInterval: number;
  depositorsCount: number;
  totalPrizesAwarded: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalDeposits,
  totalPrizeReserve,
  lastDrawTime,
  drawInterval,
  depositorsCount,
  totalPrizesAwarded,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const nextDraw = lastDrawTime + drawInterval;
      const diff = Math.max(0, nextDraw - now);

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastDrawTime, drawInterval]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Current Prize Pot */}
      <div className="glass-panel-glow rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Current Prize Pot</span>
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-cyan-300 glow-text-cyan">
            {totalPrizeReserve}
          </span>
          <span className="text-xs font-mono text-cyan-400/80">cUSDT</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Accruing yield automatically</span>
        </div>
      </div>

      {/* 2. Next Draw Countdown */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Next Draw In</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Timer className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 glow-text-emerald">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Provably fair FHE draw</span>
        </div>
      </div>

      {/* 3. Shielded Pool Principal */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Shielded TVL</span>
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-purple-300 glow-text-purple">
            {totalDeposits}
          </span>
          <span className="text-xs font-mono text-purple-400/80">cUSDT</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>{depositorsCount} confidential savers</span>
        </div>
      </div>

      {/* 4. Total Prizes Awarded */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Prizes Awarded</span>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-amber-300">
            {totalPrizesAwarded}
          </span>
          <span className="text-xs font-mono text-amber-400/80">cUSDT</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-400 font-mono">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">100% Principal Safe</span>
        </div>
      </div>
    </div>
  );
};
