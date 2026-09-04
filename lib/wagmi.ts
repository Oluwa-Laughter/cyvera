import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  rabbyWallet,
  phantomWallet,
  trustWallet,
  okxWallet,
  braveWallet,
  zerionWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http, fallback } from "wagmi";
import { sepolia } from "wagmi/chains";

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "21fef48091f12692cad574a6f7753643";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        injectedWallet,
        metaMaskWallet,
        rainbowWallet,
        coinbaseWallet,
        walletConnectWallet,
        rabbyWallet,
      ],
    },
    {
      groupName: "More Wallets",
      wallets: [
        phantomWallet,
        trustWallet,
        okxWallet,
        braveWallet,
        zerionWallet,
        ledgerWallet,
      ],
    },
  ],
  {
    appName: "Cyvera Protocol",
    projectId: WALLETCONNECT_PROJECT_ID,
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
    [sepolia.id]: fallback([
      http(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
          "https://ethereum-sepolia-rpc.publicnode.com"
      ),
      http("https://gateway.tenderly.co/public/sepolia"),
      http("https://sepolia.gateway.tenderly.co"),
    ]),
  },
  ssr: true,
});
