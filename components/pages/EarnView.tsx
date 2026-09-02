"use client";

import React, { useState } from "react";
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
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Hero Banner */}
      <div className="aura-card p-6 sm:p-10 bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 border border-amber-300 shadow-aura-md space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-amber-200/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Season 1: Confidential Liquidity Hunt</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-black text-white font-extrabold">
                {activeMarket} Pool
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-2">
              Encrypted TVL Boost & Yield Hunt
            </h2>
            <p className="text-xs text-slate-600 font-medium max-w-lg">
              Earn time-weighted protocol incentives and confidential prize multipliers simply by holding shielded savings in the vault.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm text-center min-w-[160px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Hunt Status</span>
            <div className="text-xl font-black text-amber-950 mt-0.5">{tier}</div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">
              {multiplier} Prize Multiplier
            </span>
          </div>
        </div>

        {/* Real-Time Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Shielded Principal</span>
            </span>
            <div className="text-2xl font-black text-black">
              ${userSavings} <span className="text-xs font-normal text-slate-500">{activeMarket}</span>
            </div>
            <p className="text-[10px] text-slate-400">100% principal safe & withdrawable</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-600" />
              <span>Draw Boost</span>
            </span>
            <div className="text-2xl font-black text-amber-800">
              {boostPct} <span className="text-xs font-bold text-slate-500">Odds Multiplier</span>
            </div>
            <p className="text-[10px] text-slate-400">Homomorphically computed onchain</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
              <span>Earned Hunt Points</span>
            </span>
            <div className="text-2xl font-black text-black">
              {Math.max(liquidityHuntPoints, Math.floor(savedNum * 12))} <span className="text-xs font-normal text-slate-500">PTS</span>
            </div>
            <p className="text-[10px] text-slate-400">Season 1 Retroactive Airdrop</p>
          </div>
        </div>
      </div>

      {/* 2. How the Confidential Liquidity Hunt Works */}
      <div className="aura-card p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-black">How Confidential Time-Weighted Rewards Work</h3>
            <p className="text-xs text-slate-500">Zero balance leakage while earning maximum incentives.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-medium">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-aura-yellow text-black font-black flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-black text-sm">Shield & Save</h4>
            <p className="text-slate-600 leading-relaxed">
              Wrap public tokens into confidential `cUSDT` or `cUSDC` and deposit into the prize vault. Your balance is converted into an encrypted `euint64` handle.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-aura-yellow text-black font-black flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-black text-sm">Encrypted Snapshot Weights</h4>
            <p className="text-slate-600 leading-relaxed">
              At every draw round, the protocol takes an encrypted snapshot of time-weighted deposits without exposing individual balances to anyone.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-aura-yellow text-black font-black flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-black text-sm">Automated Boosts</h4>
            <p className="text-slate-600 leading-relaxed">
              Longer savings duration homomorphically boosts your prize draw weights and unlocks higher Season 1 rewards!
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!account ? (
            <button
              onClick={onConnect}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow active:scale-95"
            >
              Connect Wallet to Join Liquidity Hunt
            </button>
          ) : !hasSavings ? (
            <button
              onClick={onEnterVault}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Deposit into Vault to Activate Multipliers</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">Your Liquidity Hunt Multiplier is Active!</span>
              </div>
              <span className="text-xs font-mono font-black text-emerald-900 bg-emerald-200/60 px-2.5 py-1 rounded-full">
                {multiplier} Boost Active
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
