import { ethers } from 'ethers';
import { requireBlockchainReadConfig } from './config';

export function getPolygonAmoyProvider() {
  const config = requireBlockchainReadConfig();
  return new ethers.JsonRpcProvider(config.rpcUrl, { chainId: config.chainId, name: 'polygon-amoy' });
}
