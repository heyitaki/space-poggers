/**
 * Require the credentials that you entered in the .env file
 */
require('dotenv').config();

const Web3 = require('web3');
const axios = require('axios');
const EthereumTx = require('ethereumjs-tx');
const log = require('ololog').configure({ time: true });
const fs = require('fs');

/**
 * Flag that defines whether to use the testnet or mainnet
 * @type {Boolean}
 */
const testmode = false;

/**
 * Network configuration
 */
const mainnet = `https://mainnet.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`;
const testnet = `https://rinkeby.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`;

/**
 * Change the provider that is passed to HttpProvider to `mainnet` for live transactions.
 */
const networkToUse = testmode ? testnet : mainnet;
const web3 = new Web3(new Web3.providers.HttpProvider(networkToUse));

/**
 * Set the web3 default account to use as your public wallet address
 */
web3.eth.defaultAccount = process.env.WALLET_ADDRESS;

/**
 * Fetch the current transaction gas prices from https://ethgasstation.info/
 *
 * @return {object} Gas prices at different priorities
 */
const getCurrentGasPrices = async () => {
  let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };

  // console.log('\r\n');
  // console.log(`Current ETH Gas Prices (in GWEI):`);
  // console.log('\r\n');
  // console.log(`Low: ${prices.low} (transaction completes in < 30 minutes)`);
  // console.log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`);
  // console.log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`);
  // console.log('\r\n');

  return prices;
};

/**
 * This is the process that will run when you execute the program.
 */
const sendEth = async (addr, amount, nonce) => {
  /**
   * With every new transaction you send using a specific wallet address,
   * you need to increase a nonce which is tied to the sender wallet.
   */
  console.log('NONCE: ', nonce);

  /**
   * Fetch the current transaction gas prices from https://ethgasstation.info/
   */
  let gasPrices = await getCurrentGasPrices();

  /**
   * Build a new transaction object and sign it locally.
   */
  let details = {
    to: addr,
    value: web3.toHex(web3.toWei(amount, 'ether')),
    gas: 21000,
    gasPrice: gasPrices.medium * 1000000000, // converts the gwei price to wei
    nonce: nonce,
    chainId: testmode ? 4 : 1, // EIP 155 chainId - mainnet: 1, rinkeby: 4
  };

  const transaction = new EthereumTx(details);

  /**
   * This is where the transaction is authorized on your behalf.
   * The private key is what unlocks your wallet.
   */
  transaction.sign(Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex'));

  /**
   * Now, we'll compress the transaction info down into a transportable object.
   */
  const serializedTransaction = transaction.serialize();

  /**
   * We're ready! Submit the raw transaction details to the provider configured above.
   */
  const transactionId = await web3.eth.sendRawTransaction(
    '0x' + serializedTransaction.toString('hex'),
  );

  /**
   * We now know the transaction ID, so let's build the public Etherscan url where
   * the transaction details can be viewed.
   */
  const url = `https://${testmode ? 'rinkeby.' : ''}etherscan.io/tx/${transactionId}`;
  console.log(url);

  console.log(`Note: please allow for 30 seconds before transaction appears on Etherscan`);
};

const main = async () => {
  let j = 0;
  const startNonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);
  let rawdata = fs.readFileSync('showcase_contest_eth_winners.json');
  let data = JSON.parse(rawdata);
  for (const addr in data) {
    console.log('======================');
    await sendEth(addr, data[addr], startNonce + j++)
      .then(() => {
        console.log('Finished ' + j);
      })
      .catch((err) => console.log(err));
  }

  console.log('All done!');
};

main().catch((err) => console.log(err));
