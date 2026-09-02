// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MockERC20 } from "./MockERC20.sol";

interface IYieldReceiver {
    function fundPrizeReserve(uint256 amount) external;
}

/// @title CyveraYieldSource
/// @notice Simulates a yield-bearing DeFi strategy (Aave V3 / Compound / Lido).
///         Yield is generated and streamed to the Cyvera prize reserve without
///         ever touching depositor principal. In production this contract connects
///         to Aave V3 / Euler / Morpho to harvest real supply APY into the prize pool.
contract CyveraYieldSource {
    MockERC20 public immutable yieldToken;
    address public prizePool;
    address public owner;

    uint256 public apyBasisPoints = 850; // 8.5%
    uint256 public lastHarvestTime;
    uint256 public totalYieldHarvested;

    event YieldHarvested(uint256 amount, uint256 timestamp);
    event YieldRateUpdated(uint256 newApyBasisPoints);
    event PrizePoolUpdated(address newPrizePool);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _yieldToken) {
        require(_yieldToken != address(0), "Invalid token");
        yieldToken = MockERC20(_yieldToken);
        owner = msg.sender;
        lastHarvestTime = block.timestamp;
    }

    function setPrizePool(address _prizePool) external onlyOwner {
        require(_prizePool != address(0), "Invalid pool");
        prizePool = _prizePool;
        emit PrizePoolUpdated(_prizePool);
    }

    function setApy(uint256 _apyBasisPoints) external onlyOwner {
        require(_apyBasisPoints <= 5000, "Max 50% APY");
        apyBasisPoints = _apyBasisPoints;
        emit YieldRateUpdated(_apyBasisPoints);
    }

    function harvestAndFund(uint256 simulatedPrincipal) external returns (uint256) {
        require(prizePool != address(0), "Prize pool not set");

        uint256 timeElapsed = block.timestamp - lastHarvestTime;
        if (timeElapsed == 0) timeElapsed = 60;

        uint256 accruedYield = (simulatedPrincipal * apyBasisPoints * timeElapsed) / (10_000 * 365 days);

        uint256 minYield = 5 * (10 ** uint256(yieldToken.decimals()));
        if (accruedYield < minYield) accruedYield = minYield;

        lastHarvestTime = block.timestamp;
        totalYieldHarvested += accruedYield;

        yieldToken.mint(address(this), accruedYield);
        yieldToken.approve(prizePool, accruedYield);
        IYieldReceiver(prizePool).fundPrizeReserve(accruedYield);

        emit YieldHarvested(accruedYield, block.timestamp);
        return accruedYield;
    }

    function manualInjectYield(uint256 amount) external returns (uint256) {
        require(prizePool != address(0), "Prize pool not set");
        yieldToken.mint(address(this), amount);
        yieldToken.approve(prizePool, amount);
        IYieldReceiver(prizePool).fundPrizeReserve(amount);
        totalYieldHarvested += amount;
        emit YieldHarvested(amount, block.timestamp);
        return amount;
    }
}

/// @notice Backward compatibility alias for MockYieldSource
contract MockYieldSource is CyveraYieldSource {
    constructor(address _yieldToken) CyveraYieldSource(_yieldToken) {}
}
