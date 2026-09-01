// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/AuraAuction.sol";
import "../contracts/MockERC20.sol";
import "../contracts/fhevm/FHE.sol";

contract AuraAuctionTest is Test {
    AuraAuction public auction;
    MockERC20 public token;

    address public seller = address(0x1111);
    address public alice = address(0x2222);
    address public bob = address(0x3333);
    address public charlie = address(0x4444);

    function setUp() public {
        token = new MockERC20("Confidential USDT", "cUSDT", 6);
        auction = new AuraAuction(address(token));

        // Fund test accounts
        token.mint(seller, 1000 * 10**6);
        token.mint(alice, 1000 * 10**6);
        token.mint(bob, 1000 * 10**6);
        token.mint(charlie, 1000 * 10**6);

        vm.prank(alice);
        token.approve(address(auction), type(uint256).max);

        vm.prank(bob);
        token.approve(address(auction), type(uint256).max);

        vm.prank(charlie);
        token.approve(address(auction), type(uint256).max);
    }

    function test_CreateAuction() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Genesis Token Lot #1",
            "Exclusive private allocation of 50,000 protocol tokens",
            address(token),
            50000 * 10**18,
            10 * 10**6, // 10 cUSDT reserve
            60 seconds
        );

        assertEq(id, 1);
        (
            uint256 aId,
            address aSeller,
            string memory title,
            string memory desc,
            address pToken,
            uint256 lotSize,
            uint256 reserve,
            uint256 startTime,
            uint256 endTime,
            uint8 status,
            address highestBidder,
            uint256 winningAmount,
            uint256 totalBids,
            uint256 totalEscrow,
            bool assetClaimed
        ) = auction.getAuctionSummary(id);

        assertEq(aId, 1);
        assertEq(aSeller, seller);
        assertEq(title, "Genesis Token Lot #1");
        assertEq(lotSize, 50000 * 10**18);
        assertEq(reserve, 10 * 10**6);
        assertEq(status, 0); // Active
        assertEq(totalBids, 0);
    }

    function test_SealedBiddingAndHomomorphicHighest() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Confidential Treasury Lot",
            "Sealed bid auction with FHE comparison",
            address(token),
            10000 * 10**18,
            5 * 10**6,
            60 seconds
        );

        // Alice bids 50 cUSDT
        vm.prank(alice);
        auction.placeBid(id, 50 * 10**6);

        // Bob bids 120 cUSDT
        vm.prank(bob);
        auction.placeBid(id, 120 * 10**6);

        // Charlie bids 80 cUSDT
        vm.prank(charlie);
        auction.placeBid(id, 80 * 10**6);

        (,,,,,,,,,, address highestBidder, uint256 winningAmount, uint256 totalBids, uint256 totalEscrow,) = auction.getAuctionSummary(id);

        assertEq(totalBids, 3);
        assertEq(totalEscrow, 250 * 10**6);
        assertEq(highestBidder, bob);
        assertEq(winningAmount, 120 * 10**6);
    }

    function test_SettlementAndSellerPayout() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Lot #3",
            "Desc",
            address(token),
            1000 * 10**18,
            5 * 10**6,
            60 seconds
        );

        vm.prank(alice);
        auction.placeBid(id, 50 * 10**6);

        vm.prank(bob);
        auction.placeBid(id, 150 * 10**6);

        uint256 sellerBalBefore = token.balanceOf(seller);

        // Warp time past auction end
        vm.warp(block.timestamp + 65 seconds);

        // Settle auction
        auction.settleAuction(id);

        uint256 sellerBalAfter = token.balanceOf(seller);
        assertEq(sellerBalAfter - sellerBalBefore, 150 * 10**6); // Seller received winning bid
    }

    function test_NonWinnerRefundFlow() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Lot #4",
            "Desc",
            address(token),
            1000 * 10**18,
            5 * 10**6,
            60 seconds
        );

        vm.prank(alice);
        auction.placeBid(id, 50 * 10**6);

        vm.prank(bob);
        auction.placeBid(id, 150 * 10**6);

        vm.warp(block.timestamp + 65 seconds);
        auction.settleAuction(id);

        uint256 aliceBalBefore = token.balanceOf(alice);

        // Alice (non-winner) claims 100% refund
        vm.prank(alice);
        auction.claimRefund(id);

        uint256 aliceBalAfter = token.balanceOf(alice);
        assertEq(aliceBalAfter - aliceBalBefore, 50 * 10**6); // Full refund returned to Alice
    }

    function test_WinnerClaimsAsset() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Lot #5",
            "Desc",
            address(token),
            1000 * 10**18,
            5 * 10**6,
            60 seconds
        );

        vm.prank(bob);
        auction.placeBid(id, 150 * 10**6);

        vm.warp(block.timestamp + 65 seconds);
        auction.settleAuction(id);

        // Bob claims won asset
        vm.prank(bob);
        auction.claimWonAsset(id);

        (,,,,,,,,,,,,,, bool assetClaimed) = auction.getAuctionSummary(id);
        assertTrue(assetClaimed);
    }

    function test_RevertWhenBidTooLow() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Lot #6",
            "Desc",
            address(token),
            1000 * 10**18,
            50 * 10**6, // 50 cUSDT reserve
            60 seconds
        );

        vm.prank(alice);
        vm.expectRevert(AuraAuction.InsufficientEscrow.selector);
        auction.placeBid(id, 20 * 10**6); // below reserve
    }
}
