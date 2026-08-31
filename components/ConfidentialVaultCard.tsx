"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, Shield, ArrowDownRight, ArrowUpRight, Sparkles, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";

interface ConfidentialVaultCardProps {
  account: string | null;
  walletBalance: string;
  isDepositor: boolean;
  decryptedBalance: string | null;
  isDecrypting: boolean;
  onDecryptBalance: () => void;
  onDeposit: (amount: string) => Promise<void>;
  onWithdraw: (amount: string) => Promise<void>;
  onWithdrawAll: () => Promise<void>;
  onOpenFaucet: () => void;
  isLoadingAction: boolean;
  actionStatus: string;
}

export const ConfidentialVaultCard: React.FC<ConfidentialVaultCardProps> = ({
  account,
  walletBalance,
  isDepositor,
  decryptedBalance,
  isDecrypting,
  onDecryptBalance,
  onDeposit,
  onWithdraw,
  onWithdrawAll,
  onOpenFaucet,
  isLoadingAction,
  actionStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState<string>("");

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    await onDeposit(amount);
    setAmount("");
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    await onWithdraw(amount);
    setAmount("");
  };

  const handleSetPercent = (pct: number) => {
    if (activeTab === "deposit") {
      const bal = parseFloat(walletBalance) || 0;
      setAmount((bal * pct).toFixed(2));
    } else {
      const bal = parseFloat(decryptedBalance || "0") || 0;
      setAmount((bal * pct).toFixed(2));
    }
  };

  return (
    <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Top Background Glow */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Tabs */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Confidential Savings Vault</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Zero Loss
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deposit to earn prize draw tickets. Principal is 100% withdrawable anytime.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "deposit"
                  ? "bg-cyan-500 text-slate-950 shadow-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "withdraw"
                  ? "bg-cyan-500 text-slate-950 shadow-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* User Confidential Balance Bar */}
        <div className="my-6 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span>Your Encrypted Principal</span>
                <span className="text-[10px] text-purple-400 px-1.5 py-0.2 rounded bg-purple-500/10 border border-purple-500/20">
                  euint64
                </span>
              </div>
              <div className="text-xl font-bold font-mono tracking-tight text-slate-100 flex items-center gap-2">
                {decryptedBalance !== null ? (
                  <span className="text-emerald-300 glow-text-emerald">
                    {decryptedBalance} <span className="text-xs text-emerald-400">cUSDT</span>
                  </span>
                ) : (
                  <span className="tracking-widest text-slate-400">•••••••• <span className="text-xs text-slate-500">cUSDT</span></span>
                )}
              </div>
            </div>
          </div>

          {/* EIP-712 Decryption Button */}
          {account ? (
            <button
              onClick={onDecryptBalance}
              disabled={isDecrypting}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/60 text-xs font-mono text-purple-300 transition-all shadow-glowPurple disabled:opacity-50"
            >
              {isDecrypting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing EIP-712...</span>
                </>
              ) : decryptedBalance !== null ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                  <span>Hide Balance</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span>Decrypt (EIP-712)</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-xs font-mono text-slate-500">Connect wallet to view</span>
          )}
        </div>

        {/* Action Form */}
        <form onSubmit={activeTab === "deposit" ? handleDepositSubmit : handleWithdrawSubmit}>
          <div className="space-y-4">
            {/* Input Label & Balances */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{activeTab === "deposit" ? "Deposit Amount" : "Withdraw Amount"}</span>
              <div className="flex items-center gap-1.5">
                <span>
                  {activeTab === "deposit"
                    ? `Wallet: ${walletBalance} cUSDT`
                    : `Saved: ${decryptedBalance !== null ? decryptedBalance : "••••"} cUSDT`}
                </span>
                {activeTab === "deposit" && (
                  <button
                    type="button"
                    onClick={onOpenFaucet}
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1"
                  >
                    +Faucet
                  </button>
                )}
              </div>
            </div>

            {/* Input Box */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 focus-within:border-cyan-400 transition-all p-2 flex items-center">
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoadingAction || !account}
                className="w-full bg-transparent px-3 py-2 text-xl font-bold font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
              />
              <div className="flex items-center gap-2 pr-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-cyan-300">
                  cUSDT
                </span>
              </div>
            </div>

            {/* Preset Percentages */}
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleSetPercent(pct)}
                  className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 hover:text-slate-200 transition-all"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>

            {/* Action Status Feedback */}
            {actionStatus && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2 text-xs font-mono text-cyan-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>{actionStatus}</span>
              </div>
            )}

            {/* Main Action Button */}
            {activeTab === "deposit" ? (
              <button
                type="submit"
                disabled={isLoadingAction || !account || !amount}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingAction ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Shield & Deposit into Vault</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isLoadingAction || !account || !amount}
                  className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingAction ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                  <span>Withdraw Amount</span>
                </button>

                <button
                  type="button"
                  onClick={onWithdrawAll}
                  disabled={isLoadingAction || !account}
                  className="py-4 px-6 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>100% Exit</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Security Guarantee Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-custodial & fully backed</span>
        </div>
        <span>Zama fhEVM Encrypted</span>
      </div>
    </div>
  );
};
