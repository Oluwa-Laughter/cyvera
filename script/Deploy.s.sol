// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script, console } from "forge-std/Script.sol";
import { MockERC20 } from "../contracts/MockERC20.sol";
import { MockYieldSource } from "../contracts/MockYieldSource.sol";
import { AuraPrizePool } from "../contracts/AuraPrizePool.sol";

/// @notice Deploys the full AuraPool stack to Ethereum Sepolia (or any
///         EVM-compatible network you point `RPC_URL` at). Re-uses an
///         existing Zama testnet cUSDT address when supplied via
///         `DEPOSIT_TOKEN` so judges don't have to deploy the mock.
contract DeployAuraPool is Script {
    function run() external returns (address tokenAddr, address yieldAddr, address poolAddr) {
        // 1. Use existing Zama cUSDT if DEPOSIT_TOKEN is set, else deploy
        //    a fresh MockERC20 with 1M tokens + public `faucet()`.
        address existingToken = vm.envOr("DEPOSIT_TOKEN", address(0));
        if (existingToken != address(0)) {
            tokenAddr = existingToken;
            console.log("Reusing existing token at", tokenAddr);
        } else {
            MockERC20 token = new MockERC20("Confidential Prize Token", "cUSDT", 6);
            tokenAddr = address(token);
            console.log("Deployed MockERC20 cUSDT at", tokenAddr);
        }

        // 2. Yield source – deployed regardless; can also be reused via env
        address existingYield = vm.envOr("YIELD_SOURCE", address(0));
        if (existingYield != address(0)) {
            yieldAddr = existingYield;
        } else {
            MockYieldSource yieldSource = new MockYieldSource(tokenAddr);
            yieldAddr = address(yieldSource);
            console.log("Deployed MockYieldSource at", yieldAddr);
        }

        // 3. Deploy the prize pool
        AuraPrizePool pool = new AuraPrizePool(tokenAddr);
        poolAddr = address(pool);
        console.log("Deployed AuraPrizePool at", poolAddr);

        // 4. Wire things up
        if (existingYield == address(0)) {
            MockYieldSource(yieldAddr).setPrizePool(poolAddr);
        }
        pool.setYieldSource(yieldAddr);

        // 5. Initial configuration – hourly draws, 1 winner per draw
        pool.setDrawInterval(1 hours);
        pool.setWinnersPerDraw(1);

        // 6. Print next steps for the user
        console.log("\n--- Next steps ---");
        console.log("1. Set the env vars on your dApp:");
        console.log("   NEXT_PUBLIC_AURA_POOL_ADDRESS=%s", poolAddr);
        console.log("   NEXT_PUBLIC_DEPOSIT_TOKEN=%s", tokenAddr);
        console.log("   NEXT_PUBLIC_YIELD_SOURCE_ADDRESS=%s", yieldAddr);
        console.log("2. (Optional) Fund the yield reserve by calling");
        console.log("   MockYieldSource(%s).manualInjectYield(500_000000);", yieldAddr);
        console.log("3. After the first deposit, call");
        console.log("   AuraPrizePool(%s).triggerDraw();", poolAddr);
    }
}
