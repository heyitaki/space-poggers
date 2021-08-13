import fs from 'fs';
import path from 'path';
import { createHashFromFile, createHashFromString } from './hash';
import { formatCombo, getComboFromFilename, getMetadata } from './metadata';
import { pinDirectoryToIPFS, pinFileToIPFS } from './pinata';
import { shuffleArray } from './utils';

type ProvenanceEntry = {
  tokenId: number;
  image: string;
  imageHash: string;
  traits: object;
};

const imgPath = '../../photoshop-scripting/v2/Combined/';
const main = async () => {
  console.log('Starting IPFS upload and provenance calculation...');

  // Create list of randomized tokenIds
  let tokenIdQueue = [];
  for (let i = 0; i < 12000; i++) {
    tokenIdQueue.push(i);
  }

  tokenIdQueue = shuffleArray(tokenIdQueue);

  const imageHashes = new Array(12000);
  const provenanceEntries: ProvenanceEntry[] = [];
  const promises: Promise<any>[] = [];
  const unpinList: string[] = [];

  try {
    // Get the files as an array
    const files = await fs.promises.readdir(imgPath);
    console.log(`Found ${files.length} images in ${imgPath}`);

    // Loop through files
    for (let i = 0; i < tokenIdQueue.length; i++) {
      const tokenId = tokenIdQueue[i];
      const file = files[tokenId];

      // Upload img to IPFS
      console.log(`(${i}/${files.length}) Uploading image to IPFS: ${file}`);
      const filepath = path.join(imgPath, file);
      promises.push(
        pinFileToIPFS(filepath).then((resp: any) => {
          const ipfs = `ipfs://${resp.data.IpfsHash}`;
          unpinList.push(resp.data.IpfsHash);
          const promises = [];

          // Save metadata json to file
          const combo = getComboFromFilename(file);
          const metadata = getMetadata(ipfs, combo);
          const metadataJson = JSON.stringify(metadata);
          promises.push(
            fs.promises
              .writeFile(`../../photoshop-scripting/v2/Metadata/${tokenId}`, metadataJson)
              .then(() =>
                console.log(`(${i}/${files.length}) Finished writing token metadata to file`),
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
                  traits: formatCombo(combo),
                };
                provenanceEntries.push(provenance);
              })
              .then(() => console.log(`(${i}/${files.length}) Calculated image hash`)),
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
        .writeFile('../../photoshop-scripting/v2/provenance.json', JSON.stringify(finalProvenance))
        .then(() => console.log('Wrote provenance data to file')),
    );

    promises.push(
      fs.promises
        .writeFile('../../photoshop-scripting/v2/unpin.json', JSON.stringify(unpinList))
        .then(() => console.log('Wrote unpin list to file')),
    );

    promises.push(
      pinDirectoryToIPFS('../../photoshop-scripting/v2/Metadata/')
        .then((data) => console.log(data))
        .then(() => console.log('Uploaded token metadata directory to IPFS')),
    );

    return Promise.all(promises).then(() => console.log('All done!'));
  });
};

main();
