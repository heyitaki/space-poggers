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

const getPoggerCombo = (): PoggerCombo => {
  const backgroundColor = getRandomTraitFromObject(BackgroundColor);
  const characterBase = getRandomTraitFromObject(CharacterBase);
  const mouthAccessory = getRandomTraitFromEnum(mouthAccessoryRarities);
  const hatAccessory = getRandomTraitFromEnum(hatAccessoryRarities);
  const eyeAccessory = getRandomTraitFromEnum(eyeAccessoryRarities);
  const neckAccessory = getRandomTraitFromEnum(neckAccessoryRarities);
  const torsoAccessory = getRandomTraitFromEnum(torsoAccessoryRarities);
  return {
    background: backgroundColor,
    character: characterBase,
    mouth: mouthAccessory,
    hat: hatAccessory,
    eye: eyeAccessory,
    neck: neckAccessory,
    torso: torsoAccessory,
  };
};
