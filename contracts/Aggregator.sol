pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IUniRouter02.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract SwapProxy is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address constant AGGREGATION_ROUTER_V3 = 0x11111112542D85B3EF69AE05771c2dCCff4fAa26;
    mapping(address => uint256) private profits;

    event Swapped(address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);


    /**
     * @dev Function which returns how much of an ERC20 token this contract can spend for owner
     * @param token The ERC20 token that we are querying
     * @param owner The address who's allowance we are fetching
    */
    function allowance(address token, address owner) public view returns (uint256) {
        return IERC20(token).allowance(owner, address(this));
    }


    /**
    * @dev 1inch API must be used to operate this function. This is used for arbitrage where an input token 
    * is swapped to an output token & then swapped back to the original input token. Swap prices need to be
    * monitored locally & upon a profitable trade, pass the API data for both swaps.
    * @param _tokenIn: Input token address
    * @param _amountIn: Amount of input token to swap
    * @param _tokenOut: Output token address
    * @param _firstData: Call data for first trade - Provided from the 1inch API
    * @param _secondData: Call data for second trade - Provided from the 1inch API
    */
    function swap(
        address _tokenIn, 
        uint256 _amountIn, 
        address _tokenOut, 
        bytes calldata _firstData, 
        bytes calldata _secondData, 
        uint deadline,
        uint256 _minProfit
    ) external onlyOwner {
        require(deadline >= block.timestamp, 'Swap: EXPIRED');
        address tokenIn = _tokenIn;
        uint256 amountIn = _amountIn;
        address tokenOut = _tokenOut;
        uint256 minProfit = _minProfit;
        
        // Move funds from user to contract
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Approve aggregation router for initial amount
        IERC20(tokenIn).approve(AGGREGATION_ROUTER_V3, amountIn);
        
        // Initial swap
        (bool succ, bytes memory _data) = address(AGGREGATION_ROUTER_V3).call(_firstData);
        (uint returnAmount, ) = abi.decode(_data, (uint, uint));
        require(succ, 'First Swap Failed');

        // Approve aggregation router for return amount
        IERC20(tokenOut).approve(AGGREGATION_ROUTER_V3, returnAmount);
        uint256 fromBalanceBefore = IERC20(tokenIn).balanceOf(address(this));

        // Second swap
        (succ, ) = address(AGGREGATION_ROUTER_V3).call(_secondData);
        require(succ, 'Second Swap Failed');
        
        // Calculate return amount
        uint256 fromBalanceAfter = IERC20(tokenIn).balanceOf(address(this));
        uint256 returnedAmount = fromBalanceAfter.sub(fromBalanceBefore);
        require(returnedAmount >= amountIn.add(minProfit), 'Return Amount is Less Than Input Amount');

        // Check for left over swap tokens
        // Withdraw tokens & record profits
        uint256 scraps = IERC20(tokenOut).balanceOf(address(this));
        if(scraps > 0) {
            profits[tokenOut] += scraps;
            _withdrawToken(tokenOut, scraps);
        }

        // Withdraw tokens & record profits
        profits[tokenIn] += returnedAmount.sub(amountIn);
        _withdrawToken(tokenIn, returnedAmount);
    }


    function getProfits(address token) external view onlyOwner returns (uint256) {
        return profits[token];
    }


    function withdrawToken(address _tokenAddress) external onlyOwner {
        address tokenAddress = _tokenAddress;

        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        _withdrawToken(tokenAddress, balance);
    }


    function _withdrawToken(address _tokenAddress, uint256 _amount) internal {
        IERC20(_tokenAddress).transfer(owner(), _amount);
    }
}
