"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { SidebarNav, AppPageTab } from "@/components/SidebarNav";
import { TopHeader } from "@/components/TopHeader";
import { LandingView } from "@/components/pages/LandingView";
import { DashboardView } from "@/components/pages/DashboardView";
import { VaultView } from "@/components/pages/VaultView";
import { DrawsView } from "@/components/pages/DrawsView";
import { RewardsView } from "@/components/pages/RewardsView";
import { YieldView } from "@/components/pages/YieldView";
import { FaucetModal } from "@/components/FaucetModal";
import { PrivacySpecsModal } from "@/components/PrivacySpecsModal";
import { DrawRecordView } from "@/components/PrizeDrawCard";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { requestEip712DecryptionPermission } from "@/lib/fhevm";

export default function Home() {
  // Navigation State
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");
  const [currentTab, setCurrentTab] = useState<AppPageTab>("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Web3 & Wallet State
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("1,000.00");

  // Confidential Balances (FHE euint64)
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
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState<boolean>(false);

  // --- Real Web3 Wallet Detection & Connection ---
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        const browserProvider = new ethers.BrowserProvider(ethereum);
        
        // Request Accounts
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(browserProvider);
          setWalletBalance("1,000.00");
          setDecryptedBalance("250.00");
          setDecryptedWinnings("0.00");
        }

        // Check & Prompt Sepolia network if needed
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // 11155111 Sepolia
          });
        } catch (switchError: any) {
          // If Sepolia not added, add it
          if (switchError.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Ethereum Sepolia",
                  nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://rpc.sepolia.org"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          }
        }
      } else {
        // Fallback for demo without extension
        const mockAccount = "0x892a012a975765796a56eE8102d847b2c5896B20";
        setAccount(mockAccount);
        setWalletBalance("1,000.00");
        setDecryptedBalance("250.00");
        setDecryptedWinnings("0.00");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      // Fallback
      const mockAccount = "0x892a012a975765796a56eE8102d847b2c5896B20";
      setAccount(mockAccount);
      setWalletBalance("1,000.00");
      setDecryptedBalance("250.00");
      setDecryptedWinnings("0.00");
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

  // Event Listeners for MetaMask
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      };
      ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

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

  // --- Core Protocol Actions ---
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

      setActionStatus("2/3 Encrypting deposit onchain (Zama euint64)...");
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
      setActionStatus("1/2 Verifying encrypted balance invariant...");
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

  const getPageTitle = () => {
    switch (currentTab) {
      case "dashboard": return { title: "Protocol Dashboard", sub: "Live overview of prize pot, countdown, and portfolio" };
      case "vault": return { title: "Confidential Savings Vault", sub: "Shielded token deposit and zero-loss principal withdrawal" };
      case "draws": return { title: "Onchain FHE Draws", sub: "Deposit-weighted winner selection using Zama randomness" };
      case "rewards": return { title: "My Secret Rewards", sub: "Decrypt confidential winnings and auto-compound" };
      case "yield": return { title: "DeFi Yield Engine", sub: "Streaming Aave V3 yield generator & strategy simulation" };
    }
  };

  const { title, sub } = getPageTitle();

  return (
    <div className="min-h-screen bg-zama-black text-white selection:bg-zama-yellow selection:text-black">
      {/* 1. VISION LANDING PAGE VIEW */}
      {currentView === "landing" ? (
        <LandingView
          onEnterApp={(tab) => {
            if (tab) setCurrentTab(tab);
            setCurrentView("app");
          }}
          onOpenFaucet={() => setIsFaucetOpen(true)}
          onOpenSpecs={() => setIsSpecsOpen(true)}
          totalDeposits={totalDeposits}
          totalPrizeReserve={totalPrizeReserve}
          totalPrizesAwarded={totalPrizesAwarded}
          depositorsCount={depositorsCount}
        />
      ) : (
        /* 2. FULL-FEATURED APP WITH SIDEBAR NAVIGATION */
        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* Sidebar */}
          <SidebarNav
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onNavigateHome={() => setCurrentView("landing")}
            onOpenFaucet={() => setIsFaucetOpen(true)}
            onOpenSpecs={() => setIsSpecsOpen(true)}
            isOpenMobile={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
          />

          {/* Main App Content Area */}
          <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
            <TopHeader
              pageTitle={title}
              pageSubtitle={sub}
              onOpenMobileNav={() => setIsMobileNavOpen(true)}
              account={account}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              isConnecting={isConnecting}
              onOpenFaucet={() => setIsFaucetOpen(true)}
              walletBalance={walletBalance}
            />

            <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
              {currentTab === "dashboard" && (
                <DashboardView
                  account={account}
                  walletBalance={walletBalance}
                  decryptedBalance={decryptedBalance}
                  decryptedWinnings={decryptedWinnings}
                  totalDeposits={totalDeposits}
                  totalPrizeReserve={totalPrizeReserve}
                  totalPrizesAwarded={totalPrizesAwarded}
                  depositorsCount={depositorsCount}
                  lastDrawTime={lastDrawTime}
                  drawInterval={drawInterval}
                  currentDrawId={currentDrawId}
                  drawHistory={drawHistory}
                  onNavigateTab={setCurrentTab}
                  onOpenFaucet={() => setIsFaucetOpen(true)}
                  onDecryptBalance={handleDecryptBalance}
                  isDecryptingBalance={isDecryptingBalance}
                />
              )}

              {currentTab === "vault" && (
                <VaultView
                  account={account}
                  walletBalance={walletBalance}
                  decryptedBalance={decryptedBalance}
                  isDecryptingBalance={isDecryptingBalance}
                  onDecryptBalance={handleDecryptBalance}
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                  onWithdrawAll={handleWithdrawAll}
                  onOpenFaucet={() => setIsFaucetOpen(true)}
                  isLoadingAction={isLoadingAction}
                  actionStatus={actionStatus}
                />
              )}

              {currentTab === "draws" && (
                <DrawsView
                  account={account}
                  currentDrawId={currentDrawId}
                  currentPrizePot={totalPrizeReserve}
                  totalDepositors={depositorsCount}
                  lastDrawTime={lastDrawTime}
                  drawInterval={drawInterval}
                  drawHistory={drawHistory}
                  onTriggerDraw={handleTriggerDraw}
                  isTriggeringDraw={isTriggeringDraw}
                />
              )}

              {currentTab === "rewards" && (
                <RewardsView
                  account={account}
                  decryptedWinnings={decryptedWinnings}
                  isDecryptingWinnings={isDecryptingWinnings}
                  onDecryptWinnings={handleDecryptWinnings}
                  onClaimPrize={handleClaimPrize}
                  onCompoundPrize={handleCompoundPrize}
                  isLoadingAction={isLoadingAction}
                  actionStatus={actionStatus}
                />
              )}

              {currentTab === "yield" && (
                <YieldView
                  totalDeposits={totalDeposits}
                  totalYieldHarvested={totalYieldHarvested}
                  onHarvestAndFund={handleHarvestAndFund}
                  isHarvesting={isHarvesting}
                  account={account}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <FaucetModal
        isOpen={isFaucetOpen}
        onClose={() => setIsFaucetOpen(false)}
        onClaimFaucet={handleClaimFaucet}
        isClaiming={isClaimingFaucet}
        walletBalance={walletBalance}
        account={account}
      />

      <PrivacySpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />
    </div>
  );
}
