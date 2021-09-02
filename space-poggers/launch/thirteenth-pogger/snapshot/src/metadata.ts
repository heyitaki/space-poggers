import fs from 'fs';

type IpfsMetadata = { attributes: { trait_type: string; value: string }; image: string };

const MAX_SUPPLY = 12000;

const getOffsetId = (tokenId: number) => (tokenId + 567) % MAX_SUPPLY;
const getTokenId = (offsetId: number) => (offsetId - 567 + MAX_SUPPLY) % MAX_SUPPLY;

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

export const getAllTokenMetadata = () => {
  const allMetadata: { [key: number]: IpfsMetadata } = {};

  // Normal Poggers
  const p1 = fs.promises.readdir('../../photoshop-scripting/v2/Metadata').then((files) => {
    console.log(`Found ${files.length} files...`);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tokenId = getTokenId(parseInt(file));
      const data = fs.readFileSync(`../../photoshop-scripting/v2/Metadata/${file}`);
      allMetadata[tokenId] = JSON.parse(data.toString());
      console.log(`(${i + 1}/${files.length}) Grabbed token metadata: ${tokenId}`);
    }
  });

  // 13th Pogger
  const p2 = fs.promises.readdir('../photoshop-scripting/Metadata').then((files) => {
    console.log(`Found ${files.length} files...`);
    for (let i = 0; i < files.length; i++) {
      const tokenId = parseInt(files[i]);
      const data = fs.readFileSync(`../photoshop-scripting/Metadata/${tokenId}`);
      allMetadata[tokenId] = JSON.parse(data.toString());
      console.log(`(${i + 1}/${files.length}) Grabbed token metadata: ${tokenId}`);
    }
  });

  return Promise.all([p1])
    .then(() => console.log(`Processed ${Object.keys(allMetadata).length} tokens`))
    .then(() =>
      fs.promises.writeFile('./data/all_token_metadata.json', JSON.stringify(allMetadata)),
    )
    .then(() => console.log('Wrote all token metadata to file'));
};

const tokenIdToMetadataMap: {
  [tokenId: string]: { attributes: { trait_type: string; value: string }[] };
} = JSON.parse(fs.readFileSync('./data/all_token_metadata.json').toString());

export const getTribe = (tokenId: string) => {
  return tokenIdToMetadataMap[tokenId].attributes.filter((x) => x.trait_type === 'Tribe')[0].value;
};

export const getNumNoneTraits = (tokenId: string) => {
  return tokenIdToMetadataMap[tokenId].attributes.filter((x) => x.value === 'None').length;
};
