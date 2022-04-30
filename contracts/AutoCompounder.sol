// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IMasterChefV2.sol";
import "./Compounder.sol";
import "./interfaces/IPokeMe.sol";
import "./interfaces/IGasTank.sol";

contract AutoCompounder is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct Compound {
        uint lastCompound;
        uint interval;
    }

    mapping(address => Compounder) public compounders;
    mapping(address => Compound) public compoundInfo;
    mapping(address => bytes32) public tasks;
    
    // Gelato address that receives the gas fee after execution
    address payable public constant gelatoPayee = payable(0x7598e84B2E114AB62CAB288CE5f7d5f6bad35BbA);
    address public constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    IPokeMe public constant gelato = IPokeMe(0x527a819db1eb0e34426297b03bae11F2f8B3A19E);
    
    IGasTank public immutable gasTank;// = IGasTank(0x8090e4C077E0372B38E5Eed5e71FA8a2F79171bB);
    IMasterChefV2 public immutable masterChef;// = IMasterChefV2(0x6F78679615D0dd9a87070b37e7F2f49Ee0E1FA98);
    uint256 public immutable rewardPoolId;// = 0;
    IERC20 public immutable rewardToken;// = IERC20(0xfd7378e0Ebe9d2636317C4B9F472C3DF83b12917);


    modifier hasCompounder() {
        require(address(compounders[msg.sender]) != address(0), "CornFi Auto Compounder: User not created");
        _;
    }

    // --------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------
    
    constructor(IGasTank _gasTank, IMasterChefV2 _mc, uint256 _rewardPool, IERC20 _rewardToken) {
        gasTank = _gasTank;
        masterChef = _mc;
        rewardPoolId = _rewardPool;
        rewardToken = _rewardToken;
    }

    // --------------------------------------------------------------------------------

    function pendingRewardPools(address _user) public view returns (uint256[] memory) {
        address comp = address(compounders[_user]);
        uint256 poolLength = masterChef.poolLength(); 
        uint256[] memory rewardPools = new uint256[](poolLength);
        uint256 rewardPoolCount = 0;

        for(uint256 i = 0; i < poolLength; i++) {
            if(masterChef.pendingCob(i, comp) > 0) {
                rewardPools[rewardPoolCount++] = i;
            }
        }
        
        uint256[] memory pools = new uint256[](rewardPoolCount);

        for(uint256 j = 0; j < rewardPoolCount; j++) {
            pools[j] = rewardPools[j];
        }

        return pools;
    } 

    // --------------------------------------------------------------------------------

    function checker(address _user) external view returns (bool, bytes memory) {
        uint256[] memory pids = pendingRewardPools(_user);
        if(pids.length == 0) {
            bytes memory b;
            return (false, b);
        }
        return (true, abi.encodeWithSelector(this.compoundGelato.selector, _user, pids));
    }

    // --------------------------------------------------------------------------------

    function deposit(uint256 _pid, uint256 _amount) external hasCompounder {
        compounders[msg.sender].deposit(_pid, _amount);
    }

    // --------------------------------------------------------------------------------

    function withdraw(uint256 _pid, uint256 _amount) external hasCompounder {
        compounders[msg.sender].withdraw(_pid, _amount);
    }

    // --------------------------------------------------------------------------------

    function startAutoCompound(uint _intervalSeconds) external hasCompounder {
        compoundInfo[msg.sender].interval = _intervalSeconds;
        if(tasks[msg.sender] == bytes32(0)) {
            tasks[msg.sender] = gelato.createTaskNoPrepayment(
                address(this), 
                this.compoundGelato.selector, 
                address(this), 
                abi.encodeWithSelector(this.checker.selector, msg.sender), 
                ETH
            );
        }
    }

    // --------------------------------------------------------------------------------

    function stopAutoCompound() external hasCompounder {
        gelato.cancelTask(tasks[msg.sender]);
        tasks[msg.sender] = bytes32(0);
    }

    // --------------------------------------------------------------------------------

    // User is caller
    function compound(uint256[] memory _pids) external hasCompounder {
        compounders[msg.sender].compound(_pids);
        compoundInfo[msg.sender].lastCompound = block.timestamp;
    }

    // --------------------------------------------------------------------------------

    // Gelato is caller
    function compoundGelato(address _user, uint256[] memory _pids) external {
        require(msg.sender == address(gelato), "CornFi Auto Compounder: Caller not Gelato");
        require(address(compounders[_user]) != address(0), "CornFi Auto Compounder: User not created");
        require(
            block.timestamp > compoundInfo[_user].lastCompound.add(compoundInfo[_user].interval), 
            "CornFi Auto Compounder: Compound too soon"
        );
        compoundInfo[_user].lastCompound = block.timestamp;

        compounders[_user].compound(_pids);

        (uint256 fee, ) = gelato.getFeeDetails();

        gasTank.pay(_user, gelatoPayee, fee);
    }

    // --------------------------------------------------------------------------------

    function createAutoCompounder() external returns (address) {
        require(address(compounders[msg.sender]) == address(0), "CornFi Auto Compounder: User already created");
        compounders[msg.sender] = new Compounder(masterChef, rewardPoolId, rewardToken, msg.sender);
        return(address(compounders[msg.sender]));
    }
}