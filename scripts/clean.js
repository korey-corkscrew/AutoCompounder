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
const krunchK = async (kData, tokenIn, amountIn) => {

    const token1 = kData.token1
    const token0 = kData.token0

    const reserveIn = tokenIn !== token0 ? kData.token0Reserves : kData.token1Reserves;
    const reserveOut = tokenIn !== token0 ? kData.token1Reserves : kData.token0Reserves;
    console.log(ethers.utils.formatUnits(reserveIn))
    console.log(ethers.utils.formatUnits(reserveOut))
    const numerator = reserveOut.mul(reserveIn)
    const denominator = reserveIn.add(amountIn)
    const amountOutMax = reserveOut.sub(numerator.div(denominator))
    const amountOutMin = amountOutMax.mul(9997).div(10000)


    return [amountOutMax, amountOutMin]
}

const getFactories = async () => {
    const factories = {  
        "Quickswap": '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32', 
        "Jetswap": '0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7', 
        "Polydex": '0xEAA98F7b5f7BfbcD1aF14D0efAa9d9e68D82f640', 
        "Waltswap": '0xa98ea6356A316b44Bf710D5f9b6b4eA0081409Ef', 
        "Apeswap": '0xCf083Be4164828f00cAE704EC15a36D711491284', 
        "Sushiswap": '0xc35DADB65012eC5796536bD9864eD8773aBc74C4', 
        "Dfyn": '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B', 
        "Cometh": '0x800b052609c355cA8103E06F022aA30647eAd60a', 
        "Polycat": '0x477Ce834Ae6b7aB003cCe4BC4d8697763FF456FA', 
        "Elk": '0xE3BD06c7ac7E1CeB17BdD2E5BA83E40D1515AF2a', 
        "Creampie": '0xF502B3d87311863bb0aC3CF3d2729A78438116Cf'
    };



    const promises = [];
    const returns = [];
    const markets = [];

    for (i in factories) {
        markets.push(i)
    }

    for (i in factories) {
        let fac = factories[i]
        promises.push(fetchContract(fac, UniV2FactoryAbi, signer))
    };
    await Promise.all(promises).then(async value => {
        returns.push(value)
        
    });

    return returns;
}

const kHole = async () => {
    const factory = await fetchContract("0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32", UniV2FactoryAbi, signer);
  
    const pairAddress =  await factory.getPair("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063");
    const pair = await fetchContract("0x4A35582a710E1F4b2030A3F826DA20BfB6703C09", UniswapV2PairAbi, signer); //weth-dai lp
    const pairRead = pair;


    
    let data = {}
    const token0 = await pairRead.token0();
    data["token0"] = token0;
    const token1 = await pairRead.token1();
    data["token1"] = token1;
    const reserves = await pairRead.getReserves();
    data.token0Reserves = reserves[0];
    data.token1Reserves = reserves[1];


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
    const amountOut = await fetchAmountOut(amountIn, path);
    const amountOutFormat = ethers.utils.formatUnits(amountOut, "ether");

    // const amountOutInner = await fetchAmountOut(amountOut, pathInner);
    // const amountOutInnerFormat = ethers.utils.formatUnits(amountOutInner);

    // const amountOutCounter = await fetchAmountOut(amountOutInner, pathCounter);
    // const amountOutCounterFormat = ethers.utils.formatUnits(amountOutCounter);
    const kh = await kHole()
    const amountsOut = await krunchK(kh, tokenIn, amountIn)
    const amountOutK = ethers.utils.formatUnits(amountsOut[0])
    
    const factories = await getFactories();


    console.log(
        `
        +_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+
        Welcome ${signer.address}

        Path: ${path}
        PathCounter: ${pathCounter}
        Token: ${tokenIn}
       
        factories: ${factories}

        Amount In: ${amountInFormat}
        Amount Out DAI: ${amountOutFormat}

        KKKKKKHHHHHHOOOOOLLLLLEEEEE
        ${kh.token0} ${kh.token0Reserves}
        ${kh.token1} ${kh.token1Reserves}

        Amount In: ${amountInFormat}
        Amount Out DAI: ${amountOutK}
        

        _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_
        `
    );
}

const fetchLPAddresses = async (tokenA, tokenB) => {
    const factories = await getFactories();
    const LPAddresses = []
    for (i in factories) {
        for (x in factories[i]) {
            let factory = factories[i][x]
            let dat = await factory.getPair(tokenA, tokenB);
            LPAddresses.push(dat)
        }
    }

    console.log(LPAddresses)
}

provider.on("block", async () => {
    //loop();
    fetchLPAddresses("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063");
})



