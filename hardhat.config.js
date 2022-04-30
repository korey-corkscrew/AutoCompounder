require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@tenderly/hardhat-tenderly");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    maticMainnet: {
      url: "https://rpc-mainnet.maticvigil.com/v1/67ee67f1d107231cfb13bd5e672685c15ed151c8",
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 60000000000
    },
  },
  etherscan: {
    apiKey: {
        polygon: process.env.API_KEY,
    }
  }
};
