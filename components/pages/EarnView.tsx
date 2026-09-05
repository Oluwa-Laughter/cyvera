"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  ShieldCheck, 
  Lock, 
  Coins, 
  ArrowUpRight, 
  CheckCircle2, 
  Zap, 
  Clock, 
  TrendingUp,
  Percent,
  Layers,
  ChevronRight
} from "lucide-react";
import { ActiveMarketId } from "@/lib/contracts";

interface EarnViewProps {
  account: string | null;
  activeMarket: ActiveMarketId;
  onChangeMarket?: (m: ActiveMarketId) => void;
  userSavings: string;
  liquidityHuntPoints: number;
  onEnterVault: () => void;
  onConnect: () => void;
}

export const EarnView: React.FC<EarnViewProps> = ({
  account,
  activeMarket,
  onChangeMarket,
  userSavings,
  liquidityHuntPoints,
  onEnterVault,
  onConnect,
}) => {
  const savedNum = parseFloat(userSavings || "0");
  const hasSavings = savedNum > 0;

  // Compute tier
  const tier = savedNum >= 500 ? "Diamond Hunter" : savedNum >= 100 ? "Gold Hunter" : savedNum >= 25 ? "Silver Hunter" : "Bronze Scout";
  const multiplier = savedNum >= 500 ? "2.5x" : savedNum >= 100 ? "1.8x" : savedNum >= 25 ? "1.25x" : "1.0x";
  const boostPct = savedNum >= 500 ? "+150%" : savedNum >= 100 ? "+80%" : savedNum >= 25 ? "+25%" : "+0%";

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* Market Switcher */}
      {onChangeMarket && (
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => onChangeMarket("cUSDT")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all ${
                activeMarket === "cUSDT" 
                  ? "bg-cyvera-gold text-black font-extrabold shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              <span className="sm:hidden">cUSDT</span>
              <span className="hidden sm:inline">cUSDT Liquidity Hunt</span>
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all ${
                activeMarket === "cUSDC" 
                  ? "bg-cyvera-gold text-black font-extrabold shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              <span className="sm:hidden">cUSDC</span>
              <span className="hidden sm:inline">cUSDC Liquidity Hunt</span>
            </button>
          </div>
          <span className="text-[11px] font-medium text-[var(--muted)] hidden sm:inline">
            Confidential Multiplier Season
          </span>
        </div>
      )}

      {/* 1. Hero Banner */}
      <div className="cyvera-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5 border-b border-[var(--card-border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Season 1: Confidential Liquidity Hunt</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground font-semibold border border-[var(--card-border)]">
                {activeMarket} Pool
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-1">
              Confidential TVL Boost & Yield Hunt
            </h2>
            <p className="text-xs text-[var(--muted)] font-normal max-w-lg leading-relaxed">
              Earn time-weighted protocol incentives and confidential prize multipliers simply by holding savings in the zero-loss vault.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-[var(--card-border)] shadow-sm text-center min-w-[150px]">
            <span className="text-[11px] font-semibold text-[var(--muted)] uppercase">Hunt Status</span>
            <div className="text-lg font-bold text-foreground mt-0.5">{tier}</div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mt-1">
              {multiplier} Prize Multiplier
            </span>
          </div>
        </div>

        {/* Real-Time Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1 shadow-sm">
            <span className="text-[11px] font-semibold text-[var(--muted)] uppercase flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Shielded Principal</span>
            </span>
            <div className="text-xl sm:text-2xl font-bold text-foreground font-mono">
              ${userSavings} <span className="text-xs font-normal text-[var(--muted)]">{activeMarket}</span>
            </div>
            <p className="text-[11px] text-[var(--muted)] font-normal">100% principal safe & withdrawable</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1 shadow-sm">
            <span className="text-[11px] font-semibold text-[var(--muted)] uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span>Draw Boost</span>
            </span>
            <div className="text-xl sm:text-2xl font-bold text-amber-500 font-mono">
              {boostPct} <span className="text-xs font-semibold text-[var(--muted)] font-sans">Odds Multiplier</span>
            </div>
            <p className="text-[11px] text-[var(--muted)] font-normal">Calculated automatically onchain</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1 shadow-sm">
            <span className="text-[11px] font-semibold text-[var(--muted)] uppercase flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-500" />
              <span>Earned Hunt Points</span>
            </span>
            <div className="text-xl sm:text-2xl font-bold text-foreground font-mono">
              {Math.max(liquidityHuntPoints, Math.floor(savedNum * 12))} <span className="text-xs font-normal text-[var(--muted)] font-sans">PTS</span>
            </div>
            <p className="text-[11px] text-[var(--muted)] font-normal">Season 1 Protocol Rewards</p>
          </div>
        </div>
      </div>

      {/* 2. How the Confidential Liquidity Hunt Works */}
      <div className="cyvera-card p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--card-border)]">
          <Layers className="w-4 h-4 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold text-foreground">How Time-Weighted Rewards Work</h3>
            <p className="text-xs text-[var(--muted)] font-normal">Zero balance leakage while earning maximum incentives.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-cyvera-gold text-black font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-foreground text-sm">Save Confidentially</h4>
            <p className="text-[var(--muted)] leading-relaxed text-[11px]">
              Deposit cUSDT or cUSDC into the zero-loss prize vault. Your balance is completely private, protected by end-to-end encryption.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-cyvera-gold text-black font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-foreground text-sm">Snapshot Weights</h4>
            <p className="text-[var(--muted)] leading-relaxed text-[11px]">
              At every draw round, the protocol snapshots deposit weights without exposing individual balances to anyone.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-cyvera-gold text-black font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-foreground text-sm">Automated Boosts</h4>
            <p className="text-[var(--muted)] leading-relaxed text-[11px]">
              Longer savings duration automatically boosts your prize draw weights and unlocks higher Season 1 rewards!
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {!account ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnect}
              className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow"
            >
              Connect Wallet to Join Liquidity Hunt
            </motion.button>
          ) : !hasSavings ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterVault}
              className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow flex items-center justify-center gap-2"
            >
              <span>Deposit into Vault to Activate Multipliers</span>
              <ChevronRight className="w-3.5 h-3.5 text-black" />
            </motion.button>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold">Your Liquidity Hunt Multiplier is Active!</span>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                {multiplier} Boost Active
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
