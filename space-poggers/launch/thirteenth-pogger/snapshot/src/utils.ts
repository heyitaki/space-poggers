export const numToHexStr = (num?: number) => {
  if (!num) return;
  return '0x' + num.toString(16);
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
