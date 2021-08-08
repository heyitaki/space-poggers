//@include "./background.js";
//@include "./character.js";
//@include "./eye.js";
//@include "./hat.js";
//@include "./mouth.js";
//@include "./neck.js";
//@include "./torso.js";

const enum PoggerTraits {
  Background = "Background",
  Tribe = "Tribe",
  Eyewear = "Eyewear",
  Headwear = "Headwear",
  Mouthpiece = "Mouthpiece",
  Neckwear = "Neckwear",
  Clothing = "Clothing",
}

const traitPathMap = {
  [PoggerTraits.Background]: ["BG"],
  [PoggerTraits.Tribe]: ["DRAWING", "CHARACTER"],
  [PoggerTraits.Eyewear]: ["DRAWING", "EYE"],
  [PoggerTraits.Headwear]: ["DRAWING", "HEADWEAR"],
  [PoggerTraits.Mouthpiece]: ["DRAWING", "MOUTH"],
  [PoggerTraits.Neckwear]: ["DRAWING", "NECK ACC"],
  [PoggerTraits.Clothing]: ["DRAWING", "UPPER BODY"],
};

const NONE = "None";
