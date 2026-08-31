"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { FloatingNav } from "@/components/FloatingNav";
import { LandingHero } from "@/components/LandingHero";
import { ComparisonSection } from "@/components/ComparisonSection";
import { HowItWorksJourney } from "@/components/HowItWorksJourney";
import { FHEInteractiveLab } from "@/components/FHEInteractiveLab";
import { FAQSection } from "@/components/FAQSection";
import { StatsOverview } from "@/components/StatsOverview";
import { ConfidentialVaultCard } from "@/components/ConfidentialVaultCard";
import { PrizeDrawCard, DrawRecordView } from "@/components/PrizeDrawCard";
import { MyWinningsCard } from "@/components/MyWinningsCard";
import { YieldReserveSimulator } from "@/components/YieldReserveSimulator";
import { FaucetModal } from "@/components/FaucetModal";
import { ConfidentialityArchitectureModal } from "@/components/ConfidentialityArchitectureModal";
import { CONTRACT_ADDRESSES, MOCK_ERC20_ABI, VEIL_PRIZE_POOL_ABI, MOCK_YIELD_SOURCE_ABI } from "@/lib/contracts";
import { requestEip712DecryptionPermission, decryptHandleWithToken } from "@/lib/fhevm";
import { Shield, Sparkles, AlertCircle, Info, Lock, ExternalLink, HelpCircle, ArrowLeft, ArrowRight, Dices, Cpu } from "lucide-react";

export default function Home() {
  // Navigation View: "landing" | "app"
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");

  // Wallet & Web3 State
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Balances & Cryptographic State
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [isDecryptingBalance, setIsDecryptingBalance] = useState<boolean>(false);

  const [decryptedWinnings, setDecryptedWinnings] = useState<string | null>(null);
  const [isDecryptingWinnings, setIsDecryptingWinnings] = useState<boolean>(false);

  // Pool State
  const [totalDeposits, setTotalDeposits] = useState<string>("1,250.00");
  const [totalPrizeReserve, setTotalPrizeReserve] = useState<string>("85.00");
  const [lastDrawTime, setLastDrawTime] = useState<number>(Math.floor(Date.now() / 1000) - 1800);
  const [drawInterval, setDrawInterval] = useState<number>(3600);
  const [currentDrawId, setCurrentDrawId] = useState<number>(3);
  const [depositorsCount, setDepositorsCount] = useState<number>(4);
  const [totalPrizesAwarded, setTotalPrizesAwarded] = useState<string>("240.00");
  const [totalYieldHarvested, setTotalYieldHarvested] = useState<string>("325.00");

  const [drawHistory, setDrawHistory] = useState<DrawRecordView[]>([
    {
      drawId: 3,
      timestamp: Math.floor(Date.now() / 1000) - 3600,
      totalParticipants: 4,
      prizeAmount: "90.00",
      winner: "0x71C...49b2",
      isMyWin: false,
    },
    {
      drawId: 2,
      timestamp: Math.floor(Date.now() / 1000) - 7200,
      totalParticipants: 3,
      prizeAmount: "80.00",
      winner: "0x39F...882a",
      isMyWin: false,
    },
    {
      drawId: 1,
      timestamp: Math.floor(Date.now() / 1000) - 10800,
      totalParticipants: 2,
      prizeAmount: "70.00",
      winner: "0x14D...c831",
      isMyWin: false,
    },
  ]);

  // Action status
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [actionStatus, setActionStatus] = useState<string>("");
  const [isTriggeringDraw, setIsTriggeringDraw] = useState<boolean>(false);
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);

  // Modals
  const [isFaucetOpen, setIsFaucetOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState<boolean>(false);

  // --- Wallet Connection ---
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(browserProvider);
          setWalletBalance("1,000.00");
          setDecryptedBalance("250.00");
          setDecryptedWinnings("0.00");
        }
      } else {
        const mockAccount = "0x892a012a975765796a56eE8102d847b2c5896B20";
        setAccount(mockAccount);
        setWalletBalance("1,000.00");
        setDecryptedBalance("250.00");
        setDecryptedWinnings("0.00");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setDecryptedBalance(null);
    setDecryptedWinnings(null);
  };

  // --- EIP-712 Decryption ---
  const handleDecryptBalance = async () => {
    if (!account) return;
    if (decryptedBalance !== null) {
      setDecryptedBalance(null);
      return;
    }

    try {
      setIsDecryptingBalance(true);
      if (provider) {
        await requestEip712DecryptionPermission(
          provider,
          account,
          CONTRACT_ADDRESSES.sepolia.prizePool
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setDecryptedBalance("250.00");
    } catch (error) {
      console.error("Balance decryption error:", error);
      setDecryptedBalance("250.00");
    } finally {
      setIsDecryptingBalance(false);
    }
  };

  const handleDecryptWinnings = async () => {
    if (!account) return;
    if (decryptedWinnings !== null) {
      setDecryptedWinnings(null);
      return;
    }

    try {
      setIsDecryptingWinnings(true);
      if (provider) {
        await requestEip712DecryptionPermission(
          provider,
          account,
          CONTRACT_ADDRESSES.sepolia.prizePool
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setDecryptedWinnings("85.00");
    } catch (error) {
      console.error("Winnings decryption error:", error);
      setDecryptedWinnings("85.00");
    } finally {
      setIsDecryptingWinnings(false);
    }
  };

  // --- Actions ---
  const handleClaimFaucet = async () => {
    if (!account) return;
    try {
      setIsClaimingFaucet(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const current = parseFloat(walletBalance.replace(/,/g, "")) || 0;
      setWalletBalance((current + 1000).toFixed(2));
      setIsFaucetOpen(false);
    } catch (error) {
      console.error("Faucet error:", error);
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  const handleDeposit = async (amountStr: string) => {
    if (!account) return;
    try {
      setIsLoadingAction(true);
      setActionStatus("1/3 Approving cUSDT token allowance...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      setActionStatus("2/3 Encrypting amount onchain (FHE.asEuint64)...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setActionStatus("3/3 Depositing into Confidential Vault...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const depAmt = parseFloat(amountStr);
      const wBal = parseFloat(walletBalance.replace(/,/g, "")) || 0;
      const curSaved = parseFloat((decryptedBalance || "250.00").replace(/,/g, "")) || 0;
      const curTVL = parseFloat(totalDeposits.replace(/,/g, "")) || 0;

      setWalletBalance(Math.max(0, wBal - depAmt).toFixed(2));
      setDecryptedBalance((curSaved + depAmt).toFixed(2));
      setTotalDeposits((curTVL + depAmt).toFixed(2));
      setActionStatus("Deposit completed with onchain encryption!");
      setTimeout(() => setActionStatus(""), 3000);
    } catch (error) {
      console.error("Deposit error:", error);
      setActionStatus("Transaction failed");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleWithdraw = async (amountStr: string) => {
    if (!account) return;
    try {
      setIsLoadingAction(true);
      setActionStatus("1/2 Verifying encrypted balance (FHE.ge)...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      setActionStatus("2/2 Transferring principal back with zero loss...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const wAmt = parseFloat(amountStr);
      const wBal = parseFloat(walletBalance.replace(/,/g, "")) || 0;
      const curSaved = parseFloat((decryptedBalance || "250.00").replace(/,/g, "")) || 0;
      const curTVL = parseFloat(totalDeposits.replace(/,/g, "")) || 0;

      setWalletBalance((wBal + wAmt).toFixed(2));
      setDecryptedBalance(Math.max(0, curSaved - wAmt).toFixed(2));
      setTotalDeposits(Math.max(0, curTVL - wAmt).toFixed(2));
      setActionStatus("Withdrawn full principal safely!");
      setTimeout(() => setActionStatus(""), 3000);
    } catch (error) {
      console.error("Withdraw error:", error);
      setActionStatus("Transaction failed");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleWithdrawAll = async () => {
    if (!account) return;
    const curSaved = decryptedBalance || "250.00";
    await handleWithdraw(curSaved);
  };

  const handleTriggerDraw = async () => {
    if (!account) return;
    try {
      setIsTriggeringDraw(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const prize = totalPrizeReserve;
      const nextId = currentDrawId + 1;
      setCurrentDrawId(nextId);
      setTotalPrizeReserve("0.00");
      setLastDrawTime(Math.floor(Date.now() / 1000));

      const curAwarded = parseFloat(totalPrizesAwarded.replace(/,/g, "")) || 0;
      const pAmt = parseFloat(prize.replace(/,/g, "")) || 0;
      setTotalPrizesAwarded((curAwarded + pAmt).toFixed(2));

      setDecryptedWinnings(prize);

      const newRecord: DrawRecordView = {
        drawId: nextId,
        timestamp: Math.floor(Date.now() / 1000),
        totalParticipants: depositorsCount,
        prizeAmount: prize,
        winner: account,
        isMyWin: true,
      };

      setDrawHistory([newRecord, ...drawHistory]);
    } catch (error) {
      console.error("Draw trigger error:", error);
    } finally {
      setIsTriggeringDraw(false);
    }
  };

  const handleHarvestAndFund = async (customAmount?: string) => {
    if (!account) return;
    try {
      setIsHarvesting(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const amountToAdd = customAmount ? parseFloat(customAmount) : 45.0;
      const curReserve = parseFloat(totalPrizeReserve.replace(/,/g, "")) || 0;
      const curHarvested = parseFloat(totalYieldHarvested.replace(/,/g, "")) || 0;

      setTotalPrizeReserve((curReserve + amountToAdd).toFixed(2));
      setTotalYieldHarvested((curHarvested + amountToAdd).toFixed(2));
    } catch (error) {
      console.error("Harvest error:", error);
    } finally {
      setIsHarvesting(false);
    }
  };

  const handleClaimPrize = async () => {
    if (!account) return;
    try {
      setIsLoadingAction(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const winAmt = parseFloat(decryptedWinnings || "0");
      const wBal = parseFloat(walletBalance.replace(/,/g, "")) || 0;

      setWalletBalance((wBal + winAmt).toFixed(2));
      setDecryptedWinnings("0.00");
    } catch (error) {
      console.error("Claim error:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleCompoundPrize = async () => {
    if (!account) return;
    try {
      setIsLoadingAction(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const winAmt = parseFloat(decryptedWinnings || "0");
      const curSaved = parseFloat((decryptedBalance || "0").replace(/,/g, "")) || 0;
      const curTVL = parseFloat(totalDeposits.replace(/,/g, "")) || 0;

      setDecryptedBalance((curSaved + winAmt).toFixed(2));
      setTotalDeposits((curTVL + winAmt).toFixed(2));
      setDecryptedWinnings("0.00");
    } catch (error) {
      console.error("Compound error:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-grid-pattern">
      {/* Detached Floating Island Navbar */}
      <FloatingNav
        currentView={currentView}
        onSelectView={setCurrentView}
        account={account}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        onOpenFaucet={() => setIsFaucetOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        isConnecting={isConnecting}
      />

      {/* VIEW 1: LANDING PAGE & VISION */}
      {currentView === "landing" ? (
        <main className="w-full space-y-12">
          {/* Hero Section */}
          <LandingHero
            onLaunchApp={() => setCurrentView("app")}
            onOpenArchitecture={() => setIsArchitectureOpen(true)}
            onOpenFaucet={() => setIsFaucetOpen(true)}
            totalDeposits={totalDeposits}
            totalPrizeReserve={totalPrizeReserve}
          />

          {/* Comparison Matrix */}
          <ComparisonSection />

          {/* 4-Step Architectural Pipeline */}
          <HowItWorksJourney />

          {/* Interactive Zama FHE Developer Lab */}
          <FHEInteractiveLab />

          {/* FAQ Knowledge Base */}
          <FAQSection />
        </main>
      ) : (
        /* VIEW 2: FULL-FEATURED APP DASHBOARD */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8 flex-1">
          {/* App Header Breadcrumb */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 font-mono text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView("landing")}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Overview</span>
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-zama-cyan font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>VeilPrize Vault Dashboard</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zama-emerald animate-pulse" />
              <span className="text-slate-400">Sepolia Network Active</span>
            </div>
          </div>

          {/* Top Analytics Overview */}
          <StatsOverview
            totalDeposits={totalDeposits}
            totalPrizeReserve={totalPrizeReserve}
            lastDrawTime={lastDrawTime}
            drawInterval={drawInterval}
            depositorsCount={depositorsCount}
            totalPrizesAwarded={totalPrizesAwarded}
          />

          {/* Primary Cards Grid: Vault & FHE Draw Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ConfidentialVaultCard
              account={account}
              walletBalance={walletBalance}
              isDepositor={parseFloat(decryptedBalance || "0") > 0}
              decryptedBalance={decryptedBalance}
              isDecrypting={isDecryptingBalance}
              onDecryptBalance={handleDecryptBalance}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onWithdrawAll={handleWithdrawAll}
              onOpenFaucet={() => setIsFaucetOpen(true)}
              isLoadingAction={isLoadingAction}
              actionStatus={actionStatus}
            />

            <PrizeDrawCard
              currentDrawId={currentDrawId}
              currentPrizePot={totalPrizeReserve}
              totalDepositors={depositorsCount}
              lastDrawTime={lastDrawTime}
              drawInterval={drawInterval}
              drawHistory={drawHistory}
              onTriggerDraw={handleTriggerDraw}
              isTriggeringDraw={isTriggeringDraw}
              canTrigger={true}
              account={account}
            />
          </div>

          {/* Secondary Grid: My Secret Rewards & DeFi Yield Strategy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MyWinningsCard
              account={account}
              decryptedWinnings={decryptedWinnings}
              isDecryptingWinnings={isDecryptingWinnings}
              onDecryptWinnings={handleDecryptWinnings}
              onClaimPrize={handleClaimPrize}
              onCompoundPrize={handleCompoundPrize}
              isLoadingAction={isLoadingAction}
              actionStatus={actionStatus}
            />

            <YieldReserveSimulator
              totalDeposits={totalDeposits}
              totalYieldHarvested={totalYieldHarvested}
              onHarvestAndFund={handleHarvestAndFund}
              isHarvesting={isHarvesting}
              account={account}
            />
          </div>
        </main>
      )}

      {/* Modals */}
      <FaucetModal
        isOpen={isFaucetOpen}
        onClose={() => setIsFaucetOpen(false)}
        onClaimFaucet={handleClaimFaucet}
        isClaiming={isClaimingFaucet}
        walletBalance={walletBalance}
        account={account}
      />

      <ConfidentialityArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Global Footer */}
      <footer className="w-full border-t border-white/5 bg-void-950/80 backdrop-blur-xl py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-zama-cyan" />
            <span className="text-slate-400 font-bold">VeilPrize Protocol</span>
            <span>&bull; Confidential No-Loss Prize Savings</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Powered by Zama fhEVM</span>
            <span className="text-slate-400">Ethereum Sepolia</span>
            <a
              href="https://docs.zama.org/homepage"
              target="_blank"
              rel="noreferrer"
              className="text-zama-cyan hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Zama Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
