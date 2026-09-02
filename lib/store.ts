/**
 * VeilPool Persistent State Engine
 * Manages dual markets (cUSDT & cUSDC), token shielding balances,
 * 4-phase verifiable draw state machine, and liquidity hunt accounting.
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
  id: string | number;
  ts?: number;
  timestamp?: number;
  kind?: string;
  type?: string;
  market?: ActiveMarketId;
  description?: string;
  account?: string;
  amount?: string;
  txHash?: string;
  status?: string;
}

const STORAGE_KEYS = {
  SAVINGS_PREFIX: "veilpool_savings_",
  SHIELDED_PREFIX: "veilpool_shielded_",
  WINNINGS_PREFIX: "veilpool_winnings_",
  WALLET_PREFIX: "veilpool_wallet_",
  PUBLIC_WALLET_PREFIX: "veilpool_pubwallet_",
  DRAWS: "veilpool_draws_history",
  ACTIVITY: "veilpool_activity_feed",
  TVL_PREFIX: "veilpool_tvl_",
  PRIZE_POT_PREFIX: "veilpool_pot_",
  LAST_DRAW_PREFIX: "veilpool_lastdraw_",
  CURRENT_DRAW_ID_PREFIX: "veilpool_drawid_",
  DRAW_PHASE_PREFIX: "veilpool_phase_",
  LIQUIDITY_HUNT_POINTS_PREFIX: "veilpool_lh_points_",
};

const isBrowser = typeof window !== "undefined";

// Active Market Storage
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

// Winnings
export const getStoredWinnings = (account: string | null, market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.WINNINGS_PREFIX}${market}_${account.toLowerCase()}`);
  return val !== null ? val : "0.00";
};

export const setStoredWinnings = (account: string | null, amount: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(`${STORAGE_KEYS.WINNINGS_PREFIX}${market}_${account.toLowerCase()}`, amount);
};

// Confidential Token Wallet Balance
export const getStoredWalletBalance = (account: string | null, market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.WALLET_PREFIX}${market}_${account.toLowerCase()}`);
  return val !== null ? val : "0.00";
};

export const setStoredWalletBalance = (account: string | null, amount: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(`${STORAGE_KEYS.WALLET_PREFIX}${market}_${account.toLowerCase()}`, amount);
};

// Public Token Wallet Balance (unshielded USDT/USDC)
export const getStoredPublicWalletBalance = (account: string | null, market: ActiveMarketId = "cUSDT"): string => {
  if (!isBrowser || !account) return "1000.00";
  const val = localStorage.getItem(`${STORAGE_KEYS.PUBLIC_WALLET_PREFIX}${market}_${account.toLowerCase()}`);
  return val !== null ? val : "1000.00";
};

export const setStoredPublicWalletBalance = (account: string | null, amount: string, market: ActiveMarketId = "cUSDT"): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(`${STORAGE_KEYS.PUBLIC_WALLET_PREFIX}${market}_${account.toLowerCase()}`, amount);
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
  const raw = localStorage.getItem(STORAGE_KEYS.DRAWS);
  if (!raw) return [];
  try {
    const list: StoredDrawRecord[] = JSON.parse(raw);
    const filtered = list.filter((d) => !d.market || d.market === market);
    if (userAccount) {
      const lower = userAccount.toLowerCase();
      return filtered.map((d) => ({
        ...d,
        isMyWin: d.winner.toLowerCase() === lower || d.winner.toLowerCase().includes(lower.slice(2, 6)),
      }));
    }
    return filtered;
  } catch {
    return [];
  }
};

export const addStoredDraw = (draw: StoredDrawRecord): void => {
  if (!isBrowser) return;
  const raw = localStorage.getItem(STORAGE_KEYS.DRAWS);
  const current: StoredDrawRecord[] = raw ? JSON.parse(raw) : [];
  const updated = [draw, ...current.filter((d) => !(d.drawId === draw.drawId && d.market === draw.market))].slice(0, 30);
  localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(updated));
  localStorage.setItem(`${STORAGE_KEYS.CURRENT_DRAW_ID_PREFIX}${draw.market}`, String(draw.drawId));
  localStorage.setItem(`${STORAGE_KEYS.LAST_DRAW_PREFIX}${draw.market}`, String(draw.timestamp));
};

export const getStoredCurrentDrawId = (market: ActiveMarketId = "cUSDT"): number => {
  if (!isBrowser) return 1;
  const val = localStorage.getItem(`${STORAGE_KEYS.CURRENT_DRAW_ID_PREFIX}${market}`);
  return val ? parseInt(val, 10) : 1;
};

export const getStoredLastDrawTime = (market: ActiveMarketId = "cUSDT"): number => {
  if (!isBrowser) return Math.floor(Date.now() / 1000) - 10;
  const val = localStorage.getItem(`${STORAGE_KEYS.LAST_DRAW_PREFIX}${market}`);
  return val ? parseInt(val, 10) : Math.floor(Date.now() / 1000) - 10;
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

// Activity Log
export const getStoredActivity = (account?: string | null): StoredActivityEntry[] => {
  if (!isBrowser) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
  if (!raw) return [];
  try {
    const list: StoredActivityEntry[] = JSON.parse(raw);
    if (account) {
      const lower = account.toLowerCase();
      return list.filter((e) => !e.account || e.account.toLowerCase() === lower);
    }
    return list;
  } catch {
    return [];
  }
};

export const getAllStoredActivity = (): StoredActivityEntry[] => {
  if (!isBrowser) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const addStoredActivity = (entry: StoredActivityEntry): void => {
  if (!isBrowser) return;
  const current = getAllStoredActivity();
  const normalized: StoredActivityEntry = {
    ...entry,
    account: entry.account ? entry.account.toLowerCase() : undefined,
    ts: entry.ts || entry.timestamp || Date.now(),
    timestamp: entry.timestamp || entry.ts || Date.now(),
  };
  const updated = [normalized, ...current].slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(updated));
};
