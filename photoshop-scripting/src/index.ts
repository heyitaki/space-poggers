const allLayers = [];

function collectAllLayers(parent, level) {
  for (var m = parent.layers.length - 1; m >= 0; m--) {
    var layer = parent.layers[m];
    if (layer.typename !== "ArtLayer") {
      allLayers.push(level + layer.name);
      collectAllLayers(layer, level + 1);
    } else {
      $.writeln(layer.name);
    }
  }
}

collectAllLayers(app.activeDocument, 0);
$.writeln(allLayers);
