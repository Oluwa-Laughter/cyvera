"use client";

import React, { useState } from "react";
import { AuraLogo } from "@/components/AuraLogo";
import { 
  Gavel, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Droplets, 
  Cpu,
  ChevronDown, 
  TrendingUp, 
  HelpCircle,
  Coins,
  ArrowDownLeft,
  ChevronRight
} from "lucide-react";
import { FaShieldAlt } from "react-icons/fa";

interface LandingViewProps {
  onEnterApp: (tab?: "auctions" | "my-bids" | "create" | "fhe-lab" | "activity" | "how-it-works") => void;
  onOpenHowItWorks?: () => void;
  account?: string | null;
  onConnect?: () => void;
  isConnecting?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  onOpenHowItWorks,
  account,
  onConnect,
  isConnecting,
}) => {
  // Simulator State
  const [simBid, setSimBid] = useState<string>("150");
  const parsedBid = parseFloat(simBid || "0");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is a Confidential Sealed-Bid Dark Auction?",
      a: "In traditional onchain auctions (like OpenSea or English auctions), every bid is publicly visible in the mempool, allowing MEV bots and snipers to outbid users by 1 wei at the last second. AuraDark uses Zama FHE to encrypt all bids into euint64 ciphertexts onchain. The smart contract determines the winner homomorphically without anyone seeing the bids before settlement.",
    },
    {
      q: "How does the contract find the highest bid without decrypting?",
      a: "Using Zama's fhEVM precompiles, the contract executes `FHE.gt(newBid, highestBid)` and `FHE.select(isHigher, newBid, highestBid)` directly over encrypted ciphertexts on Ethereum Sepolia. Plaintext numbers are never revealed to miners or observers.",
    },
    {
      q: "What happens if I don't win the auction?",
      a: "You are 100% protected. Once the auction timer expires and settlement occurs, all non-winning bidders can claim their 100% full escrow refund back into their wallet with a single click.",
    },
    {
      q: "What assets can be auctioned?",
      a: "Any ERC-20 token lot, protocol allocation, yield bond, or private treasury grant can be deployed for sealed bidding in seconds.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-black">
      {/* 1. Top Navbar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        <AuraLogo size="md" />

        <div className="flex items-center gap-3 font-medium text-xs">
          <button
            onClick={() => onEnterApp("fhe-lab")}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 active:scale-95"
          >
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>FHE Lab</span>
          </button>

          <button
            onClick={() => onEnterApp("how-it-works")}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>How It Works</span>
          </button>

          <button
            onClick={() => onEnterApp("auctions")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold shadow-aura-yellow transition-all hover:scale-105 active:scale-95"
          >
            <span>Launch Dark Pools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
              <FaShieldAlt className="w-3.5 h-3.5 text-amber-600" />
              <span>Zama FHE Encrypted Sealed-Bid Auctions</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-black">
              Front-Running-Proof <br />
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Dark Auctions
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
              Bid on confidential token allocations and private dark lots without revealing your bid value to MEV bots or competitors. Powered by Zama fhEVM homomorphic comparison with <strong>100% full escrow refunds</strong> for non-winners.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => onEnterApp("auctions")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Gavel className="w-4 h-4" />
                <span>Explore Dark Auctions</span>
              </button>

              <button
                onClick={() => onEnterApp("fhe-lab")}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Cpu className="w-4 h-4 text-amber-600" />
                <span>Test FHE Cryptography Lab</span>
              </button>
            </div>

            {/* Live Trust Metrics */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-xs font-medium text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Front-Running:</span>
                <strong className="text-emerald-700 font-black text-sm">0.00% (MEV Proof)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Privacy Level:</span>
                <strong className="text-black font-black text-sm">Zama euint64</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Non-Winner Risk:</span>
                <strong className="text-emerald-700 font-black text-sm">100% Refundable</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Card */}
          <div className="lg:col-span-5">
            <div className="aura-card p-6 sm:p-8 bg-white border border-amber-300 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-black">Live Dark Lot Preview</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-aura-yellow text-black font-extrabold">
                  Pool #1
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-black">Genesis 50,000 $AURA Lot</h3>
                <p className="text-xs text-slate-500 mt-1">Confidential seed allocation. Bids evaluated homomorphically onchain.</p>
              </div>

              {/* Interactive Bid Input */}
              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between font-bold">
                  <label className="text-slate-700">Simulate Your Sealed Bid:</label>
                  <span className="text-amber-800 font-mono font-black">${parsedBid.toFixed(2)} cUSDT</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="500"
                  step="5"
                  value={simBid}
                  onChange={(e) => setSimBid(e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Sealed Math Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Plaintext Bid:</span>
                  <strong className="text-black">${parsedBid.toFixed(2)} cUSDT</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mempool Visibility:</span>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold">0x8a9f...3c4e (Encrypted)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">If Outbid by Another:</span>
                  <span className="text-emerald-700 font-extrabold">+${parsedBid.toFixed(2)} Full Refund</span>
                </div>
              </div>

              <button
                onClick={() => onEnterApp("auctions")}
                className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Enter Dark Auction</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Grid */}
      <section className="py-16 px-4 sm:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              Why Sealed-Bid Dark Pools Beat Public Auctions
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Eliminate predatory MEV extraction with cryptographic confidentiality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="aura-card p-6 sm:p-8 bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-black">Confidential euint64 Bids</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Every bid is converted into a 256-bit ciphertext before reaching the mempool. Front-running and snipers are impossible.
              </p>
            </div>

            <div className="aura-card p-6 sm:p-8 bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-black">Homomorphic FHE.gt Winner</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                The smart contract executes comparisons directly on ciphertexts. The winner is selected without ever revealing private bid numbers.
              </p>
            </div>

            <div className="aura-card p-6 sm:p-8 bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-black">100% Escrow Refunds</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Non-winning bidders withdraw their full escrow with 1 click. Zero slippage, zero loss, 100% verifiable onchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-black">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 font-medium">Everything you need to know about AuraDark and Zama FHE.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="aura-card p-5 bg-white border border-slate-200 cursor-pointer transition-all"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-black">{faq.q}</h4>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </div>
              {openFaq === idx && (
                <p className="text-xs text-slate-600 font-medium mt-3 leading-relaxed pt-3 border-t border-slate-100">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-slate-200 bg-white text-xs text-slate-500 text-center space-y-2">
        <AuraLogo size="sm" />
        <p>AuraDark Protocol — Confidential Sealed-Bid Dark Auctions Powered by Zama fhEVM.</p>
        <p className="text-[11px] text-slate-400">Deployed on Ethereum Sepolia Testnet</p>
      </footer>
    </div>
  );
};
