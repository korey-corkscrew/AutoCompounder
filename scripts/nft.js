const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;
const axios = require("axios");

//contract imports

const masterchef = require("../artifacts/contracts/MasterChefV2.sol/MasterChefV2.json")
const {quickRouterAbi, UniswapV2PairAbi, ERC20Abi} = require('./abi.js');
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

const getUserBalance = async (userAddress, tokenAddress) => {
    const signer = await fetchSigner();
    const ctr = await fetchContract(tokenAddress, ERC20Abi, signer)
    const decimals = await ctr.decimals()
    const _symbol = await ctr.symbol()
    const balance = await ctr.balanceOf(userAddress)
    const strFormattedBal = ethers.utils.formatUnits(balance, decimals)
    const bigNumFormattedBal = ethers.utils.parseUnits(strFormattedBal, decimals)
    const floatFormattedBal = parseFloat(strFormattedBal)
    const ret = {
        symbol: _symbol,
        balance: floatFormattedBal,
        bignum: bigNumFormattedBal
    }
    return ret
}
//controller stuff
const getController = async () => {
    const signer = await fetchSigner()
    const controllerABI = ControllerABI; //imported above
    const controllerAddress = addresses.Controller
    const controllerContract = await fetchContract(
        controllerAddress,
         controllerABI,
          signer
          )
    return controllerContract
} //works

const addVault = async (address) => {
    const ctrlr = await getController()
    await ctrlr.addVault(address)
} //works

const readVaults = async (index) => {
    const ctrlr = await getController();
    const vault = await ctrlr.vaults(index);
    return vault
} //works

//nft stuff

const getVaultBase = async () => {
    const signer = await fetchSigner()
    const vaultBaseABI = VaultBaseABI
    const vaultBaseAddress = addresses.VaultBase
    const vaultBaseContract = await fetchContract(
        vaultBaseAddress,
        VaultBaseABI,
        signer
    )
    return vaultBaseContract
} //works

const activateVault = async (vaultId) => {
    const ctrlr = await getController()
    const tx = await ctrlr.activateVault(vaultId)
    return tx
}

const createTrade = async (vaultID, amounts, tokens) => {

    // _amounts[0] = starting amount
    // _amounts[1] = buy price (token[0] / token[1]) * 10e8
    // _amounts[2] = sell price (token[1] / token[0]) * 10e8
    //address _from, address[] calldata _tokens, uint256[] calldata _amounts, uint[] calldata _times

    const ctrlr = await getController()

    const tx = await ctrlr.createTrade(
        vaultID,
        tokens, 
        amounts, 
        [0],
        {gasPrice: ethers.utils.parseUnits('30', 'gwei'), gasLimit: 1009000})
    
    const receipt = await tx.wait()
    console.log(receipt)
}



const main = async () => {
    // const controller = await getController();
    // console.log("got Controller")
    // const vault = await getVaultBase()
    // console.log("got VaultBase")

    // const vaults = await readVaults(0); //same as activateVault(1)? index not same? wtf
    //const activate = await activateVault(1)
    // console.log("activated")
    // console.log(vaults)

    const bal = await getUserBalance("0x395977E98105A96328357f847Edc75333015b8f4", addresses.tokens.MiMATIC)
    //ADD VAULT
    console.log(bal)
    console.log(`
    bal: ${bal.bignum}
    
    `)
    // const add = await addVault(vault.address)
    // console.log("added vault")

    //APPROVETOKEN
    //const approval = await approveToken(addresses.tokens.USDC, addresses.Controller)
    //const approvalOut = await approveToken(addresses.tokens.WMATIC, addresses.Controller)

    // const tokens = [addresses.tokens.USDC, addresses.tokens.USDT]
    // const amountIn = 10000
    

    // const currentPrice = "2.0119303"
    // const buyPrice = 1000000000
    // const sellPrice = 2000000000 // usdc(1) / pricetarget(2.20)
    // const amounts = [amountIn, buyPrice, sellPrice]
    // console.log(`
    //     tokens: ${tokens}
    //     Amount In: ${amountIn}
    //     Current Price: ${currentPrice}
    //     Buy Target: ${buyPrice}
    //     Sell Target: ${sellPrice}
    //     amounts: ${amounts}
    // `)


    

  
    // const trade = await createTrade(0, amounts, tokens)
    // console.log("created trade")
}

main()

