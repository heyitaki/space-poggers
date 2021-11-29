import fs from 'fs';
import { Log, Transaction } from 'web3-core';
import {
  enumerateTokenHolders,
  getTotalNumCompletedSets,
  mapOwnerToHighestCollectionValue,
  mapOwnerToLowestNumTraits,
} from './enumerate';
import { getTransactions } from './transfers';

const takeSnapshot = async () => {
  // await getTransfersManually(12983740);
  await enumerateTokenHolders();
  await getTotalNumCompletedSets();
};

// getTransactions();
// simplifyTransactionMap();
// mapOwnerToHighestCollectionValue();
// mapOwnerToLowestNumTraits();
enumerateTokenHolders();

// const txs: Transaction[] = JSON.parse(fs.readFileSync('./data/transactions.json').toString());
// console.log(txs.length, txs[0]);
// console.log(
//   txs.filter(
//     (tx) =>
//       tx &&
//       (tx.to?.toLowerCase() === '0x6a3e11eb1a49db4503a2546f9046c6f62d51c513' ||
//         tx.from.toLowerCase() === '0x6a3e11eb1a49db4503a2546f9046c6f62d51c513'),
//   ),
// );

// const transfers: Log[] = JSON.parse(fs.readFileSync('./data/transfers.json').toString());
// console.log(
//   transfers.filter(
//     (transfer) =>
//       transfer.transactionHash ===
//       '0xb42e24957ad6400d1022a56f34a12496be1c2b5ec23b44904346c6de3c2404de',
//   ),
// );
