const isLayerSet = (x: any): x is LayerSet => {
  return x && x.typename && x.typename === "LayerSet";
};

const isArtLayer = (x: any): x is ArtLayer => {
  return (
    x &&
    x.typename &&
    x.typename === "ArtLayer" &&
    x.name &&
    /^[a-zA-Z][a-zA-Z\s]*$/.test(x.name)
  );
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
  let layers: Layers | null = app.activeDocument.layers;
  let layer: Layer | null = null;
  for (let i = 0; i < path.length; i++) {
    layer = getLayerByName(path[i], layers);
    if (isLayerSet(layer)) {
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
  // Hide all layers
  hideLayers(app.activeDocument.layers);

  // Show white background
  const whiteLayer = getLayerByPath(["WHITE", "<Group>"]);
  if (whiteLayer) whiteLayer.visible = true;

  // Show specified layers
  for (const traitName in traits) {
    const path = traitsMap[traitName as PoggerTraits];
    path.push(traits[traitName as PoggerTraits]!);
    const layer = getLayerByPath(path);
    if (layer) layer.visible = true;
  }
};
