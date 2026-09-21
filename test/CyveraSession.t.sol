// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import { MockERC20 } from "../contracts/MockERC20.sol";
import { CyveraPrizePool } from "../contracts/CyveraPrizePool.sol";
import { CyveraSession } from "../contracts/CyveraSession.sol";
import { ICyveraSession } from "../contracts/interfaces/ICyveraSession.sol";

contract CyveraSessionTest is Test {
    CyveraSession public sessionManager;
    CyveraPrizePool public pool;
    MockERC20 public token;

    uint256 internal ownerPk = 0xA11CE;
    address internal owner = vm.addr(ownerPk);

    uint256 internal sessionKeyPk = 0xBEEF;
    address internal sessionKey = vm.addr(sessionKeyPk);

    address internal recipient = address(0xCAFE);

    function setUp() public {
        token = new MockERC20("Confidential Token", "cUSDT", 6);
        pool = new CyveraPrizePool(address(token));
        sessionManager = new CyveraSession();

        token.mint(owner, 10_000 * 10 ** 6);
        vm.prank(owner);
        token.approve(address(pool), type(uint256).max);

        vm.prank(owner);
        pool.deposit(5_000 * 10 ** 6);
    }

    function _signOpenSession(
        address sessionOwner,
        address key,
        uint48 expiry,
        uint24 maxTxCount,
        uint256 privateKey
    ) internal view returns (bytes memory) {
        bytes32 digest = sessionManager.openSessionDigest(sessionOwner, key, expiry, maxTxCount);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return abi.encodePacked(r, s, v);
    }

    function test_OpenSessionAndSend() public {
        uint48 expiry = uint48(block.timestamp + 1 days);
        uint24 maxTx = 10;
        bytes memory sig = _signOpenSession(owner, sessionKey, expiry, maxTx, sessionKeyPk);

        address[] memory tokens = new address[](1);
        tokens[0] = address(pool);

        uint64[] memory budgets = new uint64[](1);
        budgets[0] = 500 * 10 ** 6;

        address[] memory recipients = new address[](1);
        recipients[0] = recipient;

        ICyveraSession.SessionParams memory params = ICyveraSession.SessionParams({
            sessionKey: sessionKey,
            expiry: expiry,
            maxTxCount: maxTx,
            tokens: tokens,
            budgets: budgets,
            recipients: recipients
        });

        vm.prank(owner);
        sessionManager.openSession(params, sig);

        require(sessionManager.isRecipientAllowed(sessionKey, recipient), "Recipient allowed");
        require(sessionManager.sessionOf(sessionKey).owner == owner, "Owner set");

        // Execute send as session key (AI Agent)
        vm.prank(sessionKey);
        sessionManager.send(address(pool), recipient, 200 * 10 ** 6);

        ICyveraSession.Session memory s = sessionManager.sessionOf(sessionKey);
        require(s.txCount == 1, "Tx count incremented");
    }

    function test_BudgetClampingWithoutRevert() public {
        uint48 expiry = uint48(block.timestamp + 1 days);
        uint24 maxTx = 5;
        bytes memory sig = _signOpenSession(owner, sessionKey, expiry, maxTx, sessionKeyPk);

        address[] memory tokens = new address[](1);
        tokens[0] = address(pool);

        uint64[] memory budgets = new uint64[](1);
        budgets[0] = 100 * 10 ** 6; // budget is 100

        address[] memory recipients = new address[](1);
        recipients[0] = recipient;

        ICyveraSession.SessionParams memory params = ICyveraSession.SessionParams({
            sessionKey: sessionKey,
            expiry: expiry,
            maxTxCount: maxTx,
            tokens: tokens,
            budgets: budgets,
            recipients: recipients
        });

        vm.prank(owner);
        sessionManager.openSession(params, sig);

        // Attempt to send 500 (exceeds 100 budget).
        // Homomorphic clamp reduces amount to 0 without reverting!
        vm.prank(sessionKey);
        sessionManager.send(address(pool), recipient, 500 * 10 ** 6);

        ICyveraSession.Session memory s = sessionManager.sessionOf(sessionKey);
        require(s.txCount == 1, "Tx count incremented without reverting");
    }

    function test_CloseSession() public {
        uint48 expiry = uint48(block.timestamp + 1 days);
        bytes memory sig = _signOpenSession(owner, sessionKey, expiry, 0, sessionKeyPk);

        address[] memory tokens = new address[](1);
        tokens[0] = address(pool);
        uint64[] memory budgets = new uint64[](1);
        budgets[0] = 100 * 10 ** 6;
        address[] memory recipients = new address[](1);
        recipients[0] = recipient;

        vm.prank(owner);
        sessionManager.openSession(
            ICyveraSession.SessionParams(sessionKey, expiry, 0, tokens, budgets, recipients),
            sig
        );

        vm.prank(sessionKey);
        sessionManager.closeSession(sessionKey);

        require(sessionManager.sessionOf(sessionKey).expiry == 0, "Session closed");

        // Sending after close should revert
        vm.prank(sessionKey);
        vm.expectRevert();
        sessionManager.send(address(pool), recipient, 50 * 10 ** 6);
    }
}
