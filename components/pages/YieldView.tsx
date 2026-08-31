"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Coins, 
  ArrowRight, 
  RefreshCw, 
  Zap, 
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface YieldViewProps {
  totalDeposits: string;
  totalYieldHarvested: string;
  onHarvestAndFund: (customAmount?: string) => Promise<void>;
  isHarvesting: boolean;
  account: string | null;
  onOpenConnectModal: () => void;
}

export const YieldView: React.FC<YieldViewProps> = ({
  totalDeposits,
  totalYieldHarvested,
  onHarvestAndFund,
  isHarvesting,
  account,
  onOpenConnectModal,
}) => {
  const [injectAmount, setInjectAmount] = useState<string>("50");

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header APY Card */}
      <div className="aura-card p-8 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">DeFi Yield Strategy</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200">
                Aave V3 Lending
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-4xl font-black text-emerald-700">
                8.50% <span className="text-base text-emerald-800 font-medium">APY Stream</span>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <div>Harvested Yield to Date:</div>
            <div className="text-2xl font-black text-black mt-0.5">${totalYieldHarvested} cUSDT</div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 font-medium">
          <span>Continuous interest automatically funds upcoming daily prize draws</span>
          <span>Zero risk to depositor principal</span>
        </div>
      </div>

      {/* 2. Interactive Yield Simulation Box */}
      <div className="aura-card p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-black tracking-tight">How the Prize Pot Grows</h3>
          <p className="text-xs text-slate-600">
            Deposited tokens generate continuous yield in lending pools. Test streaming yield into the upcoming draw pot below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Automatic Harvest */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px]">Automated APY Harvest</span>
              <h4 className="text-base font-bold text-black mt-1">Harvest Accrued Interest</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Calculates accrued interest from the total pool TVL (${totalDeposits} cUSDT) and transfers it into the prize pot.
              </p>
            </div>

            {!account ? (
              <button
                onClick={onOpenConnectModal}
                className="w-full py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold transition-all shadow-aura-yellow"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={() => onHarvestAndFund()}
                disabled={isHarvesting}
                className="w-full py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold transition-all shadow-aura-yellow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isHarvesting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Coins className="w-4 h-4 text-black" />
                )}
                <span>Harvest APY Yield Stream</span>
              </button>
            )}
          </div>

          {/* Custom Simulation */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px]">Test Simulation</span>
              <h4 className="text-base font-bold text-black mt-1">Simulate Extra Prize Boost</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Directly inject a custom test yield sum into the prize reserve for demonstration.
              </p>
            </div>

            {!account ? (
              <button
                onClick={onOpenConnectModal}
                className="w-full py-3.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold transition-all"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={injectAmount}
                  onChange={(e) => setInjectAmount(e.target.value)}
                  className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-black text-center shadow-sm"
                  placeholder="50"
                />
                <button
                  onClick={() => onHarvestAndFund(injectAmount)}
                  disabled={isHarvesting || !injectAmount}
                  className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-black text-white font-extrabold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>Inject ${injectAmount}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-aura-yellow" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reassurance Notice */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-950 font-bold">The No-Loss Guarantee:</strong>
            <p className="text-emerald-800 mt-0.5 leading-relaxed">
              In PoolTogether architectures, the prize pot is made entirely of external lending yield. Depositors never buy tickets with their principal — your original deposit stays 100% untouched and withdrawable at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
