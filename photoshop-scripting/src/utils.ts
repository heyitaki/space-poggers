export const isLayerSet = (x: any): x is LayerSet => {
  return x && x.typename && x.typename === "LayerSet";
};
