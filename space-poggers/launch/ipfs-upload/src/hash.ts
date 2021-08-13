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
