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
  Users 
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
  onOpenConnectModal: () => void;
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
  onOpenConnectModal,
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
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Live Draw Banner */}
      <div className="aura-card p-8 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Prize Draw</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-aura-yellow text-black font-extrabold shadow-sm">
                Draw #{currentDrawId + 1}
              </span>
            </div>

            <div className="text-4xl font-black text-black mt-1 flex items-baseline gap-2">
              <span>${currentPrizePot}</span>
              <span className="text-base text-slate-500 font-medium">cUSDT Prize</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Active Pool: <strong className="text-black">{totalDepositors} Savers Participating</strong>
            </p>
          </div>

          {/* Trigger Button */}
          <div className="w-full md:w-auto">
            {!account ? (
              <button
                onClick={onOpenConnectModal}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs tracking-wider uppercase transition-all shadow-aura-yellow"
              >
                Connect Wallet to Draw
              </button>
            ) : (
              <button
                onClick={onTriggerDraw}
                disabled={isTriggeringDraw || totalDepositors === 0}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs tracking-wider uppercase transition-all shadow-aura-yellow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isTriggeringDraw ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Drawing Random Winner...</span>
                  </>
                ) : (
                  <>
                    <Dices className="w-4 h-4" />
                    <span>Trigger Next Draw</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Countdown & Fairness Status */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-600" />
            <span>Draw In: <strong className="text-black font-mono font-bold">{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Fairness: <strong className="text-black">100% Confidential Onchain Randomness</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Draws Ledger */}
      <div className="aura-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-black uppercase tracking-wide">Completed Prize Draws</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">{drawHistory.length} draws executed</span>
        </div>

        <div className="space-y-3 text-xs">
          {drawHistory.map((draw) => (
            <div
              key={draw.drawId}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                draw.isMyWin
                  ? "bg-amber-50 border-amber-300 shadow-sm"
                  : "bg-slate-50 border-slate-100 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white font-extrabold text-black text-xs border border-slate-200 shadow-sm">
                  #{draw.drawId}
                </span>
                <div>
                  <div className="text-black font-bold">{formatDate(draw.timestamp)}</div>
                  <span className="text-slate-500 text-[11px]">{draw.totalParticipants} Participants</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-base font-black text-emerald-700">
                  +${draw.prizeAmount} cUSDT
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${draw.isMyWin ? "bg-aura-yellow text-black" : "bg-white text-slate-600 border border-slate-200"}`}>
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
