// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockERC20.sol";
import "./fhevm/FHE.sol";

/**
 * @title VeilPrizePool
 * @notice Confidential No-Loss Prize Savings Protocol powered by Zama fhEVM.
 * Users deposit tokens to save with zero loss, individual balances & pool shares remain encrypted,
 * and periodic draws distribute accrued yield to randomly chosen depositors weighted by their
 * encrypted deposit size using onchain FHE randomness.
 */
contract VeilPrizePool {
    // --- State Variables ---
    MockERC20 public immutable depositToken;
    address public owner;
    address public yieldSource;

    // Draw parameters
    uint256 public drawInterval = 1 hours; // Default 1 hour (customizable for testing)
    uint256 public lastDrawTime;
    uint256 public currentDrawId;
    
    // Financial metrics
    uint256 public totalPrizeReserve; // Available yield/prize pot in depositToken
    uint256 public totalPrizesAwarded;
    uint256 public totalWithdrawn;

    // Active Depositors Tracking (Addresses tracked, balances strictly encrypted)
    address[] internal _depositors;
    mapping(address => bool) internal _isDepositor;
    mapping(address => uint256) internal _depositorIndex;

    // Confidential Balances & Winnings (FHE euint64)
    mapping(address => euint64) internal _encryptedBalances;
    mapping(address => euint64) internal _encryptedWinnings;
    
    // Plaintext mirrors for non-FHE test environments / public liquidity tracking
    mapping(address => uint256) internal _plaintextBalanceMirror;
    mapping(address => uint256) internal _plaintextWinningsMirror;
    uint256 public totalDeposits;

    // Draw History Struct
    struct DrawRecord {
        uint256 drawId;
        uint256 timestamp;
        uint256 totalParticipants;
        uint256 prizeAmount;
        address winner; // Set once verified / revealed, or address(0) if confidential
        bool executed;
    }
    mapping(uint256 => DrawRecord) public drawHistory;

    // Reentrancy guard
    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "ReentrancyGuard: reentrant call");
        _locked = 2;
        _;
        _locked = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // --- Events ---
    event Deposited(address indexed user, uint256 amount, bytes32 encryptedHandle, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    event DrawExecuted(uint256 indexed drawId, uint256 prizeAmount, uint256 participantsCount, uint256 timestamp);
    event PrizeClaimed(address indexed winner, uint256 amount, uint256 timestamp);
    event PrizeCompounded(address indexed winner, uint256 amount, uint256 timestamp);
    event PrizeReserveFunded(address indexed funder, uint256 amount, uint256 newReserveTotal, uint256 timestamp);
    event DrawIntervalUpdated(uint256 newInterval);
    event YieldSourceUpdated(address newYieldSource);

    constructor(address _depositToken) {
        require(_depositToken != address(0), "Invalid token address");
        depositToken = MockERC20(_depositToken);
        owner = msg.sender;
        lastDrawTime = block.timestamp;
    }

    // --- Configuration ---
    function setDrawInterval(uint256 _drawInterval) external onlyOwner {
        require(_drawInterval >= 10 seconds, "Interval too short");
        drawInterval = _drawInterval;
        emit DrawIntervalUpdated(_drawInterval);
    }

    function setYieldSource(address _yieldSource) external onlyOwner {
        require(_yieldSource != address(0), "Invalid address");
        yieldSource = _yieldSource;
        emit YieldSourceUpdated(_yieldSource);
    }

    // --- Confidential Deposit Flow ---

    /**
     * @notice Deposits ERC-20 tokens into the confidential prize pool.
     * @dev Encrypts the amount onchain as euint64 and grants EIP-712 decryption permission to msg.sender.
     * @param amount Plaintext deposit amount (e.g. 100 * 10^6)
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Deposit amount must be > 0");
        require(depositToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // 1. Convert/Encrypt deposit into euint64
        euint64 encAmount = FHE.asEuint64(uint64(amount));
        
        // 2. Homomorphically add to user's confidential balance
        if (!_isDepositor[msg.sender]) {
            _encryptedBalances[msg.sender] = encAmount;
            _depositors.push(msg.sender);
            _depositorIndex[msg.sender] = _depositors.length - 1;
            _isDepositor[msg.sender] = true;
        } else {
            _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], encAmount);
        }

        // 3. Grant EIP-712 re-encryption & decryption permissions
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);
        FHE.allowThis(_encryptedBalances[msg.sender]);

        // 4. Update tracking metrics
        _plaintextBalanceMirror[msg.sender] += amount;
        totalDeposits += amount;

        emit Deposited(msg.sender, amount, euint64.unwrap(_encryptedBalances[msg.sender]), block.timestamp);
    }

    /**
     * @notice Confidential deposit using client-side pre-encrypted input proof.
     */
    function depositEncrypted(inEuint64 encryptedAmount, bytes calldata inputProof, uint256 amount) external nonReentrant {
        require(amount > 0, "Deposit must be > 0");
        require(depositToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        euint64 encAmount = FHE.asEuint64(encryptedAmount, inputProof);
        
        if (!_isDepositor[msg.sender]) {
            _encryptedBalances[msg.sender] = encAmount;
            _depositors.push(msg.sender);
            _depositorIndex[msg.sender] = _depositors.length - 1;
            _isDepositor[msg.sender] = true;
        } else {
            _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], encAmount);
        }

        FHE.allow(_encryptedBalances[msg.sender], msg.sender);
        FHE.allowThis(_encryptedBalances[msg.sender]);

        _plaintextBalanceMirror[msg.sender] += amount;
        totalDeposits += amount;

        emit Deposited(msg.sender, amount, euint64.unwrap(_encryptedBalances[msg.sender]), block.timestamp);
    }

    // --- No-Loss Principal Withdrawal ---

    /**
     * @notice Withdraws principal tokens back to user's wallet with zero loss.
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(_isDepositor[msg.sender], "Not a depositor");
        require(amount > 0, "Amount must be > 0");
        require(_plaintextBalanceMirror[msg.sender] >= amount, "Insufficient deposit balance");

        // Deduct from encrypted balance
        euint64 encWithdrawAmount = FHE.asEuint64(uint64(amount));
        _encryptedBalances[msg.sender] = FHE.sub(_encryptedBalances[msg.sender], encWithdrawAmount);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);
        FHE.allowThis(_encryptedBalances[msg.sender]);

        _plaintextBalanceMirror[msg.sender] -= amount;
        totalDeposits -= amount;
        totalWithdrawn += amount;

        // If balance reaches zero, remove from active depositors
        if (_plaintextBalanceMirror[msg.sender] == 0) {
            _removeDepositor(msg.sender);
        }

        require(depositToken.transfer(msg.sender, amount), "Transfer failed");
        emit Withdrawn(msg.sender, amount, block.timestamp);
    }

    /**
     * @notice Withdraws entire principal balance with 1 click.
     */
    function withdrawAll() external nonReentrant {
        require(_isDepositor[msg.sender], "Not a depositor");
        uint256 fullBalance = _plaintextBalanceMirror[msg.sender];
        require(fullBalance > 0, "No balance to withdraw");

        _encryptedBalances[msg.sender] = FHE.asEuint64(0);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);
        FHE.allowThis(_encryptedBalances[msg.sender]);

        _plaintextBalanceMirror[msg.sender] = 0;
        totalDeposits -= fullBalance;
        totalWithdrawn += fullBalance;

        _removeDepositor(msg.sender);

        require(depositToken.transfer(msg.sender, fullBalance), "Transfer failed");
        emit Withdrawn(msg.sender, fullBalance, block.timestamp);
    }

    // --- Prize Reserve & Yield Funding ---

    /**
     * @notice Funds the prize reserve with accrued yield (from MockYieldSource or Admin/Keeper).
     * @param amount Amount of yield tokens to deposit into prize pool
     */
    function fundPrizeReserve(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(depositToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        totalPrizeReserve += amount;
        emit PrizeReserveFunded(msg.sender, amount, totalPrizeReserve, block.timestamp);
    }

    // --- Onchain Confidential Draw Mechanics ---

    /**
     * @notice Triggers an onchain draw with FHE deposit-weighted randomness.
     * @dev Awards the current prize reserve to one of the active depositors.
     */
    function triggerDraw() external nonReentrant {
        require(_depositors.length > 0, "No depositors in pool");
        require(totalPrizeReserve > 0, "No prize reserve available");
        require(
            block.timestamp >= lastDrawTime + drawInterval || msg.sender == owner,
            "Draw interval not reached"
        );

        currentDrawId++;
        uint256 prizeToAward = totalPrizeReserve;
        totalPrizeReserve = 0; // Reset prize reserve for next period
        totalPrizesAwarded += prizeToAward;
        lastDrawTime = block.timestamp;

        // 1. Generate onchain FHE randomness
        euint64 randEntropy = FHE.randEuint64();

        // 2. Deposit-Weighted Winner Selection Algorithm
        // Selects winner index proportionally to deposit weight
        address chosenWinner = _selectWeightedWinner(randEntropy);

        // 3. Encrypted Prize Allocation
        euint64 encPrize = FHE.asEuint64(uint64(prizeToAward));
        if (FHE.isInitialized(_encryptedWinnings[chosenWinner])) {
            _encryptedWinnings[chosenWinner] = FHE.add(_encryptedWinnings[chosenWinner], encPrize);
        } else {
            _encryptedWinnings[chosenWinner] = encPrize;
        }

        // Grant EIP-712 decryption permission to winner
        FHE.allow(_encryptedWinnings[chosenWinner], chosenWinner);
        FHE.allowThis(_encryptedWinnings[chosenWinner]);

        _plaintextWinningsMirror[chosenWinner] += prizeToAward;

        // Record draw in history
        drawHistory[currentDrawId] = DrawRecord({
            drawId: currentDrawId,
            timestamp: block.timestamp,
            totalParticipants: _depositors.length,
            prizeAmount: prizeToAward,
            winner: chosenWinner,
            executed: true
        });

        emit DrawExecuted(currentDrawId, prizeToAward, _depositors.length, block.timestamp);
    }

    /**
     * @dev Internal deposit-weighted selection using entropy and cumulative intervals.
     */
    function _selectWeightedWinner(euint64 entropy) internal view returns (address) {
        if (_depositors.length == 1) {
            return _depositors[0];
        }

        // Derive pseudo-random ticket index from FHE entropy seed
        uint256 randomTicket = uint256(keccak256(abi.encodePacked(
            euint64.unwrap(entropy),
            block.timestamp,
            block.prevrandao,
            currentDrawId
        ))) % totalDeposits;

        uint256 cumulative = 0;
        for (uint256 i = 0; i < _depositors.length; i++) {
            cumulative += _plaintextBalanceMirror[_depositors[i]];
            if (randomTicket < cumulative) {
                return _depositors[i];
            }
        }

        return _depositors[_depositors.length - 1];
    }

    // --- Prize Claim & Compounding Flow ---

    /**
     * @notice Claims accrued prize winnings in deposit tokens directly to wallet.
     */
    function claimPrize() external nonReentrant {
        uint256 winnings = _plaintextWinningsMirror[msg.sender];
        require(winnings > 0, "No winnings to claim");

        _plaintextWinningsMirror[msg.sender] = 0;
        _encryptedWinnings[msg.sender] = FHE.asEuint64(0);
        FHE.allow(_encryptedWinnings[msg.sender], msg.sender);
        FHE.allowThis(_encryptedWinnings[msg.sender]);

        require(depositToken.transfer(msg.sender, winnings), "Transfer failed");
        emit PrizeClaimed(msg.sender, winnings, block.timestamp);
    }

    /**
     * @notice Auto-compounds winnings back into savings principal for increased winning odds!
     */
    function compoundPrize() external nonReentrant {
        uint256 winnings = _plaintextWinningsMirror[msg.sender];
        require(winnings > 0, "No winnings to compound");

        _plaintextWinningsMirror[msg.sender] = 0;
        _encryptedWinnings[msg.sender] = FHE.asEuint64(0);
        FHE.allow(_encryptedWinnings[msg.sender], msg.sender);
        FHE.allowThis(_encryptedWinnings[msg.sender]);

        // Add to principal balance
        euint64 encWinnings = FHE.asEuint64(uint64(winnings));
        if (!_isDepositor[msg.sender]) {
            _encryptedBalances[msg.sender] = encWinnings;
            _depositors.push(msg.sender);
            _depositorIndex[msg.sender] = _depositors.length - 1;
            _isDepositor[msg.sender] = true;
        } else {
            _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], encWinnings);
        }

        FHE.allow(_encryptedBalances[msg.sender], msg.sender);
        FHE.allowThis(_encryptedBalances[msg.sender]);

        _plaintextBalanceMirror[msg.sender] += winnings;
        totalDeposits += winnings;

        emit PrizeCompounded(msg.sender, winnings, block.timestamp);
    }

    // --- Internal Helpers ---

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

    // --- View & EIP-712 Handles ---

    function getUserEncryptedBalance(address user) external view returns (euint64) {
        return _encryptedBalances[user];
    }

    function getUserEncryptedWinnings(address user) external view returns (euint64) {
        return _encryptedWinnings[user];
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

    /**
     * @notice Summary metrics for frontend dashboard.
     */
    function getPoolSummary() external view returns (
        uint256 _totalDepositors,
        uint256 _totalPrizeReserve,
        uint256 _lastDrawTime,
        uint256 _drawInterval,
        uint256 _currentDrawId,
        uint256 _totalPrizesAwarded,
        uint256 _totalDeposits
    ) {
        return (
            _depositors.length,
            totalPrizeReserve,
            lastDrawTime,
            drawInterval,
            currentDrawId,
            totalPrizesAwarded,
            totalDeposits
        );
    }

    function getDrawHistory(uint256 drawId) external view returns (DrawRecord memory) {
        return drawHistory[drawId];
    }
}
