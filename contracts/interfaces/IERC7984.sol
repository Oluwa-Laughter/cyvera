// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { euint64 } from "../fhevm/FHE.sol";

/**
 * @title IERC7984
 * @notice Interface for the ERC-7984 Confidential Fungible Token Standard on Zama fhEVM.
 * @dev Specifies standard encrypted balance queries and confidential operations.
 */
interface IERC7984 {
    /**
     * @notice Returns the encrypted balance handle of `account`.
     * @param account The address to inspect.
     * @return The euint64 encrypted balance handle.
     */
    function confidentialBalanceOf(address account) external view returns (euint64);

    /**
     * @notice Performs a confidential transfer of `amount` to `to`.
     * @param to Recipient address.
     * @param amount Encrypted transfer amount handle.
     * @return True if transfer succeeded.
     */
    function confidentialTransfer(address to, euint64 amount) external returns (bool);

    /**
     * @notice Performs a confidential transfer from `from` to `to` using allowance.
     * @param from Sender address.
     * @param to Recipient address.
     * @param amount Encrypted transfer amount handle.
     * @return True if transfer succeeded.
     */
    function confidentialTransferFrom(address from, address to, euint64 amount) external returns (bool);

    /**
     * @notice Sets a confidential allowance for `spender`.
     * @param spender Approved spender address.
     * @param amount Encrypted allowance amount handle.
     * @return True if approval succeeded.
     */
    function confidentialApprove(address spender, euint64 amount) external returns (bool);

    /**
     * @notice Returns the confidential allowance granted by `owner` to `spender`.
     * @param owner Approving account.
     * @param spender Spender account.
     * @return Encrypted allowance amount handle.
     */
    function confidentialAllowance(address owner, address spender) external view returns (euint64);

    /**
     * @notice Emitted on confidential transfers.
     */
    event ConfidentialTransfer(address indexed from, address indexed to, bytes32 amountHandle);

    /**
     * @notice Emitted on confidential approvals.
     */
    event ConfidentialApproval(address indexed owner, address indexed spender, bytes32 amountHandle);
}
