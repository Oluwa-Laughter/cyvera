// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/MockERC20.sol";
import "../contracts/MockYieldSource.sol";
import "../contracts/AuraPrizePool.sol";

contract DeployAuraPool {
    function run() external returns (address tokenAddr, address yieldAddr, address poolAddr) {
        // 1. Deploy MockERC20 (cUSDT) or attach to official Zama token on Sepolia
        MockERC20 token = new MockERC20("Confidential Prize Token", "cUSDT", 6);
        tokenAddr = address(token);

        // 2. Deploy MockYieldSource
        MockYieldSource yieldSource = new MockYieldSource(tokenAddr);
        yieldAddr = address(yieldSource);

        // 3. Deploy AuraPrizePool
        AuraPrizePool prizePool = new AuraPrizePool(tokenAddr);
        poolAddr = address(prizePool);

        // 4. Link contracts
        yieldSource.setPrizePool(poolAddr);
        prizePool.setYieldSource(yieldAddr);
    }
}
