const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const axios = require("axios");

//contract imports

const masterchef = require("../artifacts/contracts/MasterChefV2.sol/MasterChefV2.json")
const {quickRouterAbi, UniswapV2PairAbi, ERC20Abi, aggregatorV3InterfaceABI} = require('./abi.js');
const {pools} = require("./pools.js")
const {addresses} = require("./addresses.js")
const {VaultBaseABI} = require("./vaultBaseABI.js")
const {ControllerABI} = require("./controllerABI.js")

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

const approveToken = async (tokenAddress, spender) => {
    const signer = await fetchSigner();
    const ERC20Contract = await fetchContract(tokenAddress, ERC20Abi, signer);
    const tx = await ERC20Contract.approve(spender, ethers.constants.MaxUint256.sub(1));
    console.log(`approved Controller to spend your ${tokenAddress}`)
    return tx
};//works


const fetchPriceFeed = async (priceFeedAddress) => {
    const signer = await fetchSigner()
    const ctr = await fetchContract(priceFeedAddress, aggregatorV3InterfaceABI, signer)
    return ctr
}

const getPrice = async () => {
    const ctr = await fetchPriceFeed(addresses.Oracle)
    const price = await ctr.latestRoundData()
    return price
}

const mapPriceData = async (priceData) => {
  
        console.log(priceData.roundId)
        const id = ethers.utils.formatUnits(priceData.roundId, 0)
        const answer = ethers.utils.formatUnits(priceData.answer, 8)
        
        const timestamp = ethers.utils.formatUnits(priceData.updatedAt, 0)
        var d = Date(timestamp*1000);
        return {
            ID: id,
            time: d,
            price: answer
        }
  
}

const main = async () => {
    const price = await getPrice()
    const map = await mapPriceData(price)
    console.log(price)
    console.log(map)
}

main()