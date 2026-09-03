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
              cUSDT Winnings
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeMarket === "cUSDC" 
                  ? "bg-cyvera-gold text-black font-extrabold shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              cUSDC Winnings
            </button>
          </div>
          <span className="text-[11px] font-medium text-[var(--muted)] hidden sm:inline">
            Secure Private Decryption
          </span>
        </div>
      )}

      {/* 2. Header Rewards Card */}
      <div className="cyvera-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-[var(--card-border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Private Prize Reveal Session
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-bold border border-emerald-500/20">
                100% Private
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Your Confidential Winnings
            </h2>
            <p className="text-xs text-[var(--muted)] font-normal leading-relaxed">
              Draw results are kept strictly confidential onchain. Authorize a private viewing session with your wallet to inspect and claim your winnings.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-right min-w-[130px]">
            <span className="text-[10px] font-bold text-amber-500 uppercase">Status</span>
            <div className="text-xs font-bold text-foreground">
              {hasWinnings && isCurrentlyRevealed ? "🎉 Prize Won!" : isCurrentlyRevealed ? "🛡️ Verified $0.00" : "🔒 Private"}
            </div>
          </div>
        </div>

        {/* Reveal Display Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] text-center space-y-3.5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-cyvera-gold text-black flex items-center justify-center mx-auto shadow-cyvera-glow">
            <Trophy className="w-6 h-6 text-black" />
          </div>

          <div>
            <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider block">
              Decrypted Prize Value
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-foreground mt-1 font-mono">
              {account ? (
                isCurrentlyRevealed ? (
                  <span className={hasWinnings ? "text-emerald-500 font-bold" : "text-foreground"}>
                    {hasWinnings ? `+$${decryptedWinnings}` : "$0.00"}{" "}
                    <span className="text-sm text-[var(--muted)] font-normal font-sans">{activeMarket}</span>
                  </span>
                ) : (
                  <span className="text-[var(--muted)] tracking-widest text-xl sm:text-2xl">•••••••• {activeMarket}</span>
                )
              ) : (
                <span className="text-[var(--muted)] text-lg font-sans">Connect Wallet</span>
              )}
            </div>
          </div>

          {/* Reveal / Hide Toggle Controls */}
          {account && (
            <div className="pt-1 flex items-center justify-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleToggleHideShow}
                disabled={isDecryptingWinnings}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-xs font-semibold text-foreground transition-all shadow-sm disabled:opacity-50"
              >
                {isDecryptingWinnings ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                ) : isCurrentlyRevealed ? (
                  <EyeOff className="w-3.5 h-3.5 text-[var(--muted)]" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>
                  {isDecryptingWinnings 
                    ? "Verifying Private Identity..." 
                    : isCurrentlyRevealed 
                    ? "Hide Reward" 
                    : "Show / Reveal Reward"}
                </span>
              </motion.button>
            </div>
          )}

          {hasWinnings && isCurrentlyRevealed && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Congratulations! You won +${decryptedWinnings} {activeMarket} in the prize draw!</span>
            </div>
          )}
        </div>

        {/* Claim & Auto-Compound Actions */}
        {hasWinnings && (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                disabled={isLoadingAction}
                className="py-3 px-5 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingAction ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                ) : (
                  <ArrowDownToLine className="w-3.5 h-3.5 text-black" />
                )}
                <span>Claim +${decryptedWinnings} {activeMarket} to Wallet</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCompound}
                disabled={isLoadingAction}
                className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingAction ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                ) : (
                  <Repeat className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Auto-Compound (+Tickets in {activeMarket})</span>
              </motion.button>
            </div>
            <p className="text-[11px] text-[var(--muted)] text-center font-normal">
              Claiming transfers the real token profit into your MetaMask wallet on Ethereum Sepolia.
            </p>
          </div>
        )}
      </div>

      {/* 3. Educational Breakdown: What is Private Reveal? */}
      <div className="cyvera-card p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--card-border)]">
          <Lock className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-foreground">
            What is Private Reveal & How Does It Work?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[var(--muted)] font-medium">
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)]">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px]">1</div>
              <span>Private Winnings</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              On standard pools, everyone can see who won on public explorers. On Cyvera, winning balances are encrypted. Nobody can see what you won.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)]">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[10px]">2</div>
              <span>Secure Viewing Key</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              When you click &quot;Show / Reveal Reward&quot;, your wallet securely authorizes a private session that decrypts your prize exclusively to your device.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)]">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px]">3</div>
              <span>Zero-Loss Settlement</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Click <strong>&quot;Claim to Wallet&quot;</strong> to receive your prize tokens in your wallet, or <strong>&quot;Auto-Compound&quot;</strong> to earn more tickets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
