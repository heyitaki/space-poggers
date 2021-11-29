const isLayerSet = (x: any): x is LayerSet => {
  return x && x.typename && x.typename === "LayerSet";
};

const getLayerByName = (name: string, layers: Layers): Layer | null => {
  if (layers === null) {
    $.writeln("Path to trait is invalid");
    return null;
  }

  for (let i = 0; i < layers.length; i++) {
    if (layers[i].name === name) {
      return layers[i];
    }
  }

  return null;
};

const getLayerByPath = (path: string[]) => {
  // $.writeln(path);
  let layers: Layers | null = app.activeDocument.layers;
  let layer: Layer | null = null;
  for (let i = 0; i < path.length; i++) {
    layer = getLayerByName(path[i], layers);
    // $.writeln(layer + " " + layer?.typename);
    if (isLayerSet(layer)) {
      // $.writeln("islayerset");
      layers = layer.layers;
    }
  }

  return layer;
};

const hideLayers = (layers: Layers) => {
  for (let i = 0; i < layers.length; i++) {
    if (isLayerSet(layers[i])) {
      hideLayers((layers[i] as LayerSet).layers);
    } else {
      // Layer is ArtLayer
      layers[i].visible = false;
    }
  }
};

const setLayers = (traits: Partial<PoggerCombo>) => {
  // Hide all art layers
  hideLayers(app.activeDocument.layers);

  // Show specified layers
  for (const traitName in traits) {
    const path = traitPathMap[traitName as PoggerTraits];
    path.push(traits[traitName as PoggerTraits]!);
    // $.writeln(path);
    const layer = getLayerByPath(path);
    // $.writeln(layer);
    if (layer) layer.visible = true;
  }
};
