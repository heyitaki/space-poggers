import fs from 'fs';

export const numToHexStr = (num?: number) => {
  if (!num) return;
  return '0x' + num.toString(16);
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getAddressListToAirdrop = () => {
  return fs.promises
    .readFile('./final.json')
    .then((data) => JSON.parse(data.toString()))
    .then((data) => {
      const allAddresses: string[] = [];
      for (const addr in data) {
        for (let i = 0; i < data[addr]; i++) {
          allAddresses.push(addr);
        }
      }
      return fs.promises.writeFile('./data/addresses.json', JSON.stringify(allAddresses));
    });
};

export const shuffleArray = (array: string[]) => {
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};
