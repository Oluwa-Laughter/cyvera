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
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { HiTrophy } from "react-icons/hi2";
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
    { id: "SNAPSHOT", label: "2. Snapshot", desc: "Encrypted weights locked", active: drawPhase === "SNAPSHOT" },
    { id: "SELECTING", label: "3. Selection", desc: "FHE.randEuint64() RNG", active: drawPhase === "SELECTING" },
    { id: "CLAIMING", label: "4. Claim Window", desc: "Private reveal session open", active: drawPhase === "CLAIMING" },
  ];

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
              cUSDT Draws ($15.00 Pot)
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeMarket === "cUSDC" 
                  ? "bg-cyvera-gold text-black font-black shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              cUSDC Draws ($25.00 Pot)
            </button>
          </div>
          <span className="text-[11px] font-bold text-[var(--muted)] hidden sm:inline">
            1-Minute Automated Testnet Cycle
          </span>
        </div>
      )}

      {/* 2. Active Draw Hero Banner */}
      <div className="cyvera-card p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--card-border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                Active Prize Draw #{currentDrawId}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyvera-gold text-black font-extrabold shadow-sm">
                1-Minute Frequency
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-foreground font-mono">
              ${currentPrizePot}{" "}
              <span className="text-lg text-[var(--muted)] font-normal">{activeMarket} Prize Pot</span>
            </div>
            <p className="text-xs text-[var(--muted)] font-medium">
              Active Participants: <strong className="text-foreground font-bold">{totalDepositors} Savers in this Pool</strong>
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-[var(--card-border)] shadow-md text-center min-w-[180px] space-y-1">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide flex items-center justify-center gap-1">
              <FiClock className="w-3.5 h-3.5 text-amber-500" />
              <span>Draw Countdown</span>
            </span>
            <div className="text-3xl sm:text-4xl font-black text-foreground font-mono tracking-tight">
              {formattedTime}
            </div>
            <span className="text-[10px] text-[var(--muted)] font-medium">Recur every 60 seconds</span>
          </div>
        </div>

        {/* 4-Phase Verifiable Draw Progression Tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>4-Phase Verifiable Draw State</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Permissionless Progression
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {phases.map((p) => (
              <div
                key={p.id}
                className={`p-3 rounded-2xl border transition-all ${
                  p.active 
                    ? "bg-cyvera-gold border-amber-400 text-black font-bold shadow-cyvera-glow" 
                    : "bg-slate-50 dark:bg-slate-800/40 border-[var(--card-border)] text-[var(--muted)]"
                }`}
              >
                <div className="font-extrabold text-[11px]">{p.label}</div>
                <div className="text-[10px] mt-0.5 opacity-80">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {!account ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnect}
              className="w-full py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow"
            >
              Connect Wallet
            </motion.button>
          ) : totalDepositors === 0 && onNavigateVault ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNavigateVault}
              className="w-full py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2"
            >
              <span>Deposit in Vault to Activate Draw Tickets</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTriggerDraw}
              disabled={isTriggeringDraw}
              className="w-full py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isTriggeringDraw ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <PlayCircle className="w-4 h-4 text-black" />}
              <span>
                {isTriggeringDraw ? "Executing FHE Onchain Draw..." : "Execute Draw Now (Permissionless)"}
              </span>
            </motion.button>
          )}

          {account && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCheckWinnings}
              disabled={isCheckingWinnings}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isCheckingWinnings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4 text-amber-500" />}
              <span>Private Prize Reveal</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* 3. Privacy & Cryptography Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-foreground text-sm">Encrypted Draw Weights</h4>
          <p className="text-[var(--muted)] leading-relaxed font-medium">
            A player’s deposit becomes their draw weight, but that weight stays encrypted in `euint64`. Nobody sees your odds.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 font-bold flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-foreground text-sm">FHE.randEuint64() RNG</h4>
          <p className="text-[var(--muted)] leading-relaxed font-medium">
            Winner selection runs onchain using Zama's verifiable randomness engine computed over encrypted balances.
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-foreground text-sm">Winner-Only Decryption</h4>
          <p className="text-[var(--muted)] leading-relaxed font-medium">
            Prizes are credited as encrypted handles. Only the winner can authorize wallet decryption to inspect their prize.
          </p>
        </motion.div>
      </div>

      {/* 4. Recent Executed Draws */}
      <div className="cyvera-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black uppercase tracking-wide text-foreground">Recent Executed Draws</h3>
          </div>
          <span className="text-[11px] text-[var(--muted)] font-medium">Automatic FHE onchain selection</span>
        </div>

        {drawHistory.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-[var(--card-border)] space-y-2">
            <div className="text-xs font-bold text-foreground">Draw #1 In Progress</div>
            <p className="text-[11px] text-[var(--muted)]">
              Deposit tokens and click "Execute Draw Now" to pick an onchain winner using Zama FHE randomness!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {drawHistory.map((draw) => (
              <div
                key={draw.drawId}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  draw.isMyWin 
                    ? "bg-amber-500/10 border-amber-500/30 shadow-sm" 
                    : "bg-slate-50 dark:bg-slate-800/40 border-[var(--card-border)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                    draw.isMyWin ? "bg-cyvera-gold text-black" : "bg-slate-200 dark:bg-slate-700 text-foreground"
                  }`}>
                    #{draw.drawId}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      {new Date(draw.timestamp * 1000).toLocaleTimeString()}
                    </div>
                    <div className="text-[11px] text-[var(--muted)]">
                      {draw.totalParticipants} Savers in Draw • Winner:{" "}
                      <span className="font-mono font-bold text-foreground">
                        {draw.winner.slice(0, 6)}...{draw.winner.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="font-mono font-black text-emerald-500 text-sm">
                      +${draw.prizeAmount} {activeMarket}
                    </div>
                    <span className="text-[10px] text-[var(--muted)]">Awarded</span>
                  </div>
                  {draw.isMyWin && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyvera-gold text-black font-extrabold border border-amber-300">
                      YOU WON!
                    </span>
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
