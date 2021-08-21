import { enumerateTokenHolders } from './enumerate';
import { getTransfersManually } from './transfers';

const takeSnapshot = async () => {
  const timestamp = Date.now();
  await getTransfersManually(12983740);
  await enumerateTokenHolders();
};

takeSnapshot();
