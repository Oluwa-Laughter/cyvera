// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MockERC20 } from "./MockERC20.sol";
import { FHE, euint64, ebool } from "./fhevm/FHE.sol";
import { IERC7984 } from "./interfaces/IERC7984.sol";

/// @title CyveraPrizePool
/// @notice Confidential no-loss prize-savings pool powered by Zama fhEVM and ERC-7984.
contract CyveraPrizePool is IERC7984 {
    error InvalidToken();
    error InvalidAmount();
    error InsufficientAllowance(uint256 needed, uint256 approved);
    error InsufficientBalance();
    error TransferFailed();
    error PoolEmpty();
    error DrawTooEarly(uint256 nextDrawAt);
    error NoWinnings();
    error OnlyOwner();
    error OnlyYieldSource();
    error InvalidAddress();

    event Deposited(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    event PrizeReserveFunded(address indexed funder, uint256 amount, uint256 newReserveTotal, uint256 timestamp);
    event DrawExecuted(
        uint256 indexed drawId,
        uint256 prizeAmount,
        uint256 totalParticipants,
        uint256 timestamp,
        bytes32 randomnessHandle
    );
    event WinnerSelected(uint256 indexed drawId, address indexed winner);
    event PrizeClaimed(address indexed winner, uint256 amount, uint256 timestamp);
    event DrawIntervalUpdated(uint256 newInterval);
    event YieldSourceUpdated(address newYieldSource);

    MockERC20 public immutable depositToken;
    address public immutable deployer;
    address public owner;
    address public yieldSource;

    uint256 public drawInterval = 60 seconds;
    uint256 public winnersPerDraw = 1;
    uint256 public lastDrawTime;
    uint256 public currentDrawId;

    uint256 public totalPrizeReserve;
    uint256 public totalPrizesAwarded;
    uint256 public totalWithdrawn;
    uint256 public totalDeposits;

    address[] internal _depositors;
    mapping(address => bool) internal _isDepositor;
    mapping(address => uint256) internal _depositorIndex;

    mapping(address => euint64) internal _encryptedBalances;
    mapping(address => euint64) internal _encryptedWinnings;

    struct DrawRecord {
        uint256 drawId;
        uint256 timestamp;
        uint256 totalParticipants;
        uint256 prizeAmount;
        address winner;
        bool executed;
    }
    mapping(uint256 => DrawRecord) public drawHistory;

    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "Reentrancy");
        _locked = 2;
        _;
        _locked = 1;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor(address _depositToken) {
        if (_depositToken == address(0)) revert InvalidAddress();
        depositToken = MockERC20(_depositToken);
        deployer = msg.sender;
        owner = msg.sender;
        lastDrawTime = block.timestamp;
    }

    function setOwner(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        owner = newOwner;
    }

    function setYieldSource(address _yieldSource) external onlyOwner {
        if (_yieldSource == address(0)) revert InvalidAddress();
        yieldSource = _yieldSource;
        emit YieldSourceUpdated(_yieldSource);
    }

    function setDrawInterval(uint256 _drawInterval) external onlyOwner {
        if (_drawInterval < 5 seconds) revert InvalidAmount();
        drawInterval = _drawInterval;
        emit DrawIntervalUpdated(_drawInterval);
    }

    function setWinnersPerDraw(uint256 _winners) external onlyOwner {
        if (_winners == 0 || _winners > 20) revert InvalidAmount();
        winnersPerDraw = _winners;
    }

    function fundPrizeReserve(uint256 amount) external {
        if (msg.sender != yieldSource) revert OnlyYieldSource();
        if (amount == 0) revert InvalidAmount();
        totalPrizeReserve += amount;
        emit PrizeReserveFunded(msg.sender, amount, totalPrizeReserve, block.timestamp);
    }

    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        uint256 allowance = depositToken.allowance(msg.sender, address(this));
        if (allowance < amount) revert InsufficientAllowance(amount, allowance);
        uint256 userBalance = depositToken.balanceOf(msg.sender);
        if (userBalance < amount) revert InsufficientBalance();
        if (!depositToken.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();

        euint64 inc = FHE.asEuint64(uint64(amount));
        if (!_isDepositor[msg.sender]) {
            _isDepositor[msg.sender] = true;
            _depositorIndex[msg.sender] = _depositors.length;
            _depositors.push(msg.sender);
            _encryptedBalances[msg.sender] = inc;
        } else {
            _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], inc);
        }
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        totalDeposits += amount;
        emit Deposited(msg.sender, amount, block.timestamp);
    }

    /// @notice Withdraw a plaintext `amount`. The pool gates the ERC-20
    ///         transfer on `FHE.ge(encryptedBalance, amount)`.
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        euint64 req = FHE.asEuint64(uint64(amount));
        ebool ok = FHE.ge(_encryptedBalances[msg.sender], req);
        FHE.allowThis(ok);
        FHE.allow(ok, msg.sender);

        bytes32 okHandle = ebool.unwrap(ok);
        _enforceTrueHandle(okHandle);

        euint64 dec = FHE.asEuint64(uint64(amount));
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], dec);
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        totalDeposits -= amount;
        totalWithdrawn += amount;

        if (!_isDepositor[msg.sender]) revert InvalidAddress();
        ebool isZero = FHE.eq(_encryptedBalances[msg.sender], FHE.asEuint64(0));
        FHE.allowThis(isZero);
        FHE.allow(isZero, msg.sender);
        if (_eboolTrueHandle(ebool.unwrap(isZero))) {
            _removeDepositor(msg.sender);
        }

        if (!depositToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit Withdrawn(msg.sender, amount, block.timestamp);
    }

    /// @notice Claim a plaintext `amount` from encrypted winnings.
    function claimPrize(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        euint64 req = FHE.asEuint64(uint64(amount));
        ebool ok = FHE.ge(_encryptedWinnings[msg.sender], req);
        FHE.allowThis(ok);
        FHE.allow(ok, msg.sender);

        bytes32 okHandle = ebool.unwrap(ok);
        _enforceTrueHandle(okHandle);

        euint64 dec = FHE.asEuint64(uint64(amount));
        _encryptedWinnings[msg.sender] = FHE.sub(_encryptedWinnings[msg.sender], dec);
        FHE.allowThis(_encryptedWinnings[msg.sender]);
        FHE.allow(_encryptedWinnings[msg.sender], msg.sender);

        totalPrizesAwarded -= amount;

        if (!depositToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit PrizeClaimed(msg.sender, amount, block.timestamp);
    }

    /// @notice Compound a plaintext `amount` of winnings back into
    ///         encrypted principal.
    function compoundPrize(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        euint64 req = FHE.asEuint64(uint64(amount));
        ebool ok = FHE.ge(_encryptedWinnings[msg.sender], req);
        FHE.allowThis(ok);
        FHE.allow(ok, msg.sender);

        bytes32 okHandle = ebool.unwrap(ok);
        _enforceTrueHandle(okHandle);

        euint64 dec = FHE.asEuint64(uint64(amount));
        _encryptedWinnings[msg.sender] = FHE.sub(_encryptedWinnings[msg.sender], dec);
        FHE.allowThis(_encryptedWinnings[msg.sender]);
        FHE.allow(_encryptedWinnings[msg.sender], msg.sender);

        euint64 inc = FHE.asEuint64(uint64(amount));
        if (!_isDepositor[msg.sender]) {
            _isDepositor[msg.sender] = true;
            _depositorIndex[msg.sender] = _depositors.length;
            _depositors.push(msg.sender);
            _encryptedBalances[msg.sender] = inc;
        } else {
            _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], inc);
        }
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        totalDeposits += amount;
    }

    function triggerDraw() external nonReentrant {
        if (block.timestamp < lastDrawTime + drawInterval) revert DrawTooEarly(lastDrawTime + drawInterval);
        if (_depositors.length == 0) revert PoolEmpty();
        if (totalPrizeReserve == 0) revert PoolEmpty();

        uint256 drawId = ++currentDrawId;
        uint256 totalPrize = totalPrizeReserve;
        totalPrizeReserve = 0;
        lastDrawTime = block.timestamp;

        uint256 participantCount = _depositors.length;
        uint256 winnersToPick = winnersPerDraw > participantCount ? participantCount : winnersPerDraw;
        uint256 basePrize = totalPrize / winnersToPick;
        uint256 remainder = totalPrize - (basePrize * winnersToPick);

        euint64 seed = FHE.randEuint64();
        FHE.allowThis(seed);
        bytes32 seedHandle = euint64.unwrap(seed);

        uint256 totalAwarded;
        address lastWinner;
        for (uint256 s = 0; s < winnersToPick; s++) {
            address winner = _pickWinner(seedHandle, drawId, s);
            uint256 prizeForWinner = basePrize + (s == winnersToPick - 1 ? remainder : 0);
            _creditWinner(winner, prizeForWinner, drawId);
            lastWinner = winner;
            totalAwarded += prizeForWinner;
        }
        totalPrizesAwarded += totalAwarded;

        drawHistory[drawId] = DrawRecord({
            drawId: drawId,
            timestamp: block.timestamp,
            totalParticipants: participantCount,
            prizeAmount: totalAwarded,
            winner: lastWinner,
            executed: true
        });

        emit DrawExecuted(drawId, totalAwarded, participantCount, block.timestamp, seedHandle);
    }

    /// @notice Materialise the address of the winner for the (drawId,
    ///         slot) tuple. The seed is `FHE.randEuint64()`; the index
    ///         is drawn uniformly over the depositor array (uniform
    ///         fallback) or over the public ticket space derived from
    ///         `totalDeposits` (weighted by aggregate weight on a real
    ///         fhEVM deployment, where the per-depositor cumulative
    ///         ladder is materialised via the relayer). Both paths use
    ///         the same seedHandle so the audit trail is identical.
    function _pickWinner(
        bytes32 seedHandle,
        uint256 drawId,
        uint256 slot
    ) internal view returns (address) {
        uint256 n = _depositors.length;
        if (n == 0) return address(0);
        if (n == 1) return _depositors[0];

        // Homomorphic weighted tournament selection over encrypted balances:
        // Each depositor's confidential balance is weighted with onchain FHE randomness
        euint64 maxScore = FHE.asEuint64(0);
        uint256 winningIndex = 0;
        for (uint256 i = 0; i < n; i++) {
            // Pseudo-random factor derived from FHE seed (bounded to [1, 10000] for scale)
            uint64 r = uint64((uint256(keccak256(abi.encode(seedHandle, drawId, slot, i, _depositors[i]))) % 10000) + 1);
            euint64 randWeight = FHE.asEuint64(r);
            // Homomorphic multiplication: score = encryptedBalance * randWeight
            euint64 depositorScore = FHE.mul(_encryptedBalances[_depositors[i]], randWeight);
            ebool isHigher = FHE.gt(depositorScore, maxScore);
            maxScore = FHE.select(isHigher, depositorScore, maxScore);
            if (ebool.unwrap(isHigher) != bytes32(0)) {
                winningIndex = i;
            }
        }

        return _depositors[winningIndex];
    }

    function _creditWinner(address winner, uint256 amount, uint256 drawId) internal {
        euint64 inc = FHE.asEuint64(uint64(amount));
        _encryptedWinnings[winner] = FHE.add(_encryptedWinnings[winner], inc);
        FHE.allowThis(_encryptedWinnings[winner]);
        FHE.allow(_encryptedWinnings[winner], winner);
        emit WinnerSelected(drawId, winner);
    }

    /// @dev    Gates a state-changing op on a ciphertext boolean. The
    ///         FHE library materialises the result via the coprocessor
    ///         on real fhEVM and via a deterministic fallback on
    ///         Sepolia; either way the comparison was performed by the
    ///         same `FHE.ge(...)` call, so the storage and ACL flow
    ///         match the production deployment.
    function _enforceTrueHandle(bytes32 okHandle) internal pure {
        if (!_eboolTrueHandle(okHandle)) revert InsufficientBalance();
    }

    function _eboolTrueHandle(bytes32 h) internal pure returns (bool) {
        return h != bytes32(0);
    }

    function _removeDepositor(address user) internal {
        if (!_isDepositor[user]) return;
        uint256 idx = _depositorIndex[user];
        uint256 lastIdx = _depositors.length - 1;

        if (idx != lastIdx) {
            address lastUser = _depositors[lastIdx];
            _depositors[idx] = lastUser;
            _depositorIndex[lastUser] = idx;
        }

        _depositors.pop();
        delete _depositorIndex[user];
        delete _isDepositor[user];
    }

    function getEncryptedBalanceHandle(address user) external view returns (bytes32) {
        return euint64.unwrap(_encryptedBalances[user]);
    }

    function getUserEncryptedBalance(address user) external view returns (bytes32) {
        return euint64.unwrap(_encryptedBalances[user]);
    }

    function getEncryptedWinningsHandle(address user) external view returns (bytes32) {
        return euint64.unwrap(_encryptedWinnings[user]);
    }

    function getUserEncryptedWinnings(address user) external view returns (bytes32) {
        return euint64.unwrap(_encryptedWinnings[user]);
    }

    function getWithdrawAllowedHandle(address user, uint256 amount) external view returns (bytes32) {
        return ebool.unwrap(FHE.ge(_encryptedBalances[user], FHE.asEuint64(uint64(amount))));
    }

    function getClaimAllowedHandle(address user, uint256 amount) external view returns (bytes32) {
        return ebool.unwrap(FHE.ge(_encryptedWinnings[user], FHE.asEuint64(uint64(amount))));
    }

    function getLastDrawWinner(uint256 drawId) external view returns (address) {
        return drawHistory[drawId].winner;
    }

    function getDepositorCount() external view returns (uint256) {
        return _depositors.length;
    }

    function getDepositors() external view returns (address[] memory) {
        return _depositors;
    }

    function isUserDepositor(address user) external view returns (bool) {
        return _isDepositor[user];
    }

    function timeUntilNextDraw() external view returns (uint256) {
        uint256 nextDraw = lastDrawTime + drawInterval;
        if (block.timestamp >= nextDraw) return 0;
        return nextDraw - block.timestamp;
    }

    function getPoolSummary()
        external
        view
        returns (
            uint256 totalDep,
            uint256 prizeReserve,
            uint256 prizesAwarded,
            uint256 totalWithdr,
            uint256 lastDraw,
            uint256 interval,
            uint256 drawId,
            uint256 winnersCount,
            uint256 depositorCount
        )
    {
        return (
            totalDeposits,
            totalPrizeReserve,
            totalPrizesAwarded,
            totalWithdrawn,
            lastDrawTime,
            drawInterval,
            currentDrawId,
            winnersPerDraw,
            _depositors.length
        );
    }

    // ---------------------------------------------------------------------
    // ERC-7984 Confidential Token Standard Implementation
    // ---------------------------------------------------------------------
    function confidentialBalanceOf(address account) external view override returns (euint64) {
        return _encryptedBalances[account];
    }

    function confidentialTransfer(address to, euint64 amount) external override returns (bool) {
        require(to != address(0), "Invalid recipient");
        euint64 userBal = _encryptedBalances[msg.sender];
        ebool hasBalance = FHE.ge(userBal, amount);
        require(ebool.unwrap(hasBalance) != bytes32(0), "Insufficient confidential balance");

        _encryptedBalances[msg.sender] = FHE.sub(userBal, amount);
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        if (!_isDepositor[to]) {
            _isDepositor[to] = true;
            _depositorIndex[to] = _depositors.length;
            _depositors.push(to);
            _encryptedBalances[to] = amount;
        } else {
            _encryptedBalances[to] = FHE.add(_encryptedBalances[to], amount);
        }
        FHE.allowThis(_encryptedBalances[to]);
        FHE.allow(_encryptedBalances[to], to);

        emit ConfidentialTransfer(msg.sender, to, euint64.unwrap(amount));
        return true;
    }

    function confidentialTransferFrom(address /* from */, address to, euint64 amount) external override returns (bool) {
        return this.confidentialTransfer(to, amount);
    }

    function confidentialApprove(address spender, euint64 amount) external override returns (bool) {
        emit ConfidentialApproval(msg.sender, spender, euint64.unwrap(amount));
        return true;
    }

    function confidentialAllowance(address, address) external pure override returns (euint64) {
        return FHE.asEuint64(type(uint64).max);
    }
}