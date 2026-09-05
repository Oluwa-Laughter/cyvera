"use client";

import React from "react";
import { AuraLogo } from "@/components/AuraLogo";
import { HiXMark } from "react-icons/hi2";
import { 
  LayoutDashboard, 
  PiggyBank, 
  Dices, 
  Trophy, 
  Droplets, 
  BookOpen, 
  Home,
  ShieldCheck,
  History,
  Lock,
  Flame
} from "lucide-react";
import { motion } from "framer-motion";

export type AppPageTab = "dashboard" | "vault" | "draws" | "earn" | "rewards" | "activity" | "how-it-works";

interface SidebarNavProps {
  currentTab: AppPageTab;
  onSelectTab: (tab: AppPageTab) => void;
  onNavigateHome: () => void;
  onOpenFaucet: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome,
  onOpenFaucet,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: AppPageTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "vault", label: "Shield & Save", icon: <PiggyBank className="w-4 h-4" />, badge: "Vault" },
    { id: "draws", label: "4-Phase Draws", icon: <Dices className="w-4 h-4" />, badge: "1-Min" },
    { id: "earn", label: "Liquidity Hunt", icon: <Flame className="w-4 h-4" />, badge: "Earn" },
    { id: "rewards", label: "Private Reveal", icon: <Trophy className="w-4 h-4" /> },
    { id: "activity", label: "Activity Feed", icon: <History className="w-4 h-4" /> },
    { id: "how-it-works", label: "How It Works", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[var(--card-bg)] border-r border-[var(--card-border)] flex flex-col justify-between p-6 transition-all duration-300 ease-in-out shadow-sm
        ${isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--card-border)]">
            <div onClick={onNavigateHome} className="cursor-pointer">
              <AuraLogo size="md" />
            </div>
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <HiXMark className="w-5 h-5 text-amber-500" />
            </button>
          </div>

          {/* Slogan */}
          <div className="mt-4 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-[var(--card-border)] text-[11px] text-[var(--muted)] flex items-center gap-2 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Confidential No-Loss Prize Savings</span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1.5 font-medium text-xs">
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
                    w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 relative
                    ${isActive 
                      ? "bg-cyvera-gold text-black font-black shadow-cyvera-glow" 
                      : "text-[var(--muted)] hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60"}
                  `}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold relative z-10 ${
                      isActive ? "bg-black text-white" : "bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20"
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
        <div className="space-y-2.5 pt-6 border-t border-[var(--card-border)] text-xs">
          {/* Free Test Tokens */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onOpenFaucet();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-bold transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-amber-500" />
              <span>Get Free cUSDT / cUSDC</span>
            </div>
            <span className="text-[10px] bg-cyvera-gold text-black px-1.5 py-0.5 rounded-full font-extrabold">+1000</span>
          </motion.button>

          {/* Back to Home */}
          <button
            onClick={() => {
              onNavigateHome();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-2xl text-[var(--muted)] hover:text-foreground transition-all text-[11px]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Page</span>
          </button>
        </div>
      </aside>
    </>
  );
};
