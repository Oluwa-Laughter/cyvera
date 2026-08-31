"use client";

import React from "react";
import { ZamaLogo } from "@/components/ZamaLogo";
import { 
  LayoutDashboard, 
  Shield, 
  Dices, 
  Trophy, 
  Sprout, 
  Droplets, 
  Cpu, 
  ExternalLink, 
  ChevronRight, 
  X, 
  Home,
  Lock
} from "lucide-react";

export type AppPageTab = "dashboard" | "vault" | "draws" | "rewards" | "yield";

interface SidebarNavProps {
  currentTab: AppPageTab;
  onSelectTab: (tab: AppPageTab) => void;
  onNavigateHome: () => void;
  onOpenFaucet: () => void;
  onOpenSpecs: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome,
  onOpenFaucet,
  onOpenSpecs,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: AppPageTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "vault", label: "Savings Vault", icon: <Shield className="w-4 h-4" />, badge: "Zero Loss" },
    { id: "draws", label: "Prize Draws", icon: <Dices className="w-4 h-4" />, badge: "FHE RNG" },
    { id: "rewards", label: "My Rewards", icon: <Trophy className="w-4 h-4" /> },
    { id: "yield", label: "Yield Engine", icon: <Sprout className="w-4 h-4" />, badge: "8.5%" },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-zama-dark border-r border-zama-border flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out
        ${isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Top Logo & Close for Mobile */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <div onClick={onNavigateHome} className="cursor-pointer">
              <ZamaLogo size="md" />
            </div>
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation Links */}
          <nav className="mt-6 space-y-1.5 font-mono text-xs">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium
                    ${isActive 
                      ? "bg-zama-yellow text-black font-bold shadow-zama-glow-sm" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-black/20 text-black" : "bg-zinc-800 text-zama-yellow"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-white/5 font-mono text-xs">
          {/* Faucet Trigger */}
          <button
            onClick={() => {
              onOpenFaucet();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-zama-yellow/10 hover:bg-zama-yellow/20 border border-zama-yellow/30 text-zama-yellow font-bold transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4" />
              <span>Get Testnet cUSDT</span>
            </div>
            <span className="text-[10px] bg-zama-yellow text-black px-1.5 py-0.5 rounded font-bold">+1000</span>
          </button>

          {/* Technical Specs Modal */}
          <button
            onClick={() => {
              onOpenSpecs();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-all border border-white/5"
          >
            <Cpu className="w-4 h-4 text-zama-yellow" />
            <span>Privacy & FHE Specs</span>
          </button>

          {/* Back to Landing / Vision */}
          <button
            onClick={() => {
              onNavigateHome();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-300 transition-all text-[11px]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Vision Page</span>
          </button>
        </div>
      </aside>
    </>
  );
};
