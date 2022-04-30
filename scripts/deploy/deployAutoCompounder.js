// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { addresses } = require("../addresses");
const ethers = hre.ethers;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // constructor args


  // We get the contract to deploy
  const AutoCompounder = await ethers.getContractFactory("AutoCompounder");
  const autoCompounder = AutoCompounder.attach("0xeE4Aa63A0fD6853A460B9b56EbEd74930DFf763c");
  // await autoCompounder.createAutoCompounder();
  await autoCompounder.deposit(0, ethers.utils.parseUnits('100', "ether"));

  // const autoCompounder = await AutoCompounder.deploy();
  
  // await autoCompounder.deployed();
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



