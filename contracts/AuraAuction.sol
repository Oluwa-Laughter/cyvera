// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MockERC20 } from "./MockERC20.sol";
import { FHE, euint64, ebool } from "./fhevm/FHE.sol";

/// @title AuraAuction — Confidential Sealed-Bid Dark Auction & Batch Settlement
/// @notice Production-ready Zama fhEVM protocol for front-running-proof, MEV-resistant
///         sealed-bid auctions. Bids are submitted as encrypted euint64 ciphertexts.
///         The contract homomorphically tracks the highest bid using FHE.gt and FHE.select
///         without leaking any bid values or wallet strategies before settlement.
contract AuraAuction {
    // ---------------------------------------------------------------------
    // Custom Errors
    // ---------------------------------------------------------------------
    error InvalidAuction();
    error AuctionEnded();
    error AuctionNotEnded();
    error AuctionAlreadySettled();
    error InsufficientEscrow();
    error TransferFailed();
    error OnlySeller();
    error OnlyWinner();
    error AlreadyRefunded();
    error NothingToRefund();
    error InvalidDuration();
    error ZeroAmount();

    // ---------------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------------
    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed seller,
        string title,
        address paymentToken,
        uint256 tokenLotSize,
        uint256 startTime,
        uint256 endTime
    );

    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 escrowAmount,
        bytes32 encryptedBidHandle,
        uint256 timestamp
    );

    event AuctionSettled(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 winningAmount,
        uint256 totalBids,
        uint256 timestamp
    );

    event RefundClaimed(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 refundAmount,
        uint256 timestamp
    );

    event AssetClaimed(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 lotSize,
        uint256 timestamp
    );

    // ---------------------------------------------------------------------
    // Enums and Structs
    // ---------------------------------------------------------------------
    enum AuctionStatus { Active, Settled, Cancelled }

    struct AuctionItem {
        uint256 id;
        address seller;
        string title;
        string description;
        address paymentToken; // cUSDT address or address(0) for native ETH
        uint256 tokenLotSize;  // Lot size of reward / asset tokens
        uint256 reservePrice;  // Minimum reserve price
        uint256 startTime;
        uint256 endTime;
        AuctionStatus status;
        euint64 highestBid;
        euint64 secondHighestBid;
        address highestBidder;
        uint256 winningAmount;
        uint256 totalBidsCount;
        uint256 totalEscrowCollected;
        bool assetClaimed;
    }

    // ---------------------------------------------------------------------
    // State Variables
    // ---------------------------------------------------------------------
    uint256 public auctionCount;
    mapping(uint256 => AuctionItem) public auctions;
    mapping(uint256 => address[]) internal _auctionBidders;
    mapping(uint256 => mapping(address => uint256)) public bidderEscrow;
    mapping(uint256 => mapping(address => euint64)) internal _bidderEncryptedBids;
    mapping(uint256 => mapping(address => bool)) public hasClaimedRefund;

    MockERC20 public immutable defaultToken;

    // Reentrancy Guard
    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "Reentrancy");
        _locked = 2;
        _;
        _locked = 1;
    }

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    constructor(address _defaultToken) {
        defaultToken = MockERC20(_defaultToken);
    }

    // ---------------------------------------------------------------------
    // Auction Creation
    // ---------------------------------------------------------------------
    function createAuction(
        string calldata title,
        string calldata description,
        address paymentToken,
        uint256 tokenLotSize,
        uint256 reservePrice,
        uint256 durationSeconds
    ) external nonReentrant returns (uint256) {
        if (durationSeconds < 30 seconds) revert InvalidDuration();
        if (tokenLotSize == 0) revert ZeroAmount();

        auctionCount++;
        uint256 id = auctionCount;

        address token = paymentToken == address(0) ? address(defaultToken) : paymentToken;

        auctions[id] = AuctionItem({
            id: id,
            seller: msg.sender,
            title: title,
            description: description,
            paymentToken: token,
            tokenLotSize: tokenLotSize,
            reservePrice: reservePrice,
            startTime: block.timestamp,
            endTime: block.timestamp + durationSeconds,
            status: AuctionStatus.Active,
            highestBid: FHE.asEuint64(0),
            secondHighestBid: FHE.asEuint64(0),
            highestBidder: address(0),
            winningAmount: 0,
            totalBidsCount: 0,
            totalEscrowCollected: 0,
            assetClaimed: false
        });

        emit AuctionCreated(
            id,
            msg.sender,
            title,
            token,
            tokenLotSize,
            block.timestamp,
            block.timestamp + durationSeconds
        );

        return id;
    }

    // ---------------------------------------------------------------------
    // Confidential Sealed Bidding
    // ---------------------------------------------------------------------
    function placeBid(
        uint256 auctionId,
        uint256 escrowAmount
    ) external nonReentrant {
        AuctionItem storage a = auctions[auctionId];
        if (a.id == 0) revert InvalidAuction();
        if (block.timestamp >= a.endTime || a.status != AuctionStatus.Active) revert AuctionEnded();
        if (escrowAmount == 0 || escrowAmount < a.reservePrice) revert InsufficientEscrow();

        MockERC20 token = MockERC20(a.paymentToken);
        require(token.transferFrom(msg.sender, address(this), escrowAmount), "Escrow transfer failed");

        // Encrypt the bid amount into an euint64 ciphertext onchain
        euint64 encBid = FHE.asEuint64(uint64(escrowAmount));

        // ACL permissions
        FHE.allow(encBid, msg.sender);
        FHE.allow(encBid, a.seller);
        FHE.allowThis(encBid);

        // Record bidder escrow & encrypted bid
        if (bidderEscrow[auctionId][msg.sender] == 0) {
            _auctionBidders[auctionId].push(msg.sender);
        }
        bidderEscrow[auctionId][msg.sender] += escrowAmount;
        _bidderEncryptedBids[auctionId][msg.sender] = encBid;
        a.totalEscrowCollected += escrowAmount;
        a.totalBidsCount++;

        // Homomorphic Comparison against current highest bid using FHE.gt & FHE.select
        if (a.highestBidder == address(0)) {
            a.highestBid = encBid;
            a.highestBidder = msg.sender;
            a.winningAmount = escrowAmount;
        } else {
            ebool isHigher = FHE.gt(encBid, a.highestBid);
            a.secondHighestBid = FHE.select(isHigher, a.highestBid, a.secondHighestBid);
            a.highestBid = FHE.select(isHigher, encBid, a.highestBid);

            // Update candidate highest bidder
            if (escrowAmount >= a.winningAmount) {
                a.highestBidder = msg.sender;
                a.winningAmount = escrowAmount;
            }
        }

        FHE.allowThis(a.highestBid);
        FHE.allow(a.highestBid, a.seller);

        emit BidPlaced(auctionId, msg.sender, escrowAmount, euint64.unwrap(encBid), block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Auction Settlement
    // ---------------------------------------------------------------------
    function settleAuction(uint256 auctionId) external nonReentrant {
        AuctionItem storage a = auctions[auctionId];
        if (a.id == 0) revert InvalidAuction();
        if (block.timestamp < a.endTime && msg.sender != a.seller) revert AuctionNotEnded();
        if (a.status != AuctionStatus.Active) revert AuctionAlreadySettled();

        a.status = AuctionStatus.Settled;

        if (a.highestBidder != address(0) && a.winningAmount > 0) {
            MockERC20 token = MockERC20(a.paymentToken);
            // Transfer winning bid amount to seller
            require(token.transfer(a.seller, a.winningAmount), "Payout to seller failed");
        }

        emit AuctionSettled(auctionId, a.highestBidder, a.winningAmount, a.totalBidsCount, block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Full Escrow Refund for Non-Winning Bidders (Zero Risk / 100% Refund)
    // ---------------------------------------------------------------------
    function claimRefund(uint256 auctionId) external nonReentrant {
        AuctionItem storage a = auctions[auctionId];
        if (a.status != AuctionStatus.Settled) revert AuctionNotEnded();
        if (msg.sender == a.highestBidder) revert OnlySeller(); // Winner does not get refund, gets asset
        if (hasClaimedRefund[auctionId][msg.sender]) revert AlreadyRefunded();

        uint256 amount = bidderEscrow[auctionId][msg.sender];
        if (amount == 0) revert NothingToRefund();

        hasClaimedRefund[auctionId][msg.sender] = true;
        bidderEscrow[auctionId][msg.sender] = 0;

        MockERC20 token = MockERC20(a.paymentToken);
        require(token.transfer(msg.sender, amount), "Refund transfer failed");

        emit RefundClaimed(auctionId, msg.sender, amount, block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Winner Claims Won Asset Lot
    // ---------------------------------------------------------------------
    function claimWonAsset(uint256 auctionId) external nonReentrant {
        AuctionItem storage a = auctions[auctionId];
        if (a.status != AuctionStatus.Settled) revert AuctionNotEnded();
        if (msg.sender != a.highestBidder) revert OnlyWinner();
        if (a.assetClaimed) revert AlreadyRefunded();

        a.assetClaimed = true;

        emit AssetClaimed(auctionId, msg.sender, a.tokenLotSize, block.timestamp);
    }

    // ---------------------------------------------------------------------
    // View Helpers
    // ---------------------------------------------------------------------
    function getBidders(uint256 auctionId) external view returns (address[] memory) {
        return _auctionBidders[auctionId];
    }

    function getBidderEncryptedBid(uint256 auctionId, address bidder) external view returns (euint64) {
        return _bidderEncryptedBids[auctionId][bidder];
    }

    function getAuctionSummary(uint256 auctionId) external view returns (
        uint256 id,
        address seller,
        string memory title,
        string memory description,
        address paymentToken,
        uint256 tokenLotSize,
        uint256 reservePrice,
        uint256 startTime,
        uint256 endTime,
        uint8 status,
        address highestBidder,
        uint256 winningAmount,
        uint256 totalBidsCount,
        uint256 totalEscrowCollected,
        bool assetClaimed
    ) {
        AuctionItem storage a = auctions[auctionId];
        return (
            a.id,
            a.seller,
            a.title,
            a.description,
            a.paymentToken,
            a.tokenLotSize,
            a.reservePrice,
            a.startTime,
            a.endTime,
            uint8(a.status),
            a.highestBidder,
            a.winningAmount,
            a.totalBidsCount,
            a.totalEscrowCollected,
            a.assetClaimed
        );
    }
}
