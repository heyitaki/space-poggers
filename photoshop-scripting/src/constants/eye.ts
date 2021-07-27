const enum EyeAccessory {
  Shades = "SHADES",
  ThreeDGlasses = "3D GLASSES",
  VrGoggles = "VR GOGGLE",
}

const eyeAccessoryRarities: Rarities = [
  [NONE, 0.2],
  [EyeAccessory.Shades, 0.1],
  [EyeAccessory.ThreeDGlasses, 0.2],
  [EyeAccessory.VrGoggles, 0.5],
];
