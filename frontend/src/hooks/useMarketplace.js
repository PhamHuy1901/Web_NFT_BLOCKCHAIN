import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../contexts/WalletContext'
import { MARKETPLACE_ABI } from '../config/contractABI'
import { NFT_MARKETPLACE_ADDRESS } from '../config/constants'

export const useMarketplace = () => {
  const { signer, provider } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get Marketplace contract instance
  const getContract = useCallback(() => {
    if (!provider) throw new Error('Provider not available')
    return new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      signer || provider
    )
  }, [provider, signer])

  // List NFT for sale
  const listNFT = useCallback(async (tokenId, priceInEth) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      const priceInWei = ethers.parseEther(priceInEth.toString())

      console.log(`Listing NFT #${tokenId} for ${priceInEth} ETH`)
      const tx = await contract.listNFT(tokenId, priceInWei)
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('NFT listed successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error listing NFT:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Buy NFT
  const buyNFT = useCallback(async (tokenId, priceInEth) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      const priceInWei = ethers.parseEther(priceInEth.toString())

      console.log(`Buying NFT #${tokenId} for ${priceInEth} ETH`)
      const tx = await contract.buyNFT(tokenId, { value: priceInWei })
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('NFT purchased successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error buying NFT:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Cancel listing
  const cancelListing = useCallback(async (tokenId) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      const tx = await contract.cancelListing(tokenId)
      await tx.wait()

      return { success: true }
    } catch (err) {
      console.error('Error cancelling listing:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Update price
  const updatePrice = useCallback(async (tokenId, newPriceInEth) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      const priceInWei = ethers.parseEther(newPriceInEth.toString())

      const tx = await contract.updatePrice(tokenId, priceInWei)
      await tx.wait()

      return { success: true }
    } catch (err) {
      console.error('Error updating price:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Get NFT listing info
  const getListing = useCallback(async (tokenId) => {
    try {
      setLoading(true)
      setError(null)

      const contract = getContract()
      const listing = await contract.getNFTListing(tokenId)

      return {
        seller: listing.seller,
        price: ethers.formatEther(listing.price),
        isListed: listing.isListed,
      }
    } catch (err) {
      console.error('Error getting listing:', err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [getContract])

  // Get all listings
  const getAllListings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const contract = getContract()
      const listings = await contract.getAllListings()

      return listings.map(listing => ({
        tokenId: listing.tokenId.toString(),
        seller: listing.seller,
        price: ethers.formatEther(listing.price),
      }))
    } catch (err) {
      console.error('Error getting all listings:', err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [getContract])

  return {
    loading,
    error,
    listNFT,
    buyNFT,
    cancelListing,
    updatePrice,
    getListing,
    getAllListings,
  }
}
