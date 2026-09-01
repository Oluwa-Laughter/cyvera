"use client";

import React from "react";
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
  Gift
} from "lucide-react";
import confetti from "canvas-confetti";

interface RewardsViewProps {
  account: string | null;
  decryptedWinnings: string | null;
  isDecryptingWinnings: boolean;
  onDecryptWinnings: () => void;
  onClaimPrize: () => Promise<void>;
  onCompoundPrize: () => Promise<void>;
  onConnect: () => void;
  isLoadingAction: boolean;
  actionStatus: string;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  account,
  decryptedWinnings,
  isDecryptingWinnings,
  onDecryptWinnings,
  onClaimPrize,
  onCompoundPrize,
  onConnect,
  isLoadingAction,
  actionStatus,
}) => {
  const hasWinnings = parseFloat(decryptedWinnings || "0") > 0;

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const handleClaim = async () => {
    triggerCelebration();
    await onClaimPrize();
  };

  const handleCompound = async () => {
    triggerCelebration();
    await onCompoundPrize();
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header Rewards Card */}
      <div className="aura-card p-8 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Prize Winnings</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-200">
                100% Confidential
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-4xl sm:text-5xl font-black text-black">
                {account ? (
                  decryptedWinnings !== null ? (
                    <span className="text-black">
                      ${decryptedWinnings} <span className="text-base text-slate-500 font-medium">cUSDT</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 tracking-widest text-3xl">
                      •••••••• <span className="text-base text-slate-400">cUSDT</span>
                    </span>
                  )
                ) : (
                  <span className="text-slate-400 text-2xl font-bold">Not Connected</span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptWinnings}
                  disabled={isDecryptingWinnings}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-sm active:scale-95"
                >
                  {isDecryptingWinnings ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : decryptedWinnings !== null ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reveal Winnings</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 hidden sm:block">
            <div>Payout Settlement:</div>
            <div className="text-base font-extrabold text-emerald-700 mt-0.5">Instant Onchain Transfer</div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 font-medium">
          <span>🔒 Only your wallet can decrypt and claim your prizes</span>
          <span>Zero public broadcast of winner net worth</span>
        </div>
      </div>

      {/* 2. Claim / Compound Action Box */}
      <div className="aura-card p-8">
        {!account ? (
          <div className="text-center py-8 space-y-4">
            <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
            <div>
              <h4 className="text-lg font-bold text-black">Connect Wallet to Check Winnings</h4>
              <p className="text-xs text-slate-500 mt-1">Verify if your wallet won the latest prize draw!</p>
            </div>
            <button
              onClick={onConnect}
              className="px-8 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs shadow-aura-yellow active:scale-95"
            >
              Connect Wallet
            </button>
          </div>
        ) : hasWinnings ? (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-950 font-medium">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <span>
                <strong className="text-black text-sm block mb-0.5">Congratulations! You Won!</strong>
                You have ${decryptedWinnings} cUSDT in secret prize winnings. You can claim them directly to your wallet or auto-compound into your principal for more tickets.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-extrabold">
              <button
                onClick={handleClaim}
                disabled={isLoadingAction}
                className="py-4 px-6 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black transition-all shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Claim Prize to Wallet</span>
              </button>

              <button
                onClick={handleCompound}
                disabled={isLoadingAction}
                className="py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Repeat className="w-4 h-4 text-amber-600" />
                <span>Auto-Compound into Savings</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-black font-bold text-sm">No Unclaimed Winnings</p>
            <p className="text-slate-500 max-w-sm mx-auto">
              Your principal is currently active in the savings vault. Click &quot;Reveal Winnings&quot; above after each draw to verify your secret winning status!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
