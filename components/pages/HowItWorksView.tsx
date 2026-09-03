"use client";

import React from "react";
import { 
  PiggyBank, 
  TrendingUp, 
  Trophy, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Cpu,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface HowItWorksViewProps {
  onEnterVault?: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onEnterVault }) => {
  const steps = [
    {
      number: "1",
      title: "Deposit Your Tokens",
      subtitle: "100% Principal Preserved",
      description: "Deposit cUSDT or cUSDC into the Cyvera vault. Your deposit is converted into confidential draw tickets ($1.00 = 1 Ticket). Your principal remains 100% yours, untouched and withdrawable at any moment.",
      icon: <PiggyBank className="w-5 h-5 text-cyan-400" />,
    },
    {
      number: "2",
      title: "Pool Yield Creates Grand Prizes",
      subtitle: "8.50% - 12.00% APY Stream",
      description: "Instead of sitting idle, collective deposits earn yield through decentralized lending markets. This accrued interest is pooled together to fund regular, recurring prize pots without risking anyone's initial deposit.",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    },
    {
      number: "3",
      title: "Verifiable Draws in Total Privacy",
      subtitle: "Confidential Winner Selection",
      description: "Every round, winners are selected randomly using verifiable onchain randomness. Your ticket weights, balance, and prize earnings are kept strictly encrypted so nobody can snoop on your wealth.",
      icon: <Trophy className="w-5 h-5 text-blue-400" />,
    },
    {
      number: "4",
      title: "Withdraw Your Money Anytime",
      subtitle: "Zero Lockups, Zero Fees",
      description: "Need your funds? Withdraw 100% of your initial deposit at any moment with zero penalties. If you win, you keep the prizes. If you don't win, you still keep all your money.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* 1. Header Banner (Double-Bezel Architecture) */}
      <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-6 sm:p-7 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 backdrop-blur-xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Protocol Architecture
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  100% Zero-Loss
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                How Cyvera Reinvents Wealth & Savings
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Cyvera combines the high thrill of recurring grand prizes with the security of a guaranteed savings account. With end-to-end private encryption, your financial position remains completely confidential while the system operates transparently and fairly onchain.
          </p>
        </div>
      </div>

      {/* 2. Four Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step) => (
          <motion.div
            key={step.number}
            whileHover={{ y: -2 }}
            className="p-1 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all group"
          >
            <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#111624] border border-white/[0.06]">
                  {step.icon}
                </div>
                <span className="text-2xl font-bold text-slate-700 font-mono select-none">
                  0{step.number}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  {step.subtitle}
                </span>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Call to Action Banner */}
      <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08]">
        <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white">Ready to start confidential savings?</h3>
            <p className="text-xs text-slate-400 font-normal">
              Deposit test tokens and get entered into the next active prize draw automatically.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnterVault}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <span>Open Cyvera Vault</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
