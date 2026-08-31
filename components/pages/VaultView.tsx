"use client";

import React, { useState } from "react";
import { 
  PiggyBank, 
  ArrowDownRight, 
  ArrowUpRight, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle2, 
  Droplets, 
  Sparkles, 
  ShieldCheck,
  Lock
} from "lucide-react";

interface VaultViewProps {
  account: string | null;
  walletBalance: string;
  decryptedBalance: string | null;
  isDecryptingBalance: boolean;
  onDecryptBalance: () => void;
  onDeposit: (amount: string) => Promise<void>;
  onWithdraw: (amount: string) => Promise<void>;
  onWithdrawAll: () => Promise<void>;
  onOpenFaucet: () => void;
  onOpenConnectModal: () => void;
  isLoadingAction: boolean;
  actionStatus: string;
}

export const VaultView: React.FC<VaultViewProps> = ({
  account,
  walletBalance,
  decryptedBalance,
  isDecryptingBalance,
  onDecryptBalance,
  onDeposit,
  onWithdraw,
  onWithdrawAll,
  onOpenFaucet,
  onOpenConnectModal,
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

  const handleSetPreset = (val: string) => {
    setAmount(val);
  };

  const handleSetMax = () => {
    if (activeTab === "deposit") {
      setAmount(walletBalance.replace(/,/g, ""));
    } else {
      setAmount(decryptedBalance ? decryptedBalance.replace(/,/g, "") : "250.00");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header Balance Card */}
      <div className="aura-card p-8 bg-gradient-to-br from-white via-slate-50 to-amber-50/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Shielded Savings</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                100% Principal Safe
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-4xl font-black text-black">
                {account ? (
                  decryptedBalance !== null ? (
                    <span className="text-black">
                      ${decryptedBalance} <span className="text-base text-slate-500 font-medium">cUSDT</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 tracking-widest text-3xl">
                      •••••••• <span className="text-base text-slate-400">cUSDT</span>
                    </span>
                  )
                ) : (
                  <span className="text-slate-400 text-2xl font-bold">Connect Wallet</span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptBalance}
                  disabled={isDecryptingBalance}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-sm"
                >
                  {isDecryptingBalance ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : decryptedBalance !== null ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reveal Balance</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 hidden sm:block">
            <div>Your Daily Draw Tickets:</div>
            <div className="text-base font-extrabold text-black mt-0.5">
              {decryptedBalance !== null ? `${Math.floor(parseFloat(decryptedBalance))} Tickets` : "Confidential Tickets"}
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 font-medium">
          <span>🔒 Protected by Zama End-to-End Privacy</span>
          <span>Zero Loss Guaranteed</span>
        </div>
      </div>

      {/* 2. Interactive Action Box */}
      <div className="aura-card p-8">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl w-max mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`px-6 py-2.5 rounded-xl transition-all ${
              activeTab === "deposit"
                ? "bg-aura-yellow text-black shadow-aura-yellow font-extrabold"
                : "text-slate-600 hover:text-black"
            }`}
          >
            Deposit & Save
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`px-6 py-2.5 rounded-xl transition-all ${
              activeTab === "withdraw"
                ? "bg-aura-yellow text-black shadow-aura-yellow font-extrabold"
                : "text-slate-600 hover:text-black"
            }`}
          >
            Withdraw Principal
          </button>
        </div>

        {/* Deposit/Withdraw Form */}
        <form onSubmit={activeTab === "deposit" ? handleDepositSubmit : handleWithdrawSubmit} className="space-y-6">
          {/* Header & Balance */}
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>{activeTab === "deposit" ? "How much would you like to save?" : "How much would you like to withdraw?"}</span>
            <div className="flex items-center gap-2">
              <span>
                {activeTab === "deposit"
                  ? `Wallet: ${walletBalance} cUSDT`
                  : `Saved: ${decryptedBalance !== null ? decryptedBalance : "••••"} cUSDT`}
              </span>
              {activeTab === "deposit" && (
                <button
                  type="button"
                  onClick={onOpenFaucet}
                  className="text-amber-700 font-bold hover:underline"
                >
                  +Faucet
                </button>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between focus-within:border-amber-400 focus-within:bg-white transition-all shadow-sm">
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoadingAction || !account}
              className="w-full bg-transparent text-3xl font-black text-black focus:outline-none placeholder:text-slate-300"
            />
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-black shadow-sm">
              cUSDT
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2 text-xs font-bold">
            {["50", "100", "500"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSetPreset(preset)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black transition-all"
              >
                +${preset}
              </button>
            ))}
            <button
              type="button"
              onClick={handleSetMax}
              className="py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all font-extrabold"
            >
              MAX
            </button>
          </div>

          {/* Status Message */}
          {actionStatus && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>{actionStatus}</span>
            </div>
          )}

          {/* Submit Actions */}
          {!account ? (
            <button
              type="button"
              onClick={onOpenConnectModal}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-sm transition-all shadow-aura-yellow"
            >
              Connect Wallet to Continue
            </button>
          ) : activeTab === "deposit" ? (
            <button
              type="submit"
              disabled={isLoadingAction || !amount}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm tracking-tight transition-all shadow-aura-yellow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoadingAction ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Tokens Privately...</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Deposit & Start Winning</span>
                </>
              )}
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="submit"
                disabled={isLoadingAction || !amount}
                className="py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw Amount</span>
              </button>

              <button
                type="button"
                onClick={onWithdrawAll}
                disabled={isLoadingAction}
                className="py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Instant 100% Exit</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
