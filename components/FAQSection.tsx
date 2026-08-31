"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Shield, Sparkles } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does VeilPrize select winners without decrypting balances?",
      a: "VeilPrize uses Zama's FHE randomness precompile (FHE.randEuint64) to generate verifiable onchain entropy. Winner selection maps the random ticket to cumulative deposit ranges using homomorphic comparisons (FHE.ge, FHE.lt) and multiplexing (FHE.select). The prize amount is credited confidentially to the winner's encrypted winnings balance without ever revealing who won or how much they deposited.",
    },
    {
      q: "Why is VeilPrize guaranteed to be 'No-Loss'?",
      a: "Your deposited principal is never spent or put at risk. The prize pool consists exclusively of external DeFi yield (e.g. 8.5% APY from Aave/Compound lending markets). You can withdraw 100% of your initial deposit at any time with instant onchain execution.",
    },
    {
      q: "How does EIP-712 User Decryption work?",
      a: "When you want to view your balance or claim winnings, you sign an EIP-712 typed authorization message in your wallet. The Zama Gateway / Relayer verifies your cryptographic signature against the ACL permission granted by FHE.allow, and securely re-encrypts the ciphertext under your temporary key so only your device can read the plaintext.",
    },
    {
      q: "What information is public vs what stays confidential?",
      a: "Your individual deposit amount, current savings balance, ticket odds, and unclaimed winnings stay strictly encrypted as euint64. The only public metrics are the aggregate pool TVL (for DeFi routing) and the list of active participant addresses.",
    },
    {
      q: "How does the Mock Yield Source transition to production?",
      a: "The smart contract architecture includes an interchangeable IVeilYieldSource interface. In production, this supplies the vault's idle principal directly to Aave V3 or Compound Comet lending pools. Accrued aToken interest is automatically harvested into the prize reserve before each draw.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zama-cyan/10 border border-zama-cyan/30 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zama-cyan mb-4">
          <span>Knowledge Base</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Frequently Asked Questions.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
          Deep-dive explanations into the mathematics, security invariants, and Zama FHE integration.
        </p>
      </div>

      {/* Accordion List (Double-Bezel) */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="double-bezel-outer">
              <div className="double-bezel-inner p-6 transition-all duration-300">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-mono"
                >
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                    <span className="text-zama-cyan text-xs">Q{index + 1}.</span>
                    <span>{faq.q}</span>
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 bg-zama-cyan/20 text-zama-cyan" : "text-slate-400"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-white/5 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed animate-in fade-in duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
