// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IGasTank {
    function userGasAmounts(address _user) external returns (uint256);
    function approvedPayees(uint256 _index) external returns (address);
    function _approvedPayees(address _payee) external returns (bool);
    function addPayee(address _payee) external;
    function removePayee(address _payee) external;
    function depositGas(address _receiver) external payable;
    function withdrawGas(uint256 _amount) external;
    function pay(address _payer, address _payee, uint256 _amount) external;
}