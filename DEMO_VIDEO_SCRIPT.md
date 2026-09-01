# 🎥 AuraPool: 3-Minute Demonstration Video Pitch Script

> **Zama Developer Program Mainnet Season 4 Bounty Track**  
> *Format: Real-person live walkthrough (max 3 minutes, normal speed, no AI voice).*

---

## ⏱️ Video Structure Breakdown (180 Seconds Total)

| Timestamp | Section | Visual on Screen | Key Points Spoken |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:30** | **The Hook & Problem** | AuraPool Landing Page | Traditional lotteries vs Transparent Blockchains. Why privacy matters in prize savings. |
| **0:30 - 1:00** | **Connect & Deposit** | Faucet Modal $\rightarrow$ Savings Vault | Direct wallet connect, claiming 1,000 cUSDT from faucet, depositing $500 into confidential vault. |
| **1:00 - 1:30** | **Confidential Balances** | Dashboard & Eye Toggle | How balances are encrypted as `euint64`. EIP-712 typed signature to reveal private balance. |
| **1:30 - 2:00** | **Onchain FHE Draw** | Prize Draws View | How draws execute onchain using Zama's `FHE.randEuint64()` weighted by deposit size without data leakage. |
| **2:00 - 2:30** | **Winning & Claiming** | My Winnings View | Checking private winnings, claiming to wallet or auto-compounding for more tickets. |
| **2:30 - 3:00** | **No-Loss Exit & Outro** | Savings Vault $\rightarrow$ Withdraw | 1-click instant 100% principal withdrawal, verified zero loss, closing vision. |

---

## 🎙️ Word-for-Word Presenter Script

### 🎬 Part 1: The Hook & Introduction (0:00 – 0:30)
> *"Hello everyone! Welcome to AuraPool — the next-generation Confidential No-Loss Prize Savings Protocol, built for the Zama Developer Program Season 4 Mainnet Bounty Track.*
> 
> *In traditional lotteries, 99.9% of players lose their money forever. But on transparent blockchains like Ethereum, protocols like PoolTogether introduce a massive new problem: every deposit, every balance, and every winner is publicly broadcast on Etherscan, exposing user wealth and turning winners into targets for hacks and phishing.*
> 
> *AuraPool fixes this using Zama's Fully Homomorphic Encryption, enabling a true no-loss savings game where your balance and your winnings stay 100% confidential."*

---

### 🎬 Part 2: Wallet Connection & Confidential Deposit (0:30 – 1:00)
> *(Action: Click "Connect Wallet", prompt seamlessly connects on Sepolia.)*
> *"Let's connect our wallet directly to Ethereum Sepolia. To make testing effortless for judges, we built an integrated testnet faucet. With one click, I can mint 1,000 cUSDT test tokens directly to my wallet.*
> 
> *(Action: Navigate to Savings Vault, type $500, click "Deposit & Win".)*
> *Now let's deposit $500 into the USD High-Yield Savings Vault. Behind the scenes, the smart contract takes our deposit and wraps it into an encrypted `euint64` handle using Zama fhEVM. No outside observer can inspect our deposit size or track our share of the pool."*

---

### 🎬 Part 3: Confidential Balances & EIP-712 Decryption (1:00 – 1:30)
> *(Action: Go to Dashboard, show the masked balance `•••••••• cUSDT`.)*
> *"On the Dashboard, notice how our savings balance is masked by default. To decrypt our balance, we simply click 'Reveal Balance'.*
> 
> *(Action: Click "Reveal Balance", approve the EIP-712 signature.)*
> *This triggers an EIP-712 typed signature that queries Zama's Key Management Service. Only our wallet holds the cryptographic authority to decrypt our funds. We now see our real deposited balance, which gives us active tickets in every upcoming daily draw."*

---

### 🎬 Part 4: Onchain FHE Draw & Provable Fairness (1:30 – 2:00)
> *(Action: Switch to "Prize Draws" view.)*
> *"Now let's look at the Prize Draws tab. While our money sits in the vault, it earns 8.50% APY from decentralized lending markets. That interest creates our daily prize pot.*
> 
> *Every 24 hours, an automated draw executes onchain using Zama's `FHE.randEuint64()` entropy. The winner selection is computed homomorphically over encrypted balances. Winner odds are strictly proportional to deposit size, but the smart contract never leaks individual account balances to the public!"*

---

### 🎬 Part 5: Secret Winnings, Claiming & Auto-Compounding (2:00 – 2:30)
> *(Action: Switch to "My Winnings" view, show the revealed prize winnings.)*
> *"When a draw concludes, only the winner receives the encrypted prize credit. In 'My Winnings', I can verify if I won with a single click.*
> 
> *(Action: Click "Claim Prize to Wallet" or "Auto-Compound" with confetti trigger.)*
> *I can either claim my winnings directly to my wallet or auto-compound them back into my savings principal to earn even more tickets for tomorrow's draw."*

---

### 🎬 Part 6: Zero-Loss Principal Withdrawal & Closing (2:30 – 3:00)
> *(Action: Return to Savings Vault, select Withdraw, click "MAX", click "Withdraw Instantly".)*
> *"Finally, the most important guarantee of AuraPool: The No-Loss Invariant.*
> 
> *If I ever want my money back, I can withdraw 100% of my deposited principal at any time with zero penalties and zero lockups. My original tokens return safely to my wallet.*
> 
> *AuraPool combines the excitement of prize savings with the mathematical security of Zama FHE. Thank you for watching, and try the live dApp on Sepolia today!"*
