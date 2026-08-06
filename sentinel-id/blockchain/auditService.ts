import { ethers } from 'ethers';
import { getPolygonAmoyProvider } from './provider';
import { getSecureChainReadContract, getSecureChainWriteContract } from './contract';
import { getBlockchainConfig, POLYGON_AMOY_NETWORK } from './config';
import { normalizePreviousHash } from './hash';

export async function getBlockchainStatus() {
  const provider = getPolygonAmoyProvider();
  const network = await provider.getNetwork();
  const config = getBlockchainConfig();
  return { network: POLYGON_AMOY_NETWORK, chainId: Number(network.chainId), contractAddress: config.contractAddress ?? null };
}

export async function readOnChainAudit(auditId: bigint) {
  const contract = getSecureChainReadContract();
  return contract.getAudit(auditId);
}

export async function recordOnChainAudit(input: { trustScore: number; riskLevel: string; decision: string; previousHash?: string | null }) {
  const contract = getSecureChainWriteContract();
  const transaction = await contract.recordAudit(input.trustScore, input.riskLevel, input.decision, normalizePreviousHash(input.previousHash));
  const receipt = await transaction.wait(1);
  return { transactionHash: receipt.hash, blockNumber: receipt.blockNumber, confirmations: receipt.confirmations, network: POLYGON_AMOY_NETWORK, status: receipt.status === 1 ? 'CONFIRMED' : 'FAILED' };
}
