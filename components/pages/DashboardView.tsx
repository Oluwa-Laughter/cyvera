"use client";

import React from "react";
import { 
  PiggyBank, 
  Trophy, 
  Coins, 
  Timer, 
  Sparkles, 
  ArrowUpRight, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  Gift, 
  Wallet,
  Eye,
  EyeOff,
  RefreshCw,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { ActiveMarketId, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";
import { DrawPhase } from "@/lib/store";

interface DashboardViewProps {
  account: string | null;
  activeMarket?: ActiveMarketId;
  onChangeMarket?: (m: ActiveMarketId) => void;
  walletBalance: string;
  decryptedBalance: string | null;
  decryptedWinnings: string | null;
  totalPrizeReserve: string;
  timeToNextDraw: number;
  drawPhase: DrawPhase;
  onNavigateTab: (tab: string) => void;
  onConnect: () => void;
  onOpenFaucet: () => void;
  onDecryptBalance: () => void;
  isDecryptingBalance: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  account,
  activeMarket = "cUSDT",
  onChangeMarket,
  walletBalance,
  decryptedBalance,
  decryptedWinnings,
  totalPrizeReserve,
  timeToNextDraw,
  drawPhase,
  onNavigateTab,
  onConnect,
  onOpenFaucet,
  onDecryptBalance,
  isDecryptingBalance,
}) => {
  const [timeLeft, setTimeLeft] = React.useState<number>(timeToNextDraw || 60);

  React.useEffect(() => {
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
  const savedNum = parseFloat((decryptedBalance || "0").replace(/,/g, "") || "0");
  const winNum = parseFloat(decryptedWinnings || "0");
  const totalNetPortfolio = (savedNum + winNum).toFixed(2);
  const marketCfg = ZAMA_SEPOLIA_CONFIG.markets[activeMarket];

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* 1. Market Switcher (High-End Island Tabs) */}
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
              <span>cUSDT Pool (8.50% APY)</span>
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
              <span>cUSDC Pool (12.00% APY)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 pr-2">
            <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Draw Phase: <strong className="text-white font-bold">{drawPhase}</strong>
            </span>
          </div>
        </div>
      )}

      {/* 2. Dual Portfolio Hero Card: Wallet Balance + Shielded Savings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card A: Connected Wallet Balance */}
        <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
          <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 backdrop-blur-xl border border-white/[0.04] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-medium text-slate-400 block uppercase">
                    Available in Wallet
                  </span>
                  <h3 className="text-xs font-bold text-white">Spendable {activeMarket}</h3>
                </div>
              </div>

              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Sepolia Live
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-white font-mono">
                {account ? (
                  <span>
                    ${walletBalance || "0.00"}{" "}
                    <span className="text-sm text-slate-400 font-normal font-sans">{activeMarket}</span>
                  </span>
                ) : (
                  <span className="text-slate-500 text-xl font-medium font-sans">Not Connected</span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                Tokens in your wallet ready to deposit into the zero-loss prize pool.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              {account ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onNavigateTab("vault")}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PiggyBank className="w-3.5 h-3.5 text-slate-950" />
                    <span>Deposit & Save</span>
                  </motion.button>

                  <button
                    onClick={onOpenFaucet}
                    className="px-4 py-3 rounded-2xl bg-[#131929] hover:bg-[#1A2238] border border-cyan-500/30 text-cyan-300 hover:text-white font-bold text-xs transition-colors"
                  >
                    + Free Tokens
                  </button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onConnect}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                >
                  <Wallet className="w-3.5 h-3.5 text-slate-950" />
                  <span>Connect Wallet</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Card B: Shielded Savings in Vault */}
        <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
          <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 backdrop-blur-xl border border-white/[0.04] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-medium text-slate-400 block uppercase">
                    Your Shielded Savings
                  </span>
                  <h3 className="text-xs font-bold text-white">100% Zero-Loss Principal</h3>
                </div>
              </div>

              {hasWinnings && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30">
                  +${decryptedWinnings} Won
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <div className="text-3xl font-extrabold text-white font-mono">
                  {account ? (
                    decryptedBalance !== null ? (
                      <span>
                        ${hasWinnings ? totalNetPortfolio : decryptedBalance}{" "}
                        <span className="text-sm text-slate-400 font-normal font-sans">{activeMarket}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 tracking-widest text-2xl">
                        •••••••• <span className="text-sm text-slate-400 font-sans">{activeMarket}</span>
                      </span>
                    )
                  ) : (
                    <span className="text-slate-500 text-xl font-medium font-sans">Not Connected</span>
                  )}
                </div>

                {account && (
                  <button
                    onClick={onDecryptBalance}
                    disabled={isDecryptingBalance}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131929] hover:bg-[#1A2238] border border-cyan-500/30 text-[11px] font-semibold text-cyan-300 hover:text-white transition-all"
                  >
                    {isDecryptingBalance ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                    ) : decryptedBalance !== null ? (
                      <>
                        <EyeOff className="w-3 h-3 text-slate-400" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Reveal</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                100% private and protected. Automatically enters every recurring draw.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              {account && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onNavigateTab("vault")}
                  className="w-full py-3 rounded-2xl bg-[#131929] hover:bg-[#1A2238] border border-white/[0.08] text-slate-200 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Manage Vault & Withdraw</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Telemetry Metric Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0C101A]/80 border border-white/[0.06] space-y-1.5 shadow-sm">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeMarket} Prize Pot</span>
          </span>
          <div className="text-2xl font-bold text-white font-mono">
            ${totalPrizeReserve} <span className="text-xs font-normal text-slate-400 font-sans">{activeMarket}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-normal">Awarded in recurring draws</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C101A]/80 border border-white/[0.06] space-y-1.5 shadow-sm">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-blue-400" />
            <span>Next Draw Countdown</span>
          </span>
          <div className="text-2xl font-bold text-white font-mono">
            {formattedTime}
          </div>
          <p className="text-[11px] text-slate-400 font-normal">Draws run every 60 seconds</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C101A]/80 border border-white/[0.06] space-y-1.5 shadow-sm">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Annual Yield (APY)</span>
          </span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {marketCfg.apy}
          </div>
          <p className="text-[11px] text-slate-400 font-normal">100% streams into the prize pot</p>
        </div>
      </div>

      {/* 4. Next Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("draws")}
          className="p-5 rounded-2xl bg-[#0C101A]/80 border border-white/[0.06] hover:border-cyan-500/30 cursor-pointer flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Automatic Verifiable Draws</h4>
              <p className="text-xs text-slate-400 font-normal">Check draw progress & provably fair winner selection</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab("rewards")}
          className="p-5 rounded-2xl bg-[#0C101A]/80 border border-white/[0.06] hover:border-emerald-500/30 cursor-pointer flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Private Prize Reveal</h4>
              <p className="text-xs text-slate-400 font-normal">Safely inspect your winnings, claim to wallet, or compound</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </motion.div>
      </div>
    </div>
  );
};
