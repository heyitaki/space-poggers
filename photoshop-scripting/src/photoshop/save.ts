const saveAsPng = (filename: string) => {
  const doc = app.activeDocument;

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

  // Save
  doc.saveAs(file, opts, true, Extension.LOWERCASE);
};
