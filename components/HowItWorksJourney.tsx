"use client";

import React from "react";
import { ArrowRight, Lock, Sprout, Dices, KeyRound, Sparkles, ShieldCheck, Check } from "lucide-react";

export const HowItWorksJourney: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Confidential Deposit",
      tagline: "Wrap & Shield Onchain",
      desc: "Deposit standard tokens into the pool. VeilPrize converts your balance into an onchain euint64 ciphertext and grants decryption permissions via FHE.allow.",
      badge: "FHE.asEuint64",
      badgeColor: "text-zama-cyan bg-zama-cyan/10 border-zama-cyan/30",
      codeSnippet: "euint64 encBal = FHE.asEuint64(amount);\nFHE.allow(encBal, msg.sender);",
    },
    {
      number: "02",
      title: "Continuous DeFi Yield",
      tagline: "Zero Loss Principal",
      desc: "The vault's collective TVL generates streaming interest from battle-tested DeFi strategies (Aave V3 / Compound). 100% of user principal remains withdrawable.",
      badge: "8.50% APY",
      badgeColor: "text-zama-amber bg-zama-amber/10 border-zama-amber/30",
      codeSnippet: "uint256 yield = (principal * apy * dt) / 10000;\nprizePool.fundPrizeReserve(yield);",
    },
    {
      number: "03",
      title: "Onchain FHE Draw",
      tagline: "Deposit-Weighted Entropy",
      desc: "Periodic draws sample verifiable FHE randomness (FHE.randEuint64). Winner selection runs onchain over encrypted balances without revealing amounts.",
      badge: "FHE.randEuint64",
      badgeColor: "text-zama-violet bg-zama-violet/10 border-zama-violet/30",
      codeSnippet: "euint64 entropy = FHE.randEuint64();\neuint64 prize = FHE.select(isWinner, p, 0);",
    },
    {
      number: "04",
      title: "EIP-712 Decrypt & Claim",
      tagline: "Winner-Only Settlement",
      desc: "Winners decrypt their prize winnings using their personal EIP-712 wallet signature. Claim tokens instantly or auto-compound to boost future ticket weight.",
      badge: "EIP-712 KMS",
      badgeColor: "text-zama-emerald bg-zama-emerald/10 border-zama-emerald/30",
      codeSnippet: "const token = await signTypedData(domain, types);\nconst prize = await decrypt(encHandle, token);",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zama-cyan/10 border border-zama-cyan/30 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zama-cyan mb-4">
          <span>Cryptographic Pipeline</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          How VeilPrize Operates.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
          Four interconnected onchain stages ensuring complete financial confidentiality, mathematical fairness, and zero principal loss.
        </p>
      </div>

      {/* 4-Step Bento Grid (Double-Bezel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="double-bezel-outer group">
            <div className="double-bezel-inner p-8 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-3xl font-extrabold font-mono text-white/20 group-hover:text-zama-cyan transition-colors duration-500">
                    {step.number}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mt-4">{step.title}</h3>
                <div className="text-xs font-mono text-zama-cyan mb-3">{step.tagline}</div>
                <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">{step.desc}</p>
              </div>

              {/* Code Snippet Box */}
              <div className="p-4 rounded-xl bg-void-950 border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto">
                <pre className="text-zama-cyan/90 leading-relaxed whitespace-pre">{step.codeSnippet}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
