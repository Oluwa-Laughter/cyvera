"use client";

import React from "react";
import { ShieldX, ShieldCheck, Eye, EyeOff, AlertTriangle, CheckCircle, Lock, Unlock, Users, Target } from "lucide-react";

export const ComparisonSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zama-violet/10 border border-zama-violet/30 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zama-violet mb-4">
          <span>The Privacy Dilemma</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Why Transparent Prize Savings <span className="text-zama-rose">Fails.</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
          On public blockchains, no-loss savings protocols expose personal wealth and ticket odds to the entire world. Zama Fully Homomorphic Encryption eliminates the privacy trade-off.
        </p>
      </div>

      {/* Comparison Grid (Double-Bezel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Transparent PoolTogether (Vulnerabilities) */}
        <div className="double-bezel-outer border-zama-rose/20">
          <div className="double-bezel-inner p-8 h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-zama-rose/10 border border-zama-rose/30 text-zama-rose">
                    <ShieldX className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Transparent PoolTogether</h3>
                    <p className="text-xs text-zama-rose font-mono">Traditional Web3 (Cleartext)</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-zama-rose/10 border border-zama-rose/20 text-zama-rose">
                  Leaks Data
                </span>
              </div>

              {/* Point List */}
              <ul className="space-y-4 text-xs sm:text-sm font-mono text-slate-300">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-zama-rose shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Exposed Wealth & Net Worth:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Every deposit size and individual pool share is visible to anyone on Etherscan.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-zama-rose shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Whale & User Targeting:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Large depositors become prime targets for phishing campaigns, social engineering, and targeted exploits.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Eye className="w-4 h-4 text-zama-rose shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Exact Winning Odds Leaked:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Competitors can calculate exact odds of every participant in real-time, discouraging smaller savers.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Unlock className="w-4 h-4 text-zama-rose shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Plaintext Payout History:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Whenever someone wins a draw, the identity and prize sum are broadcast across the chain.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-500">
              Traditional EVM Architecture
            </div>
          </div>
        </div>

        {/* Right: VeilPrize on Zama FHE (The Solution) */}
        <div className="double-bezel-outer border-zama-emerald/30 shadow-glow-emerald">
          <div className="double-bezel-inner p-8 h-full flex flex-col justify-between bg-gradient-to-b from-void-850 to-void-950">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-zama-emerald/10 border border-zama-emerald/30 text-zama-emerald">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">VeilPrize Protocol</h3>
                    <p className="text-xs text-zama-emerald font-mono">Zama fhEVM Encrypted</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-zama-emerald/10 border border-zama-emerald/30 text-zama-emerald font-bold">
                  100% Private
                </span>
              </div>

              {/* Point List */}
              <ul className="space-y-4 text-xs sm:text-sm font-mono text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-zama-emerald shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Encrypted Balances (euint64):</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Individual deposit amounts and ticket counts stay strictly encrypted onchain at all times.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-zama-emerald shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Zero Whale Exposure:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">No observer can determine how much capital any specific wallet holds in the prize pool.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <EyeOff className="w-4 h-4 text-zama-emerald shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Deposit-Weighted Onchain FHE Draws:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Winner selection uses FHE randomness over encrypted balances without decrypting amounts.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-zama-emerald shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">EIP-712 Winner-Only Decryption:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Only the winner holds the cryptographic key to decrypt and claim their prize tokens.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-zama-emerald flex items-center justify-between">
              <span>Powered by Zama FHEVM</span>
              <span>100% Principal Safe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
