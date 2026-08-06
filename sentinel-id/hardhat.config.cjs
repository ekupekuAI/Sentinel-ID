require('@nomicfoundation/hardhat-ethers');

module.exports = {
  solidity: '0.8.24',
  paths: {
    sources: './contracts',
    artifacts: './blockchain/artifacts',
  },
  networks: {
    hardhat: {},
    polygonAmoy: {
      url: process.env.RPC_URL || 'https://rpc-amoy.polygon.technology',
      chainId: 80002,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
