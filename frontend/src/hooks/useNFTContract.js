import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../contexts/WalletContext'
import { MARKETPLACE_ABI, NFT_ABI } from '../config/contractABI'
import { NFT_CONTRACT_ADDRESS, NFT_MARKETPLACE_ADDRESS } from '../config/constants'

export const useNFTContract = () => {
  const { signer, provider } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get NFT contract instance
  const getNFTContract = useCallback(() => {
    if (!provider) throw new Error('Provider not available')
    return new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      signer || provider
    )
  }, [provider, signer])

  // Get Marketplace contract instance
  const getMarketplaceContract = useCallback(() => {
    if (!provider) throw new Error('Provider not available')
    return new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      signer || provider
    )
  }, [provider, signer])

  // Mint new NFT
  const mintNFT = useCallback(async (metadataURI) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getNFTContract()
      const address = await signer.getAddress()

      console.log('Minting NFT with metadata:', metadataURI)
      const tx = await contract.mintNFT(address, metadataURI)
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)

      // Extract token ID from event logs
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed.name === 'Transfer'
        } catch {
          return false
        }
      })

      let tokenId = null
      if (event) {
        const parsed = contract.interface.parseLog(event)
        tokenId = parsed.args.tokenId.toString()
      }

      return { success: true, tokenId, txHash: receipt.hash }
    } catch (err) {
      console.error('Error minting NFT:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getNFTContract])

  // Get NFT metadata
  const getNFTMetadata = useCallback(async (tokenId) => {
    try {
      setLoading(true)
      setError(null)

      const contract = getNFTContract()
      const tokenURI = await contract.tokenURI(tokenId)
      const owner = await contract.ownerOf(tokenId)

      // Fetch metadata from IPFS
      const response = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'))
      const metadata = await response.json()

      return {
        tokenId,
        owner,
        tokenURI,
        ...metadata,
      }
    } catch (err) {
      console.error('Error getting NFT metadata:', err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [getNFTContract])

  // Get user's NFTs
  const getUserNFTs = useCallback(async (address) => {
    try {
      setLoading(true)
      setError(null)

      const contract = getNFTContract()
      const balance = await contract.balanceOf(address)
      const nfts = []

      for (let i = 0; i < balance; i++) {
        // Note: This is a simplified version. In production, you'd need
        // a better way to enumerate tokens (e.g., using tokenOfOwnerByIndex)
        // or maintain an off-chain index
      }

      return nfts
    } catch (err) {
      console.error('Error getting user NFTs:', err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [getNFTContract])

  // Approve marketplace to transfer NFT
  const approveMarketplace = useCallback(async (tokenId) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getNFTContract()
      const tx = await contract.approve(NFT_MARKETPLACE_ADDRESS, tokenId)
      await tx.wait()

      return { success: true }
    } catch (err) {
      console.error('Error approving marketplace:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getNFTContract])

  return {
    loading,
    error,
    mintNFT,
    getNFTMetadata,
    getUserNFTs,
    approveMarketplace,
  }
}
