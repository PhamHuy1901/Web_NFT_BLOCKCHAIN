import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config/constants'

export const useIPFS = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // Upload file to IPFS via backend
  const uploadToIPFS = async (file) => {
    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_BASE_URL}/ipfs/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return {
        success: true,
        ipfsHash: response.data.ipfsHash,
        ipfsUrl: response.data.ipfsUrl,
      }
    } catch (err) {
      console.error('Error uploading to IPFS:', err)
      setError(err.message)
      return {
        success: false,
        error: err.message,
      }
    } finally {
      setUploading(false)
    }
  }

  // Upload metadata to IPFS
  const uploadMetadata = async (metadata) => {
    try {
      setUploading(true)
      setError(null)

      const response = await axios.post(`${API_BASE_URL}/ipfs/upload-metadata`, metadata)

      return {
        success: true,
        ipfsHash: response.data.ipfsHash,
        ipfsUrl: response.data.ipfsUrl,
      }
    } catch (err) {
      console.error('Error uploading metadata to IPFS:', err)
      setError(err.message)
      return {
        success: false,
        error: err.message,
      }
    } finally {
      setUploading(false)
    }
  }

  // Get content from IPFS
  const getFromIPFS = async (ipfsHash) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ipfs/${ipfsHash}`)
      return response.data
    } catch (err) {
      console.error('Error getting from IPFS:', err)
      setError(err.message)
      return null
    }
  }

  return {
    uploading,
    error,
    uploadToIPFS,
    uploadMetadata,
    getFromIPFS,
  }
}
