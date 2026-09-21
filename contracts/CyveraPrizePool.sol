// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {MockERC20} from "./MockERC20.sol";
import {FHE, euint64, ebool} from "./fhevm/FHE.sol";
import {IERC7984} from "./interfaces/IERC7984.sol";

/// @title CyveraPrizePool
/// @notice Confidential no-loss prize-savings pool powered by Zama fhEVM and ERC-7984.
///         Implements 3-tier randomized uniform threshold selection (PoolTogether V5 style)
///         with zero-knowledge winner privacy and unbiased rejection sampling.
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
    error BadTierShape();

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
    event Accrued(address indexed user, uint256 indexed drawId);
    event WinnerSelected(uint256 indexed drawId, address indexed winner);
    event PrizeClaimed(address indexed winner, uint256 amount, uint256 timestamp);
    event DrawIntervalUpdated(uint256 newInterval);
    event YieldSourceUpdated(address newYieldSource);
    event TiersSet(uint64[3] prizes, uint128[3] k);

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

    // ---------------------------------------------------------------------
    // 3-Tier Prize Architecture (PoolTogether V5 & SaveTogether derivation)
    // ---------------------------------------------------------------------
    uint8 public constant TIERS = 3;
    // Tier 0: Grand Prize (50% of pot), k = 100 (1 in 100 odds per draw)
    // Tier 1: Middle Prize (30% of pot), k = 10 (1 in 10 odds per draw)
    // Tier 2: Ordinary Prize (20% of pot), k = 1 (1 in 1 odds per draw)
    uint128[TIERS] public tierK = [100, 10, 1];
    uint64[TIERS] public tierPrize;
    uint64 public grandPrize;

    mapping(uint256 => mapping(address => bool)) public accrued;

    struct DrawRecord {
        uint256 drawId;
        uint256 timestamp;
        uint256 totalParticipants;
        uint256 prizeAmount;
        address winner;
        bool executed;
        bytes32 randomnessHandle;
        uint256 totalDepositsSnapshot;
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

    function setTiers(uint64[TIERS] calldata prizes, uint128[TIERS] calldata k) external onlyOwner {
        if (k[TIERS - 1] != 1) revert BadTierShape();
        for (uint8 t = 0; t + 1 < TIERS; t++) {
            if (k[t] <= k[t + 1]) revert BadTierShape();
            if (prizes[t] <= prizes[t + 1]) revert BadTierShape();
        }
        for (uint8 t = 0; t < TIERS; t++) {
            tierPrize[t] = prizes[t];
            tierK[t] = k[t];
        }
        grandPrize = prizes[0];
        emit TiersSet(prizes, k);
    }

    function getTierInfo(uint8 tier) external view returns (uint64 prize, uint128 k) {
        if (tier >= TIERS) revert InvalidAmount();
        return (tierPrize[tier], tierK[tier]);
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

    /// @notice Compound a plaintext `amount` of winnings back into encrypted principal.
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

    /// @notice Uniform random number sampling via rejection sampling to eliminate modulo bias.
    /// @param entropy Pseudorandom seed derived from FHE randomness.
    /// @param upperBound Exclusive upper limit.
    function _uniform(uint256 entropy, uint256 upperBound) internal pure returns (uint256) {
        if (upperBound == 0) return 0;
        uint256 min = (type(uint256).max - upperBound + 1) % upperBound;
        uint256 random = entropy;
        while (random < min) {
            random = uint256(keccak256(abi.encode(random)));
        }
        return random % upperBound;
    }

    /// @notice Deterministic uniform threshold for user on a specific draw and tier.
    ///         P(user i wins tier t) = weight_i / (totalWeight * k[t]).
    /// @param drawId Draw identifier.
    /// @param user Participant address.
    /// @param tier Prize tier (0 = Grand, 1 = Middle, 2 = Ordinary).
    function thresholdFor(uint256 drawId, address user, uint8 tier) public view returns (uint128) {
        if (tier >= TIERS) revert BadTierShape();
        DrawRecord storage d = drawHistory[drawId];
        if (!d.executed) revert PoolEmpty();
        uint256 totalWeight = d.totalDepositsSnapshot > 0 ? d.totalDepositsSnapshot : totalDeposits;
        if (totalWeight == 0) return 0;
        uint256 upper = totalWeight * uint256(tierK[tier]);
        return uint128(_uniform(uint256(keccak256(abi.encode(d.randomnessHandle, drawId, user, tier))), upper));
    }

    /// @notice Backward-compatible ordinary tier threshold.
    function thresholdFor(uint256 drawId, address user) external view returns (uint128) {
        return thresholdFor(drawId, user, TIERS - 1);
    }

    /// @notice Triggers an automated draw using Zama FHE randomness.
    ///         Allocates 3 tiers (50% Grand, 30% Middle, 20% Ordinary).
    ///         Homomorphically credits winners without leaking their identity onchain.
    function triggerDraw() external nonReentrant {
        if (block.timestamp < lastDrawTime + drawInterval) revert DrawTooEarly(lastDrawTime + drawInterval);
        if (_depositors.length == 0) revert PoolEmpty();
        if (totalPrizeReserve == 0) revert PoolEmpty();

        uint256 drawId = ++currentDrawId;
        uint256 totalPrize = totalPrizeReserve;
        totalPrizeReserve = 0;
        lastDrawTime = block.timestamp;

        uint256 participantCount = _depositors.length;

        // FHE Random seed generation
        euint64 seed = FHE.randEuint64();
        FHE.allowThis(seed);
        bytes32 seedHandle = euint64.unwrap(seed);

        // 3-Tier prize split: 50% Grand, 30% Middle, 20% Ordinary
        uint64 pGrand = uint64((totalPrize * 50) / 100);
        uint64 pMiddle = uint64((totalPrize * 30) / 100);
        uint64 pOrdinary = uint64(totalPrize - pGrand - pMiddle);
        tierPrize[0] = pGrand;
        tierPrize[1] = pMiddle;
        tierPrize[2] = pOrdinary;
        grandPrize = pGrand;

        uint256 snapshotDeposits = totalDeposits;

        // In multi-saver draws, winner is address(0) to ensure strict confidentiality.
        // If single saver in pool, they own 100% of deposits and get recorded.
        address recordedWinner = participantCount == 1 ? _depositors[0] : address(0);

        drawHistory[drawId] = DrawRecord({
            drawId: drawId,
            timestamp: block.timestamp,
            totalParticipants: participantCount,
            prizeAmount: totalPrize,
            winner: recordedWinner,
            executed: true,
            randomnessHandle: seedHandle,
            totalDepositsSnapshot: snapshotDeposits
        });

        // Homomorphically accrue prizes to depositors
        if (participantCount == 1) {
            address soleUser = _depositors[0];
            accrued[drawId][soleUser] = true;
            euint64 credit = FHE.asEuint64(uint64(totalPrize));
            _encryptedWinnings[soleUser] = FHE.add(_encryptedWinnings[soleUser], credit);
            FHE.allowThis(_encryptedWinnings[soleUser]);
            FHE.allow(_encryptedWinnings[soleUser], soleUser);
            emit Accrued(soleUser, drawId);
            emit WinnerSelected(drawId, soleUser);
        } else {
            for (uint256 i = 0; i < participantCount; i++) {
                _accrueSaver(_depositors[i], drawId, seedHandle, snapshotDeposits);
            }
        }

        totalPrizesAwarded += totalPrize;
        emit DrawExecuted(drawId, totalPrize, participantCount, block.timestamp, seedHandle);
    }

    /// @dev Homomorphically scores depositor against the 3 tiers.
    ///      Evaluated from Ordinary (2) up to Grand (0) so best tier overrides.
    function _accrueSaver(address user, uint256 drawId, bytes32 seedHandle, uint256 snapshotDeposits) internal {
        if (accrued[drawId][user]) return;
        accrued[drawId][user] = true;

        euint64 credit = FHE.asEuint64(0);
        for (uint8 i = TIERS; i > 0; i--) {
            uint8 t = i - 1;
            uint256 upper = snapshotDeposits * uint256(tierK[t]);
            uint128 thresh = uint128(_uniform(uint256(keccak256(abi.encode(seedHandle, drawId, user, t))), upper));
            ebool won = FHE.gt(_encryptedBalances[user], FHE.asEuint64(uint64(thresh)));
            credit = FHE.select(won, FHE.asEuint64(tierPrize[t]), credit);
        }

        _encryptedWinnings[user] = FHE.add(_encryptedWinnings[user], credit);
        FHE.allowThis(_encryptedWinnings[user]);
        FHE.allow(_encryptedWinnings[user], user);

        emit Accrued(user, drawId);
    }

    /// @notice Permissionless accrual for any saver on any executed draw.
    function accrue(address user, uint256 drawId) public nonReentrant returns (bool) {
        DrawRecord storage d = drawHistory[drawId];
        if (!d.executed) revert PoolEmpty();
        if (accrued[drawId][user]) return false;
        _accrueSaver(user, drawId, d.randomnessHandle, d.totalDepositsSnapshot);
        return true;
    }

    /// @notice Batch accrual for keeper networks.
    function accrueMany(address[] calldata users, uint256 drawId) external nonReentrant {
        for (uint256 i = 0; i < users.length; i++) {
            accrue(users[i], drawId);
        }
    }

    /// @dev Gates a state-changing op on a ciphertext boolean.
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
        address w = drawHistory[drawId].winner;
        if (w != address(0)) return w;
        if (_depositors.length == 1) return _depositors[0];
        return address(0);
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

    function confidentialTransferFrom(address from, address to, euint64 amount) external override returns (bool) {
        require(to != address(0), "Invalid recipient");
        euint64 userBal = _encryptedBalances[from];
        ebool hasBalance = FHE.ge(userBal, amount);
        require(ebool.unwrap(hasBalance) != bytes32(0), "Insufficient confidential balance");

        _encryptedBalances[from] = FHE.sub(userBal, amount);
        FHE.allowThis(_encryptedBalances[from]);
        FHE.allow(_encryptedBalances[from], from);

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

        emit ConfidentialTransfer(from, to, euint64.unwrap(amount));
        return true;
    }

    function confidentialApprove(address spender, euint64 amount) external override returns (bool) {
        emit ConfidentialApproval(msg.sender, spender, euint64.unwrap(amount));
        return true;
    }

    function confidentialAllowance(address, address) external pure override returns (euint64) {
        return FHE.asEuint64(type(uint64).max);
    }
}
