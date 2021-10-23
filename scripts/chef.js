const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const axios = require("axios");

//contract imports

const masterchef = require("../artifacts/contracts/MasterChefV2.sol/MasterChefV2.json")
const {quickRouterAbi, UniswapV2PairAbi, ERC20Abi} = require('./abi.js');

const contractAddresses = {
    masterChef: "0xc9B2b713242c7Fc144ee7AC3b4D6f329EdbD3cba",
    eggToken: "0xd79E2Ec72aFeaB56171f3e6d4a1879d8b955a384",
    mockToken1: "0x7DBaFf79d13A0c842777742A86aE3aCAc9817250",
    mockToken2: "0xCCd1660797fe05dAe3439568aD39D2a4DacEab0e",
    mockLP: "0xea718C7dd15C6E1F98de3ED10f50d812e39E66D2",
};

const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");


// fetchies
const fetchSigner = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
    const wsProvider = new ethers.providers.WebSocketProvider("wss://rpc-mainnet.maticvigil.com/ws/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
    
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    
    const signer = wallet.connect(provider);
    const wsSigner = wallet.connect(provider);
    console.log(`connected to ${signer.address}`);
    
    return signer;
};//works


const fetchContract = async (address, abi, signer) => {
    const contract = new ethers.Contract(address, abi, signer);
    console.log(`loaded contract ${contract.address}`);
    return contract;
};//works

const fetchPendingReward = async (pid, user) => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
    const balances = await masterchefContract.pendingEgg(pid, user);
    return balances;
} //works


const approveToken = async (tokenAddress, spender) => {
    const signer = await fetchSigner();
    const ERC20Contract = await fetchContract(tokenAddress, ERC20Abi, signer);
    await ERC20Contract.approve(spender, ethers.constants.MaxUint256);
};//works

// pool stuff

const createPool = async (poolToken) => {
    const signer = await fetchSigner();
    const LPtoken = await fetchContract(poolToken, UniswapV2PairAbi, signer);
    const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
    console.log(`loaded MasterChef ${masterchefContract.address}
                Adding Pool for ${LPtoken.address} 
    `);
    const allocPoint = ethers.utils.parseUnits("0.01", "ether");
    const depositFeeBP = BigNumber.from(9999);
    const withUpdate = true;
    const addPool = await masterchefContract.add(allocPoint, LPtoken.address, depositFeeBP, withUpdate);
    return addPool;
}; //works


const approvePool = async (lptoken) => {
    const approvepooltoken = await approveToken(lptoken, contractAddresses.masterChef);
    return approvepooltoken

} //works

const deposit = async (amount, pid) => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
    const depositinpool = await masterchefContract.deposit(pid, amount);
    return depositinpool;
} //works

const withdraw = async (amount, pid) => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
    const withdrawinpool = await masterchefContract.withdraw(pid, amount);
    return withdrawinpool;
} //works

const updatePool = async () => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
    const update = await masterchefContract.massUpdatePools();
    return update;
}

const getOwner = async () => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(contractAddresses.masterChef, masterchef.abi, signer);
    const ownerAddress = await masterchefContract.owner();
    return ownerAddress
}


// main loop

const main = async () => {
    //const createMockPool = await createPool(contractAddresses.mockLP);
    //const approveNewPool = await approvePool(contractAddresses.mockLP);

    const amountIn = ethers.utils.parseUnits("1", "ether");
    const poolID = 0;
    //const depositIn = await deposit(amountIn, poolID);
    console.log('done')
    
    

    const signer = await fetchSigner();
    const pendingreward = await fetchPendingReward(0, signer.address);
    const ERC20Contract = await fetchContract(contractAddresses.mockLP, ERC20Abi, signer);
    let balanceofstaked = await ERC20Contract.balanceOf(contractAddresses.masterChef);
    const ownercontract = await getOwner();
   
    
   
    //pendingreward = ethers.utils.formatUnits(pendingreward, "ether");
  
    balanceofstaked = ethers.utils.formatUnits(balanceofstaked);
    //balanceofstaked = Number(balanceofstaked);
    // const comparebalanceofstaked = ethers.utils.formatUnits(balanceofstaked, "ether");
    // console.log(comparebalanceofstaked)
    // const withdrawAmount = ethers.utils.parseUnits(comparebalanceofstaked, "ether")
    // console.log(withdrawAmount)
    console.log(balanceofstaked)
    
    // if (comparebalanceofstaked !== "0.0") {
    //const take = await withdraw(ethers.utils.parseUnits("0.00001", "ether"), 0, {"gasLimit": 2000000, "gasPrice": 50000000000});
    // } else {
    //     console.log("nothing staked")
    // };
    


    console.log(`
    Pending Reward:  ${pendingreward}
    User: ${signer.address}
    `);
};

provider.on('block', async () => {
    main();
})

