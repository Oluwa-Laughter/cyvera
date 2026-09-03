"use client";

import React, { useState } from "react";
import { 
  Trophy, 
  Sparkles, 
  ArrowDownToLine, 
  Repeat, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  Gift,
  Lock,
  Unlock,
  Key,
  Flame,
  Check,
  ArrowRight,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ActiveMarketId, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";

interface RewardsViewProps {
  account: string | null;
  activeMarket?: ActiveMarketId;
  onChangeMarket?: (m: ActiveMarketId) => void;
  decryptedWinnings: string | null;
  isDecryptingWinnings: boolean;
  onDecryptWinnings: () => void;
  onClaimPrize: () => Promise<void>;
  onCompoundPrize: () => Promise<void>;
  onConnect: () => void;
  isLoadingAction: boolean;
  actionStatus?: string;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  account,
  activeMarket = "cUSDT",
  onChangeMarket,
  decryptedWinnings,
  isDecryptingWinnings,
  onDecryptWinnings,
  onClaimPrize,
  onCompoundPrize,
  onConnect,
  isLoadingAction,
}) => {
  const [isMasked, setIsMasked] = useState<boolean>(false);
  const hasWinnings = parseFloat(decryptedWinnings || "0") > 0;
  const marketCfg = ZAMA_SEPOLIA_CONFIG.markets[activeMarket];

  const triggerCelebration = () => {
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.6 },
    });
  };

  const handleClaim = async () => {
    if (isLoadingAction) return;
    triggerCelebration();
    await onClaimPrize();
  };

  const handleCompound = async () => {
    if (isLoadingAction) return;
    triggerCelebration();
    await onCompoundPrize();
  };

  const handleToggleHideShow = () => {
    if (decryptedWinnings === null) {
      onDecryptWinnings();
      setIsMasked(false);
    } else {
      setIsMasked((prev) => !prev);
    }
  };

  const isCurrentlyRevealed = decryptedWinnings !== null && !isMasked;

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
              <span>cUSDT Winnings</span>
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
              <span>cUSDC Winnings</span>
            </button>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 hidden sm:inline">
            Secure Private Decryption
          </span>
        </div>
      )}

      {/* 2. Header Rewards Card (Double-Bezel Architecture) */}
      <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-5 sm:p-7 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 backdrop-blur-xl border border-white/[0.04] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-white/[0.06]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Private Session • {activeMarket}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  100% Confidential
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Confidential Prize Reveal
              </h2>
              <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-xl">
                Draw results are kept strictly encrypted onchain. Only you can inspect and claim your prize tokens to your wallet.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#111624] border border-white/[0.08] text-right min-w-[140px] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Pool State</span>
              <div className="text-xs font-bold text-cyan-300 mt-0.5">
                {hasWinnings && isCurrentlyRevealed ? "Prize Available" : isCurrentlyRevealed ? "Verified $0.00" : "Encrypted"}
              </div>
            </div>
          </div>

          {/* Reveal Display Box */}
          <div className="p-7 sm:p-9 rounded-2xl bg-[#101524]/80 border border-white/[0.06] text-center space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.35)]">
              <Trophy className="w-7 h-7 text-slate-950" />
            </div>

            <div>
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest block">
                Decrypted Prize Value
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1.5 font-mono tracking-tight">
                {account ? (
                  isCurrentlyRevealed ? (
                    <span className={hasWinnings ? "text-cyan-300 font-bold drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "text-white"}>
                      {hasWinnings ? `+$${decryptedWinnings}` : "$0.00"}{" "}
                      <span className="text-sm text-slate-400 font-normal font-sans">{activeMarket}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 tracking-widest text-2xl">•••••••• {activeMarket}</span>
                  )
                ) : (
                  <span className="text-slate-500 text-lg font-sans">Connect Wallet</span>
                )}
              </div>
            </div>

            {/* Reveal / Hide Toggle Controls */}
            {account && (
              <div className="pt-2 flex items-center justify-center gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleToggleHideShow}
                  disabled={isDecryptingWinnings}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#151C2C] hover:bg-[#1C263C] border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:text-white transition-all shadow-sm disabled:opacity-50"
                >
                  {isDecryptingWinnings ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  ) : isCurrentlyRevealed ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-cyan-400" />
                  )}
                  <span>
                    {isDecryptingWinnings 
                      ? "Verifying Private Keys..." 
                      : isCurrentlyRevealed 
                      ? "Hide Reward" 
                      : "Reveal Reward Balance"}
                  </span>
                </motion.button>
              </div>
            )}

            {hasWinnings && isCurrentlyRevealed && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Congratulations! You won +${decryptedWinnings} {activeMarket} in the verifiable prize draw!</span>
              </div>
            )}
          </div>

          {/* Claim & Auto-Compound Actions */}
          {hasWinnings && (
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClaim}
                  disabled={isLoadingAction}
                  className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isLoadingAction ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <ArrowDownToLine className="w-4 h-4 text-slate-950" />
                  )}
                  <span>Claim +${decryptedWinnings} {activeMarket} to Wallet</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCompound}
                  disabled={isLoadingAction}
                  className="py-3.5 px-5 rounded-2xl bg-[#131929] hover:bg-[#1A2238] border border-cyan-500/30 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-sm"
                >
                  {isLoadingAction ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  ) : (
                    <Repeat className="w-4 h-4 text-cyan-400" />
                  )}
                  <span>Auto-Compound (+{Math.floor(parseFloat(decryptedWinnings))} Tickets)</span>
                </motion.button>
              </div>
            </div>
          )}

          {!account && (
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConnect}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)]"
              >
                Connect Wallet to Inspect Winnings
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Educational Breakdown */}
      <div className="p-1 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
        <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/70 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">How Private Reveals Work</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Step 1</span>
              <h4 className="font-bold text-white">Encrypted Settlement</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                When a draw concludes, winning prize tokens are credited directly into confidential escrow. The amount is never revealed publicly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">Step 2</span>
              <h4 className="font-bold text-white">Confidential Inspection</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Only the winning wallet can decrypt their balance. Your financial privacy is completely protected against surveillance.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#101524]/70 border border-white/[0.05] space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Step 3</span>
              <h4 className="font-bold text-white">Instant Settlement</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Choose to claim prize tokens directly to your MetaMask or auto-compound into the vault for greater winning odds next round.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
