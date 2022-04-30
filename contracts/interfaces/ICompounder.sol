// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IMasterChefV2.sol";

interface ICompounder {
    function creator() external view returns (address);
    function rewardToken() external view returns (IERC20);
    function rewardPool() external view returns (uint256);
    function mc() external view returns (IMasterChefV2);
    function deposit(uint256 _pid, uint256 _amount) external;
    function withdraw(uint256 _pid, uint256 _amount) external;
    function withdrawAllReward(uint256[] memory _pids) external;
    function compound(uint256[] memory _pids) external;
    function emergencyTokenWithdraw(IERC20 _token) external;
}