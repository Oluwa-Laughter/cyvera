// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FHE, ebool, euint64} from "./fhevm/FHE.sol";
import {IERC7984} from "./interfaces/IERC7984.sol";
import {ICyveraSession} from "./interfaces/ICyveraSession.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title  CyveraSession
 * @notice Gives autonomous AI agents and MCP session keys an ENCRYPTED spending budget
 *         for ERC-7984 confidential tokens.
 *
 * @dev    Enforces onchain encrypted spending limits without revealing balances, transaction
 *         amounts, or whether an AI agent exceeded its allowance.
 *         All requests over budget are homomorphically clamped to zero without reverting,
 *         preventing side-channel timing leaks or revert-based balance oracle probes.
 */
contract CyveraSession is ICyveraSession {
    error ZeroAddress();
    error ArrayLengthMismatch();
    error EmptySessionScope();
    error TooManyTokens(uint256 count);
    error TooManyRecipients(uint256 count);
    error InvalidExpiry();
    error SessionKeyAlreadyUsed(address sessionKey);
    error InvalidSessionKeySignature();
    error DuplicateToken(address token);
    error NoSuchSession(address sessionKey);
    error SessionIsClosed(address sessionKey);
    error SessionExpired(address sessionKey);
    error TxCountExhausted(address sessionKey);
    error RecipientNotAllowed(address sessionKey, address to);
    error TokenNotInSession(address sessionKey, address token);
    error NotSessionOwner(address sessionKey);
    error NotOwnerOrSessionKey(address sessionKey);
    error RecipientAlreadyAllowed(address to);
    error RecipientNotInSession(address to);
    error TransferFailed();

    uint256 public constant MAX_TOKENS = 32;
    uint256 public constant MAX_RECIPIENTS = 128;

    bytes32 private constant _TYPE_HASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant _OPEN_TYPEHASH =
        keccak256("OpenSession(address owner,address sessionKey,uint48 expiry,uint24 maxTxCount)");

    bytes32 private immutable _NAME_HASH;
    bytes32 private immutable _VERSION_HASH;

    mapping(address sessionKey => Session session) private _sessions;
    mapping(address sessionKey => mapping(address token => euint64 remaining)) private _remaining;
    mapping(address sessionKey => mapping(address to => uint256 indexPlusOne)) private _recipientIndex;
    mapping(address sessionKey => address[] recipients) private _recipients;
    mapping(address sessionKey => address[] tokens) private _tokens;

    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "Reentrancy");
        _locked = 2;
        _;
        _locked = 1;
    }

    constructor() {
        _NAME_HASH = keccak256(bytes("CyveraSession"));
        _VERSION_HASH = keccak256(bytes("1"));
    }

    function _domainSeparatorV4() internal view returns (bytes32) {
        return keccak256(abi.encode(_TYPE_HASH, _NAME_HASH, _VERSION_HASH, block.chainid, address(this)));
    }

    function _hashTypedDataV4(bytes32 structHash) internal view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", _domainSeparatorV4(), structHash));
    }

    /// @inheritdoc ICyveraSession
    function openSession(SessionParams calldata params, bytes calldata sessionKeySignature) external override {
        if (params.sessionKey == address(0)) revert ZeroAddress();
        if (params.tokens.length != params.budgets.length) revert ArrayLengthMismatch();
        if (params.tokens.length == 0 || params.recipients.length == 0) revert EmptySessionScope();
        if (params.tokens.length > MAX_TOKENS) revert TooManyTokens(params.tokens.length);
        if (params.recipients.length > MAX_RECIPIENTS) revert TooManyRecipients(params.recipients.length);
        if (params.expiry <= block.timestamp) revert InvalidExpiry();

        if (_sessions[params.sessionKey].owner != address(0)) {
            revert SessionKeyAlreadyUsed(params.sessionKey);
        }

        bytes32 digest = openSessionDigest(msg.sender, params.sessionKey, params.expiry, params.maxTxCount);
        if (ECDSA.recover(digest, sessionKeySignature) != params.sessionKey) {
            revert InvalidSessionKeySignature();
        }

        _sessions[params.sessionKey] =
            Session({owner: msg.sender, expiry: params.expiry, maxTxCount: params.maxTxCount, txCount: 0});

        for (uint256 i = 0; i < params.tokens.length; ++i) {
            address token = params.tokens[i];
            if (token == address(0)) revert ZeroAddress();
            if (FHE.isInitialized(_remaining[params.sessionKey][token])) {
                revert DuplicateToken(token);
            }

            euint64 budget = FHE.asEuint64(params.budgets[i]);
            _remaining[params.sessionKey][token] = budget;
            _tokens[params.sessionKey].push(token);

            FHE.allowThis(budget);
            FHE.allow(budget, msg.sender);
            FHE.allow(budget, params.sessionKey);
        }

        for (uint256 i = 0; i < params.recipients.length; ++i) {
            _addRecipient(params.sessionKey, params.recipients[i]);
        }

        emit SessionOpened(
            msg.sender, params.sessionKey, params.expiry, params.maxTxCount, params.tokens, params.recipients
        );
    }

    /// @inheritdoc ICyveraSession
    function send(address token, address to, uint64 amount) external override nonReentrant {
        Session storage s = _sessions[msg.sender];
        address owner_ = s.owner;

        if (owner_ == address(0)) revert NoSuchSession(msg.sender);
        if (s.expiry == 0) revert SessionIsClosed(msg.sender);
        if (s.expiry <= block.timestamp) revert SessionExpired(msg.sender);
        if (s.maxTxCount != 0 && s.txCount >= s.maxTxCount) revert TxCountExhausted(msg.sender);
        if (_recipientIndex[msg.sender][to] == 0) revert RecipientNotAllowed(msg.sender, to);

        euint64 budget = _remaining[msg.sender][token];
        if (!FHE.isInitialized(budget)) revert TokenNotInSession(msg.sender, token);

        ++s.txCount;

        // Homomorphic budget clamp: if requested > budget, send 0 without reverting
        euint64 requested = FHE.asEuint64(amount);
        ebool within = FHE.ge(budget, requested);
        euint64 toSend = FHE.select(within, requested, FHE.asEuint64(0));

        FHE.allowTransient(toSend, token);
        bool ok = IERC7984(token).confidentialTransferFrom(owner_, to, toSend);
        if (!ok) revert TransferFailed();

        // Update remaining budget
        euint64 newRemaining = FHE.sub(budget, toSend);
        _remaining[msg.sender][token] = newRemaining;

        FHE.allowThis(newRemaining);
        FHE.allowThis(within);
        FHE.allowThis(toSend);
        FHE.allow(newRemaining, owner_);
        FHE.allow(newRemaining, msg.sender);
        FHE.allow(within, owner_);
        FHE.allow(within, msg.sender);
        FHE.allow(toSend, owner_);
        FHE.allow(toSend, msg.sender);

        emit Sent(msg.sender, token, to, within, toSend);
    }

    /// @inheritdoc ICyveraSession
    function increaseBudget(address sessionKey, address token, uint64 amount) external override {
        Session storage s = _sessions[sessionKey];
        if (s.owner == address(0)) revert NoSuchSession(sessionKey);
        if (s.owner != msg.sender) revert NotSessionOwner(sessionKey);
        if (s.expiry == 0) revert SessionIsClosed(sessionKey);
        if (s.expiry <= block.timestamp) revert SessionExpired(sessionKey);

        euint64 current = _remaining[sessionKey][token];
        if (!FHE.isInitialized(current)) revert TokenNotInSession(sessionKey, token);

        euint64 updated = FHE.add(current, FHE.asEuint64(amount));
        _remaining[sessionKey][token] = updated;

        FHE.allowThis(updated);
        FHE.allow(updated, msg.sender);
        FHE.allow(updated, sessionKey);

        emit BudgetIncreased(sessionKey, token);
    }

    /// @inheritdoc ICyveraSession
    function addRecipient(address sessionKey, address to) external override {
        Session storage s = _sessions[sessionKey];
        if (s.owner == address(0)) revert NoSuchSession(sessionKey);
        if (s.owner != msg.sender) revert NotSessionOwner(sessionKey);
        if (s.expiry == 0) revert SessionIsClosed(sessionKey);
        if (s.expiry <= block.timestamp) revert SessionExpired(sessionKey);
        if (_recipientIndex[sessionKey][to] != 0) revert RecipientAlreadyAllowed(to);

        _addRecipient(sessionKey, to);
        emit RecipientAdded(sessionKey, to);
    }

    /// @inheritdoc ICyveraSession
    function removeRecipient(address sessionKey, address to) external override {
        Session storage s = _sessions[sessionKey];
        if (s.owner == address(0)) revert NoSuchSession(sessionKey);
        if (msg.sender != s.owner && msg.sender != sessionKey) {
            revert NotOwnerOrSessionKey(sessionKey);
        }

        uint256 idx = _recipientIndex[sessionKey][to];
        if (idx == 0) revert RecipientNotInSession(to);

        address[] storage list = _recipients[sessionKey];
        uint256 last = list.length;
        if (idx != last) {
            address moved = list[last - 1];
            list[idx - 1] = moved;
            _recipientIndex[sessionKey][moved] = idx;
        }
        list.pop();
        _recipientIndex[sessionKey][to] = 0;

        emit RecipientRemoved(sessionKey, to, msg.sender);
    }

    /// @inheritdoc ICyveraSession
    function closeSession(address sessionKey) external override {
        Session storage s = _sessions[sessionKey];
        if (s.owner == address(0)) revert NoSuchSession(sessionKey);
        if (msg.sender != s.owner && msg.sender != sessionKey) {
            revert NotOwnerOrSessionKey(sessionKey);
        }
        if (s.expiry == 0) revert SessionIsClosed(sessionKey);

        s.expiry = 0;
        emit SessionClosed(sessionKey, msg.sender);
    }

    /// @inheritdoc ICyveraSession
    function openSessionDigest(address owner, address sessionKey, uint48 expiry, uint24 maxTxCount)
        public
        view
        override
        returns (bytes32)
    {
        return _hashTypedDataV4(keccak256(abi.encode(_OPEN_TYPEHASH, owner, sessionKey, expiry, maxTxCount)));
    }

    /// @inheritdoc ICyveraSession
    function sessionOf(address sessionKey) external view override returns (Session memory) {
        return _sessions[sessionKey];
    }

    /// @inheritdoc ICyveraSession
    function remainingOf(address sessionKey, address token) external view override returns (euint64) {
        return _remaining[sessionKey][token];
    }

    /// @inheritdoc ICyveraSession
    function isRecipientAllowed(address sessionKey, address to) external view override returns (bool) {
        return _recipientIndex[sessionKey][to] != 0;
    }

    /// @inheritdoc ICyveraSession
    function recipientsOf(address sessionKey) external view override returns (address[] memory) {
        return _recipients[sessionKey];
    }

    /// @inheritdoc ICyveraSession
    function tokensOf(address sessionKey) external view override returns (address[] memory) {
        return _tokens[sessionKey];
    }

    function _addRecipient(address sessionKey, address to) private {
        if (to == address(0)) revert ZeroAddress();
        if (_recipientIndex[sessionKey][to] != 0) return;

        address[] storage list = _recipients[sessionKey];
        if (list.length >= MAX_RECIPIENTS) revert TooManyRecipients(list.length + 1);
        list.push(to);
        _recipientIndex[sessionKey][to] = list.length;
    }
}
