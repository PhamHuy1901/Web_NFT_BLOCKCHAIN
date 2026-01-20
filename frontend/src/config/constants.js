// Contract addresses - Deployed on Ethereum Hoodi Testnet
export const NFT_MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS || '0xa3b1c57D6CCC06A1AC0bE772dDf9040F4cb605cE'
export const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0'

// Ethereum Hoodi Testnet Chain ID
export const SEPOLIA_CHAIN_ID = import.meta.env.VITE_SEPOLIA_CHAIN_ID || 560048

// IPFS Gateway
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/'

// Backend API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Network configurations
export const NETWORKS = {
  560048: {
    name: 'Ethereum Hoodi Testnet',
    rpcUrl: 'https://0xrpc.io/hoodi',
    blockExplorer: 'https://light-hoodi.beaconcha.in',
  },
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
