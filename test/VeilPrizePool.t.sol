// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/MockERC20.sol";
import "../contracts/MockYieldSource.sol";
import "../contracts/VeilPrizePool.sol";

// Minimal self-contained Foundry test interface
abstract contract SimpleTest {
    function assertTrue(bool condition, string memory message) internal pure {
        require(condition, message);
    }

    function assertEq(uint256 a, uint256 b, string memory message) internal pure {
        require(a == b, message);
    }

    function assertEq(address a, address b, string memory message) internal pure {
        require(a == b, message);
    }
}

contract VeilPrizePoolTest is SimpleTest {
    MockERC20 public token;
    MockYieldSource public yieldSource;
    VeilPrizePool public pool;

    address public alice = address(0xA11CE);
    address public bob = address(0xB0B);
    address public charlie = address(0xC0C);

    function setUp() public {
        token = new MockERC20("Confidential Prize Token", "cUSDT", 6);
        yieldSource = new MockYieldSource(address(token));
        pool = new VeilPrizePool(address(token));
        
        yieldSource.setPrizePool(address(pool));
        pool.setYieldSource(address(yieldSource));

        // Fund test users
        token.mint(alice, 10_000 * 10**6);
        token.mint(bob, 10_000 * 10**6);
        token.mint(charlie, 10_000 * 10**6);
    }

    function test_InitialState() public view {
        assertEq(address(pool.depositToken()), address(token), "Deposit token mismatch");
        assertEq(pool.getDepositorCount(), 0, "Initial depositors must be 0");
        assertEq(pool.totalPrizeReserve(), 0, "Initial prize reserve must be 0");
        assertEq(pool.totalDeposits(), 0, "Initial deposits must be 0");
    }

    function test_Faucet() public {
        address newUser = address(0x1234);
        // Simulate calling faucet
        token.mint(newUser, 1_000 * 10**6);
        assertEq(token.balanceOf(newUser), 1_000 * 10**6, "Faucet balance mismatch");
    }

    function test_DepositFlow() public {
        uint256 depositAmt = 500 * 10**6;
        
        // Alice deposits
        token.mint(address(this), depositAmt);
        token.approve(address(pool), depositAmt);
        pool.deposit(depositAmt);

        assertEq(pool.getDepositorCount(), 1, "Depositor count should be 1");
        assertEq(pool.totalDeposits(), depositAmt, "Total deposits mismatch");
        assertTrue(pool.isUserDepositor(address(this)), "Should be marked as depositor");
    }

    function test_WithdrawNoLoss() public {
        uint256 depositAmt = 1_000 * 10**6;
        
        token.mint(address(this), depositAmt);
        token.approve(address(pool), depositAmt);
        pool.deposit(depositAmt);

        assertEq(pool.totalDeposits(), depositAmt, "Total deposits should match");

        // Withdraw half
        pool.withdraw(500 * 10**6);
        assertEq(pool.totalDeposits(), 500 * 10**6, "Remaining deposits should match");
        assertEq(pool.getDepositorCount(), 1, "Should still be depositor");

        // Withdraw remainder
        pool.withdrawAll();
        assertEq(pool.totalDeposits(), 0, "Total deposits should be 0");
        assertEq(pool.getDepositorCount(), 0, "Depositor count should be 0");
    }

    function test_YieldAccrualAndDraw() public {
        uint256 depositAmt = 1_000 * 10**6;
        
        // Deposit
        token.mint(address(this), depositAmt);
        token.approve(address(pool), depositAmt);
        pool.deposit(depositAmt);

        // Inject simulated yield into prize reserve
        yieldSource.manualInjectYield(100 * 10**6);
        assertEq(pool.totalPrizeReserve(), 100 * 10**6, "Prize reserve should be 100 cUSDT");

        // Trigger draw
        pool.triggerDraw();

        assertEq(pool.currentDrawId(), 1, "Draw ID should be 1");
        assertEq(pool.totalPrizeReserve(), 0, "Prize reserve should reset after draw");
        assertEq(pool.totalPrizesAwarded(), 100 * 10**6, "Total prizes awarded should match");
    }
}
