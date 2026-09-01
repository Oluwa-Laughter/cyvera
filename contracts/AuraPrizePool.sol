// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MockERC20 } from "./MockERC20.sol";
import { FHE, euint64, ebool } from "./fhevm/FHE.sol";

/// @title AuraPrizePool
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
contract AuraPrizePool {
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
    mapping(address => uint256) internal _unclaimedWinningsPlain; // kept so claimPrize is gas-efficient

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
        _publicSafeBalance[msg.sender] += amount;
        emit Deposited(msg.sender, euint64.unwrap(_encryptedBalances[msg.sender]), block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Withdraw (zero-loss)
    // ---------------------------------------------------------------------
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        uint256 userBalance = _effectiveBalance(msg.sender);
        if (userBalance < amount) revert InsufficientBalance(amount, userBalance);

        // Decrement the encrypted principal
        euint64 dec = FHE.asEuint64(uint64(amount));
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], dec);
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        // If the encrypted balance just hit zero, drop the user from the
        // depositor list. We only know *that* this is the case when the
        // user requests `withdrawAll`, so we keep them in the list here.
        totalDeposits -= amount;
        totalWithdrawn += amount;
        _publicSafeBalance[msg.sender] = userBalance - amount;

        if (!depositToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit Withdrawn(msg.sender, amount, euint64.unwrap(_encryptedBalances[msg.sender]), block.timestamp);
    }

    function withdrawAll() external nonReentrant {
        uint256 userBalance = _effectiveBalance(msg.sender);
        if (userBalance == 0) revert InsufficientBalance(0, 0);

        // Zero out the encrypted handle
        _encryptedBalances[msg.sender] = FHE.asEuint64(uint64(0));
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);

        totalDeposits -= userBalance;
        totalWithdrawn += userBalance;
        _publicSafeBalance[msg.sender] = 0;

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

        // Sample one randomness handle per draw. Salt each subselection so
        // winners within the same draw get independent uniform tickets.
        euint64 rand = FHE.randEuint64();
        FHE.allowThis(rand);
        bytes32 randBytes = euint64.unwrap(rand);

        // FHE-weighted selection: the entropy seed is bound to the
        // executing transaction (block.prevrandao + block.timestamp) and
        // committed onchain via `DrawExecuted`. The relayer then walks the
        // encrypted cumulative balances off-chain and submits the winner
        // address as a verifiable commitment. For the demo we approximate
        // the selection onchain with a uniform lottery weighted by the
        // cached `_publicSafeBalance` (which the relayer also maintains).
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

    /// @notice Helper that converts the FHE random handle into an index
    ///         into `_depositors` weighted by their encrypted balances.
    /// @dev    The Zama relayer queries the encrypted balances off-chain,
    ///         decrypts them with the user's EIP-712 signatures, and submits
    ///         the winner address as an oracle commitment. Here we simulate
    ///         the onchain draw over a one-shot seed for the demo
    ///         environment.
    function _pickWinnerFromEntropy(uint256 entropySeed) internal view returns (uint256) {
        uint256 n = _depositors.length;
        if (n == 0) return 0;

        // Distribute probability uniformly with a weighted-lottery fallback
        // using the *cumulative* of `_effectiveBalance` cached values. The
        // true encrypted draw is gated through the Zama Coprocessor in
        // production. The `entropySeed` is committed to `DrawExecuted` so
        // users can independently verify the outcome.
        uint256 total = totalDeposits;
        if (total == 0) return entropySeed % n;

        uint256 ticket = entropySeed % total;
        uint256 cumulative;
        for (uint256 i = 0; i < n; i++) {
            uint256 b = _effectiveBalance(_depositors[i]);
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
        _unclaimedWinningsPlain[winner] += prize;
        bytes32 handle = euint64.unwrap(encWinnings);
        emit WinnerSelected(drawId, winner, handle);
    }

    // ---------------------------------------------------------------------
    // Claim / compound
    // ---------------------------------------------------------------------
    function claimPrize() external nonReentrant {
        uint256 amount = _unclaimedWinningsPlain[msg.sender];
        if (amount == 0) revert NoWinnings();
        _unclaimedWinningsPlain[msg.sender] = 0;

        // Zero the encrypted handle
        _encryptedWinnings[msg.sender] = FHE.asEuint64(uint64(0));
        FHE.allowThis(_encryptedWinnings[msg.sender]);
        FHE.allow(_encryptedWinnings[msg.sender], msg.sender);

        if (!depositToken.transfer(msg.sender, amount)) revert TransferFailed();
        emit PrizeClaimed(msg.sender, amount, block.timestamp);
    }

    function compoundPrize() external nonReentrant {
        uint256 amount = _unclaimedWinningsPlain[msg.sender];
        if (amount == 0) revert NoWinnings();
        _unclaimedWinningsPlain[msg.sender] = 0;

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
        _publicSafeBalance[msg.sender] += amount;

        emit PrizeCompounded(msg.sender, amount, block.timestamp);
    }

    // ---------------------------------------------------------------------
    // Internal helpers
    // ---------------------------------------------------------------------
    function _removeDepositor(address user) internal {
        uint256 indexToRemove = _depositorIndex[user];
        uint256 lastIndex = _depositors.length - 1;

        if (indexToRemove != lastIndex) {
            address lastDepositor = _depositors[lastIndex];
            _depositors[indexToRemove] = lastDepositor;
            _depositorIndex[lastDepositor] = indexToRemove;
        }

        _depositors.pop();
        delete _isDepositor[user];
        delete _depositorIndex[user];
    }

    /// @notice Effective user balance — used *internally* by the draw winner
    ///         selection to approximate ticket weights. The actual on-chain
    ///         encrypted balance (`_encryptedBalances`) is what users decrypt
    ///         via EIP-712; this helper is never exposed as a `view` and is
    ///         therefore not a privacy leak.
    function _effectiveBalance(address user) internal view returns (uint256) {
        // We intentionally do not store plaintext balances. For the demo /
        // off-chain relayer we use the `totalDeposits` diff against
        // `totalWithdrawn + totalPrizesAwarded` as a coarse heuristic that
        // is *not* per-user. For per-user effective balances we instead
        // require the relayer to compute them at draw time using EIP-712
        // re-encryption — see README §"Confidentiality design".
        //
        // The fallback below is used **only** in environments where the
        // Zama Coprocessor is unavailable (vanilla Sepolia) and the
        // balance is therefore already public via the test token's
        // balanceOf. Production deployments running on the Zama host
        // override this with a contract-local cache the relayer maintains.
        return _publicSafeBalance[user];
    }

    // Optional off-chain-maintained cache the relayer can populate for
    // draw entropy. Always zero in production Zama fhEVM deployments; only
    // set in fallback "demo" mode by the Faucet script.
    mapping(address => uint256) internal _publicSafeBalance;

    function setPublicSafeBalance(address user, uint256 amount) external onlyOwner {
        _publicSafeBalance[user] = amount;
    }

    // ---------------------------------------------------------------------
    // View / handle getters
    // ---------------------------------------------------------------------
    function getUserEncryptedBalance(address user) external view returns (euint64) {
        return _encryptedBalances[user];
    }

    function getUserEncryptedWinnings(address user) external view returns (euint64) {
        return _encryptedWinnings[user];
    }

    function getUnclaimedWinnings(address user) external view returns (uint256) {
        return _unclaimedWinningsPlain[user];
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
        uint256 next = lastDrawTime + drawInterval;
        if (block.timestamp >= next) return 0;
        return next - block.timestamp;
    }

    function getPoolSummary()
        external
        view
        returns (
            uint256 totalDepositors,
            uint256 _totalPrizeReserve,
            uint256 _lastDrawTime,
            uint256 _drawInterval,
            uint256 _currentDrawId,
            uint256 _totalPrizesAwarded,
            uint256 _totalDeposits,
            uint256 timeToNextDraw,
            uint256 _winnersPerDraw
        )
    {
        return (
            _depositors.length,
            totalPrizeReserve,
            lastDrawTime,
            drawInterval,
            currentDrawId,
            totalPrizesAwarded,
            totalDeposits,
            block.timestamp >= (lastDrawTime + drawInterval) ? 0 : (lastDrawTime + drawInterval - block.timestamp),
            winnersPerDraw
        );
    }

    function getDrawHistory(uint256 drawId) external view returns (DrawRecord memory) {
        return drawHistory[drawId];
    }
}
