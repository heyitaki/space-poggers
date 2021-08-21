import fs from 'fs';

const MAX_SUPPLY = 12000;

const getOffsetId = (tokenId: number) => (tokenId + 567) % MAX_SUPPLY;

const getTokenTribe = (tokenId: number) => {
  return fs.promises
    .readFile(`../../photoshop-scripting/v2/Metadata/${getOffsetId(tokenId)}`)
    .then((data) => JSON.parse(data.toString()).attributes[0].value);
};

export const getAllTokenMetadata = async () => {
  const metadata = new Array(MAX_SUPPLY);
  const BATCH_SIZE = 1000;
  for (let i = 0; i < Math.ceil(MAX_SUPPLY / BATCH_SIZE); i++) {
    const promises = [];
    for (let j = 0; j < BATCH_SIZE; j++) {
      const idx = i * BATCH_SIZE + j;
      if (idx >= MAX_SUPPLY) {
        continue;
      }

      promises.push(
        getTokenTribe(idx).then((tribe) => {
          console.log(`(${idx}/12000) Got tribe from token metadata: ${tribe}`);
          metadata[idx] = tribe;
        }),
      );
    }

    await Promise.all(promises);
  }

  await fs.promises.writeFile('./data/tribes.json', JSON.stringify(metadata));
};

export const getTribeList = (): Promise<string[]> => {
  return fs.promises.readFile('./data/tribes.json').then((data) => JSON.parse(data.toString()));
};

const SpecialTribeMapping: { [key: string]: string } = {
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

export const enumerateTribeCounts = (tribeList: string[]) => {
  const counts: { [key: string]: number } = {
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

  for (const tribe of tribeList) {
    if (tribe in counts) {
      counts[tribe] += 1;
    } else {
      counts[SpecialTribeMapping[tribe]] += 1;
    }
  }

  return counts;
};
