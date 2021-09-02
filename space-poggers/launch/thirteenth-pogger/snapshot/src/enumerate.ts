import fs from 'fs';
import { Log, Transaction } from 'web3-core';
import { getNumNoneTraits, getTribe } from './metadata';
import { getTransactionValue } from './transfers';
import { hexToNum } from './utils';

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

const getBaseTribe = (tribe: string) => {
  if (tribe in SPECIAL_TRIBE_MAPPING) return SPECIAL_TRIBE_MAPPING[tribe];
  return tribe;
};

export const mapTokensToOwners = () => {
  if (fs.existsSync('./data/token_to_owner.json')) {
    process.stdout.write('Loading token to owner map from file... ');
    const data: { [tokenId: number]: { owner: string; hash: string } } = JSON.parse(
      fs.readFileSync('./data/token_to_owner.json').toString(),
    );
    process.stdout.write('Done!\n');
    return data;
  }

  const transfers: Log[] = JSON.parse(fs.readFileSync('./data/transfers.json').toString());
  console.log(`Enumerating ${transfers.length} transfers...`);

  const tokensToOwners: { [tokenId: number]: { owner: string; hash: string } } = {};
  for (const transfer of transfers) {
    const tokenIdHex = transfer.topics[3];
    if (!tokenIdHex) {
      continue;
    }

    const tokenId = hexToNum(tokenIdHex);
    const ownerAddr = '0x' + transfer.topics[2].slice(26);
    tokensToOwners[tokenId] = {
      owner: ownerAddr, // To addr
      hash: transfer.transactionHash,
    };
  }

  fs.writeFileSync('./data/token_to_owner.json', JSON.stringify(tokensToOwners));
  console.log('Wrote tokens to owner mapping to file');
  return tokensToOwners;
};

// Untested since new changes
export const enumerateTokenHolders = async () => {
  const tokensToOwners = mapTokensToOwners();
  console.log(`Enumerating ${Object.keys(tokensToOwners).length} tokens...`);

  const tokenCountsByOwner: { [key: string]: { [key2: string]: number } } = {};
  const tokenIds = Object.keys(tokensToOwners);
  let i = 0;
  for (const tokenId of tokenIds) {
    const addr = tokensToOwners[parseInt(tokenId)].owner;
    console.log(
      `(${++i}/${tokenIds.length}) Enumerating token id ${tokenId} with owner ${addr.slice(0, 7)}`,
    );

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
        Zero: 0,
      };
    }

    const tribe = getBaseTribe(getTribe(tokenId));
    tokenCountsByOwner[addr][tribe]++;
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
    .writeFile('./data/num_completed_sets_by_owner.json', JSON.stringify(ownerToNumCompletedSets))
    .then(() => console.log('All done!'));
};

export const getTotalNumCompletedSets = () => {
  fs.promises.readFile('./data/num_completed_sets_by_owner.json').then((data) => {
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

export const mapOwnerToHighestCollectionValue = () => {
  const tokensToOwners = mapTokensToOwners();
  const ownerToHighestSaleByTribeMap: { [ownerAddr: string]: { [tribeName: string]: number } } = {};
  for (const tokenId in tokensToOwners) {
    const data = tokensToOwners[tokenId];
    const addr = data.owner;
    if (!(addr in ownerToHighestSaleByTribeMap)) {
      ownerToHighestSaleByTribeMap[addr] = {
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
        Zero: 0,
      };
    }

    const tribe = getBaseTribe(getTribe(tokenId));
    const value = getTransactionValue(data.hash);
    ownerToHighestSaleByTribeMap[addr][tribe] = Math.max(
      value,
      ownerToHighestSaleByTribeMap[addr][tribe],
    );
  }

  fs.writeFileSync(
    './data/owner_to_highest_sales_by_tribe.json',
    JSON.stringify(ownerToHighestSaleByTribeMap),
  );
  console.log('Wrote owner to highest sales per tribe to file');

  let ownerToCollectionValueList: { addr: string; value: number }[] = [];
  for (const addr in ownerToHighestSaleByTribeMap) {
    const totalValue = Object.values(ownerToHighestSaleByTribeMap[addr]).reduce((a, b) => a + b);
    ownerToCollectionValueList.push({ addr: addr, value: totalValue });
  }

  ownerToCollectionValueList = ownerToCollectionValueList.sort((a, b) => b.value - a.value);
  fs.writeFileSync(
    './data/owner_to_collection_value.json',
    JSON.stringify(ownerToCollectionValueList),
  );
  console.log('Wrote owner to collection value list to file. All done!');
};

export const mapOwnerToLowestNumTraits = () => {
  const tokensToOwners = mapTokensToOwners();
  const ownerToHighestNumNoneTraitsByTribeMap: {
    [ownerAddr: string]: { [tribeName: string]: number };
  } = {};
  for (const tokenId in tokensToOwners) {
    const data = tokensToOwners[tokenId];
    const addr = data.owner;
    if (!(addr in ownerToHighestNumNoneTraitsByTribeMap)) {
      ownerToHighestNumNoneTraitsByTribeMap[addr] = {
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
        Zero: 0,
      };
    }

    const tribe = getBaseTribe(getTribe(tokenId));
    const numNoneTraits = getNumNoneTraits(tokenId);
    ownerToHighestNumNoneTraitsByTribeMap[addr][tribe] = Math.max(
      numNoneTraits,
      ownerToHighestNumNoneTraitsByTribeMap[addr][tribe],
    );
  }

  fs.writeFileSync(
    './data/owner_to_highest_num_none_traits_by_tribe.json',
    JSON.stringify(ownerToHighestNumNoneTraitsByTribeMap),
  );

  let ownerToNumNoneTraitsList: { addr: string; value: number }[] = [];
  for (const addr in ownerToHighestNumNoneTraitsByTribeMap) {
    const totalValue = Object.values(ownerToHighestNumNoneTraitsByTribeMap[addr]).reduce(
      (a, b) => a + b,
    );
    ownerToNumNoneTraitsList.push({ addr: addr, value: totalValue });
  }

  ownerToNumNoneTraitsList = ownerToNumNoneTraitsList.sort((a, b) => b.value - a.value);
  fs.writeFileSync(
    './data/owner_to_num_none_traits_in_collection.json',
    JSON.stringify(ownerToNumNoneTraitsList),
  );
};
