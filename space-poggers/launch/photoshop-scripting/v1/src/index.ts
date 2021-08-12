//@include "../polyfills/json.js";
//@include "../polyfills/object.js";
//@include "../polyfills/map.js";
//@include "./constants/index.js";
//@include "./photoshop/layers.js";
//@include "./photoshop/save.js";
//@include "./random.js";
//@include "./types.js";
//@include "./utils.js";

// // Minting specific combo
// const combo: Partial<PoggerCombo> = {
//   Background: BackgroundColor.Blueberry,
//   Tribe: Tribe.Bee,
//   Mouthpiece: Mouthpiece.BambooShoot,
//   Headwear: Headwear.BaseballCap,
//   Eyewear: Eyewear.CateyeGlasses,
//   Neckwear: Neckwear.Bandana,
//   Clothing: Clothing.Blouse
// };
// const filename = getFilename(combo);
// setLayers(combo);
// saveAsPng(filename);

const format = (str?: string) => {
  return (
    (str &&
      str
        .split(" ")
        .map((str) => capitalize(str))
        .join(" ")) ||
    "None"
  );
};

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.substring(1).toLowerCase();
};

const main = () => {
  const NUM_TOKENS_TO_MINT = 12000 - 4 * 12;
  const doneIds: { [key: string]: boolean } = {};
  const characterCounts = {
    [Tribe.Bee]: 0,
    [Tribe.Cat]: 0,
    [Tribe.Dog]: 0,
    [Tribe.Elephant]: 0,
    [Tribe.Frog]: 0,
    [Tribe.Gorilla]: 0,
    [Tribe.Llama]: 0,
    [Tribe.Mouse]: 0,
    [Tribe.Owl]: 0,
    [Tribe.Penguin]: 0,
    [Tribe.RedPanda]: 0,
    [Tribe.Turtle]: 0,
  };

  while (Object.keys(doneIds).length < NUM_TOKENS_TO_MINT) {
    const combo = getPoggerCombo();
    const key = format(combo.Tribe)!;
    if (characterCounts[key] > 995 || isBlacklisted(combo)) {
      $.writeln("Already created 995 copies or is blacklisted");
      continue;
    } else {
      characterCounts[key]++;
    }

    const memoizedCombo = getFilename(combo);
    if (!doneIds[memoizedCombo]) {
      doneIds[memoizedCombo] = true;
      setLayers(combo);
      saveAsPng(memoizedCombo);
      $.writeln(
        `(${
          Object.keys(doneIds).length
        }/${NUM_TOKENS_TO_MINT}) Finished saving image`
      );
    } else {
      $.writeln("Duplicate permutation");
    }
  }
};

main();
