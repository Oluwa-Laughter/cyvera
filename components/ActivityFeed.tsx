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
  Eye,
  Wallet,
  CheckCircle2,
  Lock
} from "lucide-react";
import { HiTrophy } from "react-icons/hi2";

export interface ActivityFeedItem {
  id?: string | number;
  kind?: string;
  type?: string;
  description?: string;
  amount?: string;
  account?: string;
  txHash?: string;
  timestamp?: number;
  ts?: number;
  status?: string;
}

const META_MAP: Record<string, { icon: React.ReactNode; label: string; tone: string }> = {
  deposit: { icon: <PiggyBank className="w-3.5 h-3.5" />, label: "Deposit", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  withdraw: { icon: <ArrowDownToLine className="w-3.5 h-3.5" />, label: "Withdraw", tone: "bg-slate-100 text-slate-700 border-slate-200" },
  claim: { icon: <Trophy className="w-3.5 h-3.5" />, label: "Claim Prize", tone: "bg-amber-100 text-amber-900 border-amber-200" },
  claim_prize: { icon: <Trophy className="w-3.5 h-3.5" />, label: "Claim Prize", tone: "bg-amber-100 text-amber-900 border-amber-200" },
  compound: { icon: <Repeat className="w-3.5 h-3.5" />, label: "Auto-Compound", tone: "bg-yellow-100 text-yellow-900 border-yellow-200" },
  draw: { icon: <Dices className="w-3.5 h-3.5" />, label: "Prize Draw", tone: "bg-purple-100 text-purple-900 border-purple-200" },
  faucet: { icon: <Droplets className="w-3.5 h-3.5" />, label: "Test Faucet", tone: "bg-sky-100 text-sky-900 border-sky-200" },
  decrypt: { icon: <Eye className="w-3.5 h-3.5" />, label: "Decrypt Balance", tone: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  connect: { icon: <Wallet className="w-3.5 h-3.5" />, label: "Wallet Connected", tone: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

const DEFAULT_META = {
  icon: <History className="w-3.5 h-3.5 text-slate-600" />,
  label: "Transaction",
  tone: "bg-slate-100 text-slate-700 border-slate-200",
};

function relativeTime(ts?: number) {
  if (!ts) return "recently";
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ActivityFeed: React.FC<{ entries: ActivityFeedItem[] }> = ({ entries = [] }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="aura-card p-8 text-center bg-white border border-slate-200 space-y-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <History className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-500 font-medium">No activity recorded for this session yet.</p>
      </div>
    );
  }

  return (
    <div className="aura-card p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <History className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-black uppercase tracking-wide text-black">Real-Time Protocol Activity</h3>
        <span className="ml-auto text-[10px] text-slate-400 font-medium">Live Audit Log</span>
      </div>

      <ul className="space-y-2.5 text-xs">
        <AnimatePresence initial={false}>
          {entries.map((entry, idx) => {
            const keyStr = (entry.kind || entry.type || "transaction").toLowerCase().replace(/-/g, "_");
            const meta = META_MAP[keyStr] || DEFAULT_META;
            const itemTime = entry.timestamp || entry.ts || Date.now();
            const uniqueKey = entry.id ? String(entry.id) : `activity-${idx}-${itemTime}`;

            const labelText = entry.description || (
              entry.amount ? `${meta.label} (${entry.amount})` : meta.label
            );

            return (
              <motion.li
                key={uniqueKey}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-xl border ${meta.tone}`}
                  >
                    {meta.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-black">{labelText}</span>
                      {entry.amount && !entry.description && (
                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {entry.amount}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{relativeTime(itemTime)}</div>
                  </div>
                </div>

                {entry.txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${entry.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-[11px] inline-flex items-center gap-1 text-amber-700 font-bold hover:underline"
                  >
                    <span>tx</span>
                    <ExternalLink className="w-3 h-3" />
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
