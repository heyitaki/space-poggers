import { isLayerSet } from "./utils";

const allLayers: string[] = [];

const collectAllLayers = (parent: Document | LayerSet, level: number) => {
  // if (level > 0) {
  //   $.writeln(parent);
  //   $.writeln("layers" + parent.layers);
  // }

  for (var m = parent.layers.length - 1; m >= 0; m--) {
    const layer = parent.layers[m];
    // $.write(" layer: " + layer);
    // $.write(" layerTypename: " + layer.typename);
    // $.writeln(" layerName: " + layer.name);
    if (isLayerSet(layer)) {
      allLayers.push(level + " " + layer.name);
      collectAllLayers(layer, level + 1);
    } else {
      // $.writeln(layer.name);
    }
  }
};

collectAllLayers(app.activeDocument, 0);
$.writeln(allLayers);
