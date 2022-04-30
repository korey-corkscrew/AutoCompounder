// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";


contract GasTank is Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;

    // Amount of gas a user has deposited
    mapping(address => uint256) public userGasAmounts;

    address[] public approvedPayees;
    mapping(address => bool) public _approvedPayees;


    event DepositGas(address indexed user, uint256 amount);
    event WithdrawGas(address indexed user, uint256 amount);
    event Pay(address indexed payer, address indexed payee, uint256 amount);


    modifier onlyApprovedPayee() {
        require(_approvedPayees[msg.sender], "CornFi Gas Tank: Unapproved payee");
        _;
    }

    // --------------------------------------------------------------------------------

    function addPayee(address _payee) external onlyOwner {
        require(!_approvedPayees[_payee], "CornFi Gas Tank: Payee Already Added");
        _approvedPayees[_payee] = true;
        approvedPayees.push(_payee);
    }

    // --------------------------------------------------------------------------------

    function removePayee(address _payee) external onlyOwner {
        require(_approvedPayees[_payee], "CornFi Gas Tank: Invalid payee");
        _approvedPayees[_payee] = false;
    }
    
    // --------------------------------------------------------------------------------

    /**
    * @notice Deposit ETH to pay for gas cost accrued from filling orders. ETH deposited
    * is automatically taken from the order owners balance when their orders are filled.
    * User is able to withdraw their balance of ETH at any point in time. This function
    * is not callable when 'isPaused()' == true.
    * @param _receiver: Address that is credited with the deposited ETH
    */
    function depositGas(address _receiver) external payable nonReentrant whenNotPaused {
        // User can only deposit ETH. Amount to deposit is msg.value.
        uint256 depositAmount = msg.value;

        // Add the deposited ETH to the '_receiver' balance
        userGasAmounts[_receiver] = userGasAmounts[_receiver].add(depositAmount);

        emit DepositGas(_receiver, depositAmount);
    }

    // --------------------------------------------------------------------------------

    /**
    * @notice Remove the deposited ETH balance of a user. Any amount of ETH not used to
    * pay for gas is able to be withdrawn. Withdrawing ETH while still having open orders
    * will result in the orders not being filled. A user must maintain a certian amount
    * of ETH deposited to cover gas costs.  
    */
    function withdrawGas(uint256 _amount) external nonReentrant {
        // Revert if the user does not have any deposited ETH
        if(_amount > userGasAmounts[msg.sender]) {
            _amount = userGasAmounts[msg.sender];
        }

        require(_amount > 0, "CornFi Gas Tank: Nothing to withdraw");

        userGasAmounts[msg.sender] = userGasAmounts[msg.sender].sub(_amount);

        // Transfer ETH balance to the user
        (bool success, ) = msg.sender.call{value: _amount}("");

        // Revert if the transfer fails
        require(success, "CornFi Gas Tank: ETH transfer failed");

        emit WithdrawGas(msg.sender, _amount);
    }

    // --------------------------------------------------------------------------------

    function pay(address _payer, address _payee, uint256 _amount) external onlyApprovedPayee whenNotPaused nonReentrant {
        require(userGasAmounts[_payer] >= _amount, "CornFi Gas Tank: Insufficient User Funds");
        
        userGasAmounts[_payer] = userGasAmounts[_payer].sub(_amount);

        // Transfer ETH balance to the user
        (bool success, ) = _payee.call{value: _amount}("");

        // Revert if the transfer fails
        require(success, "CornFi Gas Tank: ETH transfer failed");

        emit Pay(_payer, _payee, _amount);
    }
}