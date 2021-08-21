import fs from 'fs';
import { Log } from 'web3-core';
import { getTribeList } from './metadata';

const SPECIAL_TRIBE_MAPPING: { [key: string]: string } = {
  'Alien Cat': 'Cat',
  'Bubblegum Gorilla': 'Gorilla',
  'Diamond Owl': 'Owl',
  'Driftwood Turtle': 'Turtle',
  'Flaming Red Panda': 'Red Panda',
  'Golden Frog': 'Frog',
  'Ice Penguin': 'Penguin',
  Jellophant: 'Elephant',
  'Marble Mouse': 'Mouse',
  'Rainbow Llama': 'Llama',
  'Silver Bee': 'Bee',
  'Zombie Dog': 'Dog',
};

export const enumerateTokenHolders = async () => {
  const data = await fs.promises.readFile('./data/transfers.json');
  const transfers: Log[] = JSON.parse(data.toString());
  console.log(`Enumerating ${transfers.length} transfers...`);

  const tokenOwnerAddresses = new Array(12000);
  for (const transfer of transfers) {
    const tokenIdHex = transfer.topics[3];
    if (!tokenIdHex) {
      continue;
    }

    const tokenId = parseInt(tokenIdHex);
    tokenOwnerAddresses[tokenId] = transfer.topics[2]; // To addr
  }

  await fs.promises
    .writeFile('./data/token_to_owner.json', JSON.stringify(tokenOwnerAddresses))
    .then(() => console.log('Wrote tokens to owner mapping to file'));

  const tribes = await getTribeList();

  const tokenCountsByOwner: { [key: string]: { [key2: string]: number } } = {};
  for (let i = 0; i < tokenOwnerAddresses.length; i++) {
    const addr = tokenOwnerAddresses[i];
    if (!(addr in tokenCountsByOwner)) {
      tokenCountsByOwner[addr] = {
        Bee: 0,
        Cat: 0,
        Dog: 0,
        Elephant: 0,
        Frog: 0,
        Gorilla: 0,
        Llama: 0,
        Mouse: 0,
        Owl: 0,
        Penguin: 0,
        'Red Panda': 0,
        Turtle: 0,
      };
    }

    const tribe = tribes[i];
    const counts = tokenCountsByOwner[addr];
    if (tribe in counts) {
      counts[tribe]++;
    } else {
      counts[SPECIAL_TRIBE_MAPPING[tribe]]++;
    }
  }

  await fs.promises
    .writeFile('./data/token_list_by_owner.json', JSON.stringify(tokenCountsByOwner))
    .then(() => console.log('Wrote token list by owner to file'));

  const ownerToNumCompletedSets: { [key: string]: number } = {};
  for (const owner in tokenCountsByOwner) {
    const counts = tokenCountsByOwner[owner];
    const numCompletedSets = Math.min(...Object.values(counts));
    if (numCompletedSets) {
      ownerToNumCompletedSets[owner] = numCompletedSets;
    }
  }

  await fs.promises
    .writeFile('./data/final.json', JSON.stringify(ownerToNumCompletedSets))
    .then(() => console.log('All done!'));
};

export const getTotalNumCompletedSets = () => {
  fs.promises.readFile('./data/final.json').then((data) => {
    const counts = JSON.parse(data.toString());
    const numOwners = Object.keys(counts).length;
    const numTotalSets = (Object.values(counts) as number[]).reduce(
      (a: number, b: number) => a + b,
      0,
    );
    console.log('Number of owners with at least 1 completed set: ', numOwners);
    console.log('Total number of completed sets: ', numTotalSets);
  });
};
