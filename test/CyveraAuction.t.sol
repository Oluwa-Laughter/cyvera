// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/CyveraAuction.sol";
import "../contracts/MockERC20.sol";
import "../contracts/fhevm/FHE.sol";

contract CyveraAuctionTest is Test {
    CyveraAuction public auction;
    MockERC20 public token;

    address public seller = address(0x1111);
    address public alice = address(0x2222);
    address public bob = address(0x3333);
    address public charlie = address(0x4444);

    function setUp() public {
        token = new MockERC20("Confidential USDT", "cUSDT", 6);
        auction = new CyveraAuction(address(token));

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
            10 * 10**6,
            60 seconds
        );

        assertEq(id, 1);
    }

    function test_SealedBiddingAndHomomorphicHighest() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Confidential Vault Shares #2",
            "Dark pool asset auction",
            address(token),
            1000 * 10**18,
            10 * 10**6,
            100 seconds
        );

        vm.prank(alice);
        auction.placeBid(id, 100 * 10**6, 50 * 10**6);

        vm.prank(bob);
        auction.placeBid(id, 200 * 10**6, 120 * 10**6);

        vm.prank(charlie);
        auction.placeBid(id, 150 * 10**6, 80 * 10**6);

        CyveraAuction.AuctionItem memory item = auction.getAuction(id);
        assertEq(item.highestBidder, bob);
        assertEq(item.highestBidPlain, 120 * 10**6);
        assertEq(item.totalBidsCount, 3);
    }

    function test_SettlementAndSellerPayout() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Rare LP Position",
            "Private LP voucher",
            address(token),
            500 * 10**18,
            20 * 10**6,
            60 seconds
        );

        vm.prank(alice);
        auction.placeBid(id, 100 * 10**6, 75 * 10**6);

        vm.warp(block.timestamp + 65 seconds);

        uint256 sellerBalBefore = token.balanceOf(seller);
        auction.settleAuction(id);
        uint256 sellerBalAfter = token.balanceOf(seller);

        assertEq(sellerBalAfter - sellerBalBefore, 75 * 10**6);
    }

    function test_NonWinnerRefundFlow() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Encrypted NFT Voucher",
            "Sealed voucher",
            address(token),
            1 * 10**18,
            10 * 10**6,
            60 seconds
        );

        vm.prank(alice);
        auction.placeBid(id, 50 * 10**6, 40 * 10**6);

        vm.prank(bob);
        auction.placeBid(id, 100 * 10**6, 90 * 10**6);

        vm.warp(block.timestamp + 65 seconds);
        auction.settleAuction(id);

        uint256 aliceBalBefore = token.balanceOf(alice);
        vm.prank(alice);
        auction.claimRefund(id);
        uint256 aliceBalAfter = token.balanceOf(alice);

        assertEq(aliceBalAfter - aliceBalBefore, 50 * 10**6);
    }

    function test_WinnerClaimsAsset() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "Key Voucher",
            "Access pass",
            address(token),
            1 * 10**18,
            10 * 10**6,
            60 seconds
        );

        vm.prank(alice);
        auction.placeBid(id, 50 * 10**6, 40 * 10**6);

        vm.warp(block.timestamp + 65 seconds);
        auction.settleAuction(id);

        vm.prank(alice);
        auction.claimLot(id);

        CyveraAuction.AuctionItem memory item = auction.getAuction(id);
        assertTrue(item.lotClaimed);
    }

    function test_RevertWhenBidTooLow() public {
        vm.prank(seller);
        uint256 id = auction.createAuction(
            "VIP Pass",
            "VIP",
            address(token),
            1 * 10**18,
            50 * 10**6,
            60 seconds
        );

        vm.prank(alice);
        vm.expectRevert();
        auction.placeBid(id, 10 * 10**6, 10 * 10**6);
    }
}
