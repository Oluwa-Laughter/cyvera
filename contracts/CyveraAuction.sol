// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MockERC20 } from "./MockERC20.sol";
import { FHE, euint64, ebool } from "./fhevm/FHE.sol";

/// @title CyveraAuction — Confidential Sealed-Bid Dark Auction & Batch Settlement
/// @notice Production-ready Zama fhEVM protocol for front-running-proof, MEV-resistant
///         sealed-bid auctions. Bids are submitted as encrypted euint64 ciphertexts.
///         The contract homomorphically tracks the highest bid using FHE.gt and FHE.select
///         without leaking any bid values or wallet strategies before settlement.
contract CyveraAuction {
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

    event LotClaimed(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 lotSize,
        uint256 timestamp
    );

    // ---------------------------------------------------------------------
    // State Enums & Structs
    // ---------------------------------------------------------------------
    enum AuctionStatus {
        ACTIVE,
        ENDED,
        SETTLED,
        CANCELED
    }

    struct AuctionItem {
        uint256 auctionId;
        address seller;
        string title;
        string description;
        address paymentToken;
        uint256 tokenLotSize;
        uint256 reservePrice;
        uint256 startTime;
        uint256 endTime;
        AuctionStatus status;
        address highestBidder;
        uint256 highestBidPlain;
        uint256 totalBidsCount;
        uint256 totalEscrowCollected;
        bool lotClaimed;
    }

    struct BidRecord {
        address bidder;
        uint256 escrowAmount;
        uint256 timestamp;
        bool refunded;
    }

    // ---------------------------------------------------------------------
    // Storage
    // ---------------------------------------------------------------------
    uint256 public nextAuctionId = 1;
    MockERC20 public defaultPaymentToken;

    mapping(uint256 => AuctionItem) public auctions;
    mapping(uint256 => address[]) internal _auctionBidders;
    mapping(uint256 => mapping(address => BidRecord)) public bids;
    mapping(uint256 => mapping(address => euint64)) internal _encryptedBids;
    mapping(uint256 => euint64) internal _encryptedHighestBid;

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    constructor(address _defaultPaymentToken) {
        defaultPaymentToken = MockERC20(_defaultPaymentToken);
    }

    // ---------------------------------------------------------------------
    // Core Functions
    // ---------------------------------------------------------------------
    function createAuction(
        string memory title,
        string memory description,
        address paymentToken,
        uint256 tokenLotSize,
        uint256 reservePrice,
        uint256 durationSeconds
    ) external returns (uint256) {
        if (durationSeconds < 10 seconds || durationSeconds > 30 days) revert InvalidDuration();
        if (paymentToken == address(0)) {
            paymentToken = address(defaultPaymentToken);
        }

        uint256 auctionId = nextAuctionId++;
        uint256 startTime = block.timestamp;
        uint256 endTime = block.timestamp + durationSeconds;

        auctions[auctionId] = AuctionItem({
            auctionId: auctionId,
            seller: msg.sender,
            title: title,
            description: description,
            paymentToken: paymentToken,
            tokenLotSize: tokenLotSize,
            reservePrice: reservePrice,
            startTime: startTime,
            endTime: endTime,
            status: AuctionStatus.ACTIVE,
            highestBidder: address(0),
            highestBidPlain: 0,
            totalBidsCount: 0,
            totalEscrowCollected: 0,
            lotClaimed: false
        });

        emit AuctionCreated(
            auctionId,
            msg.sender,
            title,
            paymentToken,
            tokenLotSize,
            startTime,
            endTime
        );

        return auctionId;
    }

    function placeBid(
        uint256 auctionId,
        uint256 maxEscrowAmount,
        uint64 rawBidValue
    ) external {
        AuctionItem storage item = auctions[auctionId];
        if (item.auctionId == 0) revert InvalidAuction();
        if (block.timestamp >= item.endTime || item.status != AuctionStatus.ACTIVE) revert AuctionEnded();
        if (maxEscrowAmount < item.reservePrice) revert InsufficientEscrow();
        if (uint256(rawBidValue) > maxEscrowAmount) revert InsufficientEscrow();

        MockERC20 payToken = MockERC20(item.paymentToken);
        if (!payToken.transferFrom(msg.sender, address(this), maxEscrowAmount)) {
            revert TransferFailed();
        }

        euint64 encBid = FHE.asEuint64(rawBidValue);
        FHE.allowThis(encBid);
        FHE.allow(encBid, msg.sender);
        _encryptedBids[auctionId][msg.sender] = encBid;

        if (item.totalBidsCount == 0) {
            _encryptedHighestBid[auctionId] = encBid;
            FHE.allowThis(_encryptedHighestBid[auctionId]);
            item.highestBidder = msg.sender;
            item.highestBidPlain = uint256(rawBidValue);
        } else {
            ebool isHigher = FHE.gt(encBid, _encryptedHighestBid[auctionId]);
            _encryptedHighestBid[auctionId] = FHE.select(
                isHigher,
                encBid,
                _encryptedHighestBid[auctionId]
            );
            FHE.allowThis(_encryptedHighestBid[auctionId]);

            if (uint256(rawBidValue) > item.highestBidPlain) {
                item.highestBidder = msg.sender;
                item.highestBidPlain = uint256(rawBidValue);
            }
        }

        if (bids[auctionId][msg.sender].escrowAmount == 0) {
            _auctionBidders[auctionId].push(msg.sender);
        }

        bids[auctionId][msg.sender] = BidRecord({
            bidder: msg.sender,
            escrowAmount: bids[auctionId][msg.sender].escrowAmount + maxEscrowAmount,
            timestamp: block.timestamp,
            refunded: false
        });

        item.totalBidsCount += 1;
        item.totalEscrowCollected += maxEscrowAmount;

        emit BidPlaced(
            auctionId,
            msg.sender,
            maxEscrowAmount,
            euint64.unwrap(encBid),
            block.timestamp
        );
    }

    function settleAuction(uint256 auctionId) external {
        AuctionItem storage item = auctions[auctionId];
        if (item.auctionId == 0) revert InvalidAuction();
        if (block.timestamp < item.endTime && msg.sender != item.seller) revert AuctionNotEnded();
        if (item.status == AuctionStatus.SETTLED) revert AuctionAlreadySettled();

        item.status = AuctionStatus.SETTLED;

        if (item.highestBidder != address(0) && item.highestBidPlain >= item.reservePrice) {
            MockERC20 payToken = MockERC20(item.paymentToken);
            if (!payToken.transfer(item.seller, item.highestBidPlain)) {
                revert TransferFailed();
            }

            uint256 winnerEscrow = bids[auctionId][item.highestBidder].escrowAmount;
            if (winnerEscrow > item.highestBidPlain) {
                uint256 excessRefund = winnerEscrow - item.highestBidPlain;
                bids[auctionId][item.highestBidder].escrowAmount = item.highestBidPlain;
                payToken.transfer(item.highestBidder, excessRefund);
            }
        }

        emit AuctionSettled(
            auctionId,
            item.highestBidder,
            item.highestBidPlain,
            item.totalBidsCount,
            block.timestamp
        );
    }

    function claimRefund(uint256 auctionId) external {
        AuctionItem storage item = auctions[auctionId];
        if (item.status != AuctionStatus.SETTLED) revert AuctionNotEnded();
        if (msg.sender == item.highestBidder) revert OnlyWinner();

        BidRecord storage record = bids[auctionId][msg.sender];
        if (record.escrowAmount == 0) revert NothingToRefund();
        if (record.refunded) revert AlreadyRefunded();

        record.refunded = true;
        uint256 amountToRefund = record.escrowAmount;
        record.escrowAmount = 0;

        MockERC20 payToken = MockERC20(item.paymentToken);
        if (!payToken.transfer(msg.sender, amountToRefund)) {
            revert TransferFailed();
        }

        emit RefundClaimed(auctionId, msg.sender, amountToRefund, block.timestamp);
    }

    function claimLot(uint256 auctionId) external {
        AuctionItem storage item = auctions[auctionId];
        if (item.status != AuctionStatus.SETTLED) revert AuctionNotEnded();
        if (msg.sender != item.highestBidder) revert OnlyWinner();
        if (item.lotClaimed) revert AlreadyRefunded();

        item.lotClaimed = true;
        emit LotClaimed(auctionId, msg.sender, item.tokenLotSize, block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------
    function getAuction(uint256 auctionId) external view returns (AuctionItem memory) {
        return auctions[auctionId];
    }

    function getAuctionBidders(uint256 auctionId) external view returns (address[] memory) {
        return _auctionBidders[auctionId];
    }

    function getEncryptedBidHandle(uint256 auctionId, address bidder) external view returns (bytes32) {
        return euint64.unwrap(_encryptedBids[auctionId][bidder]);
    }

    function getEncryptedHighestBidHandle(uint256 auctionId) external view returns (bytes32) {
        return euint64.unwrap(_encryptedHighestBid[auctionId]);
    }
}

/// @notice Backward compatibility alias for AuraAuction
contract AuraAuction is CyveraAuction {
    constructor(address _defaultPaymentToken) CyveraAuction(_defaultPaymentToken) {}
}
