import { readFile } from 'node:fs/promises';
import { ethers } from 'ethers';

const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
if (!rpcUrl || !privateKey) throw new Error('Set RPC_URL and PRIVATE_KEY only when you are ready to deploy.');

const provider = new ethers.JsonRpcProvider(rpcUrl, { chainId: 80002, name: 'polygon-amoy' });
const wallet = new ethers.Wallet(privateKey, provider);
const artifact = JSON.parse(await readFile(new URL('../artifacts/contracts/SecureChainAudit.sol/SecureChainAudit.json', import.meta.url), 'utf8'));
const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
const contract = await factory.deploy();
await contract.waitForDeployment();
console.log(`SecureChainAudit deployed to ${await contract.getAddress()}`);
