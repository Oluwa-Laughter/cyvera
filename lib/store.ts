/**
 * Cyvera Client-Side Simulation & Cache Store
 * Manages dual markets (cUSDT & cUSDC), token shielding balances,
 * 4-phase draw progression, verifiable draw history, and user activity feed.
 */

import { ActiveMarketId } from "./contracts";

export type DrawPhase = "OPEN" | "SNAPSHOT" | "SELECTING" | "CLAIMING";

export interface StoredDrawRecord {
  drawId: number;
  market: ActiveMarketId;
  phase: DrawPhase;
  timestamp: number;
  totalParticipants: number;
  prizeAmount: string;
  winner: string;
  executed: boolean;
  isMyWin: boolean;
}

export interface StoredActivityEntry {
  id: string;
  kind?: string;
  type: string;
  account?: string;
  amount?: string;
  description: string;
  txHash?: string;
  timestamp: number;
  ts?: number;
  status: "CONFIRMED" | "PENDING" | "FAILED";
  market?: ActiveMarketId;
  isPublicOnchainTx?: boolean; // True ONLY for actual mined Sepolia txs (faucet, deposit, withdraw, claim)
  isGlobalOnly?: boolean;      // True for protocol-level keeper/harvest/audit events
}

const STORAGE_KEYS = {
  THEME: "cyvera_theme",
  SAVINGS_PREFIX: "cyvera_saved_",
  SHIELDED_PREFIX: "cyvera_shielded_",
  WINNINGS_PREFIX: "cyvera_winnings_",
  WALLET_BAL_PREFIX: "cyvera_wallet_bal_",
  PUBLIC_BAL_PREFIX: "cyvera_public_bal_",
  TVL_PREFIX: "cyvera_tvl_",
  PRIZE_POT_PREFIX: "cyvera_prize_pot_",
  DRAW_PHASE_PREFIX: "cyvera_draw_phase_",
  DRAW_HISTORY_PREFIX: "cyvera_draw_history_",
  CURRENT_DRAW_PREFIX: "cyvera_cur_draw_",
  LAST_DRAW_PREFIX: "cyvera_last_draw_",
  LIQUIDITY_HUNT_POINTS_PREFIX: "cyvera_lh_pts_",
  ACTIVITY: "cyvera_activity_v2",
};

const isBrowser = typeof window !== "undefined";

// Theme Storage
export const getStoredTheme = (): "dark" | "light" => {
  if (!isBrowser) return "dark";
  const val = localStorage.getItem(STORAGE_KEYS.THEME);
  return val === "light" ? "light" : "dark";
};

export const setStoredTheme = (theme: "dark" | "light"): void => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

// Savings Balance (Vault Encrypted Principal)
export const getStoredSavings = (account: string | null, market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.SAVINGS_PREFIX}${market}_${account.toLowerCase()}`);
  return val !== null ? val : "0.00";
};

export const setStoredSavings = (account: string | null, amount: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(`${STORAGE_KEYS.SAVINGS_PREFIX}${market}_${account.toLowerCase()}`, amount);
};

// Shielded Balance (Wrapped in confidential cUSDT/cUSDC ready to deposit)
export const getStoredShieldedBalance = (account: string | null, market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.SHIELDED_PREFIX}${market}_${account.toLowerCase()}`);
  return val !== null ? val : "0.00";
};

export const setStoredShieldedBalance = (account: string | null, amount: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(`${STORAGE_KEYS.SHIELDED_PREFIX}${market}_${account.toLowerCase()}`, amount);
};

// Prize Winnings (Encrypted handle)
export const getStoredWinnings = (account: string | null, market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.WINNINGS_PREFIX}${market}_${account.toLowerCase()}`);
  return val !== null ? val : "0.00";
};

export const setStoredWinnings = (account: string | null, amount: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(`${STORAGE_KEYS.WINNINGS_PREFIX}${market}_${account.toLowerCase()}`, amount);
};

// Wallet Token Balance (onchain Mock ERC20)
export const getStoredWalletBalance = (account: string | null, market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.WALLET_BAL_PREFIX}${market}_${account.toLowerCase()}`);
  return val !== null ? val : "0.00";
};

export const setStoredWalletBalance = (account: string | null, amount: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(`${STORAGE_KEYS.WALLET_BAL_PREFIX}${market}_${account.toLowerCase()}`, amount);
};

// Public Token Wallet Balance (unshielded USDT/USDC)
export const getStoredPublicWalletBalance = (account: string | null, market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser || !account) return "1000.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.PUBLIC_BAL_PREFIX}${market}_${account.toLowerCase()}`);
  return val !== null ? val : "1000.00";
};

export const setStoredPublicWalletBalance = (account: string | null, amount: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(`${STORAGE_KEYS.PUBLIC_BAL_PREFIX}${market}_${account.toLowerCase()}`, amount);
};

// TVL & Prize Pot
export const getStoredTVL = (market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser) return "0.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.TVL_PREFIX}${market}`);
  return val !== null ? val : "0.00";
};

export const setStoredTVL = (tvl: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser) return;
  localStorage.setItem(`${STORAGE_KEYS.TVL_PREFIX}${market}`, tvl);
};

export const getStoredPrizePot = (market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser) return market === "cUSDT" ? "15.00" : "25.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.PRIZE_POT_PREFIX}${market}`);
  return val !== null ? val : market === "cUSDT" ? "15.00" : "25.00";
};

export const setStoredPrizePot = (pot: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser) return;
  localStorage.setItem(`${STORAGE_KEYS.PRIZE_POT_PREFIX}${market}`, pot);
};

// 4-Phase Draw Progression
export const getStoredDrawPhase = (market: ActiveMarketId = "cUSDT"): DrawPhase => {
  if (!isBrowser) return "OPEN";
  const val = localStorage.getItem(`${STORAGE_KEYS.DRAW_PHASE_PREFIX}${market}`);
  return (val as DrawPhase) || "OPEN";
};

export const setStoredDrawPhase = (phase: DrawPhase, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser) return;
  localStorage.setItem(`${STORAGE_KEYS.DRAW_PHASE_PREFIX}${market}`, phase);
};

// Draw History
export const getStoredDrawHistory = (userAccount?: string | null, market: ActiveMarketId = "cUSDT"): StoredDrawRecord[] => {
  if (!isBrowser) return [];
  const raw = localStorage.getItem(`${STORAGE_KEYS.DRAW_HISTORY_PREFIX}${market}`);
  if (!raw) return [];
  try {
    const list: StoredDrawRecord[] = JSON.parse(raw);
    if (userAccount) {
      const lower = userAccount.toLowerCase();
      return list.map((d) => ({
        ...d,
        isMyWin: d.winner?.toLowerCase() === lower,
      }));
    }
    return list;
  } catch {
    return [];
  }
};

export const addStoredDraw = (draw: StoredDrawRecord): void => {
  if (!isBrowser) return;
  const current = getStoredDrawHistory(null, draw.market);
  const updated = [draw, ...current.filter((d) => d.drawId !== draw.drawId)].slice(0, 20);
  localStorage.setItem(`${STORAGE_KEYS.DRAW_HISTORY_PREFIX}${draw.market}`, JSON.stringify(updated));
  setStoredCurrentDrawId(draw.drawId + 1, draw.market);
  setStoredLastDrawTime(draw.timestamp, draw.market);
  setStoredDrawPhase("CLAIMING", draw.market);
};

export const getStoredCurrentDrawId = (market: ActiveMarketId = "cUSDT"): number => {
  if (!isBrowser) return 1;
  const val = localStorage.getItem(`${STORAGE_KEYS.CURRENT_DRAW_PREFIX}${market}`);
  return val ? parseInt(val, 10) : 1;
};

export const setStoredCurrentDrawId = (id: number, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser) return;
  localStorage.setItem(`${STORAGE_KEYS.CURRENT_DRAW_PREFIX}${market}`, String(id));
};

export const getStoredLastDrawTime = (market: ActiveMarketId = "cUSDT"): number => {
  if (!isBrowser) return Math.floor(Date.now() / 1000) - 10;
  const val = localStorage.getItem(`${STORAGE_KEYS.LAST_DRAW_PREFIX}${market}`);
  return val ? parseInt(val, 10) : Math.floor(Date.now() / 1000) - 10;
};

export const setStoredLastDrawTime = (ts: number, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser) return;
  localStorage.setItem(`${STORAGE_KEYS.LAST_DRAW_PREFIX}${market}`, String(ts));
};

// Liquidity Hunt Reward Accounting
export const getStoredLiquidityHuntPoints = (account: string | null): number => {
  if (!isBrowser || !account) return 0;
  const val = localStorage.getItem(`${STORAGE_KEYS.LIQUIDITY_HUNT_POINTS_PREFIX}${account.toLowerCase()}`);
  return val ? parseInt(val, 10) : 0;
};

export const addStoredLiquidityHuntPoints = (account: string | null, pts: number): void => {
  if (!isBrowser || !account) return;
  const cur = getStoredLiquidityHuntPoints(account);
  localStorage.setItem(`${STORAGE_KEYS.LIQUIDITY_HUNT_POINTS_PREFIX}${account.toLowerCase()}`, String(cur + pts));
};

// Protocol-Wide Global Default Audit Events
const DEFAULT_GLOBAL_AUDIT_EVENTS: StoredActivityEntry[] = [
  {
    id: "proto-seed-1",
    kind: "seed",
    type: "SPONSOR_SEED",
    description: "Sponsor DAO seeded 10,000 cUSDT initial prize reserve into Shielded Pool",
    amount: "+10,000 cUSDT",
    timestamp: Date.now() - 3600000 * 5,
    ts: Date.now() - 3600000 * 5,
    status: "CONFIRMED",
    market: "cUSDT",
    isPublicOnchainTx: false,
    isGlobalOnly: true,
  },
  {
    id: "proto-harvest-1",
    kind: "harvest",
    type: "YIELD_HARVEST",
    description: "Automated Keeper harvested +68.40 cUSDT lending yield into Prize Pot",
    amount: "+$68.40 cUSDT",
    timestamp: Date.now() - 3600000 * 3,
    ts: Date.now() - 3600000 * 3,
    status: "CONFIRMED",
    market: "cUSDT",
    isPublicOnchainTx: false,
    isGlobalOnly: true,
  },
  {
    id: "proto-deposit-1",
    kind: "deposit",
    type: "DEPOSIT",
    account: "0x892a43b123d4567e890123456789012345678901",
    description: "Shielded deposit of 500.00 cUSDT (encrypted ticket weight in Zama euint64)",
    amount: "$500.00 cUSDT",
    timestamp: Date.now() - 3600000 * 2,
    ts: Date.now() - 3600000 * 2,
    status: "CONFIRMED",
    market: "cUSDT",
    isPublicOnchainTx: false,
    isGlobalOnly: true,
  },
  {
    id: "proto-draw-1",
    kind: "draw",
    type: "DRAW",
    description: "Automated Keeper executed Draw #0 via Zama FHE verifiable randomness beacon",
    amount: "$25.00 cUSDT",
    timestamp: Date.now() - 3600000 * 1,
    ts: Date.now() - 3600000 * 1,
    status: "CONFIRMED",
    market: "cUSDT",
    isPublicOnchainTx: false,
    isGlobalOnly: true,
  },
  {
    id: "proto-seed-2",
    kind: "seed",
    type: "SPONSOR_SEED",
    description: "Sponsor DAO seeded 10,000 cUSDC initial prize reserve into Shielded Pool",
    amount: "+10,000 cUSDC",
    timestamp: Date.now() - 3600000 * 4,
    ts: Date.now() - 3600000 * 4,
    status: "CONFIRMED",
    market: "cUSDC",
    isPublicOnchainTx: false,
    isGlobalOnly: true,
  },
];

// Activity Log: Strictly personal wallet events
export const getStoredActivity = (account?: string | null): StoredActivityEntry[] => {
  if (!isBrowser) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
  if (!raw) return [];
  try {
    const list: StoredActivityEntry[] = JSON.parse(raw);
    if (account) {
      const lower = account.toLowerCase();
      return list.filter((e) => !e.isGlobalOnly && e.account && e.account.toLowerCase() === lower);
    }
    return list.filter((e) => !e.isGlobalOnly);
  } catch {
    return [];
  }
};

// Protocol-wide Global Audit Log
export const getAllStoredActivity = (): StoredActivityEntry[] => {
  if (!isBrowser) return DEFAULT_GLOBAL_AUDIT_EVENTS;
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
  let userList: StoredActivityEntry[] = [];
  if (raw) {
    try {
      userList = JSON.parse(raw);
    } catch {
      userList = [];
    }
  }
  // Combine user actions with protocol-wide events
  const combined = [...userList, ...DEFAULT_GLOBAL_AUDIT_EVENTS];
  // Sort descending by timestamp
  return combined.sort((a, b) => (b.timestamp || b.ts || 0) - (a.timestamp || a.ts || 0));
};

export const addStoredActivity = (entry: StoredActivityEntry): void => {
  if (!isBrowser) return;
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
  let current: StoredActivityEntry[] = [];
  if (raw) {
    try {
      current = JSON.parse(raw);
    } catch {
      current = [];
    }
  }
  const normalized: StoredActivityEntry = {
    ...entry,
    account: entry.account ? entry.account.toLowerCase() : undefined,
    ts: entry.ts || entry.timestamp || Date.now(),
    timestamp: entry.timestamp || entry.ts || Date.now(),
  };
  const updated = [normalized, ...current.filter((e) => e.id !== normalized.id)].slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(updated));
};
