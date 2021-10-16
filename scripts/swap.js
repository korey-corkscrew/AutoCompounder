
const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const axios = require("axios")


// ------ Global Constants ------


const swapProxyAbi = require("../artifacts/contracts/Aggregator.sol/SwapProxy.json")
const {quickRouterAbi, ERC20Abi} = require('./abi.js');
const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
const account = new ethers.Wallet(process.env.PRIVATE_KEY);
const signer = account.connect(provider);
const tokens = {
    "USDC": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "WETH": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    "WMATIC": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "MiMATIC": "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1",
    "DAI": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    "DINO": "0xAa9654BECca45B5BDFA5ac646c939C62b527D394",
    "LINK": "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
    "SUSHI": "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
    "FISH": '0x3a3df212b7aa91aa0402b9035b098891d276572b',
    "OMEN": "0x76e63a3E7Ba1e2E61D3DA86a87479f983dE89a7E",
    "UNI": "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
    "AAVE": "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
    "GRT": "0x5fe2b58c013d7601147dcdd68c143a77499f5531",
    "COMP": "0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c",
    "SNX": "0x50b728d8d964fd00c2d0aad81718b71311fef68a",
    "CRV": "0x172370d5cd63279efa6d502dab29171933a610af",
}
// -------- Program Constants ---------



const firstSlippage = 999;
const secondSlippage = 500;
const slippageBasis = 1000;
const deadline = 4;
const step = 10;
const sender = signer.address;
const maxAmountIn = async () => {
    const tkn = new ethers.Contract(tokenPath[0], ERC20Abi);
    const tknInContract = tkn.connect(signer);
    let maxIn = tknInContract.balanceOf(signer.address);
    if (tokenPath[0] === tokens.USDC) {
        maxIn = ethers.utils.formatUnits(maxIn, 6);
    } else {
        maxIn = ethers.utils.formatUnits(maxIn, 18);
    }
    
    return maxIn;
};
const tokenPath = [tokens.USDC, tokens.DAI];
const gasRange = [40, 50];
const minProfit = 1000000;


// ----- Contract Instatiation --------
const swapProxy = "0x8425ABcb132A1144cDc78dd745536dD3C4284979"

const swapAbi = swapProxyAbi.abi

const SwapContract = new ethers.Contract(swapProxy, swapAbi);
const SwapContractWrite = SwapContract.connect(signer);
const SwapContractRead = SwapContract.connect(provider);


//------ fetch Datas ------



const fetchTradeData = async (amountIn) => {
    const fromToken = String(tokenPath[0]);
    const toToken = String(tokenPath[1]);
    let firstSlippagePercent = (1 - (firstSlippage/slippageBasis))*100;
    firstSlippagePercent = String(firstSlippagePercent.toFixed(2));
    let secondSlippagePercent = (1 - (secondSlippage/slippageBasis))*100;
    secondSlippagePercent = String(secondSlippagePercent.toFixed(2));
    const receiver = swapProxy;
    let amtIn = amountIn;
    if (fromToken === tokens.USDC) {
        amtIn = ethers.utils.formatUnits(amtIn, 0);
    
    } else {
        amtIn = ethers.utils.formatUnits(amtIn, 0);
        
    }
    const urlFirstTrade = `https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amtIn}&fromAddress=${sender}&slippage=${firstSlippagePercent}&destReceiver=${receiver}&disableEstimate=true`

    let response;
    try {
        response = await axios.get(urlFirstTrade);
        response = response.data
        
     
      } catch (error) {
        console.error(error);
      }
    
    let firstOut = response.toTokenAmount;
    firstOut = BigNumber.from(firstOut)
    const firstOutData = response.tx.data;

    
    const urlSecondTrade = `https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=${toToken}&toTokenAddress=${fromToken}&amount=${firstOut}&fromAddress=${sender}&slippage=${secondSlippagePercent}&destReceiver=${receiver}&disableEstimate=true`
    let response2;
    try {
        response2 = await axios.get(urlSecondTrade);
        response2 = response2.data
        
      
      } catch (error) {
        console.error(error);
      }

    let secondOut = response2.toTokenAmount;
    secondOut = BigNumber.from(secondOut)
    const secondOutData = response2.tx.data;
    

    return [fromToken, amtIn, toToken, firstOut, firstOutData, secondOut, secondOutData];
};

const fetchAllowances = async (token) => {
    const tokenContract = new ethers.Contract(token, ERC20Abi);
    const tokenRead = tokenContract.connect(provider);
    const tokenWrite = tokenContract.connect(signer)

    let allowance = await tokenRead.allowance(sender, swapProxy);
    allowance = ethers.utils.formatUnits(allowance);

    
    if (allowance === "0.0") {
        try {
            const tx = await approveMax(signer.address, tokenWrite);
            const receipt = tx.wait();
            console.log(receipt);
        } catch (error) {
            console.log(error)
        }

    }
    return allowance
};


const approveMax = async (spender, erc20contract) => {
    const txOverrides = {
        gasPrice: ethers.utils.parseUnits("66", 9),
        gasLimit: ethers.utils.parseUnits("2000000", 18)
    }
    const approvalTx = await erc20contract.approve(spender, ethers.constants.MaxUint256);
    

}

const swap = async (fromToken, amtIn, toToken, firstOutData, secondOutData, deadline, minprofit) => {
    const swapTx = await SwapContract.swap(fromToken, amtIn, toToken, firstOutData, secondOutData, deadline, minprofit);

}




// ----- Main ---------
const main = async () => {
    //const allowance = await fetchAllowances(tokenPath[0]);
    const [fromToken, amtIn, toToken, firstOut, firstOutData, secondOut, secondOutData] = await fetchTradeData(1000000)
    const profit = secondOut - amtIn;
    const minprofit = 200000;
    let arbs=0;
    let scanned=0;


    if (profit > minprofit) {

        console.log(`
        +++++++++++++++
        ++ ARB ARB ++++
        +++++++++++++++
        `)

        try {
            const arbSwap = await swap(fromToken, amtIn, toToken, firstOutData, secondOutData, deadline, minprofit);
        } catch (error) {
            console.log(error);
        };
        arbs = arbs + 1;
    } else {
        scanned = scanned +1;
    }
    

    console.log(`
    ======================================
    Trading ${fromToken} for ${toToken}

    amount in: ${amtIn}
    amount out: ${secondOut}
    profit ${profit}

    ${arbs} arbitrage opportunites out of ${scanned} scans
    ======================================
    `)
}



provider.on('block', async () => {
    main();
})

