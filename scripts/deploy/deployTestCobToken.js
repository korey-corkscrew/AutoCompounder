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
  const CobToken = await ethers.getContractFactory("CobToken");

  const gnosisSafe = addresses.cornTreasury;

  const cobToken = await CobToken.deploy(gnosisSafe);
  
  const cob = await cobToken.deployed();


  console.log(`
    Test Cob Token deployed at ${cob.address}
  `);
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



