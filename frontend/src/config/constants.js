// Contract addresses - Deployed on Hoodi Network
export const NFT_CONTRACT_ADDRESS = '0x063e1e499903ecE3fC47e4a0848987aC17EEb4de'
export const NFT_MARKETPLACE_ADDRESS = '0xF5DF358e16AB6c67F5B69Aab4a0C10d0Aa85b1F9'
export const NFT_AUCTION_ADDRESS = '0x90AE1538dc01067c72f9880b6B71bc2BD680Ca29'

// Hoodi Network Chain ID
export const HOODI_CHAIN_ID = 560048
export const DEFAULT_CHAIN_ID = HOODI_CHAIN_ID

// IPFS Gateway
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/'

// Backend API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Network configurations
export const NETWORKS = {
  560048: {
    name: 'Hoodi Network',
    rpcUrl: 'https://0xrpc.io/hoodi',
    blockExplorer: '', // Hoodi chưa có block explorer
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  11155111: {
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  1: {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
}
