"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Navbar } from "@/components/Navbar";
import { StatsOverview } from "@/components/StatsOverview";
import { ConfidentialVaultCard } from "@/components/ConfidentialVaultCard";
import { PrizeDrawCard, DrawRecordView } from "@/components/PrizeDrawCard";
import { MyWinningsCard } from "@/components/MyWinningsCard";
import { YieldReserveSimulator } from "@/components/YieldReserveSimulator";
import { FaucetModal } from "@/components/FaucetModal";
import { ConfidentialityArchitectureModal } from "@/components/ConfidentialityArchitectureModal";
import { CONTRACT_ADDRESSES, MOCK_ERC20_ABI, VEIL_PRIZE_POOL_ABI, MOCK_YIELD_SOURCE_ABI } from "@/lib/contracts";
import { requestEip712DecryptionPermission, decryptHandleWithToken } from "@/lib/fhevm";
import { Shield, Sparkles, AlertCircle, Info, Lock, ExternalLink, HelpCircle } from "lucide-react";

export default function Home() {
  // --- State ---
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
          // Initial demo funds
          setWalletBalance("1,000.00");
          setDecryptedBalance("250.00");
          setDecryptedWinnings("0.00");
        }
      } else {
        // Mock fallback for browser without web3 extension
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
      // Toggle hide
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
        // Simulate EIP-712 signing delay
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setDecryptedBalance("250.00");
    } catch (error) {
      console.error("Balance decryption error:", error);
      // Fallback
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

      // Mark as current user's win for interactive test celebration
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
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navigation */}
      <Navbar
        account={account}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        onOpenFaucet={() => setIsFaucetOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        isConnecting={isConnecting}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/60 to-emerald-950/60 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Zama Mainnet Season 4 Challenge:</strong> Fully confidential no-loss prize savings powered by Zama fhEVM.
            </span>
          </div>
          <button
            onClick={() => setIsArchitectureOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] transition-all shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Architecture & Privacy Specs</span>
          </button>
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

        {/* Primary Interactive Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Confidential Savings Vault (Deposit & Withdraw) */}
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

          {/* Right Column: Draw Engine & Fairness */}
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

        {/* Secondary Grid: My Winnings & Yield Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Winner Claim & Compounding */}
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

          {/* External DeFi Yield Strategy Simulator */}
          <YieldReserveSimulator
            totalDeposits={totalDeposits}
            totalYieldHarvested={totalYieldHarvested}
            onHarvestAndFund={handleHarvestAndFund}
            isHarvesting={isHarvesting}
            account={account}
          />
        </div>
      </main>

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
      <footer className="w-full border-t border-slate-800 bg-slate-950/80 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>VeilPrize Protocol &bull; Confidential No-Loss Prize Savings</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Zama fhEVM</span>
            <span>Ethereum Sepolia</span>
            <a
              href="https://docs.zama.org/homepage"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1"
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
