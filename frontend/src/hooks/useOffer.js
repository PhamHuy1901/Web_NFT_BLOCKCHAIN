import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../contexts/WalletContext'
import { OFFER_ABI } from '../config/contractABI'
import { NFT_OFFER_ADDRESS } from '../config/constants'

export const useOffer = () => {
  const { signer, provider, account } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get Offer contract instance
  const getContract = useCallback(() => {
    if (!provider) throw new Error('Provider not available')
    return new ethers.Contract(
      NFT_OFFER_ADDRESS,
      OFFER_ABI,
      signer || provider
    )
  }, [provider, signer])

  // Make offer for NFT
  const makeOffer = useCallback(async (tokenId, offerPriceEth, expirationHours = 168) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      const offerPriceWei = ethers.parseEther(offerPriceEth.toString())
      const expirationSeconds = expirationHours * 3600

      console.log(`Making offer for NFT #${tokenId}: ${offerPriceEth} ETH`)
      const tx = await contract.makeOffer(tokenId, expirationSeconds, { value: offerPriceWei })
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Offer created successfully:', receipt)

      // Parse event to get offer ID
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed.name === 'OfferCreated'
        } catch {
          return false
        }
      })

      let offerId = null
      if (event) {
        const parsed = contract.interface.parseLog(event)
        offerId = parsed.args.offerId.toString()
      }

      return { success: true, txHash: receipt.hash, offerId }
    } catch (err) {
      console.error('Error making offer:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Accept offer (for NFT owner)
  const acceptOffer = useCallback(async (offerId) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      
      console.log(`Accepting offer #${offerId}`)
      const tx = await contract.acceptOffer(offerId)
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Offer accepted successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error accepting offer:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Cancel offer (for offerer)
  const cancelOffer = useCallback(async (offerId) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      
      console.log(`Cancelling offer #${offerId}`)
      const tx = await contract.cancelOffer(offerId)
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Offer cancelled successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error cancelling offer:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Update offer price
  const updateOffer = useCallback(async (offerId, newPriceEth) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      const newPriceWei = ethers.parseEther(newPriceEth.toString())
      
      console.log(`Updating offer #${offerId} to ${newPriceEth} ETH`)
      const tx = await contract.updateOffer(offerId, { value: newPriceWei })
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Offer updated successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error updating offer:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Get offers for a token
  const getOffersForToken = useCallback(async (tokenId) => {
    try {
      setLoading(true)
      setError(null)

      const contract = getContract()
      const offers = await contract.getOffersForToken(tokenId)

      return offers.map(offer => ({
        offerId: offer.offerId.toString(),
        tokenId: offer.tokenId.toString(),
        offerer: offer.offerer,
        offerPrice: ethers.formatEther(offer.offerPrice),
        expirationTime: Number(offer.expirationTime),
        isActive: offer.isActive,
        isAccepted: offer.isAccepted,
      }))
    } catch (err) {
      console.error('Error getting offers:', err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [getContract])

  // Get offers by user
  const getOffersByUser = useCallback(async (userAddress) => {
    try {
      setLoading(true)
      setError(null)

      const contract = getContract()
      const offers = await contract.getOffersByUser(userAddress || account)

      return offers.map(offer => ({
        offerId: offer.offerId.toString(),
        tokenId: offer.tokenId.toString(),
        offerer: offer.offerer,
        offerPrice: ethers.formatEther(offer.offerPrice),
        expirationTime: Number(offer.expirationTime),
        isActive: offer.isActive,
        isAccepted: offer.isAccepted,
      }))
    } catch (err) {
      console.error('Error getting user offers:', err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [getContract, account])

  // Get highest offer for a token
  const getHighestOffer = useCallback(async (tokenId) => {
    try {
      const contract = getContract()
      const offer = await contract.getHighestOffer(tokenId)

      if (offer.offerId.toString() === '0') {
        return null
      }

      return {
        offerId: offer.offerId.toString(),
        tokenId: offer.tokenId.toString(),
        offerer: offer.offerer,
        offerPrice: ethers.formatEther(offer.offerPrice),
        expirationTime: Number(offer.expirationTime),
        isActive: offer.isActive,
        isAccepted: offer.isAccepted,
      }
    } catch (err) {
      console.error('Error getting highest offer:', err)
      return null
    }
  }, [getContract])

  // Check if user has active offer for token
  const hasActiveOffer = useCallback(async (tokenId, userAddress) => {
    try {
      const contract = getContract()
      const [hasOffer, offerId] = await contract.hasActiveOffer(tokenId, userAddress || account)
      return { hasOffer, offerId: offerId.toString() }
    } catch (err) {
      console.error('Error checking active offer:', err)
      return { hasOffer: false, offerId: '0' }
    }
  }, [getContract, account])

  // Get single offer details
  const getOffer = useCallback(async (offerId) => {
    try {
      const contract = getContract()
      const offer = await contract.getOffer(offerId)

      return {
        offerId: offer.offerId.toString(),
        tokenId: offer.tokenId.toString(),
        offerer: offer.offerer,
        offerPrice: ethers.formatEther(offer.offerPrice),
        expirationTime: Number(offer.expirationTime),
        isActive: offer.isActive,
        isAccepted: offer.isAccepted,
      }
    } catch (err) {
      console.error('Error getting offer:', err)
      return null
    }
  }, [getContract])

  return {
    loading,
    error,
    makeOffer,
    acceptOffer,
    cancelOffer,
    updateOffer,
    getOffersForToken,
    getOffersByUser,
    getHighestOffer,
    hasActiveOffer,
    getOffer,
  }
}
