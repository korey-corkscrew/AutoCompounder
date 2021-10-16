// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // constructor args
  const supply = ethers.utils.parseUnits("10000000", "ether");
  const name = "Alt Token2"
  const symbol = "ALT"

  // We get the contract to deploy
  const EggToken = await ethers.getContractFactory("EggToken");
  const eggToken = await EggToken.deploy(name, symbol, supply);

  await eggToken.deployed();

  console.log("Greeter deployed to:", eggToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



///0xd79E2Ec72aFeaB56171f3e6d4a1879d8b955a384 - Farm token
// 0x7DBaFf79d13A0c842777742A86aE3aCAc9817250 - alt1
// 0xCCd1660797fe05dAe3439568aD39D2a4DacEab0e - alt2