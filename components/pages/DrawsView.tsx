"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Sparkles, 
  Timer, 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  Users,
  RefreshCw,
  Gift,
  PlayCircle,
  Clock,
  Zap,
  Lock
} from "lucide-react";
import { FiClock } from "react-icons/fi";
import { HiTrophy } from "react-icons/hi2";
import { DrawRecordView } from "@/components/PrizeDrawCard";

interface DrawsViewProps {
  account: string | null;
  currentDrawId: number;
  currentPrizePot: string;
  totalDepositors: number;
  lastDrawTime: number;
  drawInterval: number;
  drawHistory: DrawRecordView[];
  onCheckWinnings: () => void;
  isCheckingWinnings: boolean;
  decryptedWinnings: string | null;
  onConnect: () => void;
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
  onCheckWinnings,
  isCheckingWinnings,
  decryptedWinnings,
  onConnect,
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
    if (!timestamp) return "Today";
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const isCountdownZero = timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0;

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Live Hourly Draw Banner */}
      <div className="aura-card p-8 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Prize Draw</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-aura-yellow text-black font-extrabold shadow-sm">
                Draw #{currentDrawId + 1}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                <span>Hourly Schedule</span>
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-black mt-2 flex items-baseline gap-2">
              <span>${currentPrizePot}</span>
              <span className="text-base text-slate-500 font-medium">cUSDT Prize Pot</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Active Participants: <strong className="text-black">{totalDepositors} Savers in this Pool</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {!account ? (
              <button
                onClick={onConnect}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs tracking-wider uppercase transition-all shadow-aura-yellow active:scale-95"
              >
                Connect Wallet
              </button>
            ) : (
              <>
                <button
                  onClick={onTriggerDraw}
                  disabled={isTriggeringDraw}
                  className={`w-full md:w-auto px-6 py-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95 ${
                    isCountdownZero
                      ? "bg-emerald-400 hover:bg-emerald-500 text-black animate-pulse"
                      : "bg-aura-yellow hover:bg-aura-yellowHover text-black"
                  }`}
                >
                  {isTriggeringDraw ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Executing FHE Draw...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>Execute Draw Now</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onCheckWinnings}
                  disabled={isCheckingWinnings}
                  className="w-full md:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-black font-black text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  {isCheckingWinnings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span>Check If You Won</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Countdown & Automated Keeper Status */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-600" />
            <span>Draw Countdown: <strong className="text-black font-mono text-sm font-black">{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Entropy Engine: <strong className="text-black">Zama FHE.randEuint64() Onchain</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Fairness & Protocol Mechanics Card */}
      <div className="aura-card p-6 sm:p-8 bg-white border border-slate-200 shadow-aura-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-black text-black uppercase tracking-wide">Automated Hourly Fairness Guarantee</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="font-bold text-black flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Hourly Frequency</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Draws recur automatically every hour as DeFi interest accrues into the shared prize pool.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="font-bold text-black flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Weighted RNG</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Chances are strictly proportional to saved principal without exposing balances onchain.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="font-bold text-black flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Confidential Winner</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Winner identity and prize credits remain encrypted until the winner claims to their wallet.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Past Winners & Draws History */}
      <div className="aura-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-black uppercase tracking-wide">Recent Executed Draws</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Automatic FHE onchain selection</span>
        </div>

        <div className="space-y-3 text-xs">
          {drawHistory.length === 0 ? (
            <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <Trophy className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Draw #{currentDrawId + 1} In Progress (Hourly)</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Deposit tokens and click &quot;Execute Draw Now&quot; to pick an onchain winner using Zama FHE randomness!
              </p>
            </div>
          ) : (
            drawHistory.map((draw) => (
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
                    <span className="text-slate-500 text-[11px]">{draw.totalParticipants} Savers in Draw</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-base font-black text-emerald-700">
                    +${draw.prizeAmount} cUSDT
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${draw.isMyWin ? "bg-aura-yellow text-black" : "bg-white text-slate-600 border border-slate-200"}`}>
                    {draw.isMyWin ? (
                      <>
                        <HiTrophy className="w-3.5 h-3.5 text-black" />
                        <span>YOU WON!</span>
                      </>
                    ) : (
                      `Winner: ${draw.winner}`
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
