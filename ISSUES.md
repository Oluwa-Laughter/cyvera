# VeilPrize Sprint Issues & Milestones

This document tracks the technical issues and milestone completion for **VeilPrize (Confidential Prize Savings App)** submitted to the **Zama Developer Program Mainnet Season 4 - Bounty Track**.

---

###  Issue #1: Smart Contract Architecture & Zama fhEVM Design
- [x] Implement standard ERC-20 token (`MockERC20.sol`) with a 1-click testnet faucet (`faucet()`)
- [x] Design Zama fhEVM FHE library interface (`FHE.sol`) with custom types `euint64`, `ebool`, `inEuint64`
- [x] Implement `VeilPrizePool.sol` supporting encrypted deposits, non-custodial savings, and EIP-712 decryption permissions
- [x] Implement non-reentrancy protection and principal preservation guarantee

###  Issue #2: FHE Deposit-Weighted Draw Engine & Entropy
- [x] Design provably fair deposit-weighted winner selection over encrypted cumulative intervals
- [x] Generate verifiable onchain entropy using `FHE.randEuint64()`
- [x] Award winner confidentially using homomorphic conditional selection (`FHE.select`)
- [x] Grant winner-only EIP-712 decryption rights for claimed prize allocations

###  Issue #3: Smart Contract Testing Suite (Foundry & Hardhat)
- [x] Write Foundry unit & integration tests (`test/VeilPrizePool.t.sol`)
- [x] Verify initial contract state and faucet mechanics
- [x] Test confidential deposit wrapping and depositor registration
- [x] Test 100% no-loss principal withdrawal & complete pool exit
- [x] Test yield injection, automated draw trigger, and prize payout calculations (5/5 tests passing)

###  Issue #4: Next.js 15 Web3 dApp Frontend Scaffold
- [x] Configure Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS
- [x] Build dark cyberpunk/fintech glassmorphism theme with neon cyan and emerald glowing accents
- [x] Setup global layout, custom scrollbars, and metadata

###  Issue #5: Wallet Connection, Faucet & Confidential Vault UI
- [x] Integrate Web3 wallet connection (MetaMask / EIP-1193 / Ethers / Viem)
- [x] Build 1-click testnet cUSDT faucet modal for judges
- [x] Create interactive deposit card with percentage presets (25%, 50%, 75%, 100%)
- [x] Implement interactive EIP-712 Decryption Toggle (Eye icon) to decrypt shielded onchain principal

###  Issue #6: Onchain FHE Draw Engine & Winnings Settlement
- [x] Build live Draw Status card with countdown timer to next draw
- [x] Implement manual/keeper "Execute Onchain Draw" trigger button
- [x] Render Recent Completed Draws table with winner records and prize amounts
- [x] Create "My Prize Rewards" card with 1-click EIP-712 decryption of winnings
- [x] Add "Claim Prize to Wallet" and "Auto-Compound to Principal" with confetti celebrations

###  Issue #7: Mock Yield Source & DeFi Strategy Simulator
- [x] Implement `MockYieldSource.sol` with dynamic APY basis points (8.50% APY)
- [x] Build frontend Yield Strategy simulator with streaming APY calculator
- [x] Add "Harvest APY Yield Stream" and custom yield injection tools for demonstration

###  Issue #8: Comprehensive Documentation & Submission Deliverables
- [x] Document protocol mechanics, mathematical proofs, and confidentiality analysis
- [x] Draft 3-minute video demo pitch script (real-person presentation ready)
- [x] Draft announcement thread for X (Twitter)
