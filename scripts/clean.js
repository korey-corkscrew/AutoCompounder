const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;

const {quickRouterAbi} = require('./abi.js');

const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/4b331c188697971af1cd6f05bb7065bc358b7e89");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const signer = new wallet.connect(provider);


