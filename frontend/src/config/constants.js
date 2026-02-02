// Contract addresses - Deployed on Celo Sepolia Testnet
export const NFT_CONTRACT_ADDRESS = '0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6'
export const NFT_MARKETPLACE_ADDRESS = '0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0'
export const NFT_AUCTION_ADDRESS = '0x784baC7475665f108221bbeF83DD0767c756D4fb'
export const NFT_OFFER_ADDRESS = '0x4BCc2A39FCbba2bF16eAa7D6D12f8e83FE090C8E'

// Celo Sepolia Testnet Chain ID
export const CELO_SEPOLIA_CHAIN_ID = 11142220
export const DEFAULT_CHAIN_ID = CELO_SEPOLIA_CHAIN_ID

// IPFS Gateway
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/'

// Backend API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Network configurations
export const NETWORKS = {
  11142220: {
    name: 'Celo Sepolia Testnet',
    rpcUrl: 'https://celo-sepolia.drpc.org',
    blockExplorer: 'https://celo-sepolia.blockscout.com',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18
    }
  },
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
