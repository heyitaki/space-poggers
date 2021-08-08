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
  const backgroundColor = getRandomTraitFromEnum(backgroundRarities);
  const characterBase = getRandomTraitFromObject(Tribe);
  const mouthpiece = getRandomTraitFromEnum(mouthpieceRarities);
  const headwear = getRandomTraitFromEnum(headwearRarities);
  const eyewear = getRandomTraitFromEnum(eyewearRarities);
  const neckwear = getRandomTraitFromEnum(neckwearRarities);
  const clothing = getRandomTraitFromEnum(clothingRarities);

  const combo: Partial<PoggerCombo> = {};
  if (backgroundColor !== NONE) combo.Background = backgroundColor;
  if (characterBase !== NONE) combo.Tribe = characterBase;
  if (mouthpiece !== NONE) combo.Mouthpiece = mouthpiece;
  if (headwear !== NONE) combo.Headwear = headwear;
  if (eyewear !== NONE) combo.Eyewear = eyewear;
  if (neckwear !== NONE) combo.Neckwear = neckwear;
  if (clothing !== NONE) combo.Clothing = clothing;
  return combo;
};
