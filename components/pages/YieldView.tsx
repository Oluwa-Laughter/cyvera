"use client";

import React, { useState } from "react";
import { 
  Sprout, 
  TrendingUp, 
  Coins, 
  ArrowRight, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";

interface YieldViewProps {
  totalDeposits: string;
  totalYieldHarvested: string;
  onHarvestAndFund: (customAmount?: string) => Promise<void>;
  isHarvesting: boolean;
  account: string | null;
}

export const YieldView: React.FC<YieldViewProps> = ({
  totalDeposits,
  totalYieldHarvested,
  onHarvestAndFund,
  isHarvesting,
  account,
}) => {
  const [injectAmount, setInjectAmount] = useState<string>("50");

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* 1. Header Yield Overview */}
      <div className="zama-card p-8 bg-gradient-to-br from-zama-card to-zama-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-zinc-400">DeFi Yield Strategy Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Mock Aave V3
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-2 font-mono">
              <div className="text-4xl font-black text-emerald-400">
                8.50% <span className="text-base text-emerald-400/80">APY Stream</span>
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400">
            <div>Harvested Yield to Date:</div>
            <div className="text-xl font-black text-white mt-0.5">{totalYieldHarvested} cUSDT</div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-2">
          <span>Continuous yield accrues to the prize pot automatically</span>
          <span>Zero risk to depositor principal</span>
        </div>
      </div>

      {/* 2. Interactive Strategy Control Card */}
      <div className="zama-card p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight">Interactive Yield Injection</h3>
          <p className="text-xs text-zinc-400 font-mono">
            Simulate Aave V3 lending yield streaming into the VeilPrize reserve for the upcoming draw.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {/* Quick Harvest */}
          <div className="p-6 rounded-2xl bg-zama-dark border border-white/5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-zinc-400 uppercase text-[11px]">Automated Stream</span>
              <h4 className="text-base font-bold text-white mt-1">Harvest Accrued Yield</h4>
              <p className="text-zinc-400 mt-1">
                Harvests calculated interest based on current pool TVL ({totalDeposits} cUSDT) at 8.50% APY.
              </p>
            </div>

            <button
              onClick={() => onHarvestAndFund()}
              disabled={isHarvesting || !account}
              className="w-full py-3.5 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-extrabold transition-all shadow-zama-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isHarvesting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Coins className="w-4 h-4" />
              )}
              <span>Harvest APY Stream</span>
            </button>
          </div>

          {/* Custom Injection */}
          <div className="p-6 rounded-2xl bg-zama-dark border border-white/5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-zinc-400 uppercase text-[11px]">Manual Simulation</span>
              <h4 className="text-base font-bold text-white mt-1">Custom Prize Injection</h4>
              <p className="text-zinc-400 mt-1">
                Directly fund the prize reserve with a custom sum for demonstration purposes.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={injectAmount}
                onChange={(e) => setInjectAmount(e.target.value)}
                className="w-24 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white text-center"
                placeholder="50"
              />
              <button
                onClick={() => onHarvestAndFund(injectAmount)}
                disabled={isHarvesting || !account || !injectAmount}
                className="flex-1 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-extrabold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>Inject Yield</span>
                <ArrowRight className="w-3.5 h-3.5 text-zama-yellow" />
              </button>
            </div>
          </div>
        </div>

        {/* Production Architecture Note */}
        <div className="p-4 rounded-xl bg-black border border-white/5 text-xs font-mono text-zinc-400 space-y-1">
          <div className="text-white font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-zama-yellow" />
            <span>Production Deployment Note:</span>
          </div>
          <p>
            In production on Ethereum, the smart contract routes deposits into real Aave V3 `supply()` calls. The generated `aToken` interest is harvested permissionlessly by keeper bots prior to triggering the FHE onchain draw.
          </p>
        </div>
      </div>
    </div>
  );
};
