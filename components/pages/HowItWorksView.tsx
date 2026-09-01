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
  Wallet,
  AlertTriangle,
  EyeOff
} from "lucide-react";

interface HowItWorksViewProps {
  onEnterVault: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onEnterVault }) => {
  const steps = [
    {
      number: "1",
      title: "Deposit & Save Confidentially",
      subtitle: "Your Money Stays 100% Yours",
      description: "You deposit tokens into the savings vault and receive 1 prize ticket for every dollar saved. Your savings balance is strictly private — nobody on the blockchain can view your balance or track your net worth.",
      icon: <PiggyBank className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50/60 border-amber-200",
    },
    {
      number: "2",
      title: "Lending Yield Funds the Prize Pot",
      subtitle: "Zero Risk to Your Principal",
      description: "While your money sits in the vault, it earns lending interest in decentralized money markets. This interest streams directly into the shared daily prize pot without ever touching a single cent of your deposit.",
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50/60 border-emerald-200",
    },
    {
      number: "3",
      title: "Win Daily Secret Prizes",
      subtitle: "Provably Fair & Private",
      description: "Every 24 hours, a random winner is picked automatically onchain. Your chances are proportional to how much you saved. Most importantly, winners are never broadcast to the public, protecting your financial privacy.",
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50/60 border-amber-200",
    },
    {
      number: "4",
      title: "Withdraw Your Money Anytime",
      subtitle: "Zero Lockups, Zero Fees",
      description: "Need your funds? Withdraw 100% of your initial deposit at any moment with zero penalties. If you win, you keep the prizes. If you don't win, you still keep all your money.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50/60 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-12 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header Hero */}
      <div className="aura-card p-8 sm:p-12 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-aura-yellow text-black text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Problem & Our Solution</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
          How No-Loss Prize Savings Works
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
          VeilPool fixes what is broken with both traditional lotteries and public blockchains, creating a win-win savings account where your money stays safe forever.
        </p>
      </div>

      {/* 2. The Problems We Solve (Why We Built VeilPool) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Problem 1: Traditional Lotteries */}
        <div className="aura-card p-6 sm:p-8 border-rose-200 bg-rose-50/20 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 font-bold">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-rose-950">The Problem with Traditional Lotteries</h3>
              <span className="text-[11px] text-rose-700">99.9% of players lose their money</span>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed font-medium">
            When you buy regular lottery tickets, that money is <strong>gone forever</strong>. You spend $100 and walk away with $0. It is a wealth-destroying cycle that punishes everyday savers.
          </p>
        </div>

        {/* Problem 2: Public Blockchains */}
        <div className="aura-card p-6 sm:p-8 border-orange-200 bg-orange-50/20 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-orange-100">
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-800 font-bold">
              <EyeOff className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-orange-950">The Problem with Public Blockchains</h3>
              <span className="text-[11px] text-orange-700">Zero financial privacy</span>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed font-medium">
            On transparent blockchains, anyone can see your wallet balance and savings amount. When someone wins a big prize, their wallet is publicly exposed, making them an immediate target for scams and phishing.
          </p>
        </div>
      </div>

      {/* 3. The 4-Step Solution */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            The VeilPool Solution in 4 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Save tokens, win daily prizes, and keep your financial privacy intact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
      </div>

      {/* 4. The No-Loss Guarantee Banner */}
      <div className="aura-card p-8 sm:p-10 bg-emerald-50/50 border border-emerald-200 text-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-base font-black text-emerald-950">The 100% No-Loss Guarantee</h3>
            <span className="text-[11px] text-emerald-800 font-medium">Mathematical & Smart Contract Security</span>
          </div>
        </div>

        <p className="text-emerald-900 leading-relaxed font-medium">
          In VeilPool, all prize money comes exclusively from external lending yield generated by the collective pool. Your deposited principal is never spent on tickets and never wagered. You can withdraw 100% of your original deposit at any time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-700 font-bold">
          <div className="p-3 rounded-xl bg-white border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Instant 100% Exit</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero Withdrawal Fees</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Private Balances</span>
          </div>
        </div>
      </div>

      {/* 5. CTA Footer */}
      <div className="text-center py-4">
        <button
          onClick={onEnterVault}
          className="px-10 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm tracking-tight transition-all shadow-aura-yellow hover:scale-105 active:scale-95 inline-flex items-center gap-2"
        >
          <span>Start Saving with $0 Risk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
