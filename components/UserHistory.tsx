"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownToLine, History, PiggyBank, Repeat, Trophy, Dices, ExternalLink } from "lucide-react";
import { HistoryEntry } from "@/lib/history";

const KIND_META: Record<HistoryEntry["kind"], { icon: React.ReactNode; label: string; tone: string }> = {
  deposit: { icon: <PiggyBank className="w-3.5 h-3.5" />, label: "Deposit", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  withdraw: { icon: <ArrowDownToLine className="w-3.5 h-3.5" />, label: "Withdraw", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  claim: { icon: <Trophy className="w-3.5 h-3.5" />, label: "Claim", tone: "bg-amber-100 text-amber-900 border-amber-200" },
  compound: { icon: <Repeat className="w-3.5 h-3.5" />, label: "Compound", tone: "bg-yellow-100 text-yellow-900 border-yellow-200" },
  draw: { icon: <Dices className="w-3.5 h-3.5" />, label: "Draw", tone: "bg-purple-100 text-purple-900 border-purple-200" },
};

export const UserHistory: React.FC<{ entries: HistoryEntry[]; isLoading?: boolean }> = ({ entries, isLoading }) => {
  return (
    <div className="aura-card p-6 space-y-3 border border-slate-200">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <History className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-black uppercase tracking-wide text-black">Onchain history</h3>
        <span className="ml-auto text-[10px] text-slate-400">Last 20 events from Sepolia</span>
      </div>

      {isLoading && (
        <div className="py-6 text-center text-xs text-slate-500">Loading event logs…</div>
      )}

      {!isLoading && entries.length === 0 && (
        <div className="py-6 text-center text-xs text-slate-500">
          No onchain activity yet — deposit cUSDT to start saving!
        </div>
      )}

      <ul className="space-y-2 text-xs">
        <AnimatePresence initial={false}>
          {entries.map((e, i) => {
            const meta = KIND_META[e.kind];
            return (
              <motion.li
                key={`${e.hash}-${i}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-xl border ${meta.tone}`}>
                    {meta.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-black">
                      {e.amount ? `${e.amount} cUSDT` : "FHE draw execution"}
                    </div>
                    <div className="text-[11px] text-slate-500">Block #{e.blockNumber}</div>
                  </div>
                </div>
                <a
                  className="shrink-0 text-[11px] inline-flex items-center gap-1 text-amber-700 font-bold hover:underline"
                  href={`https://sepolia.etherscan.io/tx/${e.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  tx <ExternalLink className="w-3 h-3" />
                </a>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};
