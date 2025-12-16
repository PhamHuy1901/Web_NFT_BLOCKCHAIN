import axios from 'axios'
import { API_BASE_URL } from '../config/constants'

/**
 * Backend API Service
 * Tích hợp các API endpoints của backend
 */

// ============ IPFS APIs ============

export const uploadFileToIPFS = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const uploadMetadataToIPFS = async (metadata) => {
  const response = await axios.post(`${API_BASE_URL}/upload/metadata`, metadata)
  return response.data
}

// ============ NFT Cache APIs ============

export const getAllNFTs = async () => {
  const response = await axios.get(`${API_BASE_URL}/nft`)
  return response.data
}

export const getNFTByTokenId = async (tokenId) => {
  const response = await axios.get(`${API_BASE_URL}/nft/${tokenId}`)
  return response.data
}

export const cacheNFTData = async (nftData) => {
  const response = await axios.post(`${API_BASE_URL}/nft/cache`, nftData)
  return response.data
}

export const removeNFTFromCache = async (tokenId) => {
  const response = await axios.delete(`${API_BASE_URL}/nft/cache/${tokenId}`)
  return response.data
}

// ============ User Profile APIs ============

export const getUserProfile = async (address) => {
  const response = await axios.get(`${API_BASE_URL}/user/${address}`)
  return response.data
}

export const updateUserProfile = async (address, profileData) => {
  const response = await axios.post(`${API_BASE_URL}/user/${address}`, profileData)
  return response.data
}

export const toggleNFTLike = async (address, tokenId) => {
  const response = await axios.post(`${API_BASE_URL}/user/${address}/like/${tokenId}`)
  return response.data
}

// ============ Health Check ============

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`)
    return response.data
  } catch (error) {
    throw new Error('Backend is not running')
  }
}
