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
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--muted)] hover:text-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyvera-gold text-black shadow-cyvera-glow">
            <Droplets className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight">Test Token Faucet</h3>
            <p className="text-xs text-[var(--muted)] font-medium">Mint testnet tokens directly on Ethereum Sepolia</p>
          </div>
        </div>

        {/* Token Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-[var(--card-border)] text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedToken("cUSDT")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              selectedToken === "cUSDT"
                ? "bg-white dark:bg-slate-900 text-foreground font-black shadow-sm"
                : "text-[var(--muted)] hover:text-foreground"
            }`}
          >
            <span>cUSDT (Stablecoin)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedToken("cUSDC")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              selectedToken === "cUSDC"
                ? "bg-white dark:bg-slate-900 text-foreground font-black shadow-sm"
                : "text-[var(--muted)] hover:text-foreground"
            }`}
          >
            <span>cUSDC (Treasury)</span>
          </button>
        </div>

        {/* Current Balance & Add to MetaMask */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] flex items-center justify-between text-xs font-medium">
          <div>
            <span className="text-[var(--muted)] block text-[11px]">Wallet Token Balance:</span>
            <span className="font-mono font-black text-foreground text-sm">
              {account ? `${currentTokenBalance || "0.00"} ${currentCfg.symbol}` : "Not Connected"}
            </span>
          </div>

          {account && (
            <button
              onClick={handleAddToken}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground text-[11px] font-bold transition-all shadow-sm active:scale-95"
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Added to Wallet</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>+Add to MetaMask</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Contract Address & 1-Click Copy Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)] text-[11px] font-bold uppercase tracking-wider">
              {currentCfg.symbol} Contract Address (Sepolia):
            </span>
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
              className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs shadow-cyvera-glow active:scale-95 transition-all"
            >
              Connect Wallet to Mint
            </button>
          ) : (
            <button
              onClick={() => onClaimFaucet(selectedToken)}
              disabled={isClaiming}
              className="w-full py-3 rounded-xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-bold text-xs transition-all shadow-cyvera-glow flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isClaiming ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Minting 1,000 {currentCfg.symbol} on Sepolia...</span>
                </>
              ) : (
                <>
                  <Droplets className="w-3.5 h-3.5 text-black" />
                  <span>Mint 1,000 {currentCfg.symbol} Now</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground font-semibold text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
