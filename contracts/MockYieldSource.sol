// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockERC20.sol";

interface IVeilPrizePool {
    function fundPrizeReserve(uint256 amount) external;
}

/**
 * @title MockYieldSource
 * @notice Simulates an external DeFi yield strategy (e.g. Aave V3, Compound, Lido)
 * that generates accrued interest on the pool's deposits and streams it to the Prize Reserve.
 */
contract MockYieldSource {
    MockERC20 public immutable yieldToken;
    address public prizePool;
    address public owner;

    // Simulated Annual Percentage Yield (e.g., 850 = 8.50% APY in basis points)
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

    /**
     * @notice Simulates yield accrual and transfers harvested yield tokens to the Prize Pool.
     * @param simulatedPrincipal Principal amount upon which yield is calculated
     */
    function harvestAndFund(uint256 simulatedPrincipal) external returns (uint256) {
        require(prizePool != address(0), "Prize pool not set");
        
        uint256 timeElapsed = block.timestamp - lastHarvestTime;
        if (timeElapsed == 0) timeElapsed = 60; // Minimum 1 minute simulated yield if called back-to-back

        // Yield calculation: (Principal * APY * timeElapsed) / (10000 * 365 days)
        uint256 accruedYield = (simulatedPrincipal * apyBasisPoints * timeElapsed) / (10_000 * 365 days);
        
        // Ensure minimal test yield (e.g. at least 5 tokens with decimals) for fast demos
        uint256 minYield = 5 * (10 ** uint256(yieldToken.decimals()));
        if (accruedYield < minYield) {
            accruedYield = minYield;
        }

        lastHarvestTime = block.timestamp;
        totalYieldHarvested += accruedYield;

        // Mint simulated yield and fund prize reserve
        yieldToken.mint(address(this), accruedYield);
        yieldToken.approve(prizePool, accruedYield);
        IVeilPrizePool(prizePool).fundPrizeReserve(accruedYield);

        emit YieldHarvested(accruedYield, block.timestamp);
        return accruedYield;
    }

    /**
     * @notice Allows manual injection of yield by admin or keeper.
     */
    function manualInjectYield(uint256 amount) external {
        require(prizePool != address(0), "Prize pool not set");
        yieldToken.mint(address(this), amount);
        yieldToken.approve(prizePool, amount);
        IVeilPrizePool(prizePool).fundPrizeReserve(amount);
        totalYieldHarvested += amount;
        emit YieldHarvested(amount, block.timestamp);
    }
}
