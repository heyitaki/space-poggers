import pinataSdk from '@pinata/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BASE_PATH, NUM_TOKENS_TO_MINT } from './constants';
import { getComboFromFilename, getMetadataJson } from './metadata';
import { createHashFromFile, createHashFromString, shuffleArray } from './utils';

type ProvenanceEntry = {
  tokenId: number;
  image: string;
  imageHash: string;
  traits: object;
};

dotenv.config();
const pinata = pinataSdk(process.env.PINATA_KEY!, process.env.PINATA_SECRET!);
const imgPath = path.join(BASE_PATH, 'Combined');
const main = async () => {
  console.log('Starting IPFS upload and provenance calculation...');

  // Create list of randomized tokenIds
  let tokenIdQueue = [];
  for (let i = 0; i < NUM_TOKENS_TO_MINT; i++) {
    tokenIdQueue.push(i);
  }

  tokenIdQueue = shuffleArray(tokenIdQueue);

  const imageHashes = new Array(NUM_TOKENS_TO_MINT);
  const provenanceEntries: ProvenanceEntry[] = [];
  const promises: Promise<any>[] = [];
  const unpinList: string[] = [];

  try {
    // Get the files as an array
    const files = await fs.promises.readdir(imgPath);
    console.log(`Found ${files.length} images in ${imgPath}`);
    console.log(files, imgPath);

    // Loop through files
    for (let i = 0; i < tokenIdQueue.length; i++) {
      const tokenId = tokenIdQueue[i];
      const file = files[tokenId];

      // Upload img to IPFS
      console.log(`(${i + 1}/${files.length}) Uploading image to IPFS: ${file}`);
      const filepath = path.join(imgPath, file);
      promises.push(
        pinata.pinFromFS(filepath).then((data) => {
          const ipfs = `ipfs://${data.IpfsHash}`;
          unpinList.push(data.IpfsHash);
          const promises = [];

          // Save metadata json to file
          const combo = getComboFromFilename(file);
          const metadata = getMetadataJson(ipfs, combo);
          const metadataJson = JSON.stringify(metadata);
          promises.push(
            fs.promises
              .writeFile(path.join(BASE_PATH, `Metadata/${tokenId}`), metadataJson)
              .then(() =>
                console.log(`(${i + 1}/${files.length}) Finished writing token metadata to file`),
              ),
          );

          // Calculate image hash & save provenance data
          promises.push(
            createHashFromFile(filepath)
              .then((imgHash) => {
                imageHashes[tokenId] = imgHash;
                const provenance = {
                  tokenId,
                  image: ipfs,
                  imageHash: imgHash,
                  traits: combo,
                };
                provenanceEntries.push(provenance);
              })
              .then(() => console.log(`(${i + 1}/${files.length}) Calculated image hash`)),
          );

          return Promise.all(promises);
        }),
      );
    }
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }

  await Promise.all(promises).then(async () => {
    const promises = [];

    console.log('Calculating final provenance hash...');
    const concatImageHash = imageHashes.join('');
    const finalProvenance = {
      provenance: createHashFromString(concatImageHash),
      concatenatedImageHashes: concatImageHash,
      collection: provenanceEntries,
    };

    promises.push(
      fs.promises
        .writeFile(path.join(BASE_PATH, 'provenance.json'), JSON.stringify(finalProvenance))
        .then(() => console.log('Wrote provenance data to file')),
    );

    const options = { pinataMetadata: { name: 'Metadata' } };
    promises.push(
      pinata
        .pinFromFS(path.resolve(path.join(BASE_PATH, 'Metadata')), options) // Only absolute path works here
        .then((data) => {
          console.log('Uploaded token metadata directory to IPFS');

          unpinList.push(data.IpfsHash);
          return fs.promises.writeFile(
            path.join(BASE_PATH, 'unpin.json'),
            JSON.stringify(unpinList),
          );
        })
        .then(() => console.log('Wrote unpin list to file')),
    );

    return Promise.all(promises).then(() => console.log('All done!'));
  });
};

const unpinAll = async () => {
  const data = fs.readFileSync(path.join(BASE_PATH, 'unpin.json'));
  const ipfsHashes = JSON.parse(data.toString());
  const promises = [];
  for (let i = 0; i < ipfsHashes.length; i++) {
    promises.push(
      pinata
        .unpin(ipfsHashes[i])
        .then(() => console.log(`${i + 1}/${ipfsHashes.length} Unpinned file from IPFS`)),
    );
  }

  await Promise.all(promises);
};

// main();
unpinAll();

// const test = async () => {
//   const p1 = '../photoshop-scripting/v2/Metadata';
//   const p2 = path.join(BASE_PATH, '/Metadata');
//   console.log(p1, p2, p1 == p2);
//   await pinata
//     .pinFromFS() // path.join throws error for some reason
//     .then((data) => {
//       console.log('Uploaded token metadata directory to IPFS');
//     });
//   // await pinDirectoryToIPFS(p2)
//   //   .then(() => console.log('success2'))
//   //   .catch(() => console.log('fail2'));
//   // await pinDirectoryToIPFS();
// };

// test();
