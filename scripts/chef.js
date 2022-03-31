const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const axios = require("axios");

//contract imports

const masterchef = require("../artifacts/contracts/MasterChefV2.sol/MasterChefV2.json")
const {quickRouterAbi, UniswapV2PairAbi, ERC20Abi} = require('./abi.js');
const { addresses } = require("./addresses");
const {POOLS} = require("../config/pools.js")


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
    const masterchefContract = await fetchContract(addresses.masterChef, masterchef.abi, signer);
    const balances = await masterchefContract.pendingCob(pid, user);
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
    const masterchefContract = await fetchContract(addresses.masterChef3, masterchef.abi, signer);
    console.log(`loaded MasterChef ${masterchefContract.address}
                Adding Pool for ${poolToken} 
    `);
    const allocPoint = ethers.utils.parseUnits("50", "wei");
    const depositFeeBP = BigNumber.from(10); //FEEBP is 10000
    const withUpdate = true;
    const addPool = await masterchefContract.add(
        allocPoint,
        poolToken,
        depositFeeBP,
        withUpdate,
        {gasPrice: ethers.utils.parseUnits('97', 'gwei'), gasLimit: 10009000});
    const receipt = await addPool.wait()
    return receipt;
}; //works


const approvePool = async (lptoken) => {
    const approvepooltoken = await approveToken(lptoken, addresses.masterChef);
    return approvepooltoken

} //works

const deposit = async (pid, amount) => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(addresses.masterChef, masterchef.abi, signer);
    const depositinpool = await masterchefContract.deposit(pid, amount);
    return depositinpool;
} //works

const withdraw = async (pid, amount) => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(addresses.masterChef, masterchef.abi, signer);
    const withdrawinpool = await masterchefContract.withdraw(pid, amount);
    return withdrawinpool;
} //works

const updatePool = async () => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(addresses.masterChef3, masterchef.abi, signer);
    const update = await masterchefContract.massUpdatePools({gasPrice: ethers.utils.parseUnits('66', 'gwei'), gasLimit: 1009000});
    const receipt = await update.wait()
    return receipt
} //works

const getOwner = async () => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(addresses.masterChef, masterchef.abi, signer);
    const ownerAddress = await masterchefContract.owner();
    return ownerAddress
} //works


const getPoolInfo = async () => {
    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(addresses.masterChef, masterchef.abi, signer);
    const pLength = await masterchefContract.poolLength();

    const poolInfo = [];
    for (let index = 0; index < pLength; index++) {
        const data = await masterchefContract.poolInfo(index);
        poolInfo.push(data);
        
    }

    return poolInfo;
} // works




const tokenSymbol = async (_address, _signer) => {
    const ctr = new ethers.Contract(_address, ERC20Abi, _signer);
    const sym = await ctr.symbol()
    return sym

}

const mapSymbolToAddress = async (_poolInfo) => {
    const signer = await fetchSigner();

    const syms = _poolInfo.map( async pool => {
        const symbol = tokenSymbol(pool.lpToken, signer)
        return symbol
    })
    
    Promise.all(syms).then(values => {
        console.log(values); // [3, 1337, "foo"]
    });
    
}

const fetchUserPoolData = async () => {

    const signer = await fetchSigner();
    const masterchefContract = await fetchContract(addresses.masterChef, masterchef.abi, signer);
    const pLength = await masterchefContract.poolLength();
    const accountAddress = await signer.getAddress();
    const poolInfo = await getPoolInfo();
    console.log('poolINFOOOOO')
    console.log(poolInfo)
    const userPoolDataPromises = [];
    for (let pid = 0; pid < pLength; pid++) {
        const poolData = masterchefContract.pendingCob(pid, accountAddress);
        userPoolDataPromises.push(poolData);
    };

    const dataPack = Promise.all(userPoolDataPromises)
    .then(values => {
        const data = values.map((value, index) => {
            const pending = ethers.utils.formatUnits(value, "ether");

            const pool = poolInfo[index];
            const lpToken = pool.lpToken;
            const allocationPoints = ethers.utils.formatUnits(pool.allocPoint, "wei");
            const accCobPerShare = ethers.utils.formatUnits(pool.accCobPerShare, "ether");
            const depositFee = pool.depositFeeBP;
            

            return {
                pendingReward: pending, 
                poolInformation: {
                    depositTokenAddress: lpToken,
                    allocation: allocationPoints,
                    rewardPerShare: accCobPerShare,
                    fee: depositFee
                }};
        })
        return data;
    })
    return dataPack
}

const mapPendingToOriginalData = (newData, oldData, _masterchef, poolLength) => {
    const staticPoolLength = oldData.length;
    if (poolLength == staticPoolLength) {

        const recycledData = newData.map((value, index) => {
            const pending = value.pendingReward;
            return {
                pendingCob: pending,
                ...oldData[index]
            };
        });

        return recycledData;

    } else {

        console.log(`Devie needs to update static pool folder.  Your fetched pool length is ${poolLength} but your static pool length is ${staticPoolLength}`);
        return oldData;

    }
}

//take in pool token address and spit back true or false
const checkUserApprovedPool = async (tokendeposit, account, signer, masterchef, erc20abi) => {
    const erc20 = await fetchContract(tokendeposit, erc20abi, signer);
    const allowance = await erc20.allowance(account, masterchef.address);
    const formattedAllowance = ethers.utils.formatUnits(allowance, "ether");
    console.log(formattedAllowance)
    if (formattedAllowance !== "0.0") {
        return true
    } else {
        return false
    }
}

// main loop

const main = async () => {
    // 1.)
    // const update = await updatePool()
    // console.log(update)

    // 2.)


        // const createMockPool = await createPool(POOLS[0].tokenStakeAddress)
        // console.log(createMockPool)
        const createMockPool1 = await createPool(POOLS[1].tokenStakeAddress)
        console.log(createMockPool1)
        // const createMockPool2 = await createPool(POOLS[2].tokenStakeAddress)
        // console.log(createMockPool2)
        // const createMockPool3 = await createPool(POOLS[3].tokenStakeAddress)
        // console.log(createMockPool3)
        // const createMockPool4 = await createPool(POOLS[4].tokenStakeAddress)
        // console.log(createMockPool4)
        // const createMockPool5 = await createPool(POOLS[5].tokenStakeAddress)
        // console.log(createMockPool5)
        // const createMockPool6 = await createPool(POOLS[6].tokenStakeAddress)
        // console.log(createMockPool6)
        // const createMockPool7 = await createPool(POOLS[7].tokenStakeAddress)
        // console.log(createMockPool7)
        // const createMockPool8 = await createPool(POOLS[8].tokenStakeAddress)
        // console.log(createMockPool8)
        // const createMockPool9 = await createPool(POOLS[9].tokenStakeAddress)
        // console.log(createMockPool9)
        // const createMockPool10 = await createPool(POOLS[10].tokenStakeAddress)
        // console.log(createMockPool10)
        // const createMockPool11 = await createPool(POOLS[11].tokenStakeAddress)
        // console.log(createMockPool11)



     
    
    // const approval = await approveToken(addresses.mockLP, addresses.masterChef);

    // const approveNewPool = await approvePool(addresses.CobToken);
    // const createMockPool2 = await createPool(addresses.realLP2);
    // const approveNewPool2 = await approvePool(addresses.realLP2);
    
    // const amountIn = ethers.utils.parseEther("4.26973");
    // const depositIn = await deposit(0, amountIn);
    // console.log('staking done')


    // provider.on("block", async () => {
    //     let pendingreward = await fetchPendingReward(0, signer.address);
    //     pendingreward = ethers.utils.formatUnits(pendingreward, "ether");
    //     console.log(`
    //         Pending Cob Token ${pendingreward}
    //     `)
    // })
   

    //const ownercontract = await getOwner();
    //balanceofstaked = ethers.utils.formatUnits(balanceofstaked);
    //balanceofstaked = Number(balanceofstaked);
    // const comparebalanceofstaked = ethers.utils.formatUnits(balanceofstaked, "ether");
    // console.log(comparebalanceofstaked)
    // const withdrawAmount = ethers.utils.parseUnits(comparebalanceofstaked, "ether")
    // console.log(withdrawAmount)
    //console.log(balanceofstaked)
    
    // if (comparebalanceofstaked !== "0.0") {
    //const take = await withdraw(ethers.utils.parseUnits("0.00001", "ether"), 0, {"gasLimit": 2000000, "gasPrice": 50000000000});
    // } else {
    //     console.log("nothing staked")
    // };
    


};

main();


