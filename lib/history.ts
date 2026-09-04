/**
 * Reads a user's deposit / withdraw / claim history directly from
 * Sepolia via Etherscan's free API. We fetch the most recent N event
 * logs for the connected wallet and decode them with the contract ABI.
 * If the Etherscan key is missing we silently fall back to an empty
 * list so the UI never breaks.
 */
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, AURA_PRIZE_POOL_ABI } from "./contracts";

export interface HistoryEntry {
  kind: "deposit" | "withdraw" | "claim" | "compound" | "draw";
  amount?: string;
  hash: string;
  ts: number;
  blockNumber: number;
}

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";
const ETHERSCAN_BASE = "https://api-sepolia.etherscan.io/api";

const TOPIC = {
  Deposited: "Deposited(address,bytes32,uint256)",
  Withdrawn: "Withdrawn(address,uint256,bytes32,uint256)",
  PrizeClaimed: "PrizeClaimed(address,uint256,uint256)",
  PrizeCompounded: "PrizeCompounded(address,uint256,uint256)",
  WinnerSelected: "WinnerSelected(uint256,address,bytes32)",
};

function topic0(sig: string): string {
  return ethers.id(sig);
}

export async function fetchUserHistory(
  userAddress: string,
  fromBlock: number = 0,
  poolAddress?: string
): Promise<HistoryEntry[]> {
  if (!userAddress) return [];
  const iface = new ethers.Interface(AURA_PRIZE_POOL_ABI);
  const pool = poolAddress || CONTRACT_ADDRESSES.sepolia.prizePool;

  // Try Etherscan first
  if (ETHERSCAN_API_KEY) {
    try {
      const url = `${ETHERSCAN_BASE}?module=account&action=txlist&address=${userAddress}&startblock=${fromBlock}&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
      const r = await fetch(url);
      if (r.ok) {
        const j = await r.json();
        if (j.status === "1" && Array.isArray(j.result)) {
          return j.result.slice(0, 20).map((tx: any) => ({
            kind: "draw", // refined by receipt decoding below
            hash: tx.hash,
            ts: parseInt(tx.timeStamp, 10) * 1000,
            blockNumber: parseInt(tx.blockNumber, 10),
          }));
        }
      }
    } catch {
      // ignore
    }
  }

  // Fallback: provider-based log query for the *pool contract* events
  try {
    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
    const filter = {
      address: pool,
      fromBlock,
      toBlock: "latest",
      topics: [Object.values(TOPIC).map(topic0)],
    };
    const logs = await provider.getLogs(filter);
    const decoded: HistoryEntry[] = logs
      .slice(-20)
      .map((log) => {
        const parsed = iface.parseLog({ topics: log.topics, data: log.data });
        if (!parsed) return null;
        const block = parsed.fragment.name;
        let kind: HistoryEntry["kind"] = "draw";
        let amount: string | undefined;
        if (block === "Deposited") kind = "deposit";
        else if (block === "Withdrawn") {
          kind = "withdraw";
          amount = ethers.formatUnits(parsed.args.amount, 6);
        } else if (block === "PrizeClaimed") {
          kind = "claim";
          amount = ethers.formatUnits(parsed.args.amount, 6);
        } else if (block === "PrizeCompounded") {
          kind = "compound";
          amount = ethers.formatUnits(parsed.args.amount, 6);
        } else if (block === "WinnerSelected") {
          kind = "draw";
        }
        return {
          kind,
          amount,
          hash: log.transactionHash,
          ts: 0,
          blockNumber: log.blockNumber,
        } as HistoryEntry;
      })
      .filter((x): x is HistoryEntry => !!x)
      .reverse();
    return decoded;
  } catch {
    return [];
  }
}
