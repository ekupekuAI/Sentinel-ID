import { ethers } from 'ethers';
import { secureChainAuditAbi } from './abi/SecureChainAuditAbi';
import { getPolygonAmoyProvider } from './provider';
import { getBlockchainConfig, requireBlockchainWriteConfig } from './config';

export function getSecureChainReadContract() {
  const address = getBlockchainConfig().contractAddress;
  if (!address) throw new Error('SecureChain contract is not configured. Set CONTRACT_ADDRESS after deployment.');
  return new ethers.Contract(address, secureChainAuditAbi, getPolygonAmoyProvider());
}

export function getSecureChainWriteContract() {
  const config = requireBlockchainWriteConfig();
  const signer = new ethers.Wallet(config.privateKey!, getPolygonAmoyProvider());
  return new ethers.Contract(config.contractAddress!, secureChainAuditAbi, signer);
}
