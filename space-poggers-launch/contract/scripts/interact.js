require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(API_URL);

const contract = require('../artifacts/contracts/SpacePoggers.sol/SpacePoggers.json');
const contractAddress = '0xe12873fd7e2d91c2dc2b3f50b6189f597ff52952';
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function main() {
  const message = await nftContract.methods.totalSupply().call();
  console.log('The message is: ' + message);
}

main();
