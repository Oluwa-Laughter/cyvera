"use client";

import React, { useState, useEffect } from "react";
import { 
  PiggyBank, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Timer, 
  TrendingUp, 
  Droplets,
  Coins,
  ChevronRight,
  Gift
} from "lucide-react";
import { AppPageTab } from "@/components/SidebarNav";
import { DrawRecordView } from "@/components/PrizeDrawCard";

interface DashboardViewProps {
  account: string | null;
  walletBalance: string;
  decryptedBalance: string | null;
  decryptedWinnings: string | null;
  totalDeposits: string;
  totalPrizeReserve: string;
  totalPrizesAwarded: string;
  depositorsCount: number;
  lastDrawTime: number;
  drawInterval: number;
  currentDrawId: number;
  drawHistory: DrawRecordView[];
  onNavigateTab: (tab: AppPageTab) => void;
  onOpenFaucet: () => void;
  onConnect: () => void;
  onDecryptBalance: () => void;
  isDecryptingBalance: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  account,
  walletBalance,
  decryptedBalance,
  decryptedWinnings,
  totalDeposits,
  totalPrizeReserve,
  totalPrizesAwarded,
  depositorsCount,
  lastDrawTime,
  drawInterval,
  currentDrawId,
  drawHistory,
  onNavigateTab,
  onOpenFaucet,
  onConnect,
  onDecryptBalance,
  isDecryptingBalance,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number }>({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const next = lastDrawTime + drawInterval;
      const diff = Math.max(0, next - now);
      setTimeLeft({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastDrawTime, drawInterval]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const hasWinnings = parseFloat(decryptedWinnings || "0") > 0;

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. User Portfolio Hero Banner */}
      <div className="aura-card p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Shielded Savings</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-200">
                100% Principal Safe
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-4xl sm:text-5xl font-black text-black">
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
                  <span className="text-slate-400 text-2xl font-bold">Not Connected</span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptBalance}
                  disabled={isDecryptingBalance}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all shadow-sm active:scale-95"
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

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {!account ? (
              <button
                onClick={onConnect}
                className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs shadow-aura-yellow active:scale-95"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab("vault")}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
              >
                <PiggyBank className="w-4 h-4" />
                <span>Deposit & Save</span>
              </button>
            )}
          </div>
        </div>

        {/* Portfolio Stats Sub-bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
          <div>
            <span className="text-slate-400 text-[11px] block">Prize Tickets:</span>
            <strong className="text-black text-sm">
              {decryptedBalance !== null ? `${Math.floor(parseFloat(decryptedBalance))} Tickets` : "••••••"}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Risk of Loss:</span>
            <strong className="text-emerald-700 text-sm">0.00% (Zero Risk)</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Yield APY:</span>
            <strong className="text-emerald-700 text-sm">8.50% APY</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Next Draw:</span>
            <strong className="text-black text-sm font-mono">{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</strong>
          </div>
        </div>
      </div>

      {/* 2. Unclaimed Winnings Banner (if any) */}
      {account && hasWinnings && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-aura-yellow text-black shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-black">You Won ${decryptedWinnings} cUSDT!</h4>
              <p className="text-xs text-amber-900 font-medium">Claim your prize to your wallet or auto-compound into your savings.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("rewards")}
            className="px-6 py-3 rounded-2xl bg-black text-white hover:bg-slate-800 font-extrabold text-xs transition-all shadow-sm active:scale-95"
          >
            Claim Winnings
          </button>
        </div>
      )}

      {/* 3. Featured Savings Vaults (PoolTogether Style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-black tracking-tight">Featured Prize Vaults</h3>
          <button
            onClick={() => onNavigateTab("vault")}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All Vaults</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
          {/* Main cUSDT Vault */}
          <div className="aura-card p-6 border-amber-300 bg-gradient-to-br from-white to-amber-50/30 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-aura-yellow text-black">
                  Daily Draw Vault
                </span>
                <h4 className="text-base font-bold text-black mt-2">USD High-Yield Vault</h4>
                <span className="text-slate-500">Token: cUSDT</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-700">8.50%</span>
                <span className="text-slate-500 block text-[11px]">APY Stream</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex justify-between">
              <div>
                <span className="text-slate-500 text-[11px] block">Grand Prize:</span>
                <strong className="text-black text-sm">${totalPrizeReserve} cUSDT</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Total Shielded TVL:</span>
                <strong className="text-black text-sm">${totalDeposits}</strong>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("vault")}
              className="w-full py-3 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow active:scale-95"
            >
              Deposit & Save
            </button>
          </div>

          {/* Coming Soon ETH Vault */}
          <div className="aura-card p-6 border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Weekly Mega Draw
                </span>
                <h4 className="text-base font-bold text-black mt-2">ETH Turbo Prize Vault</h4>
                <span className="text-slate-500">Token: WETH</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-700">5.40%</span>
                <span className="text-slate-500 block text-[11px]">APY Stream</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex justify-between">
              <div>
                <span className="text-slate-500 text-[11px] block">Weekly Prize:</span>
                <strong className="text-black text-sm">$2,850 WETH</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Total TVL:</span>
                <strong className="text-black text-sm">$142,500</strong>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("vault")}
              className="w-full py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs transition-all active:scale-95"
            >
              View Vault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
