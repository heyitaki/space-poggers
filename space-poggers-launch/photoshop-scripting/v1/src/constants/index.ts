//@include "./background.js";
//@include "./blacklist.js";
//@include "./clothing.js";
//@include "./eyewear.js";
//@include "./headwear.js";
//@include "./mouthpiece.js";
//@include "./neckwear.js";
//@include "./tribe.js";

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
