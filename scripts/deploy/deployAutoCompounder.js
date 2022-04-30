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

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const account = new ethers.Wallet(process.env.PRIVATE_KEY);
  const signer = account.connect(provider);


  const GasTank = await ethers.getContractFactory("GasTank");
  // const gasTank = await GasTank.deploy();
  const gt = GasTank.attach("0xFc5cFd9616720d1b17c25D13F341F8189DEA740c");
  // const gt = await gasTank.deployed();
  // console.log(`
  //   Gas Tank deployed at ${gt.address}
  // `);

  // ------------------------------------------------------------

  const BobToken = await ethers.getContractFactory("BobToken");
  // const bobToken = await BobToken.deploy(signer.address);
  const bob = BobToken.attach("0xE5AB747c4BF94BDa6a80400f96C6cBB096607651");
  // const bob = await bobToken.deployed();
  // console.log(`
  //   Test token depoloyed at ${bob.address}
  // `);

  // // ------------------------------------------------------------

  // const cobPerBlock = ethers.utils.parseUnits("2.24", "ether");
  // const startblock = BigNumber.from(27745197);
  const MasterChefV2 = await ethers.getContractFactory("MasterChefV2");
  // const masterchef = await MasterChefV2.deploy(bob.address, signer.address, signer.address, cobPerBlock, startblock);
  const mc = MasterChefV2.attach("0xe11d9D3b273c885dBA123CDB71526f747fBA40F9");
  // const mc = await masterchef.deployed();
  // console.log(`
  //   MasterChef depoloyed at ${mc.address}
  // `);

  // await mc.add(50, bob.address, 10, false);
  // console.log(`
  //   Pool: ${bob.address} added to MasterChef
  // `);

  // await bob.transferOwnership(mc.address);
  // console.log(`
  //   Token ownership transfer
  // `);  

  // // ------------------------------------------------------------

  const rewardPool = 0;
  const AutoCompounder = await ethers.getContractFactory("AutoCompounder");
  // const autoCompounder = await AutoCompounder.deploy(gt.address, mc.address, rewardPool, bob.address);
  const ac = AutoCompounder.attach("0x7F47C4684Fc73F0427b1f497e244cb693CaF5eA6");
  // const ac = await autoCompounder.deployed();
  // console.log(`
  //   Auto Compounder depoloyed at ${ac.address}
  // `);

  // const compounder = await ac.createAutoCompounder();
  // console.log(`
  //   Compounder created at ${compounder}
  // `);

  const compounder = await ac.compounders(signer.address);

  // await ac.startAutoCompound(300);
  // console.log(`
  //   Auto compounder started
  // `);

  await ac.stopAutoCompound();

  // await gt.depositGas(signer.address, {'value': ethers.utils.parseUnits('0.5', "ether")});
  // console.log(`
  //   Gas deposit.
  // `);

  // await gt.addPayee(ac.address)
  // console.log(`
  //   Payee: ${ac.address} approved for payement with Gas Tank: ${gt.address}
  // `);

  // await bob.approve(compounder, ethers.utils.parseUnits('10000000', "ether"));
  // console.log(`
  //   Token ${bob.address} approved for trade on ${compounder}
  // `);

  // await ac.deposit(0, ethers.utils.parseUnits('100', "ether"));
  // console.log(`
  //   Auto compound desposit
  // `);
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



