/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

const { RINKEBY_API_URL, ROPSTEN_API_URL, MAINNET_API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } =
  process.env;
module.exports = {
  solidity: '0.8.0',
  defaultNetwork: 'mainnet',
  networks: {
    hardhat: {},
    rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    ropsten: {
      url: ROPSTEN_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mainnet: {
      url: MAINNET_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // TODO: Somehow this didn't work when bounded by quotes in .env
    apiKey: ETHERSCAN_API_KEY,
  },
};
