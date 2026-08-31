"use client";

import React, { useState } from "react";
import { Shield, Lock, Sparkles, ArrowRight, Dices, Eye, EyeOff, RefreshCw, KeyRound, CheckCircle2, Cpu, Zap } from "lucide-react";

interface LandingHeroProps {
  onLaunchApp: () => void;
  onOpenArchitecture: () => void;
  onOpenFaucet: () => void;
  totalDeposits: string;
  totalPrizeReserve: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchApp,
  onOpenArchitecture,
  onOpenFaucet,
  totalDeposits,
  totalPrizeReserve,
}) => {
  const [simAmount, setSimAmount] = useState<string>("500");
  const [isEncrypted, setIsEncrypted] = useState<boolean>(true);
  const [isEncryptingSim, setIsEncryptingSim] = useState<boolean>(false);

  const mockCiphertext = "0x8f3c9a01e4b872d6199aef50c128741bb380d92e67a421c905b76814fa6e3d2a";

  const handleToggleEncryption = async () => {
    setIsEncryptingSim(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsEncrypted(!isEncrypted);
    setIsEncryptingSim(false);
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-zama-violet/20 via-zama-cyan/15 to-zama-emerald/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Microscopic Eyebrow Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zama-cyan mb-8 shadow-inner-bezel">
        <span className="w-2 h-2 rounded-full bg-zama-emerald animate-pulse" />
        <span>Zama Developer Program &bull; Bounty Track</span>
      </div>

      {/* Massive Typographic Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08] mb-6">
        Save with <span className="bg-gradient-to-r from-zama-cyan via-white to-zama-emerald bg-clip-text text-transparent">Zero Loss.</span>
        <br />
        Win Yield in <span className="bg-gradient-to-r from-zama-violet via-purple-300 to-zama-cyan bg-clip-text text-transparent">Secret.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed mb-10">
        The confidential prize savings protocol powered by Zama Fully Homomorphic Encryption. Deposits, balances, and deposit-weighted draws stay encrypted end-to-end.
      </p>

      {/* Primary CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
        <button
          onClick={onLaunchApp}
          className="group flex items-center justify-center gap-3 pl-7 pr-2.5 py-3.5 rounded-full bg-gradient-to-r from-zama-cyan via-teal-400 to-zama-emerald text-void-950 font-bold text-sm tracking-tight transition-all duration-300 shadow-glow-cyan hover:scale-105 active:scale-[0.98] w-full sm:w-auto"
        >
          <span>Launch Confidential App</span>
          <div className="w-8 h-8 rounded-full bg-void-950/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="w-4 h-4 text-void-950" />
          </div>
        </button>

        <button
          onClick={onOpenArchitecture}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-mono transition-all duration-300 shadow-inner-bezel w-full sm:w-auto"
        >
          <Cpu className="w-4 h-4 text-zama-cyan" />
          <span>Architecture & Math</span>
        </button>
      </div>

      {/* Interactive Cryptographic Simulation Card (Double-Bezel) */}
      <div className="w-full max-w-3xl double-bezel-outer text-left">
        <div className="double-bezel-inner p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-zama-violet/10 border border-zama-violet/30 text-zama-violet">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-mono">Live Zama FHE Cipher Simulation</h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zama-emerald/10 border border-zama-emerald/20 text-zama-emerald font-semibold">
                    Client Sandbox
                  </span>
                </div>
                <p className="text-xs text-slate-400">See how deposit plaintext turns into verifiable onchain ciphertext.</p>
              </div>
            </div>

            <button
              onClick={handleToggleEncryption}
              disabled={isEncryptingSim}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all self-end sm:self-auto"
            >
              {isEncryptingSim ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-zama-cyan" />
              ) : isEncrypted ? (
                <Eye className="w-3.5 h-3.5 text-zama-emerald" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-zama-violet" />
              )}
              <span>{isEncrypted ? "Simulate EIP-712 Decrypt" : "Re-Encrypt to euint64"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Input Side */}
            <div className="p-4 rounded-2xl bg-void-950/70 border border-white/5 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400">Plaintext Deposit Amount</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={simAmount}
                  onChange={(e) => setSimAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl font-bold font-mono text-white focus:outline-none"
                  placeholder="500"
                />
                <span className="text-xs font-mono px-2 py-1 rounded bg-white/10 text-zama-cyan">cUSDT</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Token approval &rarr; deposit wrapped into pool.</p>
            </div>

            {/* Ciphertext Onchain Output */}
            <div className="p-4 rounded-2xl bg-void-950/70 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-slate-400">Onchain FHE State</span>
                <span className="text-[10px] font-mono text-zama-violet px-2 py-0.5 rounded bg-zama-violet/10 border border-zama-violet/20">
                  {isEncrypted ? "🔒 euint64 Ciphertext" : "🔓 Plaintext View"}
                </span>
              </div>
              <div className="text-sm font-mono font-bold text-slate-200 truncate py-1">
                {isEncrypted ? (
                  <span className="text-zama-cyan glow-text-cyan">{mockCiphertext}</span>
                ) : (
                  <span className="text-zama-emerald glow-text-emerald">{simAmount}.00 cUSDT (Decrypted)</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                {isEncrypted ? "Zero observers can read this value." : "Verified via user's private EIP-712 key."}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zama-emerald" />
              <span>Provably fair deposit-weighted draw</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zama-cyan" />
              <span>100% Principal withdrawable anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Trust Capsules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full max-w-4xl text-left">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-xs font-mono text-slate-400">Vault TVL</div>
          <div className="text-xl font-bold font-mono text-white mt-1">{totalDeposits} <span className="text-xs text-zama-cyan">cUSDT</span></div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-xs font-mono text-slate-400">Prize Pool Pot</div>
          <div className="text-xl font-bold font-mono text-zama-emerald mt-1">{totalPrizeReserve} <span className="text-xs text-zama-emerald">cUSDT</span></div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-xs font-mono text-slate-400">Yield Engine</div>
          <div className="text-xl font-bold font-mono text-zama-amber mt-1">8.50% <span className="text-xs text-zama-amber">APY</span></div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-xs font-mono text-slate-400">Privacy Standard</div>
          <div className="text-xl font-bold font-mono text-zama-violet mt-1">Zama <span className="text-xs text-zama-violet">fhEVM</span></div>
        </div>
      </div>
    </section>
  );
};
