import pinataSdk from '@pinata/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BASE_PATH, NUM_TOKENS_TO_MINT, PoggerCombo } from './constants';
import { getComboFromFilename, getMetadataJson } from './metadata';
import { createHashFromFile, createHashFromString, delay, shuffleArray } from './utils';

type ProvenanceEntry = {
  tokenId: number;
  image: string;
  imageHash: string;
  traits: object;
};

dotenv.config();
const pinata = pinataSdk(process.env.PINATA_KEY!, process.env.PINATA_SECRET!);
const imgPath = path.join(BASE_PATH, 'Combined');

const NUM_BATCHES = 4;
const BATCH_SIZE = NUM_TOKENS_TO_MINT / NUM_BATCHES;
const THROTTLE_BATCH_SIZE = 12;
const NUM_THROTTLE_BATCHES = Math.ceil(BATCH_SIZE / THROTTLE_BATCH_SIZE);

const loadBatches = async () => {
  // Get already done ids
  const rawdata = await fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'Batch-4.json'));
  const idList: number[] = JSON.parse(rawdata.toString());

  // Create list of randomized tokenIds
  let tokenIdQueue: number[] = [];
  for (let i = 0; i < NUM_TOKENS_TO_MINT; i++) {
    tokenIdQueue.push(i);
  }

  // Remove intersection of lists
  for (let i = 0; i < idList.length; i++) {
    tokenIdQueue[idList[i]] = -1;
  }

  tokenIdQueue = tokenIdQueue.filter((x) => x != -1);
  tokenIdQueue = shuffleArray(tokenIdQueue);

  // Slice list into 3 parts
  const a = tokenIdQueue.slice(0, Math.ceil(tokenIdQueue.length / 3));
  const b = tokenIdQueue.slice(
    Math.ceil(tokenIdQueue.length / 3),
    Math.ceil((tokenIdQueue.length / 3) * 2),
  );
  const c = tokenIdQueue.slice(
    Math.ceil((tokenIdQueue.length / 3) * 2),
    Math.ceil(tokenIdQueue.length),
  );
  const batches = [a, b, c];
  const promises = [];
  for (let i = 0; i < batches.length; i++) {
    promises.push(
      fs.promises
        .writeFile(
          path.join(BASE_PATH, 'Batches', `Batch-${i + 1}.json`),
          JSON.stringify(batches[i]),
        )
        .then(() =>
          console.log(`Wrote batch ${i + 1}/${batches.length} (length: ${batches[i].length})`),
        ),
    );
  }

  return Promise.all(promises);
};

const main = async (batchNum: number) => {
  console.log('Getting relevant ids...');
  const data = await fs.promises.readFile(
    path.join(BASE_PATH, 'Batches', `Batch-${batchNum}.json`),
  );
  const tokenIdQueue = JSON.parse(data.toString());

  console.log('Starting IPFS upload and provenance calculation...');

  const provenanceEntries: ProvenanceEntry[] = [];
  const promises: Promise<any>[] = [];
  const unpinList: string[] = [];

  try {
    // Get the files as an array
    const files = await fs.promises.readdir(imgPath);
    console.log(`Found ${files.length} images in ${imgPath}`);

    // Batch to avoid "too many open files" error
    for (let j = 144; j < NUM_THROTTLE_BATCHES; j++) {
      const promises: Promise<any>[] = [];
      console.log(`Starting batch ${j + 1}/${NUM_THROTTLE_BATCHES}...`);

      // Loop through files
      for (
        let i = THROTTLE_BATCH_SIZE * j;
        i < Math.min(BATCH_SIZE, THROTTLE_BATCH_SIZE * (j + 1));
        i++
      ) {
        const tokenId = tokenIdQueue[i];
        const file = files[tokenId];

        // Upload image to IPFS
        if (i % 4 == 0) await delay(1000);
        const filepath = path.join(imgPath, file);
        console.log(`(${i + 1}/${BATCH_SIZE}) Start uploading to IPFS: ${file}`);
        promises.push(
          pinata.pinFromFS(filepath).then((data) => {
            console.log(`(${i + 1}/${BATCH_SIZE}) Uploaded image to IPFS: ${file}`);

            const ipfs = `ipfs://${data.IpfsHash}`;
            unpinList.push(data.IpfsHash);

            // Save metadata json to file
            const combo = getComboFromFilename(file);
            const metadata = getMetadataJson(ipfs, combo);
            const metadataJson = JSON.stringify(metadata);

            const promises = [];
            promises.push(
              fs.promises.writeFile(
                path.join(BASE_PATH, 'Batches', `Metadata-${batchNum}`, tokenId.toString()),
                metadataJson,
              ),
              // .then(() =>
              //   console.log(`(${i + 1}/${BATCH_SIZE}) Finished writing token metadata to file`),
              // ),
            );

            // Calculate image hash & save provenance data
            promises.push(
              createHashFromFile(filepath).then((imgHash) => {
                const provenance = {
                  tokenId,
                  image: ipfs,
                  imageHash: imgHash,
                  traits: combo,
                };
                provenanceEntries.push(provenance);
              }),
              // .then(() => console.log(`(${i + 1}/${BATCH_SIZE}) Calculated image hash`)),
            );

            return Promise.all(promises);
          }),
        );
      }

      await Promise.all(promises);
    }
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }

  await Promise.all(promises).then(async () => {
    // console.log('Calculating final provenance hash...');
    // const concatImageHash = imageHashes.join('');
    // const finalProvenance = {
    //   provenance: createHashFromString(concatImageHash),
    //   concatenatedImageHashes: concatImageHash,
    //   collection: provenanceEntries,
    // };

    // promises.push(
    //   fs.promises
    //     .writeFile(path.join(BASE_PATH, 'provenance.json'), JSON.stringify(finalProvenance))
    //     .then(() => console.log('Wrote provenance data to file')),
    // );

    // const options = { pinataMetadata: { name: 'Metadata' } };
    // promises.push(
    //   pinata
    //     .pinFromFS(path.resolve(path.join(BASE_PATH, 'Metadata')), options) // Only absolute path works here
    //     .then((data) => {
    //       console.log('Uploaded token metadata directory to IPFS');

    //       unpinList.push(data.IpfsHash);
    //       return fs.promises.writeFile(
    //         path.join(BASE_PATH, 'unpin.json'),
    //         JSON.stringify(unpinList),
    //       );
    //     })
    //     .then(() => console.log('Wrote unpin list to file')),
    // );

    console.log('Writing unpin and provenance data to file...');
    return Promise.all([
      fs.promises
        .writeFile(
          path.join(BASE_PATH, 'Batches', `unpin-${batchNum}.json`),
          JSON.stringify(unpinList),
        )
        .then(() => console.log('Wrote unpin data to file')),
      fs.promises
        .writeFile(
          path.join(BASE_PATH, 'Batches', `provenance-${batchNum}.json`),
          JSON.stringify(provenanceEntries),
        )
        .then(() => console.log('Wrote provenance data to file')),
    ]).then(() => console.log('All done!'));
  });
};

// const unpinAll = async () => {
//   const data = fs.readFileSync(path.join(BASE_PATH, 'unpin.json'));
//   const ipfsHashes = JSON.parse(data.toString());
//   console.log(ipfsHashes);

//   const BATCH_SIZE = 12;
//   for (let j = 0; j < Math.ceil(ipfsHashes.length / BATCH_SIZE); j++) {
//     await delay(1000);
//     const promises = [];
//     for (let i = j * BATCH_SIZE; i < Math.min((j + 1) * BATCH_SIZE, ipfsHashes.length); i++) {
//       if (i % 2 == 0) await delay(1000);
//       console.log(`${i + 1}/${ipfsHashes.length} Start unpinning file from IPFS`);
//       promises.push(
//         pinata
//           .unpin(ipfsHashes[i])
//           .then(() => console.log(`${i + 1}/${ipfsHashes.length} Unpinned file from IPFS`)),
//       );
//     }

//     await Promise.all(promises);
//   }

//   await Promise.all([
//     fs.promises.unlink(path.join(BASE_PATH, 'provenance.json')),
//     fs.promises.unlink(path.join(BASE_PATH, 'unpin.json')),
//     fs.promises.readdir(path.join(BASE_PATH, 'Metadata')).then((files) => {
//       const promises = [];
//       for (const file of files) {
//         promises.push(fs.promises.unlink(path.join(BASE_PATH, 'Metadata', file)));
//       }

//       return Promise.all(promises);
//     }),
//   ]);
// };

// const emergencyUnpin = async () => {
//   await pinata.pinList({ status: 'pinned', pageLimit: 1000 }).then(async (resp) => {
//     for (let i = 0; i < resp.rows.length; i++) {
//       if (i % 3 == 0) await delay(1000);

//       const hash = resp.rows[i].ipfs_pin_hash;
//       if (
//         hash === 'QmUpDQPp45zePrQmsdtUGuSr4q6ZnmxVDFtzHrLwBAVuTY' ||
//         hash === 'QmR7u6cL39tx4q4uhZ9vdQstAY3HXvCRtt1uVg48XQgTen'
//       ) {
//         continue;
//       }

//       console.log(`${i + 1}/${resp.rows.length} Start unpinning file from IPFS`);
//       pinata
//         .unpin(hash)
//         .then(() => console.log(`${i + 1}/${resp.rows.length} Unpinned file from IPFS`));
//     }
//   });
// };

const emergencyGenerateProvenanceEntries = async () => {
  // Get all metadata from pinata
  console.log('Starting to get metadata from Pinata...');
  const count = (await pinata.pinList({ status: 'pinned' })).count;
  const promises = [];
  for (let i = 0; i < Math.ceil(count / 1000); i++) {
    promises.push(pinata.pinList({ status: 'pinned', pageLimit: 1000, pageOffset: i * 1000 }));
  }

  console.log('Got metadata from Pinata');

  // Get relevant data from pinata
  const pinataData = await Promise.all(promises).then(async (respList) => {
    let pinataData: { name: string; ipfsHash: string }[] = [];
    for (const resp of respList) {
      pinataData = pinataData.concat(
        resp.rows.map((row) => {
          return {
            name: row.metadata.name!.toString(),
            ipfsHash: row.ipfs_pin_hash,
          };
        }),
      );
    }

    // Remove prereveal stuff
    pinataData = pinataData.filter(
      (id) =>
        id.ipfsHash !== 'QmUpDQPp45zePrQmsdtUGuSr4q6ZnmxVDFtzHrLwBAVuTY' &&
        id.ipfsHash !== 'QmR7u6cL39tx4q4uhZ9vdQstAY3HXvCRtt1uVg48XQgTen',
    );

    return pinataData;
  });
  console.log('Transformed Pinata data');

  // Get locally saved image metadata
  const getImageMetadata = () =>
    fs.promises.readdir(path.join(BASE_PATH, 'Metadata')).then(async (files) => {
      const metadata: { tokenId: number; ipfsHash: string }[] = [];

      const BATCH_SIZE = 1000;
      for (let i = 0; i < Math.ceil(files.length / BATCH_SIZE); i++) {
        const promises = [];
        for (let j = 0; j < BATCH_SIZE; j++) {
          const idx = i * BATCH_SIZE + j;
          if (idx >= files.length) {
            continue;
          }

          const file = files[idx];
          promises.push(
            fs.promises.readFile(path.join(BASE_PATH, 'Metadata', file)).then((data) => {
              metadata.push({
                tokenId: parseInt(file),
                ipfsHash: JSON.parse(data.toString()).image.slice(7),
              });
            }),
          );
        }
        await Promise.all(promises);
      }

      return metadata;
    });

  console.log('Getting local image metadata');
  const imageMetadata = await getImageMetadata();
  console.log('Got local image metadata');

  const localAndPinataMetadata: { name: string; ipfsHash: string; tokenId: number }[] = [];
  for (let i = 0; i < imageMetadata.length; i++) {
    const pinataDatum = pinataData.filter((data) => data.ipfsHash === imageMetadata[i].ipfsHash)[0];
    localAndPinataMetadata.push({
      name: pinataDatum.name,
      ipfsHash: pinataDatum.ipfsHash,
      tokenId: imageMetadata[i].tokenId,
    });
  }
  console.log('Zipped Pinata and local data', localAndPinataMetadata.length);

  // Get image hash & attributes
  const provenanceEntries: {
    tokenId: number;
    image: string;
    imageHash: string;
    traits: PoggerCombo;
  }[] = [];
  for (let i = 0; i < localAndPinataMetadata.length; i++) {
    const filename = localAndPinataMetadata[i].name;

    // Get attributes
    const combo = getComboFromFilename(filename);

    // Get image hash
    const imageHash = await createHashFromFile(path.join(BASE_PATH, 'Combined', filename));
    console.log(`(${i + 1}/${localAndPinataMetadata.length}) Hashed image`);

    // Put it all together
    provenanceEntries.push({
      tokenId: localAndPinataMetadata[i].tokenId,
      image: `ipfs://${localAndPinataMetadata[i].ipfsHash}`,
      imageHash: imageHash,
      traits: combo,
    });
  }

  console.log('Created provenance entries, writing to file...');
  return fs.promises
    .writeFile(
      path.join(BASE_PATH, 'Batches', 'provenance.json'),
      JSON.stringify(provenanceEntries),
    )
    .then(() => console.log('All done!'));
};

// Just to double check work
const generateBatchProvenance = () => {
  fs.promises.readFile(path.join(BASE_PATH, 'Backup', '814', 'provenance-2.json')).then((data) => {
    let provenanceEntries: ProvenanceEntry[] = JSON.parse(data.toString());
    provenanceEntries = provenanceEntries.sort((a, b) => a.tokenId - b.tokenId);
    const concatHash = provenanceEntries.map((x) => x.imageHash).join('');
    const finalProvenance = {
      provenance: createHashFromString(concatHash),
      concatenatedImageHashes: concatHash,
      collection: provenanceEntries,
    };
    return fs.promises.writeFile(
      path.join(BASE_PATH, 'provenance1.json'),
      JSON.stringify(finalProvenance),
    );
  });
};

const generateFinalProvenance = () => {
  // Promise.all([
  //   fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'provenance-1.json')),
  //   fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'provenance-2.json')),
  //   fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'provenance-3.json')),
  //   fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'provenance-4.json')),
  // ])
  fs.promises.readFile(path.join(BASE_PATH, 'Batches', 'provenance.json')).then((data) => {
    let provenanceEntries: ProvenanceEntry[] = JSON.parse(data.toString());
    console.log(provenanceEntries.length);

    provenanceEntries = provenanceEntries.sort((a, b) => a.tokenId - b.tokenId);
    const concatHash = provenanceEntries.map((x) => x.imageHash).join('');
    console.log(concatHash.length);
    const finalProvenance = {
      provenance: createHashFromString(concatHash),
      concatenatedImageHashes: concatHash,
      collection: provenanceEntries,
    };

    return fs.promises.writeFile(
      path.join(BASE_PATH, 'provenance.json'),
      JSON.stringify(finalProvenance),
    );
  });
};

const randomizeTokenIds = () => {
  // Create list of randomized tokenIds
  let tokenIdQueue: number[] = [];
  for (let i = 0; i < NUM_TOKENS_TO_MINT; i++) {
    tokenIdQueue.push(i);
  }

  tokenIdQueue = shuffleArray(tokenIdQueue);
  return fs.promises.readdir(path.join(BASE_PATH, 'Metadata1')).then((files) => {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(
        fs.promises
          .copyFile(
            path.join(BASE_PATH, 'Metadata1', files[i]),
            path.join(BASE_PATH, 'Metadata', tokenIdQueue[i].toString()),
          )
          .then(() => console.log(`(${i + 1}/${files.length}) Copied file`)),
      );
    }

    return Promise.all(promises);
  });
};

// search();
// loadBatches();
// main(3);
// unpinAll();
// emergencyUnpin();
// emergencyGenerateProvenanceEntries();
// generateBatchProvenance();
generateFinalProvenance();
// randomizeTokenIds();

// pinata.pinList({ status: 'pinned' }).then((data) => {
//   // console.log(data.rows);
//   console.log(data.count);
// });

// const promises = [];
// for (let i = 1; i < 5; i++) {
//   promises.push(
//     fs.promises.readdir(path.join(BASE_PATH, 'Batches', `Metadata-${i}`)).then((files) => {
//       const promises = [];
//       for (let j = 0; j < files.length; j++) {
//         const file = files[j];
//         const src = path.join(BASE_PATH, 'Batches', `Metadata-${i}`, file);
//         const dst = path.join(BASE_PATH, 'Metadata', file);
//         promises.push(
//           fs.promises
//             .copyFile(src, dst)
//             .then(() => console.log(`Copied file from ${src} to ${dst}`)),
//         );
//       }
//       return Promise.all(promises);
//     }),
//   );
// }
// Promise.all(promises).then(() => console.log('Done!'));
