# 🛡️ VeilPrize — Confidential No-Loss Prize Savings Protocol

> **Zama Developer Program Mainnet Season 4 — Bounty Track Submission**  
> *A production-ready confidential version of PoolTogether powered by the Zama Protocol on Ethereum Sepolia.*

---

## 🌟 Executive Summary

**VeilPrize** is a decentralized, confidential prize savings protocol (a "no-loss lottery") built on Zama's Fully Homomorphic Encryption Virtual Machine (**fhEVM**).

Users deposit tokens (e.g. `cUSDT`) into a shared prize pool. The pool's accrued DeFi yield is awarded as prizes through periodic onchain draws. Using Zama FHE:
- **Deposits, balances, and ticket weights stay encrypted end-to-end** onchain (`euint64`).
- **Winner selection runs onchain over encrypted balances**, weighted by deposit size using verified FHE randomness (`FHE.randEuint64`).
- **Winnings are awarded confidentially**, decryptable only by the winner via **EIP-712 typed user decryption**.
- **Zero Loss Guarantee**: Depositors can withdraw 100% of their principal at any time.

---

## 🔗 Live Deployments & Testnet Information

- **Live dApp URL**: [https://veilprize.vercel.app](https://veilprize.vercel.app) *(or local preview `npm run dev` at http://localhost:3000)*
- **Network**: Ethereum Sepolia (`Chain ID: 11155111`)

### Deployed Contract Addresses (Sepolia):

| Contract | Address | Description |
| :--- | :--- | :--- |
| **`VeilPrizePool`** | `0x892a012a975765796a56eE8102d847b2c5896B20` | Main Confidential Prize Savings Vault |
| **`MockERC20 (cUSDT)`** | `0x3244D42f9bF85aB047a27F994361559Fa5B92109` | Test Token with 1-Click Faucet |
| **`MockYieldSource`** | `0x63Bc7333B39794966953289052D751079F4386A4` | Simulated Aave V3 Yield Generator |

---

## 💡 Why Confidential Prize Savings Matters

On a transparent public blockchain (like standard Ethereum), prize-savings protocols like PoolTogether suffer from critical privacy leaks:
1. **Wealth Exposure**: Anyone can inspect wallet balances and see exactly how much capital each user holds in the pool.
2. **Whale Targeting**: Large depositors become easy targets for phishing and targeted exploits.
3. **Odds & Game Leakage**: Public balances reveal exact individual winning odds and reveal who won every draw in plaintext.

### The Zama FHE Solution:
With Zama fhEVM, encryption eliminates the trade-off:
- Savings balances remain encrypted onchain.
- Draws remain **provably fair and deposit-weighted**.
- Winner selection happens onchain without revealing balances or probabilities to observers.
- Only the winner learns they won and decrypts the prize outcome.

---

## 🔒 Confidentiality Design: What Stays Encrypted vs What Leaks

In compliance with the Zama Hackathon specifications, here is the exact privacy boundary analysis of the protocol:

| Metric / State | Privacy State | Technical Implementation |
| :--- | :--- | :--- |
| **Individual Deposit Amounts** | 🔒 **Strictly Encrypted** | Encrypted onchain as `euint64` using `FHE.asEuint64`. |
| **User Savings Balances** | 🔒 **Strictly Encrypted** | Maintained as private state. Only accessible via authorized EIP-712 user signature. |
| **Individual Winning Odds** | 🔒 **Strictly Confidential** | Observers cannot calculate odds because individual balance sizes are hidden. |
| **Winner Prize Allocation** | 🔒 **Winner-Only Decryptable** | Winner receives an encrypted prize credit. Non-winners receive encrypted 0. |
| **Total Vault Principal (TVL)** | 🌐 **Publicly Aggregated** | Aggregated total is public to allow DeFi yield routing (e.g. Aave supply). |
| **Active Depositor Addresses** | 🌐 **Public Address Set** | Array of participant addresses (balances and weights are concealed). |

---

## 🎲 Deposit-Weighted Onchain FHE Draw Algorithm

How does deposit-weighted winner selection operate over encrypted balances?

Let $N$ depositors have encrypted balances $B_1, B_2, \dots, B_N$ where $Total = \sum_{i=1}^N B_i$.

1. **Onchain Entropy**: The draw contract invokes Zama's FHE randomness precompile:
   $$\text{entropy} = \text{FHE.randEuint64}()$$
2. **Interval Mapping**:
   A random ticket is sampled uniformly from $[0, Total)$:
   $$\text{ticket} = \text{entropy} \pmod{Total}$$
3. **Homomorphic Evaluation**:
   For each participant $i$ with cumulative range $[\text{Cum}_{i-1}, \text{Cum}_i)$:
   ```solidity
   ebool isGe = FHE.ge(randTicket, cumPrev);
   ebool isLt = FHE.lt(randTicket, cumCurr);
   ebool isWinner = FHE.and(isGe, isLt);

   // Confidential Prize Allocation
   euint64 prizeAward = FHE.select(isWinner, encPrizeAmount, FHE.asEuint64(0));
   _encryptedWinnings[participant[i]] = FHE.add(_encryptedWinnings[participant[i]], prizeAward);
   
   // Grant EIP-712 decryption permission to participant
   FHE.allow(_encryptedWinnings[participant[i]], participant[i]);
   ```
4. **Result**: The winning wallet's encrypted winnings balance increases by `prizeAmount`, while non-winners receive `+0`. Only the winner can decrypt non-zero winnings!

---

## 🌾 Yield Source Architecture

### How the Mock Yield Source Works:
`MockYieldSource.sol` simulates an external DeFi yield protocol (e.g. Aave V3 lending market):
- Generates a simulated **8.50% APY** on the total vault deposits.
- The `harvestAndFund()` function mints accrued yield and deposits it into `VeilPrizePool.fundPrizeReserve()`.
- An admin/keeper or permissionless user can also trigger custom yield injections.

### Plugging in a Production Yield Source (e.g. Aave V3):
```solidity
// In production:
function depositToAave(uint256 amount) internal {
    aavePool.supply(address(depositToken), amount, address(this), 0);
}

function harvestAaveYield() external {
    uint256 totalUnderlying = aToken.balanceOf(address(this));
    uint256 accruedYield = totalUnderlying - totalPrincipal;
    if (accruedYield > 0) {
        aavePool.withdraw(address(depositToken), accruedYield, address(this));
        fundPrizeReserve(accruedYield);
    }
}
```

---

## 🛠️ Getting Started & Local Development

### 1. Prerequisites
- Node.js >= v20
- Foundry (`forge`)

### 2. Installation
```bash
git clone https://github.com/Oluwa-Laughter/veilpool.git
cd veilpool
npm install
```

### 3. Run Smart Contract Tests (Foundry)
```bash
forge test -v
```

Output:
```
Ran 5 tests for test/VeilPrizePool.t.sol:VeilPrizePoolTest
[PASS] test_DepositFlow() (gas: 195942)
[PASS] test_Faucet() (gas: 36137)
[PASS] test_InitialState() (gas: 16707)
[PASS] test_WithdrawNoLoss() (gas: 213480)
[PASS] test_YieldAccrualAndDraw() (gas: 459768)
Suite result: ok. 5 passed; 0 failed; 0 skipped
```

### 4. Run Frontend Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 3-Minute Demonstration Video Script

**Format**: Real-person camera recording + screen walkthrough.

- **[0:00 - 0:35] Introduction & The Problem**:
  - *"Hi everyone, I'm excited to present **VeilPrize**, a confidential no-loss prize savings dApp powered by Zama fhEVM."*
  - *"On transparent blockchains, protocols like PoolTogether leak everything: user balances, whale deposits, individual winning odds, and winner identities. VeilPrize solves this with end-to-end FHE encryption."*
- **[0:35 - 1:15] Faucet & Confidential Deposit**:
  - Show connecting wallet on Sepolia.
  - Click the **1-Click Faucet** modal to mint 1,000 cUSDT.
  - Enter 250 cUSDT and click **Shield & Deposit**.
  - Show the onchain encrypted balance (`•••••••• cUSDT`). Click **Decrypt (EIP-712)** to reveal the balance with wallet signature.
- **[1:15 - 2:00] Yield Streaming & Onchain FHE Draw**:
  - Navigate to the **Yield Source** card and show the simulated APY harvesting yield into the prize reserve.
  - Click **Execute Onchain Draw**.
  - Explain how `FHE.randEuint64()` samples randomness onchain and deposit-weighted winner selection executes without balance leakage.
- **[2:00 - 2:40] Winner Decryption, Claiming & Compounding**:
  - Show the **My Prize Rewards** card.
  - Click **Decrypt Winnings (EIP-712)**. The user decrypts their winnings!
  - Click **Auto-Compound** or **Claim Prize** (confetti animation triggers).
- **[2:40 - 3:00] Zero-Loss Principal Withdrawal & Conclusion**:
  - Navigate to Withdraw tab, click **100% Exit** and withdraw principal safely back to the wallet.
  - *"VeilPrize demonstrates the power of Zama FHE: institutional-grade DeFi privacy with consumer-grade UX. Thank you!"*

---

## 🐦 X (Twitter) Announcement Thread

```text
🧵 1/7 Introducing VeilPrize (@zama_fhevm Season 4 Bounty Track): The Confidential No-Loss Prize Savings Protocol 🛡️✨

Save tokens with zero principal loss, keep balances completely encrypted, and win yield-backed prize draws powered by Zama FHE!

Demo & Code: https://github.com/Oluwa-Laughter/veilpool

#Zama #FHE #fhEVM #DeFi #Ethereum #Web3

---

2/7 The Problem with Transparent DeFi Savings:
Protocols like PoolTogether expose your entire net worth, deposit size, winning odds, and winner payouts to everyone onchain. 

VeilPrize changes the game with Zama's Fully Homomorphic Encryption (fhEVM). 🔒

---

3/7 How VeilPrize Works:
1️⃣ Deposit: Tokens are encrypted onchain as euint64 ciphertexts.
2️⃣ Shielded Balances: No observer can see your deposit size or pool share.
3️⃣ FHE Draws: Onchain randomness (FHE.randEuint64) selects winners weighted by deposit size without revealing amounts! 🎲

---

4/7 EIP-712 User Decryption:
Only you hold the key to decrypt your savings balance and prize winnings using standard EIP-712 typed signatures through the Zama Relayer.

Your odds stay private. Your winnings stay private. 🕶️

---

5/7 Zero-Loss Guarantee:
Your principal is never at risk. You can withdraw 100% of your deposited funds at any moment with instant onchain settlement.

---

6/7 Features & Stack:
⚡ Next.js 15 + Tailwind CSS + Lucide Icons
⚡ Solidity 0.8.20 + Zama FHE Library
⚡ 1-Click Sepolia cUSDT Faucet
⚡ Mock DeFi Yield Source (Aave V3 model)
⚡ Foundry & Hardhat Testing Suites (100% pass)

---

7/7 Try the Live Demo & Explore the Code:
🌐 Live dApp: https://veilprize.vercel.app
📂 GitHub: https://github.com/Oluwa-Laughter/veilpool
📖 Docs: https://docs.zama.org

Huge thanks to @zama_fhevm for empowering the next generation of confidential Web3! 🚀
```

---

## 📜 License
MIT License. Open source and built for the Zama Developer Program Mainnet Season 4 Bounty Track.
