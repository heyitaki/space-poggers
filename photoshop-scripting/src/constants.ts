const NONE = "None";

const BackgroundColor = {
  Dragonfruit: "DRAGONFRUIT",
  Peach: "PEACH",
  Blueberry: "BLUEBERRY",
  AppleJack: "APPLE JACK",
};

const CharacterBase = {
  Bee: "BEE",
  Cat: "CAT",
  Dog: "DOG",
  Elephant: "ELEPAHANT",
  Frog: "FROG",
  Gorilla: "GORILLA",
  Llama: "LLAMA",
  Mouse: "MOUSE",
  Owl: "OWL",
  Penguin: "PENGUIN",
  RedPanda: "RED PANDA",
  Turtle: "TURTLE",
};

const enum HatAccessory {
  BttfCap = "BTTF CAP",
  Beanie = "BEANIE",
  Tophat = "TOPHAT",
}

const hatAccessoryRarities: Rarities = [
  [NONE, 0.25],
  [HatAccessory.BttfCap, 0.1],
  [HatAccessory.Beanie, 0.05],
  [HatAccessory.Tophat, 0.6],
];

const enum MouthAccessory {
  BubblePipe = "BUBBLE PIPE",
}

const mouthAccessoryRarities: Rarities = [[MouthAccessory.BubblePipe, 1]];

const enum EyeAccessory {
  Shades = "SHADES",
  ThreeDGlasses = "3D GLASSES",
  VrGoggles = "VR GOGGLE",
}

const eyeAccessoryRarities: Rarities = [
  [EyeAccessory.Shades, 0.1],
  [EyeAccessory.ThreeDGlasses, 0.3],
  [EyeAccessory.VrGoggles, 0.6],
];

const enum NeckAccessory {
  Necktie = "NECKTIE",
}

const neckAccessoryRarities: Rarities = [[NeckAccessory.Necktie, 1]];

const enum TorsoAccessory {
  Torso = "TORSO",
}

const torsoAccessoryRarities: Rarities = [[TorsoAccessory.Torso, 1]];
