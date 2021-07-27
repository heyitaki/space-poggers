const toArray = <T>(input: T | T[]): T[] => {
  if (input == null) return []; // Catch undefined and null values
  return input instanceof Array ? input : [input];
};
