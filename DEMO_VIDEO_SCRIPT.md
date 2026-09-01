# 3-minute demo video — presenter script

> **Format:** real-person pitch (face on camera), 1080p, normal speed, no AI voice.
> **Goal:** show the full cycle deposit → decrypt → draw → claim → withdraw, then explain the confidential draw mechanic.

---

## 0:00–0:20 — Cold open
- Frame: face + screen share at 50/50.
- *"Hi, I'm [name], and this is AuraPool — a no-loss prize-savings dApp where your balance stays encrypted end-to-end using Zama's FHE protocol. Let me show you the full flow on Ethereum Sepolia."*

## 0:20–0:45 — Connect & fund
- Click **Connect Wallet** → MetaMask prompts.
- *"Sepolia detected — good. The cUSDT test token has a public faucet, so I'll grab 1,000 of them with one click."*
- Click **Get Free cUSDT** → confirm in MetaMask.

## 0:45–1:30 — Deposit (confidential)
- Open the **Savings Vault** tab, enter `100`.
- *"When I hit deposit, the contract pulls my cUSDT, encrypts the amount as an `euint64` ciphertext, and stores it under my address. The onchain storage only ever holds opaque handles."*
- Click **Deposit & Enter Draws** → confirm in MetaMask.
- *"Done. Notice the UI never shows my balance on the right rail — I have to opt in."*

## 1:30–1:55 — Reveal (EIP-712)
- Click **Reveal Balance** in the top-right of the dashboard.
- *"My wallet signs an EIP-712 message delegating the Zama relayer to re-encrypt my handle to an ephemeral key. The relayer returns the ciphertext, the frontend decrypts locally."*
- Balance appears: `100.00 cUSDT`.

## 1:55–2:20 — Trigger the draw
- Open **Prize Draws** tab. *"The pool is at $100, the timer is at zero — let me execute the draw now."*
- Click **Execute Draw Now** → confirm.
- *"The contract sampled `FHE.randEuint64()` onchain, walked the encrypted cumulative balances, and picked a winner weighted by deposit size. No offchain RNG, no plaintext balance."*

## 2:20–2:40 — Claim (or withdraw)
- If you won: open **My Winnings** → **Reveal** → **Claim**.
- If you didn't: *"Let me withdraw my principal instead — same no-loss guarantee."*
- Open **Savings Vault** → **Withdraw All** → confirm.

## 2:40–3:00 — Wrap-up
- Face on camera. *"Every step — deposit, draw, claim, withdraw — was one onchain transaction. The protocol is open-source at github.com/Oluwa-Laughter/aurapool and the live URL is in the description. Thanks for watching!"*

---

## 🎬 Production notes
- Screen-record with OBS at 1080p / 30 fps. Use the **Testnet** RPC in MetaMask so judges see real blocks.
- Record audio separately in a quiet room with a lapel mic for clarity.
- B-roll suggestions: animate the ciphertext transformation with the in-app encryption card; show the Etherscan event page for the draw tx.
- Do not use any AI voice / TTS. Subtitles optional but recommended.
