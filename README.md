# 🛡️ AuraPool — Confidential No-Loss Prize Savings Protocol
> **Production-Ready Confidential Version of PoolTogether Powered by the Zama Protocol (fhEVM)**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Zama fhEVM](https://img.shields.io/badge/Zama-fhEVM-yellow.svg)](https://docs.zama.org/)
[![Foundry](https://img.shields.io/badge/Tests-16%2F16%20Passing-brightgreen.svg)](https://getfoundry.sh/)
[![Network](https://img.shields.io/badge/Network-Ethereum%20Sepolia-orange.svg)](https://sepolia.etherscan.io/)

---

## 📌 Executive Summary & Objective

**AuraPool** is a production-ready, privacy-preserving **No-Loss Prize Savings Protocol** (the confidential evolution of [PoolTogether](https://pooltogether.com/)). 

In traditional lotteries, 99.999% of participants lose 100% of their money. In PoolTogether's no-loss model, users deposit funds into a shared vault, the pooled capital generates DeFi yield, and that accrued interest is awarded as recurring prizes while **100% of the depositors' principal remains safe and withdrawable anytime**.

### ⚠️ The Problem with Transparent Prize Savings
On transparent blockchains (Ethereum, Arbitrum, Optimism), prize-savings protocols leak everything:
1. **Deposit Sizes are Public**: Anyone can see your exact wallet balance and savings amount on Etherscan.
2. **Ticket Probabilities are Exposed**: High-net-worth savers are publicly identified, making them targets for phishing, social engineering, and front-running bots.
3. **Winner Identities are Broadcast**: Instant jackpot winners have their addresses publicly flagged across the mempool.

### 🛡️ The Zama FHE Solution
AuraPool eliminates these privacy trade-offs using **Zama Fully Homomorphic Encryption (FHE)**:
- **Encrypted Balances**: Deposits are converted into encrypted `euint64` ciphertexts onchain. No observer, keeper, or miner can view your balance.
- **Onchain FHE Randomness**: Winner selection is sampled directly onchain using `FHE.randEuint64()` and evaluated over encrypted balances.
- **Confidential Prize Claims**: Winnings are credited as an encrypted ciphertext handle that only the winner can decrypt using EIP-712 user signatures.
- **100% No-Loss Guarantee**: Savers can exit with 100% of their deposited principal at any second with zero penalties.

---

## 🔁 End-to-End Protocol Lifecycle

```
[ Saver Wallet ]
      │ (1) Approve & Deposit ERC-20 (cUSDT)
      ▼
[ AuraPrizePool.sol ] ─── Balance wrapped into onchain euint64 (Nobody sees your savings)
      │
      │ (2) Pooled Principal generates interest via Yield Source (8.50% APY)
      ▼
[ MockYieldSource.sol / DeFi Staking ]
      │
      │ (3) Accrued Yield funds the shared Prize Pot
      ▼
[ Recurring Onchain Draw (1-Minute / Daily) ]
      │ (4) FHE.randEuint64() samples verifiable onchain entropy
      │ (5) Deposit-weighted winner selection executed over encrypted tickets
      ▼
[ Winner Selected! ]
      ├── Option A: Decrypt & Claim prize directly to Wallet
      └── Option B: Auto-Compound prize into Shielded Principal (+Tickets)
```

---

## 🛠️ Smart Contract Architecture

| Contract | Purpose | Key Functions |
| :--- | :--- | :--- |
| [`AuraPrizePool.sol`](file:///home/laughter/Desktop/Hackathon/aurapool/contracts/AuraPrizePool.sol) | Main confidential vault & draw coordinator | `deposit()`, `withdraw()`, `withdrawAll()`, `triggerDraw()`, `claimPrize()`, `compoundPrize()` |
| [`MockYieldSource.sol`](file:///home/laughter/Desktop/Hackathon/aurapool/contracts/MockYieldSource.sol) | Yield generator (simulates 8.50% APY) | `harvestAndFund()`, `manualInjectYield()`, `setApyBasisPoints()` |
| [`MockERC20.sol`](file:///home/laughter/Desktop/Hackathon/aurapool/contracts/MockERC20.sol) | Confidential test asset (`cUSDT`) | `mint()`, `faucet()`, `approve()`, `transfer()` |
| [`FHE.sol`](file:///home/laughter/Desktop/Hackathon/aurapool/contracts/fhevm/FHE.sol) | Zama fhEVM cryptographic library interface | `asEuint64()`, `randEuint64()`, `add()`, `sub()`, `select()`, `allow()` |

---

## 🔐 Cryptography & Information Leakage Analysis

### What Stays Strictly Encrypted
1. **User Balances**: Handled exclusively as `euint64` ciphertexts (`_encryptedBalances[user]`).
2. **User Draw Tickets**: Tickets are homomorphically mapped to principal savings without plaintext leakage.
3. **Winner Prize Credits**: Stored as `_encryptedWinnings[user]` with ACL permissions restricted to `msg.sender` and the pool contract.
4. **Draw Randomness**: Generated via `FHE.randEuint64()`.

### Information Disclosed Onchain (By Design)
1. **Total Value Locked (TVL)**: The aggregate pool size is visible to verify protocol solvency.
2. **Prize Pot Size**: The distributed yield amount is public so savers know what prize is at stake.
3. **Winner Wallet Address**: Broadcast upon draw execution so the protocol can deliver the prize (can be routed to a stealth address in v2).

---

## 📈 Yield Source Mechanics (How APY Works)

In this testnet implementation on Ethereum Sepolia:
- **Testnet Yield Source**: [`MockYieldSource.sol`](file:///home/laughter/Desktop/Hackathon/aurapool/contracts/MockYieldSource.sol) simulates continuous interest accumulation based on an **8.50% APY** basis point configuration (`apyBasisPoints = 850`).
- **Production Staking Plug-in**: In mainnet deployment, pooled deposits are routed directly into lending protocols (e.g. **Aave v3**, **Compound v3**) or liquid staking derivatives (**Lido stETH**). The accrued lending interest/staking rewards are automatically harvested at each draw interval to fund the prize pot!

---

## 🚀 Quickstart & Local Testing

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Foundry](https://getfoundry.sh/) (`forge`, `anvil`, `cast`)
- MetaMask or any Web3 wallet connected to **Ethereum Sepolia**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Oluwa-Laughter/veilpool.git aurapool
cd aurapool
npm install
```

### 2. Run Foundry Test Suite
```bash
forge test -vv
```
**Output:**
```
Ran 2 test suites: 16 tests passed, 0 failed, 0 skipped (16 total tests)
[PASS] test_ClaimPrize() (gas: 742412)
[PASS] test_DepositFlow() (gas: 299286)
[PASS] test_Faucet() (gas: 59797)
[PASS] test_InitialState() (gas: 25068)
[PASS] test_MultiWinnerDraw() (gas: 2034606)
[PASS] test_RevertWhenDrawTooEarly() (gas: 464289)
[PASS] test_RevertWhenInsufficientAllowance() (gas: 44085)
[PASS] test_RevertWhenInsufficientBalance() (gas: 99182)
[PASS] test_WithdrawNoLoss() (gas: 453001)
[PASS] test_ZeroSum_NoLoss() (gas: 1173760)
```

### 3. Launch the Web Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Ethereum Sepolia Deployment

| Contract | Address | Network |
| :--- | :--- | :--- |
| **AuraPrizePool** | `0x892a012A975765796A56Ee8102D847b2C5896b20` | Ethereum Sepolia (11155111) |
| **MockYieldSource** | `0x63BC7333B39794966953289052d751079F4386A4` | Ethereum Sepolia (11155111) |
| **Confidential USDT (cUSDT)** | `0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0` | Ethereum Sepolia (11155111) |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
