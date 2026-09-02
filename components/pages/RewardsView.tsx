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
              cUSDT Winnings
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeMarket === "cUSDC" 
                  ? "bg-cyvera-gold text-black font-black shadow-cyvera-glow" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              cUSDC Winnings
            </button>
          </div>
          <span className="text-[11px] font-bold text-[var(--muted)] hidden sm:inline">
            EIP-712 User-Decryption Session
          </span>
        </div>
      )}

      {/* 2. Header Rewards Card */}
      <div className="cyvera-card p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[var(--card-border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Private Prize Reveal Session
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-extrabold border border-emerald-500/20">
                Encrypted with Zama FHE
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Your Confidential Winnings
            </h2>
            <p className="text-xs text-[var(--muted)] font-medium">
              Draw results are stored as encrypted ciphertext handles onchain. Only you can authorize an EIP-712 session to inspect and claim your winnings.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-right min-w-[140px]">
            <span className="text-[10px] font-bold text-amber-500 uppercase">Status</span>
            <div className="text-sm font-black text-foreground">
              {hasWinnings && isCurrentlyRevealed ? "🎉 Prize Won!" : isCurrentlyRevealed ? "🛡️ Verified $0.00" : "🔒 Encrypted Handle"}
            </div>
          </div>
        </div>

        {/* Big Reveal Display Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-cyvera-gold text-black flex items-center justify-center mx-auto shadow-cyvera-glow">
            <Trophy className="w-7 h-7 text-black" />
          </div>

          <div>
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block">
              Decrypted Prize Value
            </span>
            <div className="text-4xl sm:text-5xl font-black text-foreground mt-1 font-mono">
              {account ? (
                isCurrentlyRevealed ? (
                  <span className={hasWinnings ? "text-emerald-500 font-black" : "text-foreground"}>
                    {hasWinnings ? `+$${decryptedWinnings}` : "$0.00"}{" "}
                    <span className="text-lg text-[var(--muted)] font-normal font-sans">{activeMarket}</span>
                  </span>
                ) : (
                  <span className="text-[var(--muted)] tracking-widest text-3xl">•••••••• {activeMarket}</span>
                )
              ) : (
                <span className="text-[var(--muted)] text-2xl font-sans">Connect Wallet</span>
              )}
            </div>
          </div>

          {/* Reveal / Hide Toggle Controls */}
          {account && (
            <div className="pt-2 flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleToggleHideShow}
                disabled={isDecryptingWinnings}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-xs font-bold text-foreground transition-all shadow-sm disabled:opacity-50"
              >
                {isDecryptingWinnings ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                ) : isCurrentlyRevealed ? (
                  <EyeOff className="w-4 h-4 text-[var(--muted)]" />
                ) : (
                  <Eye className="w-4 h-4 text-amber-500" />
                )}
                <span>
                  {isDecryptingWinnings 
                    ? "Decrypting via EIP-712..." 
                    : isCurrentlyRevealed 
                    ? "Hide Reward" 
                    : "Show / Reveal Reward"}
                </span>
              </motion.button>
            </div>
          )}

          {hasWinnings && isCurrentlyRevealed && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Congratulations! You won +${decryptedWinnings} {activeMarket} in the prize draw!</span>
            </div>
          )}
        </div>

        {/* Claim & Auto-Compound Actions */}
        {hasWinnings && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                disabled={isLoadingAction}
                className="py-4 px-6 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingAction ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <ArrowDownToLine className="w-4 h-4 text-black" />
                )}
                <span>Claim +${decryptedWinnings} {activeMarket} to Wallet</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCompound}
                disabled={isLoadingAction}
                className="py-4 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingAction ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                ) : (
                  <Repeat className="w-4 h-4 text-amber-500" />
                )}
                <span>Auto-Compound (+Tickets in {activeMarket})</span>
              </motion.button>
            </div>
            <p className="text-[11px] text-[var(--muted)] text-center font-medium">
              Claiming transfers the real token profit into your MetaMask wallet on Ethereum Sepolia.
            </p>
          </div>
        )}
      </div>

      {/* 3. Educational Breakdown: What is Private Reveal? */}
      <div className="cyvera-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--card-border)]">
          <Lock className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-black uppercase tracking-wide text-foreground">
            What is Private Reveal & How Does It Work?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[var(--muted)] font-medium">
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)]">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px]">1</div>
              <span>Encrypted Winning Handle</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              On standard pools, everyone can see who won on Etherscan. On Cyvera, the winning amount is stored as a homomorphic ciphertext `_encryptedWinnings[winner]`. Nobody can see what you won.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)]">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[10px]">2</div>
              <span>Offchain EIP-712 Decryption</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              When you click &quot;Show / Reveal Reward&quot;, your wallet authorizes an offchain viewing session. The Zama relayer proves your address owns the private key and reveals your decrypted value exclusively to you.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)]">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px]">3</div>
              <span>Zero-Loss Settlement</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              You can click <strong>&quot;Claim to Wallet&quot;</strong> to receive your prize as spendable tokens in your wallet, or <strong>&quot;Auto-Compound&quot;</strong> to add it directly to your vault principal for more tickets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
