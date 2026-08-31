"use client";

import React, { useState } from "react";
import { Trophy, Dices, Sparkles, CheckCircle2, History, RefreshCw, AlertCircle, ShieldAlert } from "lucide-react";

export interface DrawRecordView {
  drawId: number;
  timestamp: number;
  totalParticipants: number;
  prizeAmount: string;
  winner: string;
  isMyWin?: boolean;
}

interface PrizeDrawCardProps {
  currentDrawId: number;
  currentPrizePot: string;
  totalDepositors: number;
  lastDrawTime: number;
  drawInterval: number;
  drawHistory: DrawRecordView[];
  onTriggerDraw: () => Promise<void>;
  isTriggeringDraw: boolean;
  canTrigger: boolean;
  account: string | null;
}

export const PrizeDrawCard: React.FC<PrizeDrawCardProps> = ({
  currentDrawId,
  currentPrizePot,
  totalDepositors,
  lastDrawTime,
  drawInterval,
  drawHistory,
  onTriggerDraw,
  isTriggeringDraw,
  canTrigger,
  account,
}) => {
  const formatAddress = (addr: string) => {
    if (!addr || addr === "0x0000000000000000000000000000000000000000") return "Confidential Winner (FHE Encrypted)";
    if (account && addr.toLowerCase() === account.toLowerCase()) return "🏆 YOU WON!";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Just now";
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Draw Engine & Fairness</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  FHE.randEuint64
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deposit-weighted winner selection computed over encrypted balances without revealing amounts.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 uppercase">Draw Status</span>
            <div className="text-sm font-bold font-mono text-cyan-300">
              Draw #{currentDrawId + 1} Pending
            </div>
          </div>
        </div>

        {/* Draw Live Execution Box */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-slate-400">Next Estimated Award</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono glow-text-cyan flex items-baseline gap-2">
              <span>{currentPrizePot}</span>
              <span className="text-xs text-cyan-400 font-mono">cUSDT</span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Active Participants: <span className="text-slate-200 font-semibold">{totalDepositors} wallets</span>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={onTriggerDraw}
            disabled={isTriggeringDraw || !account || totalDepositors === 0}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs font-mono tracking-wide transition-all shadow-glowEmerald flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTriggeringDraw ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing FHE Draw...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Onchain Draw</span>
              </>
            )}
          </button>
        </div>

        {/* How It Works Mini-Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-6 flex items-start gap-2.5 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200 font-semibold">Zero-Knowledge Odds:</strong> Winner selection runs onchain with encrypted randomness. No participant learns another user&apos;s deposit size or exact probability.
          </span>
        </div>

        {/* Recent Draws History Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recent Completed Draws</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">{drawHistory.length} recorded</span>
          </div>

          {drawHistory.length === 0 ? (
            <div className="py-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
              <Trophy className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-mono">No draws recorded yet</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Deposit tokens and execute the first draw!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {drawHistory.map((draw) => (
                <div
                  key={draw.drawId}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs font-mono ${
                    draw.isMyWin
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-900/50 border-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-bold text-cyan-300">
                      #{draw.drawId}
                    </span>
                    <span className="text-slate-400 text-[11px]">{formatDate(draw.timestamp)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-200 font-bold">
                      +{draw.prizeAmount} cUSDT
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded ${draw.isMyWin ? "bg-emerald-400/20 text-emerald-300 font-bold" : "bg-slate-800 text-slate-400"}`}>
                      {formatAddress(draw.winner)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>Verified Onchain Entropy</span>
        <span>Zama Precompiles</span>
      </div>
    </div>
  );
};
