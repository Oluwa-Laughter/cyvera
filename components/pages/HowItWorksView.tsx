"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  PiggyBank, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  TrendingUp, 
  Coins, 
  HelpCircle,
  Clock,
  Wallet
} from "lucide-react";

interface HowItWorksViewProps {
  onEnterVault: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onEnterVault }) => {
  const steps = [
    {
      number: "1",
      title: "Deposit Tokens into a Prize Vault",
      subtitle: "Your money stays 100% yours",
      description: "Choose a savings vault and deposit tokens (like cUSDT). You get 1 prize ticket for every dollar saved. Unlike regular lotteries, you are never buying tickets — your deposit stays in your account.",
      icon: <PiggyBank className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50 border-amber-200",
    },
    {
      number: "2",
      title: "Lending Yield Funds the Prize Pot",
      subtitle: "Zero risk to your principal",
      description: "While your money sits in the vault, it earns interest from top decentralized lending markets. This interest is collected into a shared daily prize pot without ever touching your original deposit.",
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200",
    },
    {
      number: "3",
      title: "Win Daily Secret Prizes",
      subtitle: "Provably fair and confidential",
      description: "Every day, a random winner is picked automatically. Your chances are proportional to how much you saved. Most importantly, your balance and winnings stay completely confidential to protect your financial privacy.",
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50 border-amber-200",
    },
    {
      number: "4",
      title: "Withdraw Your Money Anytime",
      subtitle: "Zero lockups, zero exit fees",
      description: "Need your funds? Withdraw 100% of your initial deposit at any moment with zero penalties. If you win, you keep the prizes. If you don't win, you still keep all your money.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-10 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header */}
      <div className="aura-card p-8 sm:p-12 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-aura-yellow text-black text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The No-Loss Savings Model</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
          How No-Loss Prize Savings Works
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
          AuraPool turns saving money into an exciting daily game. You save tokens, earn chances to win big prizes every day, and never lose your original deposit.
        </p>
      </div>

      {/* 2. Step-by-Step Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`aura-card p-6 sm:p-8 border ${step.color} flex flex-col justify-between space-y-4`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <span className="text-3xl font-black text-slate-300 font-mono">
                  0{step.number}
                </span>
                <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-sm">
                  {step.subtitle}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-4 mb-2">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-lg font-black text-black">{step.title}</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. The Big Comparison: Traditional Lottery vs AuraPool */}
      <div className="aura-card p-8 sm:p-10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-black text-center">
          Why AuraPool is Better Than Regular Lotteries
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-medium">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-sm font-black text-slate-700 block">Traditional Lottery</span>
            <ul className="space-y-2.5 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>You buy tickets and that money is <strong>gone forever</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>99.9% of players lose their entire purchase.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Tickets expire after one draw.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm space-y-3">
            <span className="text-sm font-black text-black block">AuraPool Savings Vault</span>
            <ul className="space-y-2.5 text-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Your deposit is <strong>100% yours and withdrawable anytime</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Prizes come entirely from <strong>external DeFi yield</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>1 deposit gives you <strong>automatic tickets in every future draw</strong>.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Action Button */}
      <div className="text-center py-4">
        <button
          onClick={onEnterVault}
          className="px-10 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm tracking-tight transition-all shadow-aura-yellow hover:scale-105 active:scale-95 inline-flex items-center gap-2"
        >
          <span>Explore Vaults & Start Saving</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
