const getMetadata = (combo: PoggerCombo) => {
  const filename = getFilename(combo);
  const attributes = [];
  for (const key in combo) {
    attributes.push({
      trait_type: format(key),
      value: format(combo[key as PoggerTraits]),
    });
  }

  return {
    attributes,
    image: filename,
  };
};

const format = (str: string) => {
  return str
    .split(" ")
    .map((str) => capitalize(str))
    .join(" ");
};

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.substring(1);
};
