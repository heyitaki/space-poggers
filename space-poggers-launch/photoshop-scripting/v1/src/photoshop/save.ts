const getFilename = (traits: Partial<PoggerCombo>) => {
  return `${traits.Background || ""}-${traits.Tribe || ""}-${
    traits.Mouthpiece || ""
  }-${traits.Headwear || ""}-${traits.Eyewear || ""}-${traits.Neckwear || ""}-${
    traits.Clothing || ""
  }.png`;
};

const saveAsPng = (filename: string) => {
  // Create folder if necessary
  const dest = new Folder("~/spacepoggers/images");
  if (!dest.exists) {
    dest.create();
  }

  // Set save as PNG options
  const file = new File(`${dest.absoluteURI}/${filename}`);
  const opts = new PNGSaveOptions();
  opts.compression = 0;
  opts.interlaced = false;

  // Save file
  app.activeDocument.saveAs(file, opts, true, Extension.LOWERCASE);
};
