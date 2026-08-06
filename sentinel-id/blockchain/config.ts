export const POLYGON_AMOY_CHAIN_ID = 80002;
export const POLYGON_AMOY_NETWORK = 'Polygon Amoy';

export function getBlockchainConfig() {
  return {
    rpcUrl: process.env.RPC_URL ?? process.env.BLOCKCHAIN_RPC_URL,
    privateKey: process.env.PRIVATE_KEY ?? process.env.BLOCKCHAIN_PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS ?? process.env.SECURECHAIN_CONTRACT_ADDRESS,
    chainId: Number(process.env.POLYGON_AMOY_CHAIN_ID ?? POLYGON_AMOY_CHAIN_ID),
  };
}

export function requireBlockchainReadConfig() {
  const config = getBlockchainConfig();
  if (!config.rpcUrl) throw new Error('Blockchain RPC is not configured. Set RPC_URL.');
  return config;
}

export function requireBlockchainWriteConfig() {
  const config = requireBlockchainReadConfig();
  if (!config.privateKey) throw new Error('Blockchain signer is not configured. Set PRIVATE_KEY only when writes are enabled.');
  if (!config.contractAddress) throw new Error('SecureChain contract is not configured. Set CONTRACT_ADDRESS after deployment.');
  return config;
}
