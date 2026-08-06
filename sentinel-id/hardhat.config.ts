import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: {
    version: '0.8.24',
  },
  paths: {
    sources: './contracts',
    artifacts: './blockchain/artifacts',
  },
  networks: {
    hardhat: {
      type: 'edr-simulated',
      chainType: 'l1',
    },
    polygonAmoy: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('RPC_URL'),
      accounts: [configVariable('PRIVATE_KEY')],
    },
  },
});
