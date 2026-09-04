// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script, console } from "forge-std/Script.sol";
import { MockERC20 } from "../contracts/MockERC20.sol";
import { CyveraYieldSource } from "../contracts/CyveraYieldSource.sol";
import { CyveraPrizePool } from "../contracts/CyveraPrizePool.sol";

/// @notice Deploys a dedicated cUSDC market (token + yield source + prize pool)
///         to Ethereum Sepolia for independent multi-vault accounting.
contract DeployUSDC is Script {
    function run() external returns (address tokenAddr, address yieldAddr, address poolAddr) {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0));
        if (deployerPrivateKey != 0) {
            vm.startBroadcast(deployerPrivateKey);
        } else {
            vm.startBroadcast();
        }

        MockERC20 usdcToken = new MockERC20("Confidential USD Coin", "cUSDC", 6);
        tokenAddr = address(usdcToken);
        console.log("Deployed MockERC20 cUSDC at", tokenAddr);

        CyveraYieldSource yieldSource = new CyveraYieldSource(tokenAddr);
        yieldAddr = address(yieldSource);
        console.log("Deployed CyveraYieldSource (cUSDC) at", yieldAddr);

        CyveraPrizePool pool = new CyveraPrizePool(tokenAddr);
        poolAddr = address(pool);
        console.log("Deployed CyveraPrizePool (cUSDC) at", poolAddr);

        yieldSource.setPrizePool(poolAddr);
        pool.setYieldSource(yieldAddr);
        pool.setDrawInterval(60 seconds);
        pool.setWinnersPerDraw(1);

        vm.stopBroadcast();

        console.log("\n--- cUSDC Deployment Complete ---");
        console.log("NEXT_PUBLIC_DEPOSIT_TOKEN_USDC=%s", tokenAddr);
        console.log("NEXT_PUBLIC_YIELD_SOURCE_ADDRESS_USDC=%s", yieldAddr);
        console.log("NEXT_PUBLIC_CYVERA_POOL_ADDRESS_USDC=%s", poolAddr);
    }
}
