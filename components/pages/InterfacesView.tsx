"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Smartphone, 
  Repeat, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface InterfacesViewProps {
  onEnterVault: () => void;
}

export const InterfacesView: React.FC<InterfacesViewProps> = ({ onEnterVault }) => {
  const interfaces = [
    {
      name: "AuraPool Core App",
      badge: "Confidential Native",
      badgeColor: "bg-aura-yellow text-black font-extrabold",
      description: "The primary confidential client with encrypted balances, zero whale tracking, and 1-click private prize claims on Ethereum Sepolia.",
      tag: "Live dApp",
      status: "Active",
      isInternal: true,
      iconColor: "bg-amber-500 text-black",
    },
    {
      name: "Cabana Lite",
      badge: "PoolTogether V5",
      badgeColor: "bg-purple-100 text-purple-900 font-bold",
      description: "A minimalist, long-term interface for the PoolTogether protocol focusing on cross-chain savings vaults and yield liquidations.",
      url: "https://app.cabana.fi/",
      tag: "Web Interface",
      status: "Supported",
      isInternal: false,
      iconColor: "bg-purple-600 text-white",
    },
    {
      name: "PoolSide Win",
      badge: "IPFS Hosted",
      badgeColor: "bg-blue-100 text-blue-900 font-bold",
      description: "A fully decentralized, static IPFS-hosted web client designed for censorship-resistant prize vault interactions.",
      url: "https://poolsidewin.eth.limo/",
      tag: "IPFS Client",
      status: "Supported",
      isInternal: false,
      iconColor: "bg-blue-600 text-white",
    },
    {
      name: "Shinjo",
      badge: "Base Network",
      badgeColor: "bg-emerald-100 text-emerald-900 font-bold",
      description: "Save on Base. Win daily. Keep everything. A streamlined consumer mobile-first prize savings interface.",
      url: "https://shinjo.app/",
      tag: "Mobile Web",
      status: "Supported",
      isInternal: false,
      iconColor: "bg-emerald-600 text-white",
    },
    {
      name: "PoolyTime",
      badge: "Community",
      badgeColor: "bg-indigo-100 text-indigo-900 font-bold",
      description: "Community-operated prize draw countdown tracker and winner tier viewer across active prize pools.",
      url: "https://pooly.eth.limo/",
      tag: "Draw Explorer",
      status: "Supported",
      isInternal: false,
      iconColor: "bg-indigo-600 text-white",
    },
    {
      name: "Yearn Prize Vaults",
      badge: "DeFi Yield",
      badgeColor: "bg-cyan-100 text-cyan-900 font-bold",
      description: "Deposit directly into Yearn Finance automated yield strategies wrapped inside PoolTogether prize vaults.",
      url: "https://pooltogether.yearn.space/",
      tag: "Yield Aggregator",
      status: "Supported",
      isInternal: false,
      iconColor: "bg-cyan-600 text-white",
    },
  ];

  return (
    <div className="space-y-10 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header */}
      <div className="aura-card p-8 sm:p-12 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-aura-yellow text-black text-xs font-bold uppercase tracking-wider shadow-sm">
          <Layers className="w-3.5 h-3.5" />
          <span>Decentralized Ecosystem</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
          Interfaces for Prize Savings
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
          There are multiple ways to interact with the PoolTogether & AuraPool protocols. Supporting multiple community interfaces ensures complete decentralization and censorship resistance.
        </p>
      </div>

      {/* 2. Interfaces Grid */}
      <div className="space-y-4">
        {interfaces.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="aura-card p-6 sm:p-7 border border-slate-200 hover:border-amber-300 hover:shadow-aura-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-sm shrink-0 ${item.iconColor}`}>
                <Globe className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-black text-black">{item.name}</h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    &bull; {item.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              {item.isInternal ? (
                <button
                  onClick={onEnterVault}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Launch Vaults</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Open App</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Decentralization Info Banner */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-black font-bold">Permissionless Smart Contracts:</strong>
          <p className="leading-relaxed">
            All user deposits are held directly in non-custodial smart contracts on Ethereum Sepolia. You can access your funds through any of these community interfaces at any time.
          </p>
        </div>
      </div>
    </div>
  );
};
