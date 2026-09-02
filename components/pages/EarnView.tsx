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
  userSavings: string;
  liquidityHuntPoints: number;
  onEnterVault: () => void;
  onConnect: () => void;
}

export const EarnView: React.FC<EarnViewProps> = ({
  account,
  activeMarket,
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
    <div className="space-y-8 w-full max-w-4xl mx-auto text-foreground">
      {/* 1. Hero Banner */}
      <div className="cyvera-card p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--card-border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Season 1: Confidential Liquidity Hunt</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground font-extrabold border border-[var(--card-border)]">
                {activeMarket} Pool
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-2">
              Encrypted TVL Boost & Yield Hunt
            </h2>
            <p className="text-xs text-[var(--muted)] font-medium max-w-lg">
              Earn time-weighted protocol incentives and confidential prize multipliers simply by holding shielded savings in the vault.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-[var(--card-border)] shadow-sm text-center min-w-[160px]">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase">Hunt Status</span>
            <div className="text-xl font-black text-foreground mt-0.5">{tier}</div>
            <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mt-1">
              {multiplier} Prize Multiplier
            </span>
          </div>
        </div>

        {/* Real-Time Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Shielded Principal</span>
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              ${userSavings} <span className="text-xs font-normal text-[var(--muted)]">{activeMarket}</span>
            </div>
            <p className="text-[10px] text-[var(--muted)]">100% principal safe & withdrawable</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span>Draw Boost</span>
            </span>
            <div className="text-2xl font-black text-amber-500 font-mono">
              {boostPct} <span className="text-xs font-bold text-[var(--muted)] font-sans">Odds Multiplier</span>
            </div>
            <p className="text-[10px] text-[var(--muted)]">Homomorphically computed onchain</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-500" />
              <span>Earned Hunt Points</span>
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              {Math.max(liquidityHuntPoints, Math.floor(savedNum * 12))} <span className="text-xs font-normal text-[var(--muted)] font-sans">PTS</span>
            </div>
            <p className="text-[10px] text-[var(--muted)]">Season 1 Retroactive Airdrop</p>
          </div>
        </div>
      </div>

      {/* 2. How the Confidential Liquidity Hunt Works */}
      <div className="cyvera-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--card-border)]">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">How Confidential Time-Weighted Rewards Work</h3>
            <p className="text-xs text-[var(--muted)]">Zero balance leakage while earning maximum incentives.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-medium">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-cyvera-gold text-black font-black flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-foreground text-sm">Shield & Save</h4>
            <p className="text-[var(--muted)] leading-relaxed">
              Wrap public tokens into confidential `cUSDT` or `cUSDC` and deposit into the prize vault. Your balance is converted into an encrypted `euint64` handle.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-cyvera-gold text-black font-black flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-foreground text-sm">Encrypted Snapshot Weights</h4>
            <p className="text-[var(--muted)] leading-relaxed">
              At every draw round, the protocol takes an encrypted snapshot of time-weighted deposits without exposing individual balances to anyone.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-cyvera-gold text-black font-black flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-foreground text-sm">Automated Boosts</h4>
            <p className="text-[var(--muted)] leading-relaxed">
              Longer savings duration homomorphically boosts your prize draw weights and unlocks higher Season 1 rewards!
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!account ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnect}
              className="w-full py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow"
            >
              Connect Wallet to Join Liquidity Hunt
            </motion.button>
          ) : !hasSavings ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterVault}
              className="w-full py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2"
            >
              <span>Deposit into Vault to Activate Multipliers</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </motion.button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-xs">Your Liquidity Hunt Multiplier is Active!</span>
              </div>
              <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                {multiplier} Boost Active
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
