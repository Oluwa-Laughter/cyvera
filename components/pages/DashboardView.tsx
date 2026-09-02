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

      {/* 2. Dual Portfolio Hero Card: Wallet Balance + Shielded Savings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card A: Connected Wallet Balance */}
        <div className="cyvera-card p-6 sm:p-8 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block">
                  Available in Connected Wallet
                </span>
                <h3 className="text-xs font-bold text-foreground">Spendable {activeMarket}</h3>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/30">
              Sepolia Live
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-foreground font-mono">
              {account ? (
                <span>
                  ${walletBalance || "0.00"}{" "}
                  <span className="text-base text-[var(--muted)] font-normal">{activeMarket}</span>
                </span>
              ) : (
                <span className="text-[var(--muted)] text-2xl font-bold font-sans">Not Connected</span>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] font-medium">
              Tokens ready to be shielded and deposited into the zero-loss prize pool.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            {account ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigateTab("vault")}
                  className="flex-1 py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-1.5"
                >
                  <PiggyBank className="w-4 h-4 text-black" />
                  <span>Deposit & Save</span>
                </motion.button>

                <button
                  onClick={onOpenFaucet}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-bold text-xs transition-colors"
                >
                  + Mint More
                </button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConnect}
                className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4 text-black" />
                <span>Connect Wallet to View</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Card B: Shielded Savings in Vault */}
        <div className="cyvera-card p-6 sm:p-8 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block">
                  Your Shielded Savings
                </span>
                <h3 className="text-xs font-bold text-foreground">100% Zero-Loss Vault</h3>
              </div>
            </div>

            {hasWinnings && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 font-black border border-amber-500/30">
                +${decryptedWinnings} Won
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <div className="text-3xl sm:text-4xl font-black text-foreground font-mono">
                {account ? (
                  decryptedBalance !== null ? (
                    <span>
                      ${hasWinnings ? totalNetPortfolio : decryptedBalance}{" "}
                      <span className="text-base text-[var(--muted)] font-normal">{activeMarket}</span>
                    </span>
                  ) : (
                    <span className="text-[var(--muted)] tracking-widest text-2xl sm:text-3xl">
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
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-xs font-semibold text-foreground transition-all active:scale-95"
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
                      <span>Reveal</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] font-medium">
              Encrypted in Zama euint64. Earns tickets in every recurring draw.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            {account && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateTab("vault")}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Manage Vault & Withdraw</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--muted)]" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Three Telemetry Metric Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{activeMarket} Prize Pot</span>
          </span>
          <div className="text-2xl font-black text-foreground font-mono">
            ${totalPrizeReserve} <span className="text-xs font-normal text-[var(--muted)]">{activeMarket}</span>
          </div>
          <p className="text-[10px] text-[var(--muted)] font-medium">Distributed in recurring draws</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span>Next Draw Countdown</span>
          </span>
          <div className="text-2xl font-black text-foreground font-mono">
            {formattedTime}
          </div>
          <p className="text-[10px] text-[var(--muted)] font-medium">Recur every 60 seconds</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-sm">
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

      {/* 4. Next Actions Grid */}
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
