//@include "../polyfills/json.js";
//@include "../polyfills/object.js";
//@include "./constants/index.js";
//@include "./photoshop/layers.js";
//@include "./photoshop/save.js";
//@include "./random.js";
//@include "./types.js";
//@include "./utils.js";

const combo = getPoggerCombo();
const filename = getFilename(combo);
setLayers(combo);
saveAsPng(filename);
