/**
 * AuraDark: Sealed-Bid Dark Auction State Engine & Persistent Store.
 * Manages active sealed-bid auctions, encrypted bid handles, escrow locks, and 100% refund claims.
 */
import { ethers } from "ethers";

export interface AuctionView {
  id: number;
  seller: string;
  title: string;
  description: string;
  paymentToken: string;
  tokenLotSize: string;
  reservePrice: string;
  startTime: number;
  endTime: number;
  status: "Active" | "Settled" | "Cancelled";
  highestBidder: string;
  winningAmount: string;
  totalBidsCount: number;
  totalEscrowCollected: string;
  assetClaimed: boolean;
  myEscrow: string;
  myEncryptedBidHandle: string | null;
  hasClaimedRefund: boolean;
  isMyWin: boolean;
  isSeller: boolean;
}

const STORAGE_KEY_AUCTIONS = "auradark_auctions_v1";
const STORAGE_KEY_BIDS = "auradark_bids_v1";
const STORAGE_KEY_REFUNDS = "auradark_refunds_v1";
const STORAGE_KEY_CLAIMS = "auradark_claims_v1";

const INITIAL_AUCTIONS: AuctionView[] = [
  {
    id: 1,
    seller: "0x892a012A975765796A56Ee8102D847b2C5896b20",
    title: "Genesis Allocation: 50,000 $AURA Dark Lot",
    description: "Confidential institutional seed round allocation. Sealed bids evaluated via Zama FHE.",
    paymentToken: "0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0",
    tokenLotSize: "50,000 AURA",
    reservePrice: "25.00",
    startTime: Math.floor(Date.now() / 1000) - 300,
    endTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour remaining
    status: "Active",
    highestBidder: "0x0000000000000000000000000000000000000000",
    winningAmount: "0.00",
    totalBidsCount: 4,
    totalEscrowCollected: "380.00",
    assetClaimed: false,
    myEscrow: "0.00",
    myEncryptedBidHandle: null,
    hasClaimedRefund: false,
    isMyWin: false,
    isSeller: false,
  },
  {
    id: 2,
    seller: "0x63BC7333B39794966953289052d751079F4386A4",
    title: "1-Minute Flash Dark Auction: 10,000 cUSDT Yield Lot",
    description: "Rapid MEV-proof sealed auction for protocol yield bonds. Front-running mathematically impossible.",
    paymentToken: "0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0",
    tokenLotSize: "10,000 cUSDT Bond",
    reservePrice: "10.00",
    startTime: Math.floor(Date.now() / 1000) - 30,
    endTime: Math.floor(Date.now() / 1000) + 30, // 30 seconds for fast test
    status: "Active",
    highestBidder: "0x0000000000000000000000000000000000000000",
    winningAmount: "0.00",
    totalBidsCount: 2,
    totalEscrowCollected: "120.00",
    assetClaimed: false,
    myEscrow: "0.00",
    myEncryptedBidHandle: null,
    hasClaimedRefund: false,
    isMyWin: false,
    isSeller: false,
  },
];

export function getStoredAuctions(userAccount?: string | null): AuctionView[] {
  if (typeof window === "undefined") return INITIAL_AUCTIONS;

  let stored: AuctionView[] = INITIAL_AUCTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUCTIONS);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch {}

  const lowerUser = userAccount ? userAccount.toLowerCase() : null;

  return stored.map((auc) => {
    let myEscrow = "0.00";
    let myEncryptedBidHandle: string | null = null;
    let hasClaimedRefund = false;
    let isMyWin = false;
    let isSeller = false;

    if (lowerUser) {
      isSeller = auc.seller.toLowerCase() === lowerUser;
      isMyWin = auc.highestBidder.toLowerCase() === lowerUser;

      try {
        const bidsRaw = localStorage.getItem(`${STORAGE_KEY_BIDS}_${auc.id}_${lowerUser}`);
        if (bidsRaw) {
          const parsed = JSON.parse(bidsRaw);
          myEscrow = parsed.amount || "0.00";
          myEncryptedBidHandle = parsed.handle || null;
        }
        const refundRaw = localStorage.getItem(`${STORAGE_KEY_REFUNDS}_${auc.id}_${lowerUser}`);
        hasClaimedRefund = !!refundRaw;
      } catch {}
    }

    return {
      ...auc,
      myEscrow,
      myEncryptedBidHandle,
      hasClaimedRefund,
      isMyWin,
      isSeller,
    };
  });
}

export function saveStoredAuction(auction: AuctionView): void {
  if (typeof window === "undefined") return;
  try {
    const list = getStoredAuctions();
    const existingIndex = list.findIndex((a) => a.id === auction.id);
    if (existingIndex >= 0) {
      list[existingIndex] = auction;
    } else {
      list.push(auction);
    }
    localStorage.setItem(STORAGE_KEY_AUCTIONS, JSON.stringify(list));
  } catch {}
}

export function recordUserBid(
  auctionId: number,
  userAccount: string,
  amount: string
): void {
  if (typeof window === "undefined") return;
  const lowerUser = userAccount.toLowerCase();
  const handle = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  try {
    // 1. Record user's bid
    localStorage.setItem(
      `${STORAGE_KEY_BIDS}_${auctionId}_${lowerUser}`,
      JSON.stringify({ amount, handle, timestamp: Date.now() })
    );

    // 2. Update auction object
    const list = getStoredAuctions();
    const auc = list.find((a) => a.id === auctionId);
    if (auc) {
      const currentHighest = parseFloat(auc.winningAmount || "0");
      const bidNum = parseFloat(amount);
      const isNewHighest = bidNum > currentHighest;

      auc.totalBidsCount += 1;
      const prevEscrow = parseFloat(auc.totalEscrowCollected || "0");
      auc.totalEscrowCollected = (prevEscrow + bidNum).toFixed(2);

      if (isNewHighest || auc.highestBidder === "0x0000000000000000000000000000000000000000") {
        auc.highestBidder = userAccount;
        auc.winningAmount = bidNum.toFixed(2);
      }
      localStorage.setItem(STORAGE_KEY_AUCTIONS, JSON.stringify(list));
    }
  } catch {}
}

export function settleStoredAuction(auctionId: number): void {
  if (typeof window === "undefined") return;
  try {
    const list = getStoredAuctions();
    const auc = list.find((a) => a.id === auctionId);
    if (auc) {
      auc.status = "Settled";
      localStorage.setItem(STORAGE_KEY_AUCTIONS, JSON.stringify(list));
    }
  } catch {}
}

export function recordClaimRefund(auctionId: number, userAccount: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_REFUNDS}_${auctionId}_${userAccount.toLowerCase()}`, "true");
  } catch {}
}

export function recordClaimAsset(auctionId: number): void {
  if (typeof window === "undefined") return;
  try {
    const list = getStoredAuctions();
    const auc = list.find((a) => a.id === auctionId);
    if (auc) {
      auc.assetClaimed = true;
      localStorage.setItem(STORAGE_KEY_AUCTIONS, JSON.stringify(list));
    }
  } catch {}
}
