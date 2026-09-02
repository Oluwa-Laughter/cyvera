"use client";

import React, { useState, useEffect } from "react";
import { 
  PiggyBank, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Timer, 
  TrendingUp, 
  Droplets, 
  Coins, 
  ChevronRight, 
  Gift,
  Flame,
  Layers,
  Lock,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import { AppPageTab } from "@/components/SidebarNav";
import { DrawRecordView } from "@/components/PrizeDrawCard";
import { ActiveMarketId, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";
import { DrawPhase } from "@/lib/store";

interface DashboardViewProps {
  account: string | null;
  activeMarket?: ActiveMarketId;
  onChangeMarket?: (m: ActiveMarketId) => void;
  drawPhase?: DrawPhase;
  liquidityHuntPoints?: number;
  walletBalance: string;
  decryptedBalance: string | null;
  decryptedWinnings: string | null;
  totalDeposits: string;
  totalPrizeReserve: string;
  totalPrizesAwarded: string;
  depositorsCount: number;
  lastDrawTime: number;
  drawInterval: number;
  currentDrawId: number;
  winnersPerDraw: number;
  timeToNextDraw: number;
  apyBasisPoints: number;
  drawHistory: DrawRecordView[];
  onNavigateTab: (tab: AppPageTab) => void;
  onOpenFaucet: () => void;
  onConnect: () => void;
  onDecryptBalance: () => void;
  isDecryptingBalance: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  account,
  activeMarket = "cUSDT",
  onChangeMarket,
  drawPhase = "OPEN",
  liquidityHuntPoints = 0,
  walletBalance,
  decryptedBalance,
  decryptedWinnings,
  totalDeposits,
  totalPrizeReserve,
  totalPrizesAwarded,
  depositorsCount,
  lastDrawTime,
  drawInterval,
  currentDrawId,
  winnersPerDraw,
  timeToNextDraw,
  apyBasisPoints,
  drawHistory,
  onNavigateTab,
  onOpenFaucet,
  onConnect,
  onDecryptBalance,
  isDecryptingBalance,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeToNextDraw || 60);

  useEffect(() => {
    setTimeLeft(timeToNextDraw);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeToNextDraw]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const hasWinnings = parseFloat(decryptedWinnings || "0") > 0;
  const savedNum = parseFloat(decryptedBalance || "0");
  const winNum = parseFloat(decryptedWinnings || "0");
  const totalNetPortfolio = (savedNum + winNum).toFixed(2);
  const marketCfg = ZAMA_SEPOLIA_CONFIG.markets[activeMarket];

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-foreground">
      {/* 1. Market Switcher */}
      {onChangeMarket && (
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm">
          <div className="flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => onChangeMarket("cUSDT")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeMarket === "cUSDT" 
                  ? "bg-cyvera-gold text-black font-black shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              cUSDT Market (8.50% APY)
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeMarket === "cUSDC" 
                  ? "bg-cyvera-gold text-black font-black shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              cUSDC Market (12.00% APY)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] font-bold text-[var(--muted)]">
              Draw Phase: <strong className="text-foreground font-extrabold uppercase">{drawPhase}</strong>
            </span>
          </div>
        </div>
      )}

      {/* 2. User Portfolio Hero Banner */}
      <div className="cyvera-card p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--card-border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Your Shielded Savings</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-extrabold border border-emerald-500/20">
                100% Zero-Loss
              </span>
              {hasWinnings && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 font-black border border-amber-500/30">
                  +${decryptedWinnings} Won Profit
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-4xl sm:text-5xl font-black text-foreground font-mono">
                {account ? (
                  decryptedBalance !== null ? (
                    <span>
                      ${hasWinnings ? totalNetPortfolio : decryptedBalance}{" "}
                      <span className="text-base text-[var(--muted)] font-normal">{activeMarket}</span>
                    </span>
                  ) : (
                    <span className="text-[var(--muted)] tracking-widest text-3xl">
                      •••••••• <span className="text-base text-[var(--muted)]">{activeMarket}</span>
                    </span>
                  )
                ) : (
                  <span className="text-[var(--muted)] text-2xl font-bold font-sans">Not Connected</span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptBalance}
                  disabled={isDecryptingBalance}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-xs font-semibold text-foreground transition-all shadow-sm active:scale-95"
                >
                  {isDecryptingBalance ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : decryptedBalance !== null ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-500" />
                      <span>Reveal Balance</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {account && (
              <div className="flex items-center gap-4 text-xs pt-1">
                <span className="text-[var(--muted)] flex items-center gap-1.5 font-medium">
                  <Wallet className="w-3.5 h-3.5 text-amber-500" />
                  <span>Wallet Balance:</span>
                  <strong className="font-mono text-foreground font-bold">${walletBalance || "0.00"} {activeMarket}</strong>
                </span>

                <button
                  onClick={onOpenFaucet}
                  className="text-amber-500 hover:underline font-bold text-[11px]"
                >
                  + Mint Free {activeMarket}
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {!account ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConnect}
                className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs shadow-cyvera-glow"
              >
                Connect Wallet
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigateTab("vault")}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs shadow-cyvera-glow flex items-center justify-center gap-2"
              >
                <PiggyBank className="w-4 h-4 text-black" />
                <span>Deposit & Save</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeMarket} Prize Pot</span>
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              ${totalPrizeReserve} <span className="text-xs font-normal text-[var(--muted)]">{activeMarket}</span>
            </div>
            <p className="text-[10px] text-[var(--muted)] font-medium">Distributed in recurring draws</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-amber-500" />
              <span>Next Draw Countdown</span>
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              {formattedTime}
            </div>
            <p className="text-[10px] text-[var(--muted)] font-medium">Recur every 60 seconds</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-1">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Annual Yield (APY)</span>
            </span>
            <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono">
              {marketCfg.apy}
            </div>
            <p className="text-[10px] text-[var(--muted)] font-medium">100% feeds the prize pot</p>
          </div>
        </div>
      </div>

      {/* 3. Next Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigateTab("draws")}
          className="cyvera-card p-6 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-foreground">4-Phase Verifiable Draws</h4>
              <p className="text-xs text-[var(--muted)] font-medium">Inspect draw progress & verify Zama FHE randomness</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigateTab("rewards")}
          className="cyvera-card p-6 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-foreground">Private Prize Reveal</h4>
              <p className="text-xs text-[var(--muted)] font-medium">Authorize EIP-712 session to claim or auto-compound</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </motion.div>
      </div>
    </div>
  );
};
