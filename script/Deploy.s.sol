// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script, console } from "forge-std/Script.sol";
import { MockERC20 } from "../contracts/MockERC20.sol";
import { CyveraYieldSource } from "../contracts/CyveraYieldSource.sol";
import { CyveraPrizePool } from "../contracts/CyveraPrizePool.sol";

/// @notice Deploys the Cyvera stack (token + yield source + prize pool)
///         to Ethereum Sepolia in one transaction.
contract DeployCyvera is Script {
    function run() external returns (address tokenAddr, address yieldAddr, address poolAddr) {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0));
        if (deployerPrivateKey != 0) {
            vm.startBroadcast(deployerPrivateKey);
        } else {
            vm.startBroadcast();
        }

        address existingToken = vm.envOr("DEPOSIT_TOKEN", address(0));
        if (existingToken != address(0)) {
            tokenAddr = existingToken;
            console.log("Reusing existing deposit token at", tokenAddr);
        } else {
            MockERC20 token = new MockERC20("Confidential Prize Token", "cUSDT", 6);
            tokenAddr = address(token);
            console.log("Deployed MockERC20 cUSDT at", tokenAddr);
        }

        address existingYield = vm.envOr("YIELD_SOURCE", address(0));
        if (existingYield != address(0)) {
            yieldAddr = existingYield;
            console.log("Reusing existing yield source at", yieldAddr);
        } else {
            CyveraYieldSource yieldSource = new CyveraYieldSource(tokenAddr);
            yieldAddr = address(yieldSource);
            console.log("Deployed CyveraYieldSource at", yieldAddr);
        }

        CyveraPrizePool pool = new CyveraPrizePool(tokenAddr);
        poolAddr = address(pool);
        console.log("Deployed CyveraPrizePool at", poolAddr);

        if (existingYield == address(0)) {
            CyveraYieldSource(yieldAddr).setPrizePool(poolAddr);
        }
        pool.setYieldSource(yieldAddr);
        pool.setDrawInterval(60 seconds);
        pool.setWinnersPerDraw(1);

        vm.stopBroadcast();

        console.log("\n--- Cyvera Deployment Complete ---");
        console.log("NEXT_PUBLIC_DEPOSIT_TOKEN=%s", tokenAddr);
        console.log("NEXT_PUBLIC_YIELD_SOURCE_ADDRESS=%s", yieldAddr);
        console.log("NEXT_PUBLIC_CYVERA_POOL_ADDRESS=%s", poolAddr);
    }
}