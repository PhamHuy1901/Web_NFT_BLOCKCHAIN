import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../contexts/WalletContext'
import { AUCTION_ABI } from '../config/contractABI'
import { NFT_AUCTION_ADDRESS } from '../config/constants'

export const useAuction = () => {
  const { signer, provider } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get Auction contract instance
  const getContract = useCallback(() => {
    if (!provider) throw new Error('Provider not available')
    return new ethers.Contract(
      NFT_AUCTION_ADDRESS,
      AUCTION_ABI,
      signer || provider
    )
  }, [provider, signer])

  // Create auction
  const createAuction = useCallback(async (tokenId, startingPriceEth, reservePriceEth, durationInHours) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      const startingPriceWei = ethers.parseEther(startingPriceEth.toString())
      const reservePriceWei = ethers.parseEther(reservePriceEth.toString())
      const durationInSeconds = Math.floor(durationInHours * 3600) // Convert hours to seconds

      console.log(`Creating auction for NFT #${tokenId}`)
      console.log(`Starting price: ${startingPriceEth} ETH`)
      console.log(`Reserve price: ${reservePriceEth} ETH`)
      console.log(`Duration: ${durationInHours} hours`)

      const tx = await contract.createAuction(
        tokenId,
        startingPriceWei,
        reservePriceWei,
        durationInSeconds
      )
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Auction created successfully:', receipt)

      // Parse event to get auction ID
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed.name === 'AuctionCreated'
        } catch {
          return false
        }
      })

      let auctionId = null
      if (event) {
        const parsed = contract.interface.parseLog(event)
        auctionId = parsed.args.auctionId.toString()
      }

      return { success: true, txHash: receipt.hash, auctionId }
    } catch (err) {
      console.error('Error creating auction:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Place bid
  const placeBid = useCallback(async (auctionId, bidAmountEth) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      const bidAmountWei = ethers.parseEther(bidAmountEth.toString())

      console.log(`Placing bid on auction #${auctionId} for ${bidAmountEth} ETH`)
      const tx = await contract.placeBid(auctionId, { value: bidAmountWei })
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Bid placed successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error placing bid:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // End auction
  const endAuction = useCallback(async (auctionId) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      
      console.log(`Ending auction #${auctionId}`)
      const tx = await contract.endAuction(auctionId)
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Auction ended successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error ending auction:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Cancel auction
  const cancelAuction = useCallback(async (auctionId) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      
      console.log(`Cancelling auction #${auctionId}`)
      const tx = await contract.cancelAuction(auctionId)
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Auction cancelled successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error cancelling auction:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Withdraw bid
  const withdrawBid = useCallback(async (auctionId) => {
    try {
      setLoading(true)
      setError(null)

      if (!signer) throw new Error('Please connect your wallet')

      const contract = getContract()
      
      console.log(`Withdrawing bid from auction #${auctionId}`)
      const tx = await contract.withdrawBid(auctionId)
      console.log('Transaction sent:', tx.hash)

      const receipt = await tx.wait()
      console.log('Bid withdrawn successfully:', receipt)

      return { success: true, txHash: receipt.hash }
    } catch (err) {
      console.error('Error withdrawing bid:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [signer, getContract])

  // Get auction details
  const getAuction = useCallback(async (auctionId) => {
    try {
      setLoading(true)
      setError(null)

      const contract = getContract()
      const auction = await contract.getAuction(auctionId)

      return {
        auctionId: auction.auctionId.toString(),
        tokenId: auction.tokenId.toString(),
        seller: auction.seller,
        startingPrice: ethers.formatEther(auction.startingPrice),
        reservePrice: ethers.formatEther(auction.reservePrice),
        highestBid: ethers.formatEther(auction.highestBid),
        highestBidder: auction.highestBidder,
        startTime: Number(auction.startTime),
        endTime: Number(auction.endTime),
        ended: auction.ended,
        cancelled: auction.cancelled,
      }
    } catch (err) {
      console.error('Error getting auction:', err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [getContract])

  // Get all active auctions
  const getActiveAuctions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const contract = getContract()
      const auctions = await contract.getActiveAuctions()

      return auctions.map(auction => ({
        auctionId: auction.auctionId.toString(),
        tokenId: auction.tokenId.toString(),
        seller: auction.seller,
        startingPrice: ethers.formatEther(auction.startingPrice),
        reservePrice: ethers.formatEther(auction.reservePrice),
        highestBid: ethers.formatEther(auction.highestBid),
        highestBidder: auction.highestBidder,
        startTime: Number(auction.startTime),
        endTime: Number(auction.endTime),
        ended: auction.ended,
        cancelled: auction.cancelled,
      }))
    } catch (err) {
      console.error('Error getting active auctions:', err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [getContract])

  // Get auctions by seller
  const getAuctionsBySeller = useCallback(async (sellerAddress) => {
    try {
      setLoading(true)
      setError(null)

      const contract = getContract()
      const auctions = await contract.getAuctionsBySeller(sellerAddress)

      return auctions.map(auction => ({
        auctionId: auction.auctionId.toString(),
        tokenId: auction.tokenId.toString(),
        seller: auction.seller,
        startingPrice: ethers.formatEther(auction.startingPrice),
        reservePrice: ethers.formatEther(auction.reservePrice),
        highestBid: ethers.formatEther(auction.highestBid),
        highestBidder: auction.highestBidder,
        startTime: Number(auction.startTime),
        endTime: Number(auction.endTime),
        ended: auction.ended,
        cancelled: auction.cancelled,
      }))
    } catch (err) {
      console.error('Error getting auctions by seller:', err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [getContract])

  // Get minimum bid
  const getMinimumBid = useCallback(async (auctionId) => {
    try {
      const contract = getContract()
      const minBid = await contract.getMinimumBid(auctionId)
      return ethers.formatEther(minBid)
    } catch (err) {
      console.error('Error getting minimum bid:', err)
      return null
    }
  }, [getContract])

  // Get pending returns for a bidder
  const getPendingReturns = useCallback(async (auctionId, bidderAddress) => {
    try {
      const contract = getContract()
      const pending = await contract.getPendingReturns(auctionId, bidderAddress)
      return ethers.formatEther(pending)
    } catch (err) {
      console.error('Error getting pending returns:', err)
      return '0'
    }
  }, [getContract])

  // Check if NFT is in auction
  const isInAuction = useCallback(async (tokenId) => {
    try {
      const contract = getContract()
      return await contract.isInAuction(tokenId)
    } catch (err) {
      console.error('Error checking if in auction:', err)
      return false
    }
  }, [getContract])

  return {
    loading,
    error,
    createAuction,
    placeBid,
    endAuction,
    cancelAuction,
    withdrawBid,
    getAuction,
    getActiveAuctions,
    getAuctionsBySeller,
    getMinimumBid,
    getPendingReturns,
    isInAuction,
  }
}
