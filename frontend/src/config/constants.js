// Contract addresses - UPDATE THESE after deployment
export const NFT_MARKETPLACE_ADDRESS = '0x...' // TODO: Update after contract deployment
export const NFT_CONTRACT_ADDRESS = '0x...' // TODO: Update after contract deployment

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
