// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ebool, euint64 } from "../fhevm/FHE.sol";

/**
 * @title  ICyveraSession
 * @notice Encrypted spending budgets for ERC-7984 confidential tokens and AI agent / MCP session keys.
 */
interface ICyveraSession {
    struct Session {
        address owner;
        uint48 expiry;
        uint24 maxTxCount;
        uint24 txCount;
    }

    struct SessionParams {
        address sessionKey;
        uint48 expiry;
        uint24 maxTxCount;
        address[] tokens;
        uint64[] budgets;
        address[] recipients;
    }

    event SessionOpened(
        address indexed owner,
        address indexed sessionKey,
        uint48 expiry,
        uint24 maxTxCount,
        address[] tokens,
        address[] recipients
    );

    event Sent(
        address indexed sessionKey,
        address indexed token,
        address indexed to,
        ebool within,
        euint64 sent
    );

    event BudgetIncreased(address indexed sessionKey, address indexed token);
    event RecipientAdded(address indexed sessionKey, address indexed recipient);
    event RecipientRemoved(address indexed sessionKey, address indexed recipient, address indexed by);
    event SessionClosed(address indexed sessionKey, address indexed by);

    function openSession(
        SessionParams calldata params,
        bytes calldata sessionKeySignature
    ) external;

    function send(
        address token,
        address to,
        uint64 amount
    ) external;

    function increaseBudget(
        address sessionKey,
        address token,
        uint64 amount
    ) external;

    function addRecipient(address sessionKey, address to) external;
    function removeRecipient(address sessionKey, address to) external;
    function closeSession(address sessionKey) external;

    function sessionOf(address sessionKey) external view returns (Session memory);
    function remainingOf(address sessionKey, address token) external view returns (euint64);
    function isRecipientAllowed(address sessionKey, address to) external view returns (bool);
    function recipientsOf(address sessionKey) external view returns (address[] memory);
    function tokensOf(address sessionKey) external view returns (address[] memory);
    function openSessionDigest(
        address owner,
        address sessionKey,
        uint48 expiry,
        uint24 maxTxCount
    ) external view returns (bytes32);
}
