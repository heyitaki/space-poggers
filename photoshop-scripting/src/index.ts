//@include "./types.js";
//@include "../polyfills/json.js";
//@include "../polyfills/object.js";
//@include "./constants.js";
//@include "./random.js";
//@include "./photoshop/layers.js";
//@include "./photoshop/save.js";

// getPoggerCombo();

// const allLayers: string[] = [];

// const isLayerSet = (x: any): x is LayerSet => {
//   return x && x.typename && x.typename === "LayerSet";
// };

// const collectAllLayers = (parent: Document | LayerSet, level: number) => {
//   // if (level > 0) {
//   //   $.writeln(parent);
//   //   $.writeln("layers" + parent.layers);
//   // }

//   for (let m = parent.layers.length - 1; m >= 0; m--) {
//     const layer = parent.layers[m];
//     // $.write(" layer: " + layer);
//     // $.write(" layerTypename: " + layer.typename);
//     // $.writeln(" layerName: " + layer.name);
//     if (isLayerSet(layer)) {
//       allLayers.push(level + " " + layer.name);
//       collectAllLayers(layer, level + 1);
//     } else {
//       $.writeln(layer.name);
//     }
//   }
// };

// collectAllLayers(app.activeDocument, 0);
// $.writeln(allLayers);

saveAsPng("hi.png");
