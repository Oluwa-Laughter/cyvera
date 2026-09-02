import { ethers } from "ethers";

export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_HEX_CHAIN_ID = "0xaa36a7";
export const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  };
  provider: any;
}

// Find any available Ethereum provider (EIP-6963 or window.ethereum)
export const getInjectedProvider = (): any => {
  if (typeof window === "undefined") return null;

  const anyWindow = window as any;

  // Check if multiple providers exist (e.g. MetaMask + Coinbase + Rabby)
  if (anyWindow.ethereum?.providers?.length) {
    const metamask = anyWindow.ethereum.providers.find((p: any) => p.isMetaMask);
    return metamask || anyWindow.ethereum.providers[0];
  }

  if (anyWindow.ethereum) {
    return anyWindow.ethereum;
  }

  return null;
};

// Check if mobile device
export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Request wallet connection and switch to Sepolia
export const connectInjectedWallet = async (forcePrompt: boolean = true): Promise<{
  account: string;
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
}> => {
  const ethereum = getInjectedProvider();

  if (!ethereum) {
    if (isMobile()) {
      const cleanUrl = window.location.href.replace(/^https?:\/\//, "");
      window.location.href = `https://metamask.app.link/dapp/${cleanUrl}`;
      throw new Error("Redirecting to MetaMask mobile app...");
    }
    throw new Error("No Web3 wallet extension found. Please install MetaMask, Rabby, or Coinbase Wallet.");
  }

  // If forcePrompt is true, request permissions so MetaMask explicitly pops up the account selection window
  let accounts: string[] = [];
  if (forcePrompt) {
    try {
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
    } catch (permErr: any) {
      if (permErr.code === 4001) {
        throw new Error("Connection rejected by user in wallet.");
      }
      // If wallet_requestPermissions is not supported by the wallet, continue to eth_requestAccounts
    }
  }

  // Request accounts
  try {
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
  } catch (err: any) {
    if (err.code === 4001) {
      throw new Error("Connection rejected by user.");
    }
    throw err;
  }

  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found in wallet.");
  }

  const browserProvider = new ethers.BrowserProvider(ethereum);

  // Switch or Add Sepolia
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_HEX_CHAIN_ID }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902 || switchError.code === -32603) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_HEX_CHAIN_ID,
              chainName: "Ethereum Sepolia",
              nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: [SEPOLIA_RPC, "https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } catch (addErr) {
        console.warn("Could not auto-add Sepolia network:", addErr);
      }
    }
  }

  const signer = await browserProvider.getSigner();
  return {
    account: accounts[0],
    provider: browserProvider,
    signer,
  };
};

/**
 * Explicitly disconnect wallet and clear permissions where supported
 */
export const disconnectInjectedWallet = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cyvera_disconnected", "true");
  }
  const ethereum = getInjectedProvider();
  if (ethereum) {
    try {
      await ethereum.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    } catch {
      // Ignore if revokePermissions is not supported
    }
  }
};

/**
 * Adds token to MetaMask / Rabby / Web3 wallet via EIP-747 wallet_watchAsset
 */
export const addTokenToWallet = async (
  tokenAddress: string,
  symbol: string = "cUSDT",
  decimals: number = 6
): Promise<boolean> => {
  const ethereum = getInjectedProvider();
  if (!ethereum) return false;

  try {
    const formattedAddress = ethers.getAddress(tokenAddress.toLowerCase().trim());
    const wasAdded = await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: formattedAddress,
          symbol: symbol,
          decimals: decimals,
        },
      },
    });
    return !!wasAdded;
  } catch (error) {
    console.error("Error adding token to wallet via wallet_watchAsset:", error);
    return false;
  }
};
