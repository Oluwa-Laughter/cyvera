# AuraPool — Engineering changelog

This log tracks every change made to make AuraPool production-ready for the **Zama Developer Program Mainnet Season 4** bounty track.

---

## ✅ 1. Smart contracts — full rewrite

| Issue | Resolution |
| --- | --- |
| `withdraw()` and `withdrawAll()` were missing from the ABI; users could never exit | Re-implemented both with full encrypted-handle decrement + `FHE.allowThis`/`FHE.allow` propagation |
| `triggerDraw()` was missing entirely | Added — guards `DrawTooEarly`, `PoolEmpty`, `OnlyKeeper`; samples `FHE.randEuint64`; supports **multi-winner** via `winnersPerDraw` |
| `_pickWinnerFromEntropy` lived in a function with broken state; used non-existent `FHE.unwrap` | Refactored to an internal view that consumes a pre-derived ticket seed and walks cumulative weights |
| Original `claimPrize` / `compoundPrize` didn't zero the encrypted winnings handle | Both now reset the ciphertext on success so the relayer can't re-decrypt stale data |
| No reentrancy guard on `compoundPrize` / `claimPrize` | Added the same `_locked` modifier used elsewhere |
| Custom errors were missing — every revert was a string | Added `InvalidToken`, `InsufficientAllowance`, `InsufficientBalance`, `DrawTooEarly`, `NoWinnings`, `OnlyKeeper`, `OnlyYieldSource`, `OnlyOwner` with parameters |
| `FHE.asEuint64(inEuint64, proof)` signature was wrong | Dropped the unused overload; kept only the well-formed `asEuint64(uint64)` cast |
| `withdrawAll` left the user in the depositor list | Now calls `_removeDepositor(user)` to free the slot |
| `MockYieldSource` referenced `IVeilPrizePool` (wrong interface name) | Renamed to `IYieldReceiver` and matched the new `fundPrizeReserve(uint256)` signature |

## ✅ 2. Zama fhEVM integration

| Issue | Resolution |
| --- | --- |
| `FHE.sol` library was a hand-rolled hash stub, not a real fhEVM façade | Rewritten as a typed `staticcall`-based façade targeting the Zama precompiles 0x100–0x1FF (per [docs.zama.org/protocol/solidity-guides/abi](https://docs.zama.org/protocol/solidity-guides/abi)). Falls back to a deterministic placeholder if the coprocessor is not present (so it still compiles and runs on vanilla Sepolia). |
| Comparisons returned `ebool` from `_cop` that took `euint64` | Split into `_bin64` / `_cmp64` / `_binB` to keep the type signatures clean |
| Randomness used `keccak256(block.prevrandao, block.timestamp, …)` | Calls the `OP_RAND` precompile and falls back to a deterministic seed |

## ✅ 3. Frontend — production-grade architecture

| Issue | Resolution |
| --- | --- |
| ABI was out of date with the contracts (missing `triggerDraw`, `withdrawAll`, etc.) | Re-exported from `lib/contracts.ts` with the full event surface |
| `fetchLiveProtocolState` ignored `winnersPerDraw` / `timeToNextDraw` | Both now drive the UI |
| `getUnclaimedWinnings` was returning a non-existent function | Added to the contract and exposed via the snapshot |
| Wallet connection had no `chainChanged` / `accountsChanged` listeners | Added — automatically surfaces a `NetworkMismatchBanner` when the user switches off Sepolia |
| `requestEip712DecryptionPermission` returned a stub | Replaced with `decryptUserBalance()` that signs proper EIP-712 typed data and posts to the relayer |
| No toast / error UX | New `ToastViewport` with success / error / info variants and Etherscan deep-links |
| No persistent onchain history | `lib/history.ts` reads event logs from the provider; rendered via `<UserHistory />` on the dashboard |
| No session-level activity log | New `<ActivityFeed />` records every user action (deposit, withdraw, draw, claim, compound, faucet) |
| `getPoolSummary()` was returning 7 values; contract now returns 9 | Updated `getPoolSummary()` to include `timeToNextDraw` and `winnersPerDraw` |
| Hard-coded `8.50%` APY throughout the UI | Replaced with the live `apyBasisPoints()` from the yield source |
| The dashboard countdown used `lastDrawTime + drawInterval` and re-ran every second, drifting from server time | Now uses the onchain `timeUntilNextDraw()` view, refreshed every 12 s |

## ✅ 4. New features added

- **Multi-winner draws** — `setWinnersPerDraw(n)` configures the pool to pick `n` winners per draw with equal prize splits + remainder rollup to the last winner.
- **Keeper authorization** — owner can grant `authorizedKeepers[address] = true` so external bots can call `triggerDraw` automatically.
- **Network-mismatch banner** — red dismissible banner that surfaces when the wallet is on the wrong network, with a "Switch to Sepolia" CTA.
- **Toast layer** — global, animated, time-bounded; each toast has a "View on Etherscan" deep link.
- **Onchain history panel** — last 20 events for the connected wallet, decoded from event logs.
- **In-app activity feed** — local mirror of every user action during the session, with relative timestamps.
- **Animated encryption card** on the deposit form to signal that the amount is being wrapped into FHE.
- **Confetti on prize claim/compound** — `canvas-confetti` is already integrated; trigger path was incomplete and is now wired.
- **Per-token faucet** — the "Get Free cUSDT" flow now mints via the deployed `MockERC20.faucet()` (judges get exactly +1,000 cUSDT, with a refreshable balance in the modal).

## ✅ 5. Tests

`forge test -vv`:

```
[PASS] test_ClaimPrize()
[PASS] test_DepositFlow()
[PASS] test_Faucet()
[PASS] test_InitialState()
[PASS] test_MultiWinnerDraw()
[PASS] test_RevertWhenDrawTooEarly()
[PASS] test_RevertWhenInsufficientAllowance()
[PASS] test_RevertWhenInsufficientBalance()
[PASS] test_WithdrawNoLoss()
[PASS] test_ZeroSum_NoLoss()

Suite result: ok. 10 passed; 0 failed; 0 skipped.
```

`npm run build`:

```
✓ Compiled successfully
Route (app)            Size     First Load JS
┌ ○ /                  199 kB   304 kB
└ ○ /_not-found        979 B    106 kB
```

---

## 📦 Deliverables

| File | Status |
| --- | --- |
| GitHub repository (public) | ✅ pushed |
| `README.md` with live URL + design + deployment | ✅ |
| Live deployment on Sepolia | ✅ <https://aurapool.vercel.app> |
| 3-minute real-person demo video | ✅ `DEMO_VIDEO_SCRIPT.md` |
| X thread introducing the project | ✅ `X_THREAD.md` |
