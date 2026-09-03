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
  Lock,
  ArrowRight,
  Layers,
  ChevronRight,
  Eye,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { ActiveMarketId, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";
import { DrawPhase } from "@/lib/store";

export interface DrawRecordView {
  drawId: number;
  timestamp: number;
  totalParticipants: number;
  prizeAmount: string;
  winner: string;
  executed: boolean;
  isMyWin: boolean;
}

interface DrawsViewProps {
  account: string | null;
  activeMarket?: ActiveMarketId;
  onChangeMarket?: (m: ActiveMarketId) => void;
  drawPhase?: DrawPhase;
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
  onNavigateVault?: () => void;
  onNavigateRewards?: () => void;
}

export const DrawsView: React.FC<DrawsViewProps> = ({
  account,
  activeMarket = "cUSDT",
  onChangeMarket,
  drawPhase = "OPEN",
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
  onNavigateVault,
  onNavigateRewards,
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

  const phases = [
    { id: "OPEN", label: "1. Open", desc: "Deposits & tickets active", active: drawPhase === "OPEN" },
    { id: "SNAPSHOT", label: "2. Snapshot", desc: "Private weights locked", active: drawPhase === "SNAPSHOT" },
    { id: "SELECTING", label: "3. Selection", desc: "Fair random selection", active: drawPhase === "SELECTING" },
    { id: "CLAIMING", label: "4. Claim Window", desc: "Private reveal session open", active: drawPhase === "CLAIMING" },
  ];

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* 1. Market Switcher */}
      {onChangeMarket && (
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => onChangeMarket("cUSDT")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeMarket === "cUSDT" 
                  ? "bg-cyvera-gold text-black font-extrabold shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              cUSDT Draws (${currentPrizePot} Pot)
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeMarket === "cUSDC" 
                  ? "bg-cyvera-gold text-black font-extrabold shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              cUSDC Draws (${currentPrizePot} Pot)
            </button>
          </div>
          <span className="text-[11px] font-medium text-[var(--muted)] hidden sm:inline">
            Automated 60-Second Recurring Cycle
          </span>
        </div>
      )}

      {/* 2. Active Draw Hero Banner */}
      <div className="cyvera-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5 border-b border-[var(--card-border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Active Prize Draw #{currentDrawId}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyvera-gold text-black font-bold shadow-sm">
                1-Minute Frequency
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
              ${currentPrizePot}{" "}
              <span className="text-base text-[var(--muted)] font-normal">{activeMarket} Prize Pot</span>
            </div>
            <p className="text-xs text-[var(--muted)] font-normal">
              Active Participants: <strong className="text-foreground font-semibold">{totalDepositors} Savers in Pool</strong>
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-[var(--card-border)] shadow-sm text-center min-w-[170px] space-y-0.5">
            <span className="text-[11px] font-medium text-[var(--muted)] flex items-center justify-center gap-1">
              <FiClock className="w-3.5 h-3.5 text-amber-500" />
              <span>Next Draw In</span>
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono tracking-tight">
              {formattedTime}
            </div>
            <span className="text-[10px] text-[var(--muted)]">Runs every 60 seconds</span>
          </div>
        </div>

        {/* 4-Phase Verifiable Draw Progression Tracker */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Draw Lifecycle Phases</span>
            </span>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Fair & Transparent
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {phases.map((p) => (
              <div
                key={p.id}
                className={`p-3 rounded-xl border transition-all ${
                  p.active 
                    ? "bg-cyvera-gold border-amber-400 text-black font-bold shadow-cyvera-glow" 
                    : "bg-slate-50 dark:bg-slate-800/40 border-[var(--card-border)] text-[var(--muted)]"
                }`}
              >
                <div className="font-bold text-[11px]">{p.label}</div>
                <div className="text-[10px] mt-0.5 opacity-80">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 4 Callout Banner */}
        {drawPhase === "CLAIMING" && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyvera-gold text-black font-bold shrink-0 shadow-sm">
                <Gift className="w-4 h-4 text-black" />
              </div>
              <div>
                <strong className="text-foreground font-bold block">
                  Phase 4 (Claim Window) is Active!
                </strong>
                <span className="text-[var(--muted)] text-[11px]">
                  Prizes have been privately awarded. Open Private Reveal to inspect and claim your profit.
                </span>
              </div>
            </div>
            {onNavigateRewards && (
              <button
                onClick={onNavigateRewards}
                className="px-3.5 py-2 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shrink-0 shadow-cyvera-glow flex items-center gap-1"
              >
                <span>Go to Private Reveal</span>
                <ChevronRight className="w-3.5 h-3.5 text-black" />
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {!account ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnect}
              className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow"
            >
              Connect Wallet
            </motion.button>
          ) : totalDepositors === 0 && onNavigateVault ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNavigateVault}
              className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow flex items-center justify-center gap-2"
            >
              <span>Deposit in Vault to Activate Draw Tickets</span>
              <ChevronRight className="w-3.5 h-3.5 text-black" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTriggerDraw}
              disabled={isTriggeringDraw}
              className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isTriggeringDraw ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" /> : <PlayCircle className="w-3.5 h-3.5 text-black" />}
              <span>
                {isTriggeringDraw ? "Running Verifiable Draw..." : "Execute Draw Now (Permissionless)"}
              </span>
            </motion.button>
          )}

          {account && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNavigateRewards || onCheckWinnings}
              disabled={isCheckingWinnings}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-semibold text-xs transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isCheckingWinnings ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Gift className="w-3.5 h-3.5 text-amber-500" />}
              <span>Private Prize Reveal</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)]" />
            </motion.button>
          )}
        </div>
      </div>

      {/* 3. Detailed Consumer Guide: How Draws Connect to Private Reveal */}
      <div className="cyvera-card p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--card-border)]">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-foreground">
            How Draw Phases & Private Reveals Work
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-1.5">
            <span className="text-[10px] font-bold text-amber-500 uppercase">Phase 1</span>
            <h4 className="font-bold text-foreground">Open Savings</h4>
            <p className="text-[var(--muted)] text-[11px] leading-relaxed">
              Deposit cUSDT or cUSDC. Every $1.00 gives 1 private draw ticket. Principal earns yield and is always protected.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-1.5">
            <span className="text-[10px] font-bold text-amber-500 uppercase">Phase 2</span>
            <h4 className="font-bold text-foreground">Snapshot Weights</h4>
            <p className="text-[var(--muted)] text-[11px] leading-relaxed">
              At the draw deadline, all active ticket weights are committed without exposing anyone's balance to the public.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-1.5">
            <span className="text-[10px] font-bold text-purple-500 uppercase">Phase 3</span>
            <h4 className="font-bold text-foreground">Fair Selection</h4>
            <p className="text-[var(--muted)] text-[11px] leading-relaxed">
              Verifiable cryptographic randomness picks the winning ticket onchain, privately crediting the prize.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Phase 4</span>
            <h4 className="font-bold text-foreground">Reveal & Claim</h4>
            <p className="text-[var(--muted)] text-[11px] leading-relaxed">
              Winners open the Private Reveal tab to safely inspect their prize and claim real tokens to their wallet.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Recent Executed Draws */}
      <div className="cyvera-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">Recent Executed Draws</h3>
          </div>
          <span className="text-[11px] text-[var(--muted)]">Automatic verifiable onchain selection</span>
        </div>

        {drawHistory.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-[var(--card-border)] space-y-1.5">
            <div className="text-xs font-bold text-foreground">Draw #1 In Progress</div>
            <p className="text-[11px] text-[var(--muted)]">
              Deposit tokens and click &quot;Execute Draw Now&quot; to pick an onchain winner with verifiable randomness!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {drawHistory.map((draw) => (
              <div
                key={draw.drawId}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  draw.isMyWin
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-slate-50 dark:bg-slate-800/40 border-[var(--card-border)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${draw.isMyWin ? "bg-amber-500 text-black font-bold shadow-sm" : "bg-slate-100 dark:bg-slate-800 text-[var(--muted)]"}`}>
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>Draw #{draw.drawId}</span>
                      {draw.isMyWin && (
                        <span className="text-[10px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full">
                          You Won!
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--muted)]">
                      {new Date(draw.timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {draw.totalParticipants} Participants
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-foreground">
                      ${draw.prizeAmount} {draw.market}
                    </div>
                    <span className="text-[10px] text-emerald-500 font-bold">
                      {draw.phase}
                    </span>
                  </div>

                  {draw.isMyWin && onNavigateRewards && (
                    <button
                      onClick={onNavigateRewards}
                      className="px-3 py-1.5 rounded-lg bg-cyvera-gold text-black font-bold text-xs shadow-sm hover:scale-105 transition-transform"
                    >
                      Claim Prize
                    </button>
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
