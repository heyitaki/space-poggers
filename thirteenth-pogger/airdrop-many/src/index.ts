import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { shuffleArray } from './utils';

dotenv.config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const web3 = createAlchemyWeb3(API_URL!);

const contract = JSON.parse(fs.readFileSync('./data/contract-abi.json').toString());
const contractAddress = '0x4a8B01E437C65FA8612e8b699266c0e0a98FF65c';
const nftContract = new web3.eth.Contract(contract);

const getCurrentGasPrices = async () => {
  const response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
  return {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };
};

const airdropThirteenthPogger = async (address: string, nonce: number) => {
  const gasPrices = await getCurrentGasPrices();
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    gas: 500000,
    gasPrice: gasPrices.medium * 1000000000, // converts the gwei price to wei
    nonce: nonce,
    chainId: 1, // EIP 155 chainId - mainnet: 1, rinkeby: 4
    data: nftContract.methods.airdropThirteenthPogger(address).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction!, function (err, hash) {
        if (!err) {
          console.log(
            'The hash of your transaction is: ',
            hash,
            "\nCheck Alchemy's Mempool to view the status of your transaction!",
          );
        } else {
          console.log('Something went wrong when submitting your transaction:', err);
        }
      });
    })
    .catch((err) => {
      console.log(' Promise failed:', err);
    });
};

const randomizeAddresses = async () => {
  const data = await fs.promises.readFile('./data/addresses_base.json');
  let addresses = JSON.parse(data.toString());
  addresses = shuffleArray(addresses);
  await fs.promises.writeFile('./data/addresses.json', JSON.stringify(addresses));
};

const airdropAllThirteenthPoggers = async () => {
  // Nonce
  let j = 0;
  const startNonce = await web3.eth.getTransactionCount(PUBLIC_KEY);

  // Load addresses
  const rawdata = await fs.promises.readFile('./data/addresses.json');
  const addresses = JSON.parse(rawdata.toString());

  // Iterate and airdrop
  for (const addr of addresses) {
    await airdropThirteenthPogger(addr, startNonce + j++).then(() =>
      console.log(`${j}/${addresses.length} Airdrop completed!`),
    );
  }
};

// randomizeAddresses();
airdropAllThirteenthPoggers();
