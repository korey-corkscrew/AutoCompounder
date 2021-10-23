const { BigNumber, Contract } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const swap = require("./spinLP.js")


const {quickRouterAbi, ERC20Abi, UniswapV2PairAbi, UniV2FactoryAbi} = require('./abi.js');
const MultiCall = require("../artifacts/contracts/MultiCall.sol/MultiCall.json")

const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const signer = wallet.connect(provider);

//funcs
const loadRouter = async () => {
 
    const quickRouterAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"


    const contractRead = new ethers.Contract(quickRouterAddress, quickRouterAbi, provider);
    const contractWrite = new ethers.Contract(quickRouterAddress, quickRouterAbi, signer);
    const Contracts = [contractRead, contractWrite];
    return Contracts;

};

const fetchContract = async (address, abi, signer) => {
    const contract = new ethers.Contract(address, abi, signer);
    console.log(`loaded contract ${contract.address}`);
    return contract;
};

const fetchMultiCallAddress = async () => {
    const multiCallAddress = "0x4a099eC850A80fF64e30bb16C6e000EFA3F86A13";
    const multiCallContract = new ethers.Contract(multiCallAddress, MultiCall.abi, signer)
    

    return multiCallContract.address;
}

const fetchAmountOut= async (amountIn, path) => {
    const router = await loadRouter();
    const routerRead = router[0]
    const amountsOut = await routerRead.getAmountsOut(amountIn, path);
    const amountOut = amountsOut[1];
    return amountOut;
}

// def getAmountOut(reserveIn, reserveOut, amountIn, fee):
//     amtInWithFee = int(amountIn * fee / 10000)
//     if(amtInWithFee + reserveIn > 0):
//         return reserveOut - ((reserveOut * reserveIn) / (reserveIn + amtInWithFee))
//     else:
//         return 0

const kHole = async () => {
    const factory = await fetchContract("0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32", UniV2FactoryAbi, signer);
  
    const pairAddress =  await factory.getPair("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063");
    const pair = await fetchContract("0xFBa51e1eA2d46c4D5E98f27E1F5333969d2222D7", UniswapV2PairAbi, signer);
    const pairRead = pair;


    
    let data = {}
    const token0 = await pairRead.token0();
    data["token0"] = token0;
    const token1 = await pairRead.token1();
    data["token1"] = token1;
    const reserves = await pairRead.getReserves();
    data.token0Reserves = reserves[0].toString();
    console.log(reserves)
    data.token1Reserves = reserves[1].toString();

    return data


}

const loop = async () => {
    const tokenIn = swap.tokens.WETH;
    const tokenOut = swap.tokens.DAI;
    const tokenInContract = await fetchContract(tokenIn, ERC20Abi, signer);

    const path = [swap.tokens.WETH, swap.tokens.DAI];
    const pathInner = [swap.tokens.LINK, swap.tokens.DAI];
    const pathCounter = [swap.tokens.LINK, swap.tokens.WETH];

    const balance = await tokenInContract.balanceOf(signer.address);
    const router = await loadRouter()[0];
  
    

    

    

    const amountIn = ethers.utils.parseUnits("1", "ether");
    const amountInFormat = ethers.utils.formatUnits(amountIn)
    const amountOut = await fetchAmountOut(amountIn, pathInner);
    const amountOutFormat = ethers.utils.formatUnits(amountOut, "ether");

    // const amountOutInner = await fetchAmountOut(amountOut, pathInner);
    // const amountOutInnerFormat = ethers.utils.formatUnits(amountOutInner);

    // const amountOutCounter = await fetchAmountOut(amountOutInner, pathCounter);
    // const amountOutCounterFormat = ethers.utils.formatUnits(amountOutCounter);
    const kh = await kHole()
    
    


    console.log(
        `
        +_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+
        Welcome ${signer.address}

        Path: ${path}
        PathCounter: ${pathCounter}
        Token: ${tokenIn}
       
        

        Amount In: ${amountInFormat}
        Amount Out DAI: ${amountOutFormat}

        KKKKKKHHHHHHOOOOOLLLLLEEEEE
        ${kh.token0} ${kh.token0Reserves}
        ${kh.token1} ${kh.token1Reserves}
        

        _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_
        `
    );
}


provider.on("block", async () => {
    loop();
})



