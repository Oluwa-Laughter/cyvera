"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowDownToLine, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  Coins, 
  TrendingUp, 
  Droplets, 
  PlusCircle, 
  Check, 
  AlertCircle,
  Repeat,
  Lock,
  Unlock,
  Shield,
  Layers
} from "lucide-react";
import { addTokenToWallet } from "@/lib/wallet";
import { ActiveMarketId, CONTRACT_ADDRESSES, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";

interface VaultViewProps {
  account: string | null;
  activeMarket: ActiveMarketId;
  onChangeMarket: (m: ActiveMarketId) => void;
  walletBalance: string;
  publicWalletBalance?: string;
  shieldedBalance?: string;
  decryptedBalance: string | null;
  isDecryptingBalance: boolean;
  onDecryptBalance: (targetMarket?: ActiveMarketId) => void;
  onDeposit: (amount: string, targetMarket?: ActiveMarketId) => Promise<void>;
  onWithdraw: (amount: string, targetMarket?: ActiveMarketId) => Promise<void>;
  onWithdrawAll: (targetMarket?: ActiveMarketId) => Promise<void>;
  onShield?: (amount: string, targetMarket?: ActiveMarketId) => Promise<void>;
  onUnshield?: (amount: string, targetMarket?: ActiveMarketId) => Promise<void>;
  onOpenFaucet: () => void;
  onConnect: () => void;
  isLoadingAction: boolean;
  initialDepositAmount?: string;
  totalDeposits: string;
  totalPrizeReserve: string;
}

export const VaultView: React.FC<VaultViewProps> = ({
  account,
  activeMarket,
  onChangeMarket,
  walletBalance,
  publicWalletBalance = "1000.00",
  shieldedBalance = "0.00",
  decryptedBalance,
  isDecryptingBalance,
  onDecryptBalance,
  onDeposit,
  onWithdraw,
  onWithdrawAll,
  onShield,
  onUnshield,
  onOpenFaucet,
  onConnect,
  isLoadingAction,
  initialDepositAmount = "",
  totalDeposits,
  totalPrizeReserve,
}) => {
  const [activeSection, setActiveSection] = useState<"save" | "shield">("save");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [shieldTab, setShieldTab] = useState<"shield" | "unshield">("shield");
  const [amount, setAmount] = useState<string>(initialDepositAmount || "50");
  const [shieldAmount, setShieldAmount] = useState<string>("100");
  const [isTokenAdded, setIsTokenAdded] = useState(false);

  const marketCfg = ZAMA_SEPOLIA_CONFIG.markets[activeMarket];
  const parsedWallet = parseFloat(walletBalance.replace(/,/g, "") || "0");
  const parsedSaved = parseFloat((decryptedBalance || "0").replace(/,/g, "") || "0");
  const parsedPublic = parseFloat(publicWalletBalance.replace(/,/g, "") || "0");

  const handleQuickPreset = (val: number) => {
    if (activeSection === "save") {
      if (activeTab === "deposit") {
        setAmount(val.toString());
      } else {
        setAmount(Math.min(parsedSaved, val).toString());
      }
    } else {
      setShieldAmount(val.toString());
    }
  };

  const handleMax = () => {
    if (activeSection === "save") {
      if (activeTab === "deposit") {
        setAmount(parsedWallet > 0 ? parsedWallet.toString() : "0");
      } else {
        setAmount(parsedSaved > 0 ? parsedSaved.toString() : "0");
      }
    } else {
      if (shieldTab === "shield") {
        setShieldAmount(parsedPublic > 0 ? parsedPublic.toString() : "0");
      } else {
        setShieldAmount(parsedWallet > 0 ? parsedWallet.toString() : "0");
      }
    }
  };

  const handleAddToken = async () => {
    const success = await addTokenToWallet(marketCfg.underlying, marketCfg.symbol, marketCfg.decimals);
    if (success) {
      setIsTokenAdded(true);
      setTimeout(() => setIsTokenAdded(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSection === "save") {
      if (!amount || parseFloat(amount) <= 0) return;
      if (activeTab === "deposit") {
        await onDeposit(amount, activeMarket);
      } else {
        await onWithdraw(amount, activeMarket);
      }
    } else {
      if (!shieldAmount || parseFloat(shieldAmount) <= 0) return;
      if (shieldTab === "shield" && onShield) {
        await onShield(shieldAmount, activeMarket);
      } else if (shieldTab === "unshield" && onUnshield) {
        await onUnshield(shieldAmount, activeMarket);
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* 1. Market Switcher Banner */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => onChangeMarket("cUSDT")}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all ${
              activeMarket === "cUSDT" 
                ? "bg-cyvera-gold text-black font-extrabold shadow-cyvera-glow" 
                : "text-[var(--muted)] hover:text-foreground"
            }`}
          >
            <span className="sm:hidden">cUSDT (8.5%)</span>
            <span className="hidden sm:inline">cUSDT Vault (8.50% APY)</span>
          </button>
          <button
            onClick={() => onChangeMarket("cUSDC")}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all ${
              activeMarket === "cUSDC" 
                ? "bg-cyvera-gold text-black font-extrabold shadow-cyvera-glow" 
                : "text-[var(--muted)] hover:text-foreground"
            }`}
          >
            <span className="sm:hidden">cUSDC (12%)</span>
            <span className="hidden sm:inline">cUSDC Vault (12.00% APY)</span>
          </button>
        </div>

        <button
          onClick={handleAddToken}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-foreground transition-colors"
        >
          {isTokenAdded ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <PlusCircle className="w-3.5 h-3.5 text-[var(--muted)]" />}
          <span>Add {marketCfg.symbol} to Wallet</span>
        </button>
      </div>

      {/* 2. Main Vault Card */}
      <div className="cyvera-card p-6 space-y-6">
        {/* Vault Header Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--card-border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Shielded Prize Vault</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-bold border border-emerald-500/20">
                {marketCfg.apy} APY Stream
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{marketCfg.name}</h2>
            <p className="text-xs text-[var(--muted)] font-normal leading-relaxed">
              Deposit {marketCfg.symbol} tokens to enter recurring prize draws. 100% principal safe with zero loss.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-right min-w-[130px]">
            <span className="text-[10px] font-bold text-amber-500 uppercase">Prize Pot</span>
            <div className="text-lg font-bold text-foreground font-mono">
              ${totalPrizeReserve} <span className="text-xs font-normal text-[var(--muted)]">{marketCfg.symbol}</span>
            </div>
          </div>
        </div>

        {/* Section Selector: [ Save / Withdraw ] vs [ Shield / Unshield Converter ] */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-[var(--card-border)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSection("save")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeSection === "save"
                ? "bg-white dark:bg-slate-900 text-foreground font-bold shadow-sm"
                : "text-[var(--muted)] hover:text-foreground"
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5 text-amber-500" />
            <span>Deposit & Withdraw</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("shield")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeSection === "shield"
                ? "bg-white dark:bg-slate-900 text-foreground font-bold shadow-sm"
                : "text-[var(--muted)] hover:text-foreground"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <span>Shielding Converter</span>
          </button>
        </div>

        {/* Section 1: Save / Withdraw */}
        {activeSection === "save" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Action Sub-Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("deposit")}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === "deposit" ? "bg-cyvera-gold text-black font-bold shadow-sm" : "text-[var(--muted)]"
                }`}
              >
                Deposit (Enter Draws)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("withdraw")}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === "withdraw" ? "bg-cyvera-gold text-black font-bold shadow-sm" : "text-[var(--muted)]"
                }`}
              >
                Withdraw (100% Zero-Loss)
              </button>
            </div>

            {/* Balances Display */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] text-xs">
              <div>
                <span className="text-[var(--muted)] block text-[11px] font-medium">Wallet Balance:</span>
                <strong className="text-foreground font-mono font-bold text-sm">${walletBalance} {marketCfg.symbol}</strong>
              </div>
              <div>
                <span className="text-[var(--muted)] block text-[11px] font-medium">Saved in Vault:</span>
                <div className="flex items-center gap-2">
                  <strong className="text-emerald-500 font-mono font-bold text-sm">
                    {decryptedBalance !== null ? `$${decryptedBalance}` : "••••••••"} {marketCfg.symbol}
                  </strong>
                  {account && (
                    <button
                      type="button"
                      onClick={() => onDecryptBalance(activeMarket)}
                      className="text-[var(--muted)] hover:text-foreground p-1"
                    >
                      {decryptedBalance !== null ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-500" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="text-foreground">
                  {activeTab === "deposit" ? "Amount to Deposit:" : "Amount to Withdraw:"}
                </label>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-amber-500 hover:underline text-xs"
                >
                  Use Max
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-[var(--card-border)] font-mono text-base font-bold text-foreground focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--muted)] font-mono">
                  {marketCfg.symbol}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1">
                {[25, 50, 100, 500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickPreset(val)}
                    className="py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground text-xs font-semibold transition-colors cursor-pointer"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            {!account ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onConnect}
                className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow"
              >
                Connect Wallet
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoadingAction}
                className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />}
                <span>
                  {activeTab === "deposit" ? `Confirm Deposit of $${amount} ${marketCfg.symbol}` : `Withdraw $${amount} ${marketCfg.symbol}`}
                </span>
              </motion.button>
            )}
          </form>
        )}

        {/* Section 2: Shield / Unshield Converter */}
        {activeSection === "shield" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setShieldTab("shield")}
                className={`py-2 rounded-lg transition-all ${
                  shieldTab === "shield" ? "bg-cyvera-gold text-black font-bold shadow-sm" : "text-[var(--muted)]"
                }`}
              >
                Shield ({marketCfg.publicSymbol} → {marketCfg.symbol})
              </button>
              <button
                type="button"
                onClick={() => setShieldTab("unshield")}
                className={`py-2 rounded-lg transition-all ${
                  shieldTab === "unshield" ? "bg-cyvera-gold text-black font-bold shadow-sm" : "text-[var(--muted)]"
                }`}
              >
                Unshield ({marketCfg.symbol} → {marketCfg.publicSymbol})
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-600 dark:text-cyan-400 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Private Token Shielding</span>
              </div>
              <p className="text-[var(--muted)] leading-relaxed font-normal">
                Shielding wraps public tokens into private confidential assets. Nobody can view your balance or track your transactions on public explorers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="text-foreground">Amount to Convert:</label>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-amber-500 hover:underline text-xs"
                >
                  Use Max
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={shieldAmount}
                  onChange={(e) => setShieldAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-[var(--card-border)] font-mono text-base font-bold text-foreground focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--muted)] font-mono">
                  {shieldTab === "shield" ? marketCfg.publicSymbol : marketCfg.symbol}
                </span>
              </div>
            </div>

            {!account ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onConnect}
                className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow"
              >
                Connect Wallet
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoadingAction}
                className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />}
                <span>
                  {shieldTab === "shield" ? `Shield $${shieldAmount} ${marketCfg.publicSymbol} → ${marketCfg.symbol}` : `Unshield $${shieldAmount} ${marketCfg.symbol} → ${marketCfg.publicSymbol}`}
                </span>
              </motion.button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
