const getRandomTraitFromObject = (traits: object) => {
  const keys = Object.keys(traits) as (keyof typeof traits)[];
  return traits[keys[Math.floor(Math.random() * keys.length)]] as string;
};

const getRandomTraitFromEnum = (rarities: Rarities) => {
  let rand = Math.random();
  let trait: string = rarities.length > 0 ? rarities[0][0] : NONE;
  for (let i = 0; i < rarities.length; i++) {
    if (rand <= 0) {
      break;
    }

    trait = rarities[i][0];
    rand -= rarities[i][1];
  }

  return trait;
};

const getPoggerCombo = (): Partial<PoggerCombo> => {
  const backgroundColor = getRandomTraitFromObject(BackgroundColor);
  const characterBase = getRandomTraitFromObject(CharacterBase);
  const mouthAccessory = getRandomTraitFromEnum(mouthAccessoryRarities);
  const hatAccessory = getRandomTraitFromEnum(hatAccessoryRarities);
  const eyeAccessory = getRandomTraitFromEnum(eyeAccessoryRarities);
  const neckAccessory = getRandomTraitFromEnum(neckAccessoryRarities);
  const torsoAccessory = getRandomTraitFromEnum(torsoAccessoryRarities);

  const combo: Partial<PoggerCombo> = {};
  if (backgroundColor !== NONE) combo.background = backgroundColor;
  if (characterBase !== NONE) combo.background = characterBase;
  if (mouthAccessory !== NONE) combo.background = mouthAccessory;
  if (hatAccessory !== NONE) combo.background = hatAccessory;
  if (eyeAccessory !== NONE) combo.background = eyeAccessory;
  if (neckAccessory !== NONE) combo.background = neckAccessory;
  if (torsoAccessory !== NONE) combo.background = torsoAccessory;
  return combo;
};
