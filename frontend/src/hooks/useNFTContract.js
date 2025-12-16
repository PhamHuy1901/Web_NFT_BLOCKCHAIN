import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../contexts/WalletContext'
import { MARKETPLACE_ABI, NFT_ABI } from '../config/contractABI'
import { NFT_CONTRACT_ADDRESS, NFT_MARKETPLACE_ADDRESS } from '../config/constants'

export const useNFTContract = () => {
  const { signer, provider, account } = useWallet()
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
      if (!account) throw new Error('Account address not available')

      const contract = getNFTContract()

      console.log('Minting NFT with metadata:', metadataURI)
      console.log('Recipient address:', account)
      const tx = await contract.mintNFT(account, metadataURI)
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
  }, [signer, account, getNFTContract])

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
      const totalSupply = await contract.totalSupply()
      const nfts = []

      // Iterate through all tokens and check ownership
      for (let i = 1; i <= totalSupply; i++) {
        try {
          const owner = await contract.ownerOf(i)
          
          if (owner.toLowerCase() === address.toLowerCase()) {
            const tokenURI = await contract.tokenURI(i)
            
            // Fetch metadata
            let metadata = { name: `NFT #${i}`, description: '', image: '' }
            try {
              const metadataURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
              const response = await fetch(metadataURL)
              if (response.ok) {
                metadata = await response.json()
              }
            } catch (metaErr) {
              console.warn(`Could not fetch metadata for token ${i}:`, metaErr)
            }

            nfts.push({
              tokenId: i.toString(),
              owner,
              tokenURI,
              ...metadata,
            })
          }
        } catch (tokenErr) {
          // Token might not exist or already burned, skip it
          console.warn(`Error checking token ${i}:`, tokenErr)
        }
      }

      console.log(`Found ${nfts.length} NFTs for ${address}`)
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
