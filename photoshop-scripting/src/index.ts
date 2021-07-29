//@include "../polyfills/json.js";
//@include "../polyfills/object.js";
//@include "./constants/index.js";
//@include "./photoshop/layers.js";
//@include "./photoshop/save.js";
//@include "./random.js";
//@include "./types.js";
//@include "./utils.js";

const doneIds = new Set<string>();
while (doneIds.size < NUM_TOKENS_TO_MINT) {
  const combo = getPoggerCombo();
  const filename = getFilename(combo);
  if (!doneIds.has(filename)) {
    doneIds.add(filename);
    setLayers(combo);
    saveAsPng(filename);
  }
}
