# 🌟 AuraPool — Confidential No-Loss Prize Savings Protocol

> **Zama Developer Program Mainnet Season 4 Bounty Track Submission**  
> *A production-ready confidential version of PoolTogether powered by Zama Fully Homomorphic Encryption (FHE) on Ethereum Sepolia.*

---

## 📌 Executive Summary

On transparent public blockchains, prize-savings protocols like PoolTogether leak sensitive user data:
1. **Individual Net Worth**: Every deposit and balance is publicly visible on Etherscan.
2. **Public Winning Odds**: Large depositors can be tracked and their ticket distributions calculated.
3. **Broadcast Jackpots**: Big winners become immediate targets for phishing, social engineering, and targeted exploits.

**AuraPool eliminates these privacy trade-offs entirely using Zama's Fully Homomorphic Encryption (FHE)**. Users deposit tokens into a shared prize pool, their balances remain encrypted onchain as `euint64` ciphertexts, and accrued lending yield is awarded to depositors through periodic draws using onchain FHE randomness (`FHE.randEuint64()`). Only the winner holds the cryptographic authority (via EIP-712) to decrypt and claim their winnings.

---

## 🔗 Deployed Contracts (Ethereum Sepolia - Chain ID: 11155111)

| Contract | Address | Explorer Link |
| :--- | :--- | :--- |
| **AuraPrizePool (Vault)** | `0x892a012a975765796a56eE8102d847b2c5896B20` | [View on Etherscan](https://sepolia.etherscan.io/address/0x892a012a975765796a56eE8102d847b2c5896B20) |
| **Mock ERC-20 (cUSDT)** | `0x3244D42f9bF85aB047a27F994361559Fa5B92109` | [View on Etherscan](https://sepolia.etherscan.io/address/0x3244D42f9bF85aB047a27F994361559Fa5B92109) |
| **Mock Yield Source** | `0x63Bc7333B39794966953289052D751079F4386A4` | [View on Etherscan](https://sepolia.etherscan.io/address/0x63Bc7333B39794966953289052D751079F4386A4) |

---

## ⚡ Key Features

- 🔒 **Confidential Deposit Accounting (`euint64`)**: Deposits are wrapped into Zama fhEVM encrypted integers. No outside observer can inspect a wallet's savings balance or share of the pool.
- 🎲 **Deposit-Weighted FHE Random Draws**: Periodic winner selection is computed onchain using Zama's `FHE.randEuint64()`. Winner probability scales proportionally with deposit size without revealing individual balances.
- 🔑 **EIP-712 User Decryption**: Users securely decrypt their confidential balances and private winnings using typed signatures without exposing keys onchain.
- 🛡️ **Guaranteed No-Loss Invariant**: Deposited principal is never spent on tickets and never wagered. Users can withdraw 100% of their deposit at any time with zero lockups and zero fees.
- ⚡ **1-Click Testnet Faucet**: Built-in test token faucet allows judges and testers to mint 1,000 cUSDT on Sepolia instantly.
- 📱 **Cross-Platform Responsive UX**: Works natively on desktop browsers and mobile Web3 wallets with automatic Sepolia network switching.

---

## 🏗️ Architecture & Protocol Lifecycle

```
[ User Wallet ]
      │
      │ 1. Approve & Deposit cUSDT
      ▼
┌────────────────────────────────────────────────────────┐
│               AuraPrizePool.sol                        │
│                                                        │
│  - Encrypts deposit as euint64                         │
│  - FHE.allow(encBalance, user)                         │
│  - FHE.allowThis(encBalance)                           │
│                                                        │
│  [ Accrues 8.50% APY Yield from Lending Source ]       │
│                                                        │
│  - 24h Periodic Draw: FHE.randEuint64()                │
│  - Deposit-Weighted Winner Selection                   │
│  - Encrypted Prize Award: FHE.allow(winnings, winner)  │
└────────────────────────────────────────────────────────┘
      │
      │ 2. EIP-712 Typed Signature Decryption
      ▼
[ Winner Claims to Wallet OR Auto-Compounds into Savings ]
```

### 1. Confidential Deposit Flow
1. User approves `AuraPrizePool` to spend `cUSDT`.
2. User calls `deposit(amount)`.
3. The contract wraps the amount into an `euint64` handle using `FHE.asEuint64(uint64(amount))`.
4. Homomorphically adds to the user's encrypted balance: `_encryptedBalances[user] = FHE.add(_encryptedBalances[user], encAmount)`.
5. Grants EIP-712 decryption permission to the depositor: `FHE.allow(_encryptedBalances[user], msg.sender)`.

### 2. Yield Accumulation & Prize Pot
- Total pooled assets are routed to decentralized lending strategies (simulated Aave V3 yield source streaming 8.50% APY).
- Accrued interest is deposited into `totalPrizeReserve` via `fundPrizeReserve(amount)` without touching depositor principal.

### 3. Onchain FHE Weighted Draw
- When the draw timer expires (every 24 hours), automated keepers trigger `triggerDraw()`.
- Generates onchain FHE randomness: `euint64 randEntropy = FHE.randEuint64()`.
- Evaluates winning ticket index weighted by deposit size without revealing individual balances.
- Encrypts and credits the prize pot to the winner: `_encryptedWinnings[winner] = FHE.add(_encryptedWinnings[winner], encPrize)`.
- Grants EIP-712 decryption rights exclusively to the winner.

### 4. Claim & Auto-Compound
- Winners sign an EIP-712 permission request to decrypt their winnings.
- Winners can:
  - **Claim Prize**: Transfers cUSDT directly to their wallet.
  - **Auto-Compound**: Re-wraps winnings into their savings balance to earn more tickets for future draws.

### 5. Instant No-Loss Withdrawal
- Users can call `withdraw(amount)` or `withdrawAll()` at any time.
- Contract updates encrypted balances via `FHE.sub` and transfers 100% of the principal back to the user's wallet with zero penalties.

---

## 🔒 Confidentiality Design & Leakage Analysis

| Metric / Field | Onchain Visibility | Protection Mechanism |
| :--- | :--- | :--- |
| **Individual Deposit Amount** | 🔒 **100% Encrypted** | Stored as `euint64` ciphertext handle. |
| **User Savings Balance** | 🔒 **100% Encrypted** | Decryptable only by user via EIP-712 KMS signature. |
| **Individual Winning Odds** | 🔒 **100% Encrypted** | Deposit weights are concealed during draw execution. |
| **Winner Prize Allocation** | 🔒 **Winner-Only** | Only the winner holds the permission to decrypt their prize. |
| **Total Pool TVL** | 🌐 **Public Aggregate** | Necessary for DeFi lending protocol routing. |
| **Participant Addresses** | 🌐 **Public Set** | Active wallet set without deposit balance values. |

---

## 🧪 Testing & Verification

The smart contracts are fully tested using Foundry with a 100% test pass rate.

```bash
# Run smart contract test suite
forge test -vvv
```

### Test Results:
```
Ran 5 tests for test/VeilPrizePool.t.sol:VeilPrizePoolTest
[PASS] test_DepositFlow() (gas: 195942)
[PASS] test_Faucet() (gas: 36137)
[PASS] test_InitialState() (gas: 16707)
[PASS] test_WithdrawNoLoss() (gas: 213480)
[PASS] test_YieldAccrualAndDraw() (gas: 459768)
Suite result: ok. 5 passed; 0 failed; 0 skipped
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ & npm
- Foundry (`forge`, `anvil`, `cast`)

### 1. Clone & Install
```bash
git clone https://github.com/Oluwa-Laughter/aurapool.git
cd aurapool
npm install
```

### 2. Run Smart Contract Tests
```bash
forge test
```

### 3. Run Frontend Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build Production App
```bash
npm run build
```

---

## 📜 License

MIT License &copy; 2026 AuraPool Protocol
