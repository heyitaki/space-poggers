import {
  AssetTransfersCategory,
  AssetTransfersParams,
  AssetTransfersResult,
  createAlchemyWeb3,
} from '@alch/alchemy-web3';
import dotenv from 'dotenv';
import fs from 'fs';
import { Log } from 'web3-core';
import { numToHexStr, sleep } from './utils';

dotenv.config();
const API_URL = process.env.API_URL;
const web3 = createAlchemyWeb3(API_URL!);

/**
 * Calling `getAssetTransfers` returns an "Internal data store" error from Alchemy. Recommendation
 * by Alchemy eng was to call it on smaller block ranges.
 * @param fromBlock
 * @param toBlock
 * @param fromAddress
 * @param toAddress
 * @returns
 */
export const getTransactionsAlchemy = async (
  fromBlock?: number,
  toBlock?: number,
  fromAddress?: string,
  toAddress?: string,
) => {
  let pKey = '';
  let allTransfers: AssetTransfersResult[] = [];
  try {
    while (true) {
      await sleep(5000);
      const filters: AssetTransfersParams = {
        fromBlock: numToHexStr(fromBlock),
        pageKey: pKey === '' ? undefined : pKey,
        excludeZeroValue: false,
        contractAddresses: ['0x4a8b01e437c65fa8612e8b699266c0e0a98ff65c'],
        category: [AssetTransfersCategory.TOKEN],
      };

      // filters.fromBlock = numToHexStr(fromBlock) || 'latest';
      // filters.toBlock = numToHexStr(toBlock) || 'latest';
      // if (fromAddress) filters.fromAddress = fromAddress;
      // if (toAddress) filters.toAddress = toAddress;

      const assetTransfers = await web3.alchemy.getAssetTransfers(filters);
      allTransfers = allTransfers.concat(assetTransfers.transfers);
      if (!assetTransfers.pageKey) {
        break;
      } else {
        pKey = assetTransfers.pageKey;
        console.log(`New page key: ${pKey}`);
      }
    }
  } catch (e) {
    console.log(e);
    console.log(allTransfers.length);
  }

  return allTransfers;
};

const TOKEN_TRANSFER_TOPIC0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
export const getTransfersManually = async (fromBlock: number) => {
  let allTransfers: Log[] = [];
  const promises = [];
  const toBlock = await web3.eth.getBlock('latest').then((data) => data.number);
  let currBlock = fromBlock;
  const BATCH_SIZE = 2000; // web3 eth_getLogs limit

  // Logging
  let i = 1;
  const numBatches = Math.ceil((toBlock - fromBlock) / BATCH_SIZE);

  while (true) {
    if (currBlock > toBlock) {
      break;
    }

    promises.push(
      web3.eth
        .getPastLogs({
          fromBlock: currBlock,
          toBlock: Math.min(currBlock + BATCH_SIZE, toBlock),
          topics: [TOKEN_TRANSFER_TOPIC0],
          address: '0x4a8B01E437C65FA8612e8b699266c0e0a98FF65c',
        })
        .then((data) => (allTransfers = allTransfers.concat(data)))
        .then(() => console.log(`Finished batch ${i++}/${numBatches}`)),
    );
    currBlock += BATCH_SIZE;
  }

  return Promise.all(promises).then(() => {
    allTransfers = allTransfers.sort((t1, t2) => t1.blockNumber - t2.blockNumber);
    fs.promises.writeFile('./data/transfers.json', JSON.stringify(allTransfers));
  });
};
