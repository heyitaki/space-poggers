import fs from 'fs';
import path from 'path';
import { createHashFromFile, createHashFromString } from './hash';
import { formatCombo, getComboFromFilename, getMetadata } from './metadata';
import { pinDirectoryToIPFS, pinFileToIPFS } from './pinata';

type ProvenanceEntry = {
  tokenId: number;
  image: string;
  imageHash: string;
  traits: object;
};

const imgPath = '../../../spacepoggers/images';
const main = async () => {
  console.log('Starting IPFS upload and provenance calculation...');

  let concatImageHash = '';
  const collection: ProvenanceEntry[] = [];
  const promises = [];
  const unpinList: string[] = [];
  try {
    // Get the files as an array
    const files = await fs.promises.readdir(imgPath);
    console.log(`Found ${files.length} images in ${imgPath}`);

    // Loop through files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Upload img to IPFS
      console.log(`(${i}/${files.length}) Uploading image to IPFS: ${file}`);
      const filepath = path.join(imgPath, file);
      const resp = await pinFileToIPFS(filepath);
      const ipfs = `ipfs://${resp.data.IpfsHash}`;
      unpinList.push(resp.data.IpfsHash);

      // Save metadata json to file
      const combo = getComboFromFilename(file);
      const metadata = getMetadata(ipfs, combo);
      const metadataJson = JSON.stringify(metadata);
      promises.push(
        fs.promises
          .writeFile(`../../../spacepoggers/metadata/${i}`, metadataJson)
          .then(() =>
            console.log(`(${i}/${files.length}) Finished writing token metadata to file`),
          ),
      );

      // Calculate image hash & save provenance data
      const imageHash = await createHashFromFile(filepath);
      console.log(`(${i}/${files.length}) Calculating image hash...`);
      concatImageHash += imageHash;
      const provenance = {
        tokenId: i,
        image: ipfs,
        imageHash: imageHash,
        traits: formatCombo(combo),
      };
      collection.push(provenance);
    }
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }

  await Promise.all(promises).then(async () => {
    console.log('Calculating final provenance hash...');
    const finalProvenance = {
      provenance: createHashFromString(concatImageHash),
      concatenatedImageHashes: concatImageHash,
      collection: collection,
    };
    console.log('Writing provenance data to file...');
    await fs.promises.writeFile(
      '../../../spacepoggers/provenance.json',
      JSON.stringify(finalProvenance),
    );
    console.log('Writing unpin list to file...');
    await fs.promises.writeFile('../../../spacepoggers/unpin.json', JSON.stringify(unpinList));
    console.log('Uploading token metadata directory to IPFS...');
    const data = await pinDirectoryToIPFS('../../../spacepoggers/metadata/');
    console.log(data);
    console.log('All done!');
  });
};

main();
console.log('done!');
