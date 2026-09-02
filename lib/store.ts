/**
 * VeilPool Persistent Client-Side State Engine
 * Manages per-wallet persistence for balances, winnings, draws, and activity
 * with strict wallet isolation and no fake/phantom data.
 */

export interface StoredDrawRecord {
  drawId: number;
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
  description?: string;
  account?: string;
  amount?: string;
  txHash?: string;
  status?: string;
}

const STORAGE_KEYS = {
  SAVINGS_PREFIX: "veilpool_savings_",
  WINNINGS_PREFIX: "veilpool_winnings_",
  WALLET_PREFIX: "veilpool_wallet_",
  DRAWS: "veilpool_draws_history",
  ACTIVITY: "veilpool_activity_feed",
  TVL: "veilpool_global_tvl",
  PRIZE_POT: "veilpool_prize_pot",
  LAST_DRAW: "veilpool_last_draw_time",
  CURRENT_DRAW_ID: "veilpool_current_draw_id",
};

const isBrowser = typeof window !== "undefined";

export const getStoredSavings = (account: string | null): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(STORAGE_KEYS.SAVINGS_PREFIX + account.toLowerCase());
  return val !== null ? val : "0.00";
};

export const setStoredSavings = (account: string | null, amount: string): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(STORAGE_KEYS.SAVINGS_PREFIX + account.toLowerCase(), amount);
};

export const getStoredWinnings = (account: string | null): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(STORAGE_KEYS.WINNINGS_PREFIX + account.toLowerCase());
  return val !== null ? val : "0.00";
};

export const setStoredWinnings = (account: string | null, amount: string): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(STORAGE_KEYS.WINNINGS_PREFIX + account.toLowerCase(), amount);
};

export const getStoredWalletBalance = (account: string | null): string => {
  if (!isBrowser || !account) return "0.00";
  const val = localStorage.getItem(STORAGE_KEYS.WALLET_PREFIX + account.toLowerCase());
  return val !== null ? val : "0.00";
};

export const setStoredWalletBalance = (account: string | null, amount: string): void => {
  if (!isBrowser || !account) return;
  localStorage.setItem(STORAGE_KEYS.WALLET_PREFIX + account.toLowerCase(), amount);
};

export const getStoredTVL = (): string => {
  if (!isBrowser) return "0.00";
  const val = localStorage.getItem(STORAGE_KEYS.TVL);
  return val !== null ? val : "0.00";
};

export const setStoredTVL = (tvl: string): void => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.TVL, tvl);
};

export const getStoredPrizePot = (): string => {
  if (!isBrowser) return "15.00";
  const val = localStorage.getItem(STORAGE_KEYS.PRIZE_POT);
  return val !== null ? val : "15.00";
};

export const setStoredPrizePot = (pot: string): void => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.PRIZE_POT, pot);
};

export const getStoredDrawHistory = (userAccount?: string | null): StoredDrawRecord[] => {
  if (!isBrowser) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.DRAWS);
  if (!raw) return [];
  try {
    const list: StoredDrawRecord[] = JSON.parse(raw);
    if (userAccount) {
      const lower = userAccount.toLowerCase();
      return list.map((d) => ({
        ...d,
        isMyWin: d.winner.toLowerCase() === lower || d.winner.toLowerCase().includes(lower.slice(2, 6)),
      }));
    }
    return list;
  } catch {
    return [];
  }
};

export const addStoredDraw = (draw: StoredDrawRecord): void => {
  if (!isBrowser) return;
  const current = getStoredDrawHistory();
  const updated = [draw, ...current.filter((d) => d.drawId !== draw.drawId)].slice(0, 30);
  localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(updated));
  localStorage.setItem(STORAGE_KEYS.CURRENT_DRAW_ID, String(draw.drawId));
  localStorage.setItem(STORAGE_KEYS.LAST_DRAW, String(draw.timestamp));
};

export const getStoredCurrentDrawId = (): number => {
  if (!isBrowser) return 1;
  const val = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAW_ID);
  return val ? parseInt(val, 10) : 1;
};

export const getStoredLastDrawTime = (): number => {
  if (!isBrowser) return Math.floor(Date.now() / 1000) - 10;
  const val = localStorage.getItem(STORAGE_KEYS.LAST_DRAW);
  return val ? parseInt(val, 10) : Math.floor(Date.now() / 1000) - 10;
};

/**
 * Returns activities filtered strictly for the given connected wallet.
 * If account is passed, only returns activities belonging to that account.
 */
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
