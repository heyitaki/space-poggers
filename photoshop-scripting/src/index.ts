//@include "../polyfills/json.js";
//@include "../polyfills/object.js";
//@include "./constants/index.js";
//@include "./photoshop/layers.js";
//@include "./photoshop/save.js";
//@include "./random.js";
//@include "./types.js";
//@include "./utils.js";

// // Minting specific combo
// const combo = {
//   background: BackgroundColor.Blueberry,
//   character: CharacterBase.Bee,
// };
// const filename = getFilename(combo);
// setLayers(combo);
// saveAsPng(filename);

const doneIds: { [key: string]: boolean } = {};
while (Object.keys(doneIds).length < NUM_TOKENS_TO_MINT) {
  const combo = getPoggerCombo();
  const filename = getFilename(combo);
  if (!doneIds[filename]) {
    doneIds[filename] = true;
    setLayers(combo);
    saveAsPng(filename);
  }
}
