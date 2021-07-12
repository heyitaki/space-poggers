const allLayers: string[] = [];

function collectAllLayers(parent: Document, level: number) {
  for (var m = parent.layers.length - 1; m >= 0; m--) {
    var layer: Layer = parent.layers[m];
    if (layer.typename !== "ArtLayer") {
      allLayers.push(level + layer.name);
      collectAllLayers(layer as any as Document, level + 1);
    } else {
      $.writeln(layer.name);
    }
  }
}

collectAllLayers(app.activeDocument, 0);
$.writeln(allLayers);
