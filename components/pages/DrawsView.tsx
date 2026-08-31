"use client";

import React, { useState, useEffect } from "react";
import { 
  Dices, 
  Trophy, 
  Sparkles, 
  RefreshCw, 
  Timer, 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  Coins 
} from "lucide-react";
import { DrawRecordView } from "@/components/PrizeDrawCard";

interface DrawsViewProps {
  account: string | null;
  currentDrawId: number;
  currentPrizePot: string;
  totalDepositors: number;
  lastDrawTime: number;
  drawInterval: number;
  drawHistory: DrawRecordView[];
  onTriggerDraw: () => Promise<void>;
  isTriggeringDraw: boolean;
}

export const DrawsView: React.FC<DrawsViewProps> = ({
  account,
  currentDrawId,
  currentPrizePot,
  totalDepositors,
  lastDrawTime,
  drawInterval,
  drawHistory,
  onTriggerDraw,
  isTriggeringDraw,
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

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Just now";
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* 1. Live Draw Banner */}
      <div className="zama-card p-8 bg-gradient-to-br from-zama-card to-zama-black relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Onchain FHE Draw Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zama-yellow text-black font-bold">
                Draw #{currentDrawId + 1}
              </span>
            </div>

            <div className="text-4xl font-black font-mono text-zama-yellow glow-text-yellow mt-2 flex items-baseline gap-2">
              <span>{currentPrizePot}</span>
              <span className="text-base text-zinc-400">cUSDT Award</span>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Active Pool: <span className="text-white font-bold">{totalDepositors} Confidential Savers</span>
            </p>
          </div>

          {/* Trigger Button */}
          <div className="w-full md:w-auto">
            <button
              onClick={onTriggerDraw}
              disabled={isTriggeringDraw || !account || totalDepositors === 0}
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-black text-xs font-mono tracking-wider uppercase transition-all shadow-zama-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isTriggeringDraw ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing FHE Draw...</span>
                </>
              ) : (
                <>
                  <Dices className="w-4 h-4" />
                  <span>Execute Onchain Draw</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Countdown & Fairness Status */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <Timer className="w-4 h-4 text-emerald-400" />
            <span>Time to Auto-Draw: <strong className="text-white">{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-zama-yellow" />
            <span>Onchain Entropy: <strong className="text-white">FHE.randEuint64 Verified</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Cryptographic Draw Ledger */}
      <div className="zama-card p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 font-mono">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-zama-yellow" />
            <h3 className="text-sm font-bold text-white uppercase">Historical Draws Ledger</h3>
          </div>
          <span className="text-xs text-zinc-500">{drawHistory.length} draws executed</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {drawHistory.map((draw) => (
            <div
              key={draw.drawId}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                draw.isMyWin
                  ? "bg-zama-yellow/10 border-zama-yellow/40 text-zama-yellow"
                  : "bg-zama-dark border-white/5 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-black font-bold text-zama-yellow text-xs">
                  #{draw.drawId}
                </span>
                <div>
                  <div className="text-white font-bold">{formatDate(draw.timestamp)}</div>
                  <span className="text-zinc-400 text-[11px]">{draw.totalParticipants} Participants</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-base font-black text-emerald-400">
                  +{draw.prizeAmount} cUSDT
                </span>
                <span className={`text-[11px] px-2.5 py-1 rounded font-bold ${draw.isMyWin ? "bg-zama-yellow text-black" : "bg-zinc-800 text-zinc-400"}`}>
                  {draw.isMyWin ? "🏆 YOU WON!" : `Winner: ${draw.winner}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
