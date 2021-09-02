export const numToHex = (num?: number) => {
  if (!num) return;
  return '0x' + num.toString(16);
};

export const hexToNum = (hex: string) => {
  return parseInt(hex);
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
