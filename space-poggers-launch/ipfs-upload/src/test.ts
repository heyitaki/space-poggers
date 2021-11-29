import pinataSdk from '@pinata/sdk';
import fs from 'fs';
import path from 'path';
import { BASE_PATH } from './constants';
const pinata = pinataSdk(process.env.PINATA_KEY!, process.env.PINATA_SECRET!);

// pinata.pinList({ status: 'pinned', pageLimit: 1000, pageOffset: 0 }).then((data) => {
//   // console.log(data.rows);
//   console.log(data.count);
// });

Promise.all([
  fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'Batch-1.json')),
  fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'Batch-2.json')),
  fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'Batch-3.json')),
  fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'Batch-4.json')),
]).then((dataList) => {
  let totalList: number[] = [];
  for (const data of dataList) {
    totalList.concat(JSON.parse(data.toString()));
  }

  totalList = totalList.sort();
  const set = new Set(totalList);
  console.log(totalList.length, set.size);
});
