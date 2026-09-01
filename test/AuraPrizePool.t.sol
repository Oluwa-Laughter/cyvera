// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import { MockERC20 } from "../contracts/MockERC20.sol";
import { MockYieldSource } from "../contracts/MockYieldSource.sol";
import { AuraPrizePool } from "../contracts/AuraPrizePool.sol";

contract AuraPrizePoolTest is Test {
    MockERC20 public token;
    MockYieldSource public yieldSource;
    AuraPrizePool public pool;

    address public alice = address(0xA11CE);
    address public bob = address(0xB0B);
    address public charlie = address(0xC0C);

    function setUp() public {
        token = new MockERC20("Confidential Prize Token", "cUSDT", 6);
        yieldSource = new MockYieldSource(address(token));
        pool = new AuraPrizePool(address(token));

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
        // Sync the off-chain entropy cache used by the draw winner
        // selection. In production this value is supplied by the relayer
        // which re-encrypts every user's balance through EIP-712.
        pool.setPublicSafeBalance(user, amount);
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
    }

    function test_WithdrawNoLoss() public {
        uint256 amt = 1_000 * 10 ** 6;
        _deposit(alice, amt);

        vm.prank(alice);
        pool.withdraw(500 * 10 ** 6);
        require(pool.totalDeposits() == 500 * 10 ** 6, "Remaining deposits");
        require(pool.getDepositorCount() == 1, "Still a depositor");

        vm.prank(alice);
        pool.withdrawAll();
        require(pool.totalDeposits() == 0, "Deposits after withdrawAll");
        require(pool.getDepositorCount() == 0, "Depositor count after withdrawAll");
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
            _deposit(u, 500 * 10 ** 6);
        }
        pool.setWinnersPerDraw(3);
        yieldSource.manualInjectYield(300 * 10 ** 6);
        _warpToNextDraw();
        pool.triggerDraw();
        require(pool.totalPrizesAwarded() == 300 * 10 ** 6, "All prizes awarded");
    }

    function test_ClaimPrize() public {
        _deposit(alice, 1_000 * 10 ** 6);
        yieldSource.manualInjectYield(50 * 10 ** 6);
        _warpToNextDraw();
        pool.triggerDraw();

        AuraPrizePool.DrawRecord memory rec = pool.getDrawHistory(1);
        require(rec.executed, "Draw executed");
        require(rec.prizeAmount == 50 * 10 ** 6, "Prize amount");
        require(rec.winner != address(0), "Winner set");
        require(pool.getUnclaimedWinnings(rec.winner) == 50 * 10 ** 6, "Unclaimed balance");

        vm.prank(rec.winner);
        pool.claimPrize();
        require(pool.getUnclaimedWinnings(rec.winner) == 0, "Unclaimed zero after claim");
    }

    function test_RevertWhenDrawTooEarly() public {
        _deposit(alice, 100 * 10 ** 6);
        yieldSource.manualInjectYield(10 * 10 ** 6);
        vm.expectRevert(abi.encodeWithSelector(AuraPrizePool.DrawTooEarly.selector, uint256(block.timestamp + pool.drawInterval())));
        pool.triggerDraw();
    }

    function test_RevertWhenInsufficientBalance() public {
        // Alice has 10k tokens. Approve max, then try to deposit 20k.
        vm.prank(alice);
        token.approve(address(pool), type(uint256).max);
        vm.expectRevert(abi.encodeWithSelector(AuraPrizePool.InsufficientBalance.selector, 20_000 * 10 ** 6, 10_000 * 10 ** 6));
        vm.prank(alice);
        pool.deposit(20_000 * 10 ** 6);
    }

    function test_RevertWhenInsufficientAllowance() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(AuraPrizePool.InsufficientAllowance.selector, 100 * 10 ** 6, 0));
        pool.deposit(100 * 10 ** 6);
    }
}
