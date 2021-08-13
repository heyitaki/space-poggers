import crypto from 'crypto';
import fs from 'fs';

export const createHashFromFile = (filePath: string): Promise<string> =>
  new Promise((resolve) => {
    const hash = crypto.createHash('sha256');
    return fs
      .createReadStream(filePath)
      .on('data', (data) => hash.update(data))
      .on('end', () => resolve(hash.digest('hex')));
  });

export const createHashFromString = (str: string): string => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

export const shuffleArray = (array: number[]) => {
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
