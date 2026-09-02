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
  EyeOff,
  Cpu,
  Fingerprint
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
      description: "You deposit tokens into the Cyvera savings vault and receive 1 prize ticket for every dollar saved. Your savings balance is strictly private — nobody on the blockchain can view your balance or track your net worth.",
      icon: <PiggyBank className="w-6 h-6 text-amber-500" />,
    },
    {
      number: "2",
      title: "Lending Yield Funds the Prize Pot",
      subtitle: "Zero Risk to Your Principal",
      description: "While your money sits in the vault, it earns lending interest in decentralized money markets. This interest streams directly into the shared prize pot without ever touching a single cent of your deposit.",
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
    },
    {
      number: "3",
      title: "Win Verifiable Encrypted Prizes",
      subtitle: "Provably Fair & Private",
      description: "Draws progress automatically onchain using Zama FHE randomness. Your chances are proportional to how much you saved. Most importantly, winners are never broadcast to the public, protecting your financial privacy.",
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
    },
    {
      number: "4",
      title: "Withdraw Your Money Anytime",
      subtitle: "Zero Lockups, Zero Fees",
      description: "Need your funds? Withdraw 100% of your initial deposit at any moment with zero penalties. If you win, you keep the prizes. If you don't win, you still keep all your money.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    },
  ];

  return (
    <div className="space-y-10 w-full max-w-4xl mx-auto text-foreground">
      {/* 1. Header Banner */}
      <div className="cyvera-card p-6 sm:p-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyvera-gold text-black flex items-center justify-center font-bold shadow-cyvera-glow">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                Protocol Mechanics
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-extrabold border border-emerald-500/20">
                100% Zero-Loss
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
              How Cyvera Reinvents Wealth & Savings
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-medium">
          Cyvera combines the high thrill of grand prize jackpots with the peace of mind of a guaranteed savings account. By applying Fully Homomorphic Encryption (Zama FHE), your financial position remains completely private while the system operates transparently and fairly onchain.
        </p>
      </div>

      {/* 2. Four Interactive Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <motion.div
            key={step.number}
            whileHover={{ y: -4 }}
            className="cyvera-card p-6 sm:p-8 space-y-4 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-[var(--card-border)]">
                {step.icon}
              </div>
              <span className="text-4xl font-black text-slate-200 dark:text-slate-800 font-mono select-none">
                0{step.number}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide block">
                {step.subtitle}
              </span>
              <h3 className="text-lg font-black text-foreground">{step.title}</h3>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 3. Call to Action Banner */}
      <div className="cyvera-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-black text-foreground">Ready to start confidential savings?</h3>
          <p className="text-xs text-[var(--muted)] font-medium">
            Deposit test tokens and get entered into the next active prize draw automatically.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnterVault}
          className="px-8 py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2 shrink-0"
        >
          <span>Open Cyvera Vault</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </motion.button>
      </div>
    </div>
  );
};
