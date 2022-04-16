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
  //        Masterchef Constructor Args,
  // address _devaddr,
  // address _feeAddress,
  // uint256 _eggPerBlock,
  // uint256 _startBlock
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // constructor args
  
  const cobAddress = addresses.CobToken 
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const account = new ethers.Wallet(process.env.PRIVATE_KEY);
  const signer = account.connect(provider);
  const devaddress = signer.address;
  const feeaddress = addresses.cornTreasury;
  const cobPerBlock = ethers.utils.parseUnits("2.24", "ether");
  const startblock = BigNumber.from(20285829);


  // We get the contract to deploy
  const MasterChefV2 = await ethers.getContractFactory("MasterChefV2");
  const masterchef = await MasterChefV2.deploy(cobAddress, devaddress, feeaddress, cobPerBlock, startblock);

  await masterchef.deployed();

  console.log("Master Chief 117 deployed to:", masterchef.address);
  const CobToken = await ethers.getContractFactory("CobToken");
  const cobContract = CobToken.attach(cobAddress);
  await cobContract.transferOwnership(masterchef.address);

  console.log("Transferred ownership of Cob to MasterChief for minting & staking rewards")

  await new Promise(r => setTimeout(r, 30000));


  await hre.run("verify:verify", {
    address: masterchef.address,
    constructorArguments: [
      cobAddress, devaddress, feeaddress, cobPerBlock, startblock
    ],
  });
}

//renounce ownership of COB token to Masterchef





// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// 0xC71EbC899BCC111F39B2715B5d2D397E671B5bd2 - MasterChef
///0x793AcF39c3d605d3aD042Ae01fd290a6fE489164 - Farm token
// 0x7DBaFf79d13A0c842777742A86aE3aCAc9817250 - alt1
// 0xCCd1660797fe05dAe3439568aD39D2a4DacEab0e - alt2