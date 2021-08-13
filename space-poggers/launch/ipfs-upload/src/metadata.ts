import { PoggerCombo } from './constants';

export const getComboFromFilename = (filename: string): PoggerCombo => {
  // Same ordering as in getFilename in photoshop-scripting
  const tokens = filename.split('.')[0].split('-');
  return {
    Tribe: tokens[0],
    Background: tokens[1],
    Clothing: tokens[2],
    Neckwear: tokens[3],
    Headwear: tokens[4],
    Eyewear: tokens[5],
    Mouthpiece: tokens[6],
  };
};

export const getMetadataJson = (ipfsAddress: string, combo: PoggerCombo) => {
  const attributes = [];
  for (const key in combo) {
    attributes.push({
      trait_type: key,
      value: combo[key as keyof PoggerCombo],
    });
  }

  return {
    attributes,
    image: ipfsAddress,
  };
};
