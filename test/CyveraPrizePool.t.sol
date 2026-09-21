// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import { MockERC20 } from "../contracts/MockERC20.sol";
import { CyveraYieldSource } from "../contracts/CyveraYieldSource.sol";
import { CyveraPrizePool } from "../contracts/CyveraPrizePool.sol";

contract CyveraPrizePoolTest is Test {
    MockERC20 public token;
    CyveraYieldSource public yieldSource;
    CyveraPrizePool public pool;

    address public alice = address(0xA11CE);
    address public bob = address(0xB0B);
    address public charlie = address(0xC0C);

    function setUp() public {
        token = new MockERC20("Confidential Prize Token", "cUSDT", 6);
        yieldSource = new CyveraYieldSource(address(token));
        pool = new CyveraPrizePool(address(token));

        yieldSource.setPrizePool(address(pool));
        pool.setYieldSource(address(yieldSource));

        token.mint(alice, 10_000 * 10 ** 6);
        token.mint(bob, 10_000 * 10 ** 6);
        token.mint(charlie, 10_000 * 10 ** 6);
    }

    function _deposit(address user, uint256 amount) internal {
        vm.prank(user);
        token.approve(address(pool), amount);
        vm.prank(user);
        pool.deposit(amount);
    }

    function _warpToNextDraw() internal {
        vm.warp(block.timestamp + pool.drawInterval() + 1);
    }

    function test_InitialState() public view {
        require(address(pool.depositToken()) == address(token), "Deposit token mismatch");
        require(pool.getDepositorCount() == 0, "Initial depositors");
        require(pool.totalPrizeReserve() == 0, "Initial prize reserve");
        require(pool.totalDeposits() == 0, "Initial deposits");
    }

    function test_Faucet() public {
        address newUser = address(0x1234);
        token.mint(newUser, 1_000 * 10 ** 6);
        require(token.balanceOf(newUser) == 1_000 * 10 ** 6, "Faucet balance mismatch");
    }

    function test_DepositFlow() public {
        uint256 amt = 500 * 10 ** 6;
        _deposit(alice, amt);
        require(pool.getDepositorCount() == 1, "Depositor count");
        require(pool.totalDeposits() == amt, "Total deposits");
        require(pool.isUserDepositor(alice), "Should be depositor");
        require(pool.getEncryptedBalanceHandle(alice) != bytes32(0), "Encrypted handle set");
    }

    function test_WithdrawExact() public {
        uint256 amt = 1_000 * 10 ** 6;
        _deposit(alice, amt);

        vm.prank(alice);
        pool.withdraw(500 * 10 ** 6);
        require(pool.totalDeposits() == 500 * 10 ** 6, "Remaining deposits");
        require(pool.totalWithdrawn() == 500 * 10 ** 6, "Withdrawn counter");
        require(pool.getDepositorCount() == 1, "Still a depositor");

        vm.prank(alice);
        pool.withdraw(500 * 10 ** 6);
        require(pool.totalDeposits() == 0, "Deposits after full withdraw");
        require(pool.getDepositorCount() == 0, "Depositor count after full withdraw");
        require(token.balanceOf(alice) == 10_000 * 10 ** 6, "Refund total");
    }

    function test_ZeroSum_NoLoss() public {
        uint256 amt = 1_000 * 10 ** 6;
        _deposit(alice, amt);
        _deposit(bob, amt);
        _deposit(charlie, amt);

        yieldSource.manualInjectYield(150 * 10 ** 6);
        _warpToNextDraw();
        pool.triggerDraw();
        require(pool.totalPrizeReserve() == 0, "Prize reserve drained");
        require(pool.totalPrizesAwarded() == 150 * 10 ** 6, "Prizes awarded");
        require(pool.totalDeposits() == 3_000 * 10 ** 6, "Principal untouched");
    }

    function test_MultiWinnerDraw() public {
        for (uint256 i = 0; i < 5; i++) {
            address u = address(uint160(0x1000 + i));
            token.mint(u, 1_000 * 10 ** 6);
            _deposit(u, 100 * 10 ** 6);
        }

        yieldSource.manualInjectYield(100 * 10 ** 6);
        pool.setWinnersPerDraw(2);

        _warpToNextDraw();
        pool.triggerDraw();

        require(pool.totalPrizesAwarded() == 100 * 10 ** 6, "Total prizes");
    }

    function test_DrawPicksOneOfDepositors() public {
        _deposit(alice, 1_000 * 10 ** 6);
        _deposit(bob, 1_000 * 10 ** 6);
        yieldSource.manualInjectYield(50 * 10 ** 6);

        _warpToNextDraw();
        pool.triggerDraw();

        // In a confidential pool, winner is NOT leaked onchain for multi-saver pools
        address winner = pool.getLastDrawWinner(1);
        require(winner == address(0), "Winner remains confidential onchain");

        // Both participants have deterministic thresholds computed without modulo bias
        uint128 aliceThresh = pool.thresholdFor(1, alice, 2);
        uint128 bobThresh = pool.thresholdFor(1, bob, 2);
        require(aliceThresh <= 2_000 * 10 ** 6, "Alice ordinary threshold in range");
        require(bobThresh <= 2_000 * 10 ** 6, "Bob ordinary threshold in range");

        // Encrypted winnings handles in simulation reflect that at least one participant won
        bytes32 aliceWinnings = pool.getEncryptedWinningsHandle(alice);
        bytes32 bobWinnings = pool.getEncryptedWinningsHandle(bob);
        require(aliceWinnings != bytes32(0) || bobWinnings != bytes32(0), "At least one saver won and accrued encrypted winnings");
    }

    function test_ClaimPrize() public {
        _deposit(alice, 1_000 * 10 ** 6);
        yieldSource.manualInjectYield(50 * 10 ** 6);

        _warpToNextDraw();
        pool.triggerDraw();

        address winner = pool.getLastDrawWinner(1);
        require(winner == alice, "Alice should win with only depositor");

        uint256 beforeBal = token.balanceOf(winner);
        vm.prank(winner);
        pool.claimPrize(50 * 10 ** 6);
        uint256 afterBal = token.balanceOf(winner);
        require(afterBal - beforeBal == 50 * 10 ** 6, "Claimed amount");
    }

    function test_RevertWhenDrawTooEarly() public {
        _deposit(alice, 100 * 10 ** 6);
        yieldSource.manualInjectYield(10 * 10 ** 6);
        vm.expectRevert();
        pool.triggerDraw();
    }

    function test_RevertWhenInsufficientAllowance() public {
        vm.prank(alice);
        vm.expectRevert();
        pool.deposit(100 * 10 ** 6);
    }

    function test_RevertWhenInsufficientBalance() public {
        address poor = address(0x9999);
        vm.prank(poor);
        token.approve(address(pool), 100 * 10 ** 6);
        vm.prank(poor);
        vm.expectRevert();
        pool.deposit(100 * 10 ** 6);
    }

    function test_GettersExposeHandles() public {
        _deposit(alice, 100 * 10 ** 6);
        bytes32 bal = pool.getEncryptedBalanceHandle(alice);
        bytes32 allowed = pool.getWithdrawAllowedHandle(alice, 50 * 10 ** 6);
        require(bal != bytes32(0), "Balance handle set");
        require(allowed != bytes32(0), "Withdraw allowed handle set");
    }

    function test_DepositAfterWithdrawPreservesAccounting() public {
        _deposit(alice, 1_000 * 10 ** 6);
        vm.prank(alice);
        pool.withdraw(400 * 10 ** 6);
        require(pool.totalDeposits() == 600 * 10 ** 6, "After partial withdraw");

        _deposit(alice, 200 * 10 ** 6);
        require(pool.totalDeposits() == 800 * 10 ** 6, "After subsequent deposit");
        require(pool.getDepositorCount() == 1, "Still a depositor");
    }

    function test_3TierThresholdCalculation() public {
        _deposit(alice, 500 * 10 ** 6);
        _deposit(bob, 500 * 10 ** 6);
        yieldSource.manualInjectYield(100 * 10 ** 6);
        _warpToNextDraw();
        pool.triggerDraw();

        // Total deposits: 1,000 * 10^6
        // Tier 0 (Grand, k=100): upper bound = 100,000 * 10^6
        // Tier 1 (Middle, k=10): upper bound = 10,000 * 10^6
        // Tier 2 (Ordinary, k=1): upper bound = 1,000 * 10^6
        uint128 grandThresh = pool.thresholdFor(1, alice, 0);
        uint128 midThresh = pool.thresholdFor(1, alice, 1);
        uint128 ordThresh = pool.thresholdFor(1, alice, 2);

        require(grandThresh <= 100_000 * 10 ** 6, "Grand threshold upper bound");
        require(midThresh <= 10_000 * 10 ** 6, "Middle threshold upper bound");
        require(ordThresh <= 1_000 * 10 ** 6, "Ordinary threshold upper bound");

        (uint64 grandPrize, uint128 grandK) = pool.getTierInfo(0);
        (uint64 midPrize, uint128 midK) = pool.getTierInfo(1);
        (uint64 ordPrize, uint128 ordK) = pool.getTierInfo(2);

        require(grandK == 100, "Grand k must be 100");
        require(midK == 10, "Middle k must be 10");
        require(ordK == 1, "Ordinary k must be 1");
        require(grandPrize == 50 * 10 ** 6, "Grand prize 50%");
        require(midPrize == 30 * 10 ** 6, "Middle prize 30%");
        require(ordPrize == 20 * 10 ** 6, "Ordinary prize 20%");
    }

    function test_PermissionlessAccrue() public {
        _deposit(alice, 1_000 * 10 ** 6);
        yieldSource.manualInjectYield(50 * 10 ** 6);
        _warpToNextDraw();
        pool.triggerDraw();

        address randomKeeper = address(0x777);
        vm.prank(randomKeeper);
        bool alreadyAccrued = pool.accrue(alice, 1);
        require(!alreadyAccrued, "Already accrued in triggerDraw");
    }

    function test_SetTiersValidation() public {
        uint64[3] memory validPrizes = [uint64(500), uint64(300), uint64(200)];
        uint128[3] memory validK = [uint128(100), uint128(10), uint128(1)];
        pool.setTiers(validPrizes, validK);

        // Invalid: k not strictly decreasing
        uint128[3] memory invalidK = [uint128(10), uint128(10), uint128(1)];
        vm.expectRevert();
        pool.setTiers(validPrizes, invalidK);

        // Invalid: prizes not strictly decreasing
        uint64[3] memory invalidPrizes = [uint64(200), uint64(300), uint64(500)];
        vm.expectRevert();
        pool.setTiers(invalidPrizes, validK);
    }
}