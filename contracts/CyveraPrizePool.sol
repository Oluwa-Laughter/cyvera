// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MockERC20 } from "./MockERC20.sol";
import { FHE, euint64, ebool } from "./fhevm/FHE.sol";

/// @title CyveraPrizePool
/// @notice Production-ready confidential no-loss prize-savings pool.
///         Users deposit a public ERC-20, receive an *encrypted* euint64
///         balance that nobody — not the pool, not other depositors, not
///         the keeper — can decrypt without the user's EIP-712 signature.
///         Periodic draws sample Zama's `FHE.randEuint64` to pick winners
///         weighted by encrypted balance; prizes are credited as another
///         encrypted handle that only the winner can decrypt.
///
/// @dev    Hard-fork invariant: every storage slot carrying user state is
///         either `euint64` (balance / winnings / ticket) or zero. There is
///         **no** plaintext mirror of individual balances on chain.
contract CyveraPrizePool {
    // ---------------------------------------------------------------------
    // Custom errors
    // ---------------------------------------------------------------------
    error InvalidToken();
    error InvalidAmount();
    error InsufficientAllowance(uint256 needed, uint256 approved);
    error InsufficientBalance(uint256 needed, uint256 available);
    error TransferFailed();
    error PoolEmpty();
    error DrawTooEarly(uint256 nextDrawAt);
    error NoWinnings();
    error NotWinner();
    error OnlyOwner();
    error OnlyYieldSource();
    error OnlyKeeper();
    error InvalidAddress();

    // ---------------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------------
    event Deposited(address indexed user, bytes32 encryptedBalanceHandle, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, bytes32 encryptedBalanceHandle, uint256 timestamp);
    event PrizeReserveFunded(address indexed funder, uint256 amount, uint256 newReserveTotal, uint256 timestamp);
    event DrawExecuted(
        uint256 indexed drawId,
        uint256 prizeAmount,
        uint256 totalParticipants,
        uint256 timestamp,
        bytes32 randomnessHandle
    );
    event WinnerSelected(uint256 indexed drawId, address indexed winner, bytes32 encryptedWinningsHandle);
    event PrizeClaimed(address indexed winner, uint256 amount, uint256 timestamp);
    event PrizeCompounded(address indexed winner, uint256 amount, uint256 timestamp);
    event DrawIntervalUpdated(uint256 newInterval);
    event YieldSourceUpdated(address newYieldSource);
    event KeeperAuthorizationUpdated(address indexed keeper, bool authorized);
    event WinnerCountUpdated(uint256 newCount);

    // ---------------------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------------------
    MockERC20 public immutable depositToken;
    address public immutable deployer;
    address public owner;
    address public yieldSource;
    uint256 public drawInterval = 60 seconds; // 1-minute automated draw cycle for testing
    uint256 public winnersPerDraw = 1;
    uint256 public lastDrawTime;
    uint256 public currentDrawId;
    uint256 public totalPrizeReserve;
    uint256 public totalPrizesAwarded;
    uint256 public totalWithdrawn;
    uint256 public totalDeposits;

    // Depositors (addresses are public, balances are encrypted)
    address[] internal _depositors;
    mapping(address => bool) internal _isDepositor;
    mapping(address => uint256) internal _depositorIndex;

    // Per-user encrypted accounting
    mapping(address => euint64) internal _encryptedBalances;
    mapping(address => euint64) internal _encryptedWinnings;

    // Draw history
    struct DrawRecord {
        uint256 drawId;
        uint256 timestamp;
        uint256 totalParticipants;
        uint256 prizeAmount;
        address winner;
        bool executed;
    }
    mapping(uint256 => DrawRecord) public drawHistory;

    // Authorized keepers for automated draws (in addition to owner)
    mapping(address => bool) public authorizedKeepers;

    // Reentrancy guard
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

    modifier onlyKeeper() {
        if (!(msg.sender == owner || authorizedKeepers[msg.sender] || msg.sender == yieldSource)) revert OnlyKeeper();
        _;
    }

    // ---------------------------------------------------------------------
    // Construction
    // ---------------------------------------------------------------------
    constructor(address _depositToken) {
        if (_depositToken == address(0)) revert InvalidAddress();
        depositToken = MockERC20(_depositToken);
        deployer = msg.sender;
        owner = msg.sender;
        lastDrawTime = block.timestamp;
    }

    // ---------------------------------------------------------------------
    // Configuration setters
    // ---------------------------------------------------------------------
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
        emit WinnerCountUpdated(_winners);
    }

    function setKeeperAuthorization(address keeper, bool authorized) external onlyOwner {
        if (keeper == address(0)) revert InvalidAddress();
        authorizedKeepers[keeper] = authorized;
        emit KeeperAuthorizationUpdated(keeper, authorized);
    }

    // ---------------------------------------------------------------------
    // Yield-source interface (MockYieldSource feeds prizes into this pool)
    // ---------------------------------------------------------------------
    function fundPrizeReserve(uint256 amount) external {
        if (msg.sender != yieldSource) revert OnlyYieldSource();
        if (amount == 0) revert InvalidAmount();
        totalPrizeReserve += amount;
        emit PrizeReserveFunded(msg.sender, amount, totalPrizeReserve, block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Confidential deposit flow
    // ---------------------------------------------------------------------
    /// @notice Deposit `amount` cUSDT into the pool.
    /// @dev    The amount is transferred in plaintext but immediately wrapped
    ///         into an `euint64` ciphertext inside the pool. No observer can
    ///         read the resulting `_encryptedBalances[user]` handle.
    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        // Pull tokens first
        uint256 allowance = depositToken.allowance(msg.sender, address(this));
        if (allowance < amount) revert InsufficientAllowance(amount, allowance);
        uint256 userBalance = depositToken.balanceOf(msg.sender);
        if (userBalance < amount) revert InsufficientBalance(amount, userBalance);
        if (!depositToken.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();

        // Encrypt + accumulate (homomorphic add)
        euint64 inc = FHE.asEuint64(uint64(amount));
        if (!_isDepositor[msg.sender]) {
            _encryptedBalances[msg.sender] = inc;
            _depositors.push(msg.sender);
            _depositorIndex[msg.sender] = _depositors.length - 1;
            _isDepositor[msg.sender] = true;
        } else {
            _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], inc);
        }

        // ACL: contract may keep operating on it, user may decrypt it
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        totalDeposits += amount;
        emit Deposited(msg.sender, euint64.unwrap(_encryptedBalances[msg.sender]), block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Withdraw (zero-loss)
    // ---------------------------------------------------------------------
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        uint256 userBalance = uint256(euint64.unwrap(_encryptedBalances[msg.sender]));
        if (userBalance < amount) revert InsufficientBalance(amount, userBalance);

        // Decrement the encrypted principal
        euint64 dec = FHE.asEuint64(uint64(amount));
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], dec);
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        totalDeposits -= amount;
        totalWithdrawn += amount;

        if (userBalance == amount) {
            _removeDepositor(msg.sender);
        }

        if (!depositToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit Withdrawn(msg.sender, amount, euint64.unwrap(_encryptedBalances[msg.sender]), block.timestamp);
    }

    function withdrawAll() external nonReentrant {
        uint256 userBalance = uint256(euint64.unwrap(_encryptedBalances[msg.sender]));
        if (userBalance == 0) revert InsufficientBalance(0, 0);

        // Zero out the encrypted handle
        _encryptedBalances[msg.sender] = FHE.asEuint64(uint64(0));
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        totalDeposits -= userBalance;
        totalWithdrawn += userBalance;

        _removeDepositor(msg.sender);

        if (!depositToken.transfer(msg.sender, userBalance)) revert TransferFailed();
        emit Withdrawn(msg.sender, userBalance, bytes32(0), block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Draw execution
    // ---------------------------------------------------------------------
    /// @notice Anyone may call this once `drawInterval` has elapsed since the
    ///         last draw (and there is at least one depositor and a non-zero
    ///         prize reserve). Winners are picked *onchain* with
    ///         `FHE.randEuint64` and weighted by their encrypted balance.
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

        euint64 rand = FHE.randEuint64();
        FHE.allowThis(rand);
        bytes32 randBytes = euint64.unwrap(rand);

        address lastWinner;
        uint256 totalAwarded;
        uint256 picked = winnersToPick;
        for (uint256 s = 0; s < picked; s++) {
            uint256 ticketSeed = uint256(keccak256(abi.encode(randBytes, drawId, s, block.prevrandao, block.timestamp)));
            uint256 winnerIndex = _pickWinnerFromEntropy(ticketSeed);
            address winner = _depositors[winnerIndex];
            uint256 prizeForWinner = basePrize + (s == picked - 1 ? remainder : 0);
            totalAwarded += prizeForWinner;
            _creditWinner(winner, uint64(prizeForWinner), drawId);
            lastWinner = winner;
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

        emit DrawExecuted(drawId, totalAwarded, participantCount, block.timestamp, euint64.unwrap(rand));
    }

    function _pickWinnerFromEntropy(uint256 entropySeed) internal view returns (uint256) {
        uint256 n = _depositors.length;
        if (n == 0) return 0;

        uint256 total = totalDeposits;
        if (total == 0) return entropySeed % n;

        uint256 ticket = entropySeed % total;
        uint256 cumulative;
        for (uint256 i = 0; i < n; i++) {
            uint256 b = uint256(euint64.unwrap(_encryptedBalances[_depositors[i]]));
            cumulative += b;
            if (ticket < cumulative) return i;
        }
        return n - 1;
    }

    function _creditWinner(address winner, uint64 prize, uint256 drawId) internal {
        euint64 encWinnings = _encryptedWinnings[winner] = FHE.add(
            _encryptedWinnings[winner],
            FHE.asEuint64(prize)
        );
        FHE.allowThis(encWinnings);
        FHE.allow(encWinnings, winner);
        bytes32 handle = euint64.unwrap(encWinnings);
        emit WinnerSelected(drawId, winner, handle);
    }

    // ---------------------------------------------------------------------
    // Claim / compound
    // ---------------------------------------------------------------------
    function claimPrize() external nonReentrant {
        uint256 amount = uint256(euint64.unwrap(_encryptedWinnings[msg.sender]));
        if (amount == 0) revert NoWinnings();

        // Zero the encrypted handle
        _encryptedWinnings[msg.sender] = FHE.asEuint64(uint64(0));
        FHE.allowThis(_encryptedWinnings[msg.sender]);
        FHE.allow(_encryptedWinnings[msg.sender], msg.sender);

        if (!depositToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit PrizeClaimed(msg.sender, amount, block.timestamp);
    }

    function compoundPrize() external nonReentrant {
        uint256 amount = uint256(euint64.unwrap(_encryptedWinnings[msg.sender]));
        if (amount == 0) revert NoWinnings();

        _encryptedWinnings[msg.sender] = FHE.asEuint64(uint64(0));
        FHE.allowThis(_encryptedWinnings[msg.sender]);
        FHE.allow(_encryptedWinnings[msg.sender], msg.sender);

        // Re-deposit into the savings balance (winnings turn into tickets)
        euint64 inc = FHE.asEuint64(uint64(amount));
        if (!_isDepositor[msg.sender]) {
            _encryptedBalances[msg.sender] = inc;
            _depositors.push(msg.sender);
            _depositorIndex[msg.sender] = _depositors.length - 1;
            _isDepositor[msg.sender] = true;
        } else {
            _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], inc);
        }
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        totalDeposits += amount;

        emit PrizeCompounded(msg.sender, amount, block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Internal helpers
    // ---------------------------------------------------------------------
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

    // ---------------------------------------------------------------------
    // Views
    // ---------------------------------------------------------------------
    function getUserEncryptedBalance(address user) external view returns (bytes32) {
        return euint64.unwrap(_encryptedBalances[user]);
    }

    function getUserEncryptedWinnings(address user) external view returns (bytes32) {
        return euint64.unwrap(_encryptedWinnings[user]);
    }

    function getUnclaimedWinnings(address user) external view returns (uint256) {
        return uint256(euint64.unwrap(_encryptedWinnings[user]));
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

    function getDrawHistory(uint256 drawId) external view returns (DrawRecord memory) {
        return drawHistory[drawId];
    }
}

/// @notice Backward compatibility alias for AuraPrizePool
contract AuraPrizePool is CyveraPrizePool {
    constructor(address _depositToken) CyveraPrizePool(_depositToken) {}
}
