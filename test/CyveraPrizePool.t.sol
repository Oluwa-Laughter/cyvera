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

        address winner = pool.getLastDrawWinner(1);
        require(winner == alice || winner == bob, "Winner is one of depositors");
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
}