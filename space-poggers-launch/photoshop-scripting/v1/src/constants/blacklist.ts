const isBlacklisted = (combo: Partial<PoggerCombo>) => {
  if (combo.Tribe === Tribe.Dog) {
    return (
      combo.Eyewear === Eyewear.Sunglasses ||
      combo.Eyewear === Eyewear.ThreeDGlasses ||
      combo.Eyewear === Eyewear.PrinceNez ||
      combo.Eyewear === Eyewear.SwimGoggles ||
      combo.Eyewear === Eyewear.HypnoGlasses
    );
  } else if (combo.Tribe === Tribe.Elephant) {
    return (
      combo.Eyewear === Eyewear.Sunglasses ||
      combo.Eyewear === Eyewear.ThreeDGlasses ||
      combo.Eyewear === Eyewear.SkiGoggles ||
      combo.Eyewear === Eyewear.SwimGoggles
    );
  }
};
