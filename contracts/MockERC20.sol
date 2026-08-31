// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockERC20 (cUSDT / Mock Prize Token)
 * @notice Standard ERC-20 token with a 1-click testnet faucet for testing the Confidential Prize Savings Protocol.
 */
contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event FaucetUsed(address indexed recipient, uint256 amount);

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        // Mint initial supply to deployer (1,000,000 tokens)
        _mint(msg.sender, 1_000_000 * (10 ** uint256(_decimals)));
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = allowance[from][msg.sender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            allowance[from][msg.sender] = currentAllowance - amount;
        }
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @notice 1-Click Faucet for Hackathon judges & testers.
     * @dev Mints 1,000 tokens directly to caller.
     */
    function faucet() external {
        uint256 faucetAmount = 1_000 * (10 ** uint256(decimals));
        _mint(msg.sender, faucetAmount);
        emit FaucetUsed(msg.sender, faucetAmount);
    }

    /**
     * @notice Custom mint for testing or mock yield reserves.
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(balanceOf[from] >= amount, "ERC20: burn amount exceeds balance");
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(balanceOf[from] >= amount, "ERC20: transfer amount exceeds balance");

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "ERC20: mint to zero address");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}
