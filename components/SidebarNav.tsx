"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuraLogo } from "@/components/AuraLogo";
import { 
  LayoutDashboard, 
  PiggyBank, 
  Dices, 
  Trophy, 
  Droplets, 
  BookOpen, 
  X, 
  Home,
  ShieldCheck,
  History
} from "lucide-react";

export type AppPageTab = "dashboard" | "vault" | "draws" | "rewards" | "activity" | "how-it-works";

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
    { id: "vault", label: "Savings Vault", icon: <PiggyBank className="w-4 h-4" />, badge: "8.5%" },
    { id: "draws", label: "Prize Draws", icon: <Dices className="w-4 h-4" />, badge: "1-Min" },
    { id: "rewards", label: "My Winnings", icon: <Trophy className="w-4 h-4" /> },
    { id: "activity", label: "Activity Feed", icon: <History className="w-4 h-4" /> },
    { id: "how-it-works", label: "How It Works", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out shadow-sm
        ${isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div onClick={onNavigateHome} className="cursor-pointer">
              <AuraLogo size="md" />
            </div>
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5 font-medium text-xs">
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
                      ? "bg-aura-yellow text-black font-extrabold shadow-aura-yellow" 
                      : "text-slate-600 hover:text-black hover:bg-slate-100"}
                  `}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold relative z-10 ${
                      isActive ? "bg-black text-white" : "bg-amber-100 text-amber-900"
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
        <div className="space-y-2.5 pt-6 border-t border-slate-100 text-xs">
          {/* Free Test Tokens */}
          <button
            onClick={() => {
              onOpenFaucet();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-all active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-amber-600" />
              <span>Get Free cUSDT</span>
            </div>
            <span className="text-[10px] bg-aura-yellow text-black px-1.5 py-0.5 rounded-full font-extrabold">+1000</span>
          </button>

          {/* Back to Landing */}
          <button
            onClick={() => {
              onNavigateHome();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-2xl text-slate-400 hover:text-slate-700 transition-all text-[11px]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>
        </div>
      </aside>
    </>
  );
};
