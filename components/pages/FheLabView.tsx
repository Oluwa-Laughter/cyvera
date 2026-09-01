"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  RefreshCw,
  Code2,
  CheckCircle2
} from "lucide-react";

export const FheLabView: React.FC = () => {
  const [bidA, setBidA] = useState<number>(75);
  const [bidB, setBidB] = useState<number>(120);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setStep(1);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 2200);
    setTimeout(() => {
      setStep(4);
      setIsSimulating(false);
    }, 3400);
  };

  const handleA = "0x7f8a9b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4";
  const handleB = "0x1a2b3c4d5e6f708192a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5";
  const winner = bidA >= bidB ? "Bidder A" : "Bidder B";
  const winningVal = Math.max(bidA, bidB);

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto text-black">
      {/* 1. Hero */}
      <div className="aura-card p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-aura-yellow text-black flex items-center justify-center font-bold shadow-sm">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black text-white">
                Zama fhEVM
              </span>
              <span className="text-xs font-bold text-slate-500">Interactive Cryptography Lab</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black">FHE Homomorphic Execution Engine</h2>
          </div>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-3 max-w-2xl leading-relaxed">
          Explore how Zama's Fully Homomorphic Encryption allows smart contracts to compute over encrypted inputs without ever decrypting them or exposing private numbers to the blockchain.
        </p>
      </div>

      {/* 2. Interactive Simulator */}
      <div className="aura-card p-6 sm:p-10 bg-white border border-slate-200 shadow-sm space-y-8">
        <div>
          <h3 className="text-base font-black text-black flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Interactive Homomorphic Comparison Simulator (`FHE.gt`)</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Input two secret bid amounts to observe how the smart contract compares and selects the winner using encrypted ciphertexts.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-medium">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-700">Bidder A (Secret Value):</span>
              <span className="text-amber-800 font-mono font-black">${bidA} cUSDT</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={bidA}
              onChange={(e) => {
                setBidA(Number(e.target.value));
                setStep(0);
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[11px] font-mono text-slate-400 break-all bg-white p-2 rounded-xl border border-slate-200">
              <code>euint64: {handleA.slice(0, 24)}...</code>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-700">Bidder B (Secret Value):</span>
              <span className="text-amber-800 font-mono font-black">${bidB} cUSDT</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={bidB}
              onChange={(e) => {
                setBidB(Number(e.target.value));
                setStep(0);
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[11px] font-mono text-slate-400 break-all bg-white p-2 rounded-xl border border-slate-200">
              <code>euint64: {handleB.slice(0, 24)}...</code>
            </div>
          </div>
        </div>

        {/* Trigger */}
        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>Evaluating Zama FHE Circuits...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-black" />
              <span>Run Homomorphic FHE Evaluation</span>
            </>
          )}
        </button>

        {/* Simulation Steps Output */}
        {step > 0 && (
          <div className="p-6 rounded-3xl bg-slate-900 text-white font-mono text-xs space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-amber-400 font-bold flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                <span>Onchain fhEVM Circuit Trace</span>
              </span>
              <span className="text-slate-400 text-[10px]">Coprocessor 0x0100</span>
            </div>

            <div className="space-y-3">
              {step >= 1 && (
                <div className="flex items-start gap-2 text-slate-300 animate-in fade-in">
                  <span className="text-amber-400">Step 1:</span>
                  <span>
                    Encrypt inputs to ciphertext: <code>FHE.asEuint64(A)</code> and <code>FHE.asEuint64(B)</code>
                  </span>
                </div>
              )}

              {step >= 2 && (
                <div className="flex items-start gap-2 text-slate-300 animate-in fade-in">
                  <span className="text-amber-400">Step 2:</span>
                  <span>
                    Execute homomorphic comparison: <code>ebool isHigher = FHE.gt(ct_B, ct_A);</code>
                  </span>
                </div>
              )}

              {step >= 3 && (
                <div className="flex items-start gap-2 text-slate-300 animate-in fade-in">
                  <span className="text-amber-400">Step 3:</span>
                  <span>
                    Homomorphic multiplexer: <code>euint64 winnerCt = FHE.select(isHigher, ct_B, ct_A);</code>
                  </span>
                </div>
              )}

              {step >= 4 && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 space-y-1 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Homomorphic Output Computed</span>
                  </div>
                  <p className="text-[11px]">
                    Winner: <strong>{winner}</strong> with Highest Encrypted Bid <strong>(${winningVal} cUSDT)</strong>. Zero plaintext was leaked to the mempool or miners during the entire execution!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
