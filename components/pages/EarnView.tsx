"use client";

import React from "react";
import { 
  Zap, 
  Flame, 
  Coins, 
  Trophy, 
  Timer, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Gift, 
  Percent, 
  CheckCircle2, 
  Lock,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { ActiveMarketId } from "@/lib/contracts";

interface EarnViewProps {
  userSavings: string;
  liquidityHuntPoints: number;
  onNavigateVault: () => void;
  onOpenFaucet: () => void;
  activeMarket?: ActiveMarketId;
  onChangeMarket?: (m: ActiveMarketId) => void;
}

export const EarnView: React.FC<EarnViewProps> = ({
  userSavings,
  liquidityHuntPoints,
  onNavigateVault,
  onOpenFaucet,
  activeMarket = "cUSDT",
  onChangeMarket,
}) => {
  const savedNum = parseFloat(userSavings || "0");
  const multiplier = savedNum >= 1000 ? "3.5x" : savedNum >= 250 ? "2.0x" : savedNum > 0 ? "1.2x" : "1.0x";
  const tier = savedNum >= 1000 ? "Diamond Whale" : savedNum >= 250 ? "Gold Saver" : savedNum > 0 ? "Silver Explorer" : "Bronze Observer";
  const boostPct = savedNum >= 1000 ? "+250%" : savedNum >= 250 ? "+100%" : savedNum > 0 ? "+20%" : "+0%";

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* Market Switcher (High-End Island Tabs) */}
      {onChangeMarket && (
        <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[#0B0E17]/80 backdrop-blur-xl border border-white/[0.08] shadow-lg">
          <div className="flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => onChangeMarket("cUSDT")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeMarket === "cUSDT" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.35)]" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeMarket === "cUSDT" ? "bg-slate-950 animate-pulse" : "bg-cyan-500/50"}`} />
              <span>cUSDT Liquidity Hunt</span>
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeMarket === "cUSDC" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.35)]" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeMarket === "cUSDC" ? "bg-slate-950 animate-pulse" : "bg-cyan-500/50"}`} />
              <span>cUSDC Liquidity Hunt</span>
            </button>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 hidden sm:inline">
            Confidential Multipliers
          </span>
        </div>
      )}

      {/* 1. Hero Banner (Double-Bezel Architecture) */}
      <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-5 sm:p-7 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 backdrop-blur-xl border border-white/[0.04] space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5 border-b border-white/[0.06]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3 py-0.5 rounded-full border border-cyan-500/20 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Season 1: Confidential Liquidity Hunt</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#101524] text-slate-300 font-semibold border border-white/[0.06]">
                  {activeMarket} Pool
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Confidential TVL Boost & Yield Hunt
              </h2>
              <p className="text-xs text-slate-400 font-normal max-w-lg leading-relaxed">
                Earn time-weighted protocol incentives and confidential prize multipliers simply by holding savings in the zero-loss vault.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111624] border border-white/[0.08] shadow-sm text-center min-w-[150px]">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Hunt Status</span>
              <div className="text-lg font-bold text-white mt-0.5">{tier}</div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mt-1">
                {multiplier} Prize Multiplier
              </span>
            </div>
          </div>

          {/* Real-Time Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#101524] border border-white/[0.06] space-y-1 shadow-inner">
              <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <span>Shielded Principal</span>
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                ${userSavings} <span className="text-xs font-normal text-slate-400 font-sans">{activeMarket}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">100% principal safe & withdrawable</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524] border border-white/[0.06] space-y-1 shadow-inner">
              <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Draw Boost</span>
              </span>
              <div className="text-2xl font-bold text-cyan-300 font-mono">
                {boostPct} <span className="text-xs font-semibold text-slate-400 font-sans">Odds Multiplier</span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">Calculated automatically onchain</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524] border border-white/[0.06] space-y-1 shadow-inner">
              <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-blue-400" />
                <span>Earned Hunt Points</span>
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                {Math.max(liquidityHuntPoints, Math.floor(savedNum * 12))} <span className="text-xs font-normal text-slate-400 font-sans">PTS</span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">Season 1 Protocol Rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. How the Confidential Liquidity Hunt Works */}
      <div className="p-1 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
        <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/70 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Layers className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">How Time-Weighted Rewards Work</h3>
              <p className="text-xs text-slate-400 font-normal">Zero balance leakage while earning maximum incentives.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-bold text-white text-sm">Save Confidentially</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Deposit {activeMarket} into the zero-loss prize vault. Your balance is completely private, protected by end-to-end encryption.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-bold text-white text-sm">Snapshot Weights</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                At every draw round, the protocol snapshots deposit weights without exposing individual balances to anyone.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-bold text-white text-sm">Multiplier Accumulation</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Maintain your savings through multiple consecutive draw cycles to automatically compound your multiplier status.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onNavigateVault}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 transition-all"
            >
              <span>Deposit {activeMarket} to Boost Multiplier</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onOpenFaucet}
              className="px-5 py-3.5 rounded-2xl bg-[#131929] hover:bg-[#1A2238] border border-cyan-500/30 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Get Free {activeMarket} Tokens</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
