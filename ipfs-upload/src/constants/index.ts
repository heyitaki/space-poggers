const enum PoggerTraits {
  Background = 'background',
  CharacterBase = 'character',
  EyeAccessory = 'eye',
  HatAccessory = 'hat',
  MouthAccessory = 'mouth',
  NeckAccessory = 'neck',
  TorsoAccessory = 'torso',
}

const traitPathMap = {
  [PoggerTraits.Background]: ['BG'],
  [PoggerTraits.CharacterBase]: ['CHARACTER BASE'],
  [PoggerTraits.EyeAccessory]: ['ACCESSORIES', 'EYE'],
  [PoggerTraits.HatAccessory]: ['ACCESSORIES', 'HAT'],
  [PoggerTraits.MouthAccessory]: ['ACCESSORIES', 'MOUTH'],
  [PoggerTraits.NeckAccessory]: ['ACCESSORIES', 'NECK'],
  [PoggerTraits.TorsoAccessory]: ['ACCESSORIES', 'TORSO'],
};

const NONE = 'None';
const NUM_TOKENS_TO_MINT = 3;
