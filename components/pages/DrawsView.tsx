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
  winnersPerDraw: number;
  currentPrizePot: string;
  totalDepositors: number;
  lastDrawTime: number;
  drawInterval: number;
  timeToNextDraw: number;
  drawHistory: DrawRecordView[];
  onCheckWinnings: () => void;
  isCheckingWinnings: boolean;
  decryptedWinnings: string | null;
  onConnect: () => void;
  onTriggerDraw: () => Promise<void>;
  isTriggeringDraw: boolean;
  onOpenFaucet: () => void;
  onFundPrize: () => Promise<void>;
  isFundingPrize: boolean;
}

export const DrawsView: React.FC<DrawsViewProps> = ({
  account,
  currentDrawId,
  currentPrizePot,
  totalDepositors,
  lastDrawTime,
  drawInterval = 60,
  drawHistory,
  winnersPerDraw,
  timeToNextDraw,
  onCheckWinnings,
  isCheckingWinnings,
  decryptedWinnings,
  onConnect,
  onTriggerDraw,
  isTriggeringDraw,
  onOpenFaucet,
  onFundPrize,
  isFundingPrize,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);

  useEffect(() => {
    const updateCountdown = () => {
      const baseTime = lastDrawTime > 0 ? lastDrawTime : Math.floor(Date.now() / 1000) - 10;
      const targetTime = baseTime + (drawInterval || 60);
      const now = Math.floor(Date.now() / 1000);
      const diff = Math.max(0, targetTime - now);
      setSecondsRemaining(diff);
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

  const isCountdownZero = secondsRemaining === 0;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `00:${pad(minutes)}:${pad(seconds)}`;

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Live Draw Banner */}
      <div className="aura-card p-8 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Prize Draw</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-aura-yellow text-black font-extrabold shadow-sm">
                Draw #{currentDrawId + 1}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                <span>1-Minute Schedule</span>
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
                  className="w-full md:w-auto px-6 py-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95 bg-aura-yellow hover:bg-aura-yellowHover text-black"
                >
                  {isTriggeringDraw ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Executing FHE Draw...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-black" />
                      <span>{isCountdownZero ? "Execute Draw Now" : `Execute Draw (${formattedCountdown})`}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onCheckWinnings}
                  disabled={isCheckingWinnings}
                  className="w-full md:w-auto px-5 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  {isCheckingWinnings ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                  ) : (
                    <Gift className="w-4 h-4 text-amber-500" />
                  )}
                  <span>Check If You Won</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Draw Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-slate-700">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-amber-500" />
              <span>Draw Countdown</span>
            </span>
            <div className="text-2xl font-black text-black font-mono">
              {formattedCountdown}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Recur every 60 seconds</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Entropy Engine</span>
            </span>
            <div className="text-sm font-extrabold text-emerald-950 font-mono">
              Zama FHE.randEuint64()
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Homomorphic onchain seed</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Fairness Invariant</span>
            </span>
            <div className="text-sm font-extrabold text-black">
              Deposit-Weighted RNG
            </div>
            <p className="text-[11px] text-slate-500 font-medium">100% Zero-Loss & Verifiable</p>
          </div>
        </div>
      </div>

      {/* 2. Automated Fairness Guarantee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-black">1-Minute Frequency</h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Draws recur automatically every minute as yield accrues into the shared prize pool.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-black">Weighted RNG</h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Chances are strictly proportional to saved principal without exposing balances onchain.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-black">Confidential Winner</h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Winner identity and prize credits remain encrypted until the winner claims to their wallet.
          </p>
        </div>
      </div>

      {/* 3. Recent Executed Draws */}
      <div className="aura-card p-6 sm:p-8 bg-white border border-slate-200 shadow-aura-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black text-black">Recent Executed Draws</h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">Automatic FHE onchain selection</span>
        </div>

        {drawHistory.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Trophy className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Draw #{currentDrawId + 1} In Progress (1-Minute Cycle)</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Deposit tokens and click &quot;Execute Draw Now&quot; to pick an onchain winner using Zama FHE randomness!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {drawHistory.map((draw) => (
              <div key={draw.drawId} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-black text-sm">
                    #{draw.drawId}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-black">{formatDate(draw.timestamp)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {draw.totalParticipants} Savers in Draw
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      Winner: {draw.winner.slice(0, 6)}...{draw.winner.slice(-4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-950 font-mono">
                      +${draw.prizeAmount} cUSDT
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">Awarded</span>
                  </div>

                  {draw.isMyWin && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold flex items-center gap-1">
                      <HiTrophy className="w-3.5 h-3.5 text-emerald-700" />
                      <span>YOU WON!</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
