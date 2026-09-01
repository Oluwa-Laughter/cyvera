"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiggyBank,
  ArrowDownToLine,
  Trophy,
  Repeat,
  Dices,
  Droplets,
  ExternalLink,
  History,
} from "lucide-react";
import { ActivityEntry } from "@/app/page";

import { Eye, Wallet } from "lucide-react";

const KIND_META: Record<
  ActivityEntry["kind"],
  { icon: React.ReactNode; label: string; tone: string }
> = {
  deposit: { icon: <PiggyBank className="w-3.5 h-3.5" />, label: "Deposit", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  withdraw: { icon: <ArrowDownToLine className="w-3.5 h-3.5" />, label: "Withdraw", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  claim: { icon: <Trophy className="w-3.5 h-3.5" />, label: "Claim", tone: "bg-amber-100 text-amber-900 border-amber-200" },
  compound: { icon: <Repeat className="w-3.5 h-3.5" />, label: "Compound", tone: "bg-yellow-100 text-yellow-900 border-yellow-200" },
  draw: { icon: <Dices className="w-3.5 h-3.5" />, label: "Draw", tone: "bg-purple-100 text-purple-900 border-purple-200" },
  faucet: { icon: <Droplets className="w-3.5 h-3.5" />, label: "Faucet", tone: "bg-sky-100 text-sky-900 border-sky-200" },
  decrypt: { icon: <Eye className="w-3.5 h-3.5" />, label: "Decrypt", tone: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  connect: { icon: <Wallet className="w-3.5 h-3.5" />, label: "Connect", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleString();
}

export const ActivityFeed: React.FC<{ entries: ActivityEntry[] }> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <div className="aura-card p-6 space-y-3 border border-slate-200">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <History className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-black uppercase tracking-wide text-black">Activity feed</h3>
        <span className="ml-auto text-[10px] text-slate-400">Session activity</span>
      </div>

      <ul className="space-y-2 text-xs">
        <AnimatePresence initial={false}>
          {entries.map((entry) => {
            const meta = KIND_META[entry.kind];
            return (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-xl border ${meta.tone}`}
                  >
                    {meta.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-black">{entry.description}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{relativeTime(entry.ts)}</div>
                  </div>
                </div>
                {entry.txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${entry.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-[11px] inline-flex items-center gap-1 text-amber-700 font-bold hover:underline"
                  >
                    tx <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};
