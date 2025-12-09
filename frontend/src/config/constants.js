// Contract addresses - Deployed on Sepolia Testnet
export const NFT_MARKETPLACE_ADDRESS = '0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0'
export const NFT_CONTRACT_ADDRESS = '0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6'

// Sepolia Testnet Chain ID
export const SEPOLIA_CHAIN_ID = 11155111

// IPFS Gateway
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'

// Backend API URL
export const API_BASE_URL = 'http://localhost:5000/api'

// Network configurations
export const NETWORKS = {
  11155111: {
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  1: {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
  },
}
