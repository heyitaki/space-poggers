const getFilename = (traits: Traits) => {
  return `${traits.background}-${traits.character}-${traits.mouth}-${traits.hat}-${traits.eye}-${traits.neck}-${traits.torso}.png`;
};

const saveAsPng = (filename: string) => {
  // Create folder if necessary
  const dest = new Folder("~/spacepoggers");
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
