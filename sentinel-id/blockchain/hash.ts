import { ethers } from 'ethers';

export function normalizePreviousHash(value?: string | null) {
  return value && ethers.isHexString(value, 32) ? value : ethers.ZeroHash;
}

export function createAuditPayloadHash(input: { trustScore: number; riskLevel: string; decision: string; previousHash?: string | null }) {
  return ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify({ ...input, previousHash: normalizePreviousHash(input.previousHash) })));
}
