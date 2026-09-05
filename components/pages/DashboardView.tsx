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
  Wallet,
  ArrowUpRight
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
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* 1. Market Switcher */}
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
              <span className="sm:hidden">cUSDT (8.5%)</span>
              <span className="hidden sm:inline">cUSDT Pool (8.50% APY)</span>
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all ${
                activeMarket === "cUSDC" 
                  ? "bg-cyvera-gold text-black font-extrabold shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              <span className="sm:hidden">cUSDC (12%)</span>
              <span className="hidden sm:inline">cUSDC Pool (12.00% APY)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] font-medium text-[var(--muted)]">
              Draw Status: <strong className="text-foreground font-bold uppercase">{drawPhase}</strong>
            </span>
          </div>
        </div>
      )}

      {/* 2. Dual Portfolio Hero Card: Wallet Balance + Shielded Savings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card A: Connected Wallet Balance */}
        <div className="cyvera-card p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[var(--muted)] block">
                  Available in Wallet
                </span>
                <h3 className="text-xs font-bold text-foreground">Spendable {activeMarket}</h3>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
              Sepolia Live
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
              {account ? (
                <span>
                  ${walletBalance || "0.00"}{" "}
                  <span className="text-sm text-[var(--muted)] font-normal">{activeMarket}</span>
                </span>
              ) : (
                <span className="text-[var(--muted)] text-xl font-medium font-sans">Not Connected</span>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] font-normal leading-relaxed">
              Tokens in your wallet ready to deposit into the zero-loss prize pool.
            </p>
          </div>

          <div className="pt-1 flex items-center gap-2.5">
            {account ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigateTab("vault")}
                  className="flex-1 py-2.5 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow flex items-center justify-center gap-1.5"
                >
                  <PiggyBank className="w-3.5 h-3.5 text-black" />
                  <span>Deposit & Save</span>
                </motion.button>

                <button
                  onClick={onOpenFaucet}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-semibold text-xs transition-colors"
                >
                  + Free Tokens
                </button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConnect}
                className="w-full py-2.5 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow flex items-center justify-center gap-2"
              >
                <Wallet className="w-3.5 h-3.5 text-black" />
                <span>Connect Wallet</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Card B: Shielded Savings in Vault */}
        <div className="cyvera-card p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[var(--muted)] block">
                  Your Shielded Savings
                </span>
                <h3 className="text-xs font-bold text-foreground">100% Zero-Loss Principal</h3>
              </div>
            </div>

            {hasWinnings && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 font-bold border border-amber-500/30">
                +${decryptedWinnings} Won
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                {account ? (
                  decryptedBalance !== null ? (
                    <span>
                      ${hasWinnings ? totalNetPortfolio : decryptedBalance}{" "}
                      <span className="text-sm text-[var(--muted)] font-normal">{activeMarket}</span>
                    </span>
                  ) : (
                    <span className="text-[var(--muted)] tracking-widest text-xl sm:text-2xl">
                      •••••••• <span className="text-sm text-[var(--muted)]">{activeMarket}</span>
                    </span>
                  )
                ) : (
                  <span className="text-[var(--muted)] text-xl font-medium font-sans">Not Connected</span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptBalance}
                  disabled={isDecryptingBalance}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-[11px] font-semibold text-foreground transition-all active:scale-95"
                >
                  {isDecryptingBalance ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : decryptedBalance !== null ? (
                    <>
                      <EyeOff className="w-3 h-3 text-[var(--muted)]" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 text-amber-500" />
                      <span>Reveal</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] font-normal leading-relaxed">
              100% private and protected. Automatically enters every recurring draw.
            </p>
          </div>

          <div className="pt-1 flex items-center gap-2.5">
            {account && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateTab("vault")}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Manage Vault & Withdraw</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--muted)]" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Three Telemetry Metric Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-sm">
          <span className="text-[11px] font-medium text-[var(--muted)] flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{activeMarket} Prize Pot</span>
          </span>
          <div className="text-xl sm:text-2xl font-bold text-foreground font-mono">
            ${totalPrizeReserve} <span className="text-xs font-normal text-[var(--muted)]">{activeMarket}</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] font-normal">Awarded in recurring draws</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-sm">
          <span className="text-[11px] font-medium text-[var(--muted)] flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span>Next Draw Countdown</span>
          </span>
          <div className="text-xl sm:text-2xl font-bold text-foreground font-mono">
            {formattedTime}
          </div>
          <p className="text-[11px] text-[var(--muted)] font-normal">Draws run every 60 seconds</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-sm">
          <span className="text-[11px] font-medium text-[var(--muted)] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Annual Yield (APY)</span>
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-500 dark:text-emerald-400 font-mono">
            {marketCfg.apy}
          </div>
          <p className="text-[11px] text-[var(--muted)] font-normal">100% streams into the prize pot</p>
        </div>
      </div>

      {/* 4. Next Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("draws")}
          className="cyvera-card p-5 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Automatic Verifiable Draws</h4>
              <p className="text-xs text-[var(--muted)] font-normal">Check draw progress & provably fair winner selection</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("rewards")}
          className="cyvera-card p-5 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Private Prize Reveal</h4>
              <p className="text-xs text-[var(--muted)] font-normal">Safely inspect your winnings, claim to wallet, or compound</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </motion.div>
      </div>
    </div>
  );
};
