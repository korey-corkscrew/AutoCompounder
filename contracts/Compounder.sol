// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IMasterChefV2.sol";

contract Compounder is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // MasterChef contract
    IMasterChefV2 public immutable mc;       
    
    // MasterChef pool for reward token
    uint256 public immutable rewardPool;   

    // Token emitted from staking in MasterChef pools                                                 
    IERC20 public immutable rewardToken;

    // Contract creator
    address public immutable creator;       

    // --------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------

    constructor(IMasterChefV2 _mc, uint256 _rewardPool, IERC20 _rewardToken, address _creator) {
        mc = _mc;
        rewardPool = _rewardPool;
        rewardToken = _rewardToken;
        creator = _creator;
    }

    // --------------------------------------------------------------------------------

    function deposit(uint256 _pid, uint256 _amount) external onlyOwner {
        // Get pool token
        (IERC20 token, , , , ) = mc.poolInfo(_pid);

        // Transfer token from user to this contract
        token.safeTransferFrom(creator, address(this), _amount);

        // Approve Master Chef contract
        token.approve(address(mc), _amount);

        // Deposit into Master Chef
        mc.deposit(_pid, _amount);

        // Deposit reward claimed
        _compoundReward();
    }

    // --------------------------------------------------------------------------------

    function withdraw(uint256 _pid, uint256 _amount) external onlyOwner {
        // Get pool token
        (IERC20 token, , , , ) = mc.poolInfo(_pid);

        // Withdraw from Master Chef. Will revert if user has insuffient funds in MC.
        mc.withdraw(_pid, _amount);

        // Transfer token from this contract to user
        token.safeTransfer(creator, _amount);

        _compoundReward();
    }

    // --------------------------------------------------------------------------------

    function withdrawAllReward(uint256[] memory _pids) external onlyOwner {
        (uint256 stakedAmt, ) = mc.userInfo(rewardPool, address(this));
        _claimPoolsRewards(_pids);
        mc.withdraw(rewardPool, stakedAmt);
        rewardToken.transfer(creator, rewardToken.balanceOf(address(this)));
    }

    // --------------------------------------------------------------------------------

    function compound(uint256[] memory _pids) external onlyOwner {
        _claimPoolsRewards(_pids);
        _compoundReward();
    }

    // --------------------------------------------------------------------------------

    function emergencyTokenWithdraw(IERC20 _token) external onlyOwner {
        _token.transfer(creator, _token.balanceOf(address(this)));
    }

    // --------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------

    function _claimPoolsRewards(uint256[] memory _pids) internal {
        for(uint256 i = 0; i < _pids.length; i++) {
            mc.withdraw(_pids[i], 0);
        }
    }

    // --------------------------------------------------------------------------------

    function _compoundReward() internal {
        // Deposit received reward tokens into reward pool
        uint256 rewardBalance = rewardToken.balanceOf(address(this));
        while(rewardBalance > 0) {
            rewardToken.approve(address(mc), rewardBalance);
            mc.deposit(rewardPool, rewardBalance);
            rewardBalance = rewardToken.balanceOf(address(this));
        }
    }
}