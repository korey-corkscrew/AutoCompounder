const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;

const {quickRouterAbi} = require('./abi.js');


//contract addresses
const wsProvider = new ethers.providers.WebSocketProvider("wss://rpc-mainnet.maticvigil.com/ws/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
const account = new ethers.Wallet(process.env.PRIVATE_KEY);
const signer = account.connect(provider);
const wsSigner = account.connect(wsProvider);
const quoteToken = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
const tokens = {

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

const mockTokens = {
    "farmToken": "0xd79E2Ec72aFeaB56171f3e6d4a1879d8b955a384",
    "altToken1": "0x7DBaFf79d13A0c842777742A86aE3aCAc9817250",
    "altToken2": "0xCCd1660797fe05dAe3439568aD39D2a4DacEab0e",
}

const quickRouterAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"

const signers = [signer, provider]




const loadRouter = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://nd-002-300-311.p2pify.com/ac7cb66f76f1666ac6b69a0769220ed5");
    const account = new ethers.Wallet(process.env.PRIVATE_KEY);
    const signer = account.connect(provider);
    const quickRouterAddress = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"


    const contractRead = new ethers.Contract(quickRouterAddress, quickRouterAbi, provider);
    const contractWrite = new ethers.Contract(quickRouterAddress, quickRouterAbi, signer);
    const Contracts = [contractRead, contractWrite];
    return Contracts;

};


const gasPrice = async () => {
    const gas = await signers[0].getGasPrice()
    const gasGwei = ethers.utils.formatUnits(gas, 9)
    return gasGwei
};

const quote = async (tokenIn, tokenOut) => {
    const Routers = await loadRouter();
    const routerRead = Routers[0];
    const dev = signers[0];

    const path = [tokenIn, tokenOut];
    const amountIn = ethers.utils.parseUnits("1.0", 18);


    
    const priceData = await routerRead.getAmountsOut(amountIn, path);
    const priceDataK = priceData[1];
    let price;

    //handle usdc
    if (tokenOut === quoteToken) {
        price = ethers.utils.formatUnits(priceDataK, 6)
        } else {
            price = ethers.utils.formatUnits(priceDataK, 18)
        };
    return price;
};

const fetchQuotes = async () => {
    const promises = [];
    const tokes = [];
    const data = []
    // const token = tokens.DINO;
    // data.push(await quote(token, quoteToken))

    for (let i in tokens) {
        let token = tokens[i];
        
        tokes.push(token)

    }

    for (let toke in tokes) {
        let tokie = tokes[toke]
        console.log(tokie)
        promises.push(quote(tokie, quoteToken));
    };

    Promise.all(promises)
        .then(
            (results) => {
                data.push(results)
            }
        )
        .catch((err) => {console.log(err)})

    //data.push({tokensymbol: tokenName, price: priceData, address: token})


    return data;
}

const main = async () => {
    try {
        const grass = await gasPrice();
        const accountInfo = await loadRouter();
        //const quotes = await fetchQuotes();
        const price = await quote(tokens.DINO, quoteToken);

        
        console.log(
            `
            +_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+
            Welcome ${accountInfo[0].address}

            Current Gas Price: ${grass}
            Token: ${tokens.DINO}
            Price in USD: ${price}
            Another Price: ${price}

            _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_
            `
        );
     
    } catch (error) {
        console.log(error)
    };

    
    return;
};
//return Routers;

provider.on('block', async () => {
    main();
})











