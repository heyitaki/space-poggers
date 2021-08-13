import fs from 'fs';

export const uploadMetadataToIpfs = () => {};

export const writeJsonToFile = (filename: string, json: string) => {
  const path = `~/spacepoggers/metadata/${filename}`;
  fs.writeFile(filename, json, () => {});
};

export const getComboFromFilename = (filename: string): Partial<PoggerCombo> => {
  const tokens = filename.split('.')[0].split('-');
  const combo = {} as Partial<PoggerCombo>;

  // Same ordering as in getFilename in photoshop-scripting
  combo.background = tokens[0];
  combo.character = tokens[1];
  combo.mouth = tokens[2];
  combo.hat = tokens[3];
  combo.eye = tokens[4];
  combo.neck = tokens[5];
  combo.torso = tokens[6];

  return combo;
};

export const getMetadata = (filename: string, combo: Partial<PoggerCombo>) => {
  const attributes = [];
  const formattedCombo = formatCombo(combo);
  for (const key in formattedCombo) {
    attributes.push({
      trait_type: key,
      value: formattedCombo[key],
    });
  }

  return {
    attributes,
    image: filename,
  };
};

export const formatCombo = (combo: Partial<PoggerCombo>) => {
  const formattedCombo: { [key: string]: string } = {};
  for (const key of ['Background', 'Character', 'Eye', 'Hat', 'Mouth', 'Neck', 'Torso']) {
    formattedCombo[key] = format(combo[key.toLowerCase() as PoggerTraits]) || 'None';
  }

  return formattedCombo;
};

const format = (str?: string) => {
  return (
    str &&
    str
      .split(' ')
      .map((str) => capitalize(str))
      .join(' ')
  );
};

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.substring(1).toLowerCase();
};
