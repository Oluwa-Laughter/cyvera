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
  ArrowUpRight,
  PiggyBank
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
  phase?: string;
  market?: string;
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
  userSavings?: string;
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
  userSavings = "0.00",
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

  // Live real-time phase derived dynamically from the countdown timer
  const livePhase: DrawPhase = isTriggeringDraw 
    ? "SELECTING" 
    : timeLeft > 20 
    ? "OPEN" 
    : timeLeft > 5 
    ? "SNAPSHOT" 
    : timeLeft > 0 
    ? "SELECTING" 
    : "CLAIMING";

  const phases = [
    { 
      id: "OPEN", 
      label: "1. Open", 
      desc: "Deposits & tickets active", 
      active: livePhase === "OPEN",
      activeBg: "bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    },
    { 
      id: "SNAPSHOT", 
      label: "2. Snapshot", 
      desc: "Private weights locked", 
      active: livePhase === "SNAPSHOT",
      activeBg: "bg-blue-500/15 border-blue-400/40 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
    },
    { 
      id: "SELECTING", 
      label: "3. Selection", 
      desc: "Fair random selection", 
      active: livePhase === "SELECTING",
      activeBg: "bg-purple-500/15 border-purple-400/40 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
    },
    { 
      id: "CLAIMING", 
      label: "4. Claim Window", 
      desc: "Private reveal session open", 
      active: livePhase === "CLAIMING",
      activeBg: "bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
    },
  ];

  const parsedSavings = parseFloat(userSavings || "0");
  const userHasTickets = parsedSavings > 0;
  const hasWinnings = parseFloat(decryptedWinnings || "0") > 0;

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
              <span>cUSDT Pool (${currentPrizePot} Pot)</span>
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
              <span>cUSDC Pool (${currentPrizePot} Pot)</span>
            </button>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 hidden sm:inline">
            Automated 60s Cycle
          </span>
        </div>
      )}

      {/* 2. Active Draw Hero Banner (Double-Bezel Architecture) */}
      <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-5 sm:p-7 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 backdrop-blur-xl border border-white/[0.04] space-y-6">
          
          {/* Header & Metric Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5 border-b border-white/[0.06]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Draw #{currentDrawId} • {activeMarket}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-white/[0.08]">
                  Zero-Loss Protected
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-2">
                <span>${currentPrizePot}</span>
                <span className="text-sm font-sans font-medium text-slate-400">{activeMarket} Prize Pot</span>
              </div>

              {/* Participation & Ticket Status */}
              <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pool Savers: <strong className="text-white font-semibold">{totalDepositors} Active</strong></span>
                </span>
                <span className="text-slate-600">•</span>
                {userHasTickets ? (
                  <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your Tickets: {parsedSavings.toFixed(0)} (${parsedSavings.toFixed(2)})</span>
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-white/[0.08] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Tickets: 0 (Deposit in Vault to Enter)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Countdown Clock Box */}
            <div className="p-4 rounded-2xl bg-[#111624] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] text-center min-w-[170px] space-y-1">
              <span className="text-[11px] font-medium text-slate-400 flex items-center justify-center gap-1.5">
                <FiClock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Next Draw In</span>
              </span>
              <div className="text-3xl font-black text-white font-mono tracking-wider drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                {formattedTime}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">1-min testnet cycle</span>
            </div>
          </div>

          {/* 4-Phase Verifiable Draw Progression Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Draw Lifecycle Phases</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Phase: {livePhase}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {phases.map((p) => (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                    p.active 
                      ? p.activeBg 
                      : "bg-[#0F1320]/60 border-white/[0.05] text-slate-400"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{p.label}</span>
                    {p.active && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                  </div>
                  <div className="text-[10px] mt-1 opacity-80 leading-snug">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 4 Callout Banner (Appears when user has won) */}
          {hasWinnings && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  <Trophy className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <strong className="text-white font-bold text-sm block">
                    You Won +${decryptedWinnings} {activeMarket}!
                  </strong>
                  <span className="text-slate-400 text-[11px]">
                    Your confidential prize is ready. Open Private Reveal to inspect and claim to your wallet.
                  </span>
                </div>
              </div>
              {onNavigateRewards && (
                <button
                  onClick={onNavigateRewards}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-1.5 transition-all"
                >
                  <span>Go to Private Reveal</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
                </button>
              )}
            </motion.div>
          )}

          {/* 3 Core Action Buttons (Guaranteed on BOTH cUSDT & cUSDC) */}
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Button 1: Execute Draw Now (Permissionless) */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={!account ? onConnect : onTriggerDraw}
                disabled={isTriggeringDraw}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isTriggeringDraw ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <PlayCircle className="w-4 h-4 text-slate-950" />
                )}
                <span>
                  {isTriggeringDraw ? "Running Draw..." : "Execute Draw Now"}
                </span>
              </motion.button>

              {/* Button 2: Private Prize Reveal */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={!account ? onConnect : (onNavigateRewards || onCheckWinnings)}
                disabled={isCheckingWinnings}
                className="py-3.5 px-4 rounded-2xl bg-[#131929] hover:bg-[#1A2238] border border-cyan-500/30 text-cyan-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {isCheckingWinnings ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <Gift className="w-4 h-4 text-cyan-400" />
                )}
                <span>Private Prize Reveal</span>
              </motion.button>

              {/* Button 3: Deposit in Vault */}
              {onNavigateVault && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onNavigateVault}
                  className="py-3.5 px-4 rounded-2xl bg-[#131929] hover:bg-[#1A2238] border border-white/[0.08] text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <PiggyBank className="w-4 h-4 text-emerald-400" />
                  <span>Deposit in Vault</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </motion.button>
              )}

            </div>

            {/* Micro Helper Note */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 px-1">
              <span>Anyone can execute draws permissionlessly every 60 seconds</span>
              <span className="font-mono text-cyan-400/80">Market: {activeMarket}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Detailed Consumer Guide: How Draws Connect to Private Reveal */}
      <div className="p-1 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
        <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/70 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              How Draw Phases & Private Reveals Work ({activeMarket})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Phase 1</span>
              <h4 className="font-bold text-white">Open Savings</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Deposit {activeMarket}. Every $1.00 gives 1 private draw ticket. Principal earns yield and is always protected.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">Phase 2</span>
              <h4 className="font-bold text-white">Snapshot Weights</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                At the draw deadline, all active ticket weights are committed without exposing anyone&apos;s balance to the public.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">Phase 3</span>
              <h4 className="font-bold text-white">Fair Selection</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Verifiable cryptographic randomness picks the winning ticket onchain, privately crediting the prize.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Phase 4</span>
              <h4 className="font-bold text-white">Reveal & Claim</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Winners open the Private Reveal tab to safely inspect their prize and claim real tokens to their wallet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Executed Draws */}
      <div className="p-1 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
        <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/70 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Recent Executed Draws ({activeMarket})</h3>
            </div>
            <span className="text-[11px] text-slate-400">Automatic verifiable onchain selection</span>
          </div>

          {drawHistory.length === 0 ? (
            <div className="p-6 text-center bg-[#101524]/50 rounded-2xl border border-dashed border-white/[0.08] space-y-1.5">
              <div className="text-xs font-bold text-white">Draw #1 In Progress</div>
              <p className="text-[11px] text-slate-400">
                Deposit tokens and click &quot;Execute Draw Now&quot; to pick an onchain winner with verifiable randomness!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {drawHistory.map((draw) => (
                <div
                  key={draw.drawId}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                    draw.isMyWin
                      ? "bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                      : "bg-[#101524]/60 border-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${draw.isMyWin ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md" : "bg-slate-800/80 text-slate-400"}`}>
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>Draw #{draw.drawId}</span>
                        {draw.isMyWin ? (
                          <span className="text-[10px] bg-cyan-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                            You Won!
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full border border-white/[0.06]">
                            Winner: {draw.winner ? `${draw.winner.slice(0, 6)}...${draw.winner.slice(-4)}` : "Community Pool"}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(draw.timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {draw.totalParticipants} Participants
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-cyan-300">
                        ${draw.prizeAmount} {draw.market}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-medium">
                        {draw.phase || "COMPLETED"}
                      </span>
                    </div>

                    {draw.isMyWin && onNavigateRewards && (
                      <button
                        onClick={onNavigateRewards}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-sm hover:scale-105 transition-transform"
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
    </div>
  );
};
