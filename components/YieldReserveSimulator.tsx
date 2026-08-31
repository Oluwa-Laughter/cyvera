"use client";

import React, { useState } from "react";
import { TrendingUp, Sprout, Coins, ArrowRight, RefreshCw, Zap } from "lucide-react";

interface YieldReserveSimulatorProps {
  totalDeposits: string;
  totalYieldHarvested: string;
  onHarvestAndFund: (customAmount?: string) => Promise<void>;
  isHarvesting: boolean;
  account: string | null;
}

export const YieldReserveSimulator: React.FC<YieldReserveSimulatorProps> = ({
  totalDeposits,
  totalYieldHarvested,
  onHarvestAndFund,
  isHarvesting,
  account,
}) => {
  const [injectAmount, setInjectAmount] = useState<string>("50");

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Yield Source Strategy</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Mock Aave V3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulates real-world DeFi yield accrual streaming into the confidential prize reserve.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 uppercase">Simulated APY</span>
            <div className="text-sm font-bold font-mono text-emerald-400">
              8.50% APY
            </div>
          </div>
        </div>

        {/* Strategy Architecture Box */}
        <div className="my-6 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Total Yield Harvested To Date:</span>
            </div>
            <span className="text-sm font-bold text-emerald-300 glow-text-emerald">
              {totalYieldHarvested} cUSDT
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 font-mono space-y-1">
            <div className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Production Architecture Note:</span>
            </div>
            <p>
              In production, the Prize Pool supplies idle vault principal to Aave V3 / Compound V3 / Lido stETH. The harvested interest is streamed directly into the prize reserve, creating the no-loss prize mechanics.
            </p>
          </div>
        </div>

        {/* Quick Action: Harvest & Fund */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onHarvestAndFund()}
              disabled={isHarvesting || !account}
              className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono tracking-wide transition-all shadow-glowPurple flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isHarvesting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Coins className="w-4 h-4" />
              )}
              <span>Harvest APY Yield Stream</span>
            </button>

            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={injectAmount}
                onChange={(e) => setInjectAmount(e.target.value)}
                className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 text-center"
                placeholder="50"
              />
              <button
                onClick={() => onHarvestAndFund(injectAmount)}
                disabled={isHarvesting || !account || !injectAmount}
                className="flex-1 py-3.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs font-mono tracking-wide transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>Inject Custom Yield</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>MockYieldSource.sol</span>
        <span>Streaming Reserve</span>
      </div>
    </div>
  );
};
