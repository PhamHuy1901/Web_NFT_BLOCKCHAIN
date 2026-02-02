import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_OFFER_ADDRESS } from '../config/constants'
import { NFT_ABI, OFFER_ABI } from '../config/contractABI'

/**
 * Check if offers need refund when NFT ownership changed
 * @param {ethers.Provider} provider 
 * @param {string} tokenId 
 * @returns {Promise<Array>} List of invalid offers that need refund
 */
export async function checkInvalidOffers(provider, tokenId) {
  try {
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider)
    const offerContract = new ethers.Contract(NFT_OFFER_ADDRESS, OFFER_ABI, provider)

    // Get current NFT owner
    const currentOwner = await nftContract.ownerOf(tokenId)

    // Get all active offers for this token
    const offers = await offerContract.getOffersForToken(tokenId)

    // Filter invalid offers (owner changed but offers still active)
    const invalidOffers = []
    for (const offer of offers) {
      if (offer.isActive) {
        // Offer is invalid if current owner is different from when offer was made
        // This happens when NFT is sold via marketplace
        const tokenOwner = await nftContract.ownerOf(tokenId)
        if (tokenOwner.toLowerCase() !== currentOwner.toLowerCase()) {
          invalidOffers.push({
            offerId: offer.offerId.toString(),
            tokenId: offer.tokenId.toString(),
            offerer: offer.offerer,
            offerPrice: ethers.formatEther(offer.offerPrice),
          })
        }
      }
    }

    return invalidOffers
  } catch (error) {
    console.error('Error checking invalid offers:', error)
    return []
  }
}

/**
 * Auto-refund offers when NFT is sold via marketplace
 * Anyone can call this to help refund stuck offers
 * @param {ethers.Signer} signer 
 * @param {Array} offerIds 
 */
export async function refundInvalidOffers(signer, offerIds) {
  try {
    const offerContract = new ethers.Contract(NFT_OFFER_ADDRESS, OFFER_ABI, signer)
    const results = []

    for (const offerId of offerIds) {
      try {
        // Try to cancel the offer (only offerer can call)
        // Or wait for expiration and anyone can withdraw
        const offer = await offerContract.getOffer(offerId)
        
        // Check if expired
        const now = Math.floor(Date.now() / 1000)
        if (now >= Number(offer.expirationTime)) {
          console.log(`Withdrawing expired offer #${offerId}`)
          const tx = await offerContract.withdrawExpiredOffer(offerId)
          await tx.wait()
          results.push({ offerId, success: true, method: 'expired' })
        } else {
          // Not expired yet, offerer needs to cancel manually
          results.push({ offerId, success: false, reason: 'Not expired yet' })
        }
      } catch (err) {
        console.error(`Failed to refund offer #${offerId}:`, err.message)
        results.push({ offerId, success: false, error: err.message })
      }
    }

    return results
  } catch (error) {
    console.error('Error refunding invalid offers:', error)
    return []
  }
}

/**
 * Monitor NFT sales and alert users about stuck offers
 * @param {ethers.Provider} provider 
 * @param {string} tokenId 
 * @param {Function} onInvalidOffersDetected 
 */
export async function monitorNFTSale(provider, tokenId, onInvalidOffersDetected) {
  try {
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider)
    const initialOwner = await nftContract.ownerOf(tokenId)

    // Listen for ownership changes
    const filter = nftContract.filters.Transfer(null, null, tokenId)
    
    nftContract.on(filter, async (from, to, tokenIdEmitted) => {
      if (tokenIdEmitted.toString() === tokenId.toString()) {
        console.log(`NFT #${tokenId} transferred from ${from} to ${to}`)
        
        // Check for invalid offers
        const invalidOffers = await checkInvalidOffers(provider, tokenId)
        
        if (invalidOffers.length > 0) {
          console.warn(`Found ${invalidOffers.length} stuck offers for NFT #${tokenId}`)
          onInvalidOffersDetected(invalidOffers)
        }
      }
    })
  } catch (error) {
    console.error('Error monitoring NFT sale:', error)
  }
}
