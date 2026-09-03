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
  Lock,
  Zap,
  Layers
} from "lucide-react";

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
  market?: string;
  isPublicOnchainTx?: boolean;
}

interface ActivityFeedProps {
  entries?: ActivityFeedItem[];
  items?: ActivityFeedItem[];
  title?: string;
  emptyMessage?: string;
}

const META_MAP: Record<string, { icon: React.ReactNode; label: string; tone: string }> = {
  deposit: { icon: <PiggyBank className="w-3.5 h-3.5 text-emerald-500" />, label: "Deposit", tone: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  withdraw: { icon: <ArrowDownToLine className="w-3.5 h-3.5 text-slate-400" />, label: "Withdraw", tone: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  claim: { icon: <Trophy className="w-3.5 h-3.5 text-amber-500" />, label: "Claim Prize", tone: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  claim_prize: { icon: <Trophy className="w-3.5 h-3.5 text-amber-500" />, label: "Claim Prize", tone: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  compound: { icon: <Repeat className="w-3.5 h-3.5 text-yellow-500" />, label: "Auto-Compound", tone: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  draw: { icon: <Dices className="w-3.5 h-3.5 text-purple-500" />, label: "Prize Draw", tone: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  faucet: { icon: <Droplets className="w-3.5 h-3.5 text-sky-500" />, label: "Testnet Faucet", tone: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
  decrypt: { icon: <Eye className="w-3.5 h-3.5 text-indigo-500" />, label: "Decrypt Balance", tone: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  connect: { icon: <Wallet className="w-3.5 h-3.5 text-emerald-500" />, label: "Wallet Connected", tone: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  seed: { icon: <Zap className="w-3.5 h-3.5 text-amber-500" />, label: "Sponsor Seed", tone: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  harvest: { icon: <Layers className="w-3.5 h-3.5 text-emerald-500" />, label: "Yield Harvest", tone: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
};

const DEFAULT_META = {
  icon: <History className="w-3.5 h-3.5 text-amber-500" />,
  label: "Transaction",
  tone: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

function relativeTime(ts?: number) {
  if (!ts) return "recently";
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  entries,
  items,
  title = "Real-Time Protocol Activity",
  emptyMessage = "No transactions recorded for this wallet yet. Get test tokens and make a deposit to see your verified onchain activity!",
}) => {
  const activeList = items || entries || [];

  if (!activeList || activeList.length === 0) {
    return (
      <div className="p-8 text-center space-y-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[var(--muted)] flex items-center justify-center mx-auto border border-[var(--card-border)]">
          <History className="w-5 h-5" />
        </div>
        <p className="text-xs text-[var(--muted)] font-medium max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground">{title}</h3>
        </div>
        <span className="text-[10px] text-[var(--muted)] font-mono font-bold">
          {activeList.length} {activeList.length === 1 ? "Event" : "Events"} Logged
        </span>
      </div>

      <ul className="space-y-2.5 text-xs">
        <AnimatePresence initial={false}>
          {activeList.map((entry, idx) => {
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
                className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-[var(--card-border)] hover:border-amber-500/30 transition-all shadow-sm"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-xl border ${meta.tone}`}
                  >
                    {meta.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground">{labelText}</span>
                      {entry.amount && !entry.description && (
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                          {entry.amount}
                        </span>
                      )}
                      {entry.status && (
                        <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md uppercase font-mono">
                          {entry.status}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] mt-0.5 font-medium flex items-center gap-2">
                      <span>{relativeTime(itemTime)}</span>
                      {entry.account && (
                        <span className="font-mono text-[10px] opacity-70">
                          • {entry.account.slice(0, 6)}...{entry.account.slice(-4)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Real mined Sepolia transactions get the Etherscan link. Private FHE actions get a verified FHE badge */}
                {entry.isPublicOnchainTx && entry.txHash ? (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${entry.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-[11px] inline-flex items-center gap-1 text-amber-500 font-bold hover:underline font-mono"
                    title="View Transaction on Sepolia Etherscan"
                  >
                    <span>Sepolia TX</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="shrink-0 text-[10px] inline-flex items-center gap-1 text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>Encrypted</span>
                  </span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};
