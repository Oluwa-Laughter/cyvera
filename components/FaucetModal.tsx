"use client";

import React, { useState } from "react";
import { 
  X, 
  Droplets, 
  Sparkles, 
  RefreshCw, 
  PlusCircle, 
  Check, 
  Copy, 
  ExternalLink, 
  HelpCircle,
  Shield,
  Layers,
  ChevronDown
} from "lucide-react";
import { addTokenToWallet } from "@/lib/wallet";
import { ActiveMarketId, CONTRACT_ADDRESSES, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimFaucet: (market: ActiveMarketId) => Promise<void>;
  isClaiming: boolean;
  walletBalance?: string;
  usdtBalance?: string;
  usdcBalance?: string;
  account: string | null;
  onConnect?: () => void;
  activeMarket?: ActiveMarketId;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  onClaimFaucet,
  isClaiming,
  walletBalance = "0.00",
  usdtBalance,
  usdcBalance,
  account,
  onConnect,
  activeMarket = "cUSDT",
}) => {
  const [selectedToken, setSelectedToken] = useState<ActiveMarketId>(activeMarket);
  const [isAdded, setIsAdded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  // Sync selected token when activeMarket changes
  React.useEffect(() => {
    setSelectedToken(activeMarket);
  }, [activeMarket]);

  if (!isOpen) return null;

  const currentCfg = ZAMA_SEPOLIA_CONFIG.markets[selectedToken];
  const currentTokenBalance = selectedToken === "cUSDT"
    ? (usdtBalance ?? walletBalance ?? "0.00")
    : (usdcBalance ?? (activeMarket === "cUSDC" ? walletBalance : "0.00"));

  const handleAddToken = async () => {
    const success = await addTokenToWallet(currentCfg.underlying, currentCfg.symbol, currentCfg.decimals);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentCfg.underlying);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyvera-card bg-[var(--card-bg)] rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-cyvera-lg border border-[var(--card-border)] text-foreground space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Droplets className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Test Token Faucet</h3>
            <p className="text-xs text-slate-400 font-medium">Mint testnet tokens directly on Ethereum Sepolia</p>
          </div>
        </div>

        {/* Token Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#0E1322] border border-white/[0.06] text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedToken("cUSDT")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              selectedToken === "cUSDT"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>cUSDT (Stablecoin)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedToken("cUSDC")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              selectedToken === "cUSDC"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>cUSDC (Treasury)</span>
          </button>
        </div>

        {/* Current Balance & Add to MetaMask */}
        <div className="p-4 rounded-2xl bg-[#101524] border border-white/[0.06] flex items-center justify-between text-xs font-medium shadow-inner">
          <div>
            <span className="text-slate-400 block text-[11px]">Wallet Token Balance:</span>
            <span className="font-mono font-black text-white text-sm">
              {account ? `${currentTokenBalance || "0.00"} ${currentCfg.symbol}` : "Not Connected"}
            </span>
          </div>

          {account && (
            <button
              onClick={handleAddToken}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#131929] hover:bg-[#1A2238] border border-cyan-500/30 text-cyan-300 hover:text-white text-[11px] font-bold transition-all shadow-sm active:scale-95"
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Added to Wallet</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add to MetaMask</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Faucet Info */}
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-white">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant +1,000 {currentCfg.symbol} per mint</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Mints testnet {currentCfg.symbol} tokens directly to your wallet for testing deposits, daily prize draws, and instant zero-loss withdrawals.
          </p>
        </div>

        {/* Contract Address & Manual Import Guide */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Underlying Token Contract:</span>
            <button
              onClick={handleCopyAddress}
              className="flex items-center gap-1 text-amber-500 hover:underline font-bold text-[11px]"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? "Copied!" : "Copy Address"}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[var(--card-border)] font-mono text-[11px] text-foreground break-all select-all flex items-center justify-between">
            <span>{currentCfg.underlying}</span>
            <a
              href={`https://sepolia.etherscan.io/token/${currentCfg.underlying}`}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--muted)] hover:text-foreground ml-2 shrink-0"
              title="View on Etherscan"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Collapsible Manual Import Guide */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setShowManualGuide(!showManualGuide)}
            className="w-full p-3.5 flex items-center justify-between text-amber-500 dark:text-amber-400 font-bold"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>How to manually add {currentCfg.symbol} to MetaMask</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showManualGuide ? "rotate-180" : ""}`} />
          </button>

          {showManualGuide && (
            <div className="p-4 pt-1 border-t border-amber-500/20 text-foreground space-y-2 text-[11px] font-medium leading-relaxed">
              <p className="text-[var(--muted)]">If MetaMask did not pop up automatically, follow these 3 quick steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-foreground">
                <li>Open your <strong>MetaMask</strong> extension and ensure you are on the <strong>Sepolia</strong> network.</li>
                <li>Scroll down in your Assets tab and click <strong>"Import Tokens"</strong> → <strong>"Custom Token"</strong>.</li>
                <li>Paste the Contract Address: <strong className="font-mono text-amber-500 break-all">{currentCfg.underlying}</strong></li>
                <li>Token Symbol will auto-fill as <strong>{currentCfg.symbol}</strong>, Decimals: <strong>6</strong>. Click <strong>"Next"</strong> → <strong>"Import"</strong>!</li>
              </ol>
            </div>
          )}
        </div>

        {/* Mint Button */}
        <div className="space-y-2.5 text-xs">
          {!account ? (
            <button
              onClick={() => {
                onClose();
                if (onConnect) onConnect();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all"
            >
              Connect Wallet to Mint
            </button>
          ) : (
            <button
              onClick={() => onClaimFaucet(selectedToken)}
              disabled={isClaiming}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isClaiming ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Minting 1,000 {currentCfg.symbol} on Sepolia...</span>
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4 text-slate-950" />
                  <span>Mint 1,000 {currentCfg.symbol} Now</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#111624] hover:bg-[#182032] text-slate-300 hover:text-white font-semibold text-xs transition-all border border-white/[0.06]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
