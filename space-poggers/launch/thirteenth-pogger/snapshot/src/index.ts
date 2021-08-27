import { enumerateTokenHolders, getTotalNumCompletedSets } from './enumerate';
import { getAllTokenMetadata } from './metadata';

const takeSnapshot = async () => {
  const timestamp = Date.now();
  // await getTransfersManually(12983740);
  await enumerateTokenHolders();
  await getTotalNumCompletedSets();
};

getAllTokenMetadata();
