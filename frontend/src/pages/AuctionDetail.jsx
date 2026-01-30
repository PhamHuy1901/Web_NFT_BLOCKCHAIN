import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuction } from '../hooks/useAuction'
import { useNFTContract } from '../hooks/useNFTContract'
import { useWallet } from '../contexts/WalletContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './AuctionDetail.css'

const AuctionDetail = () => {
  const { auctionId } = useParams()
  const navigate = useNavigate()
  const { account, isConnected } = useWallet()
  const { 
    getAuction, 
    getMinimumBid, 
    getPendingReturns,
    placeBid, 
    endAuction, 
    cancelAuction, 
    withdrawBid,
    loading: actionLoading 
  } = useAuction()
  const { getNFTMetadata } = useNFTContract()

  const [auction, setAuction] = useState(null)
  const [nftMetadata, setNftMetadata] = useState(null)
  const [minimumBid, setMinimumBid] = useState('0')
  const [pendingReturns, setPendingReturns] = useState('0')
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  const isOwner = auction && account && auction.seller.toLowerCase() === account.toLowerCase()
  const isHighestBidder = auction && account && auction.highestBidder.toLowerCase() === account.toLowerCase()
  const hasNoBids = auction && auction.highestBidder === '0x0000000000000000000000000000000000000000'

  // Load auction data
  useEffect(() => {
    const loadAuction = async () => {
      try {
        setLoading(true)
        setError(null)

        const auctionData = await getAuction(auctionId)
        if (!auctionData) {
          throw new Error('Auction not found')
        }

        setAuction(auctionData)

        // Load NFT metadata
        const metadata = await getNFTMetadata(auctionData.tokenId)
        setNftMetadata(metadata)

        // Get minimum bid
        const minBid = await getMinimumBid(auctionId)
        setMinimumBid(minBid || auctionData.startingPrice)
        setBidAmount(minBid || auctionData.startingPrice)

        // Get pending returns if connected
        if (account) {
          const pending = await getPendingReturns(auctionId, account)
          setPendingReturns(pending)
        }
      } catch (err) {
        console.error('Error loading auction:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAuction()
  }, [auctionId, account])

  // Update timer
  useEffect(() => {
    if (!auction) return

    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000)
      const endTime = auction.endTime
      const diff = endTime - now

      if (diff <= 0) {
        setTimeLeft('Auction Ended')
        setIsExpired(true)
        return
      }

      const days = Math.floor(diff / (24 * 60 * 60))
      const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60))
      const minutes = Math.floor((diff % (60 * 60)) / 60)
      const seconds = diff % 60

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [auction])

  // Handle place bid
  const handlePlaceBid = async () => {
    try {
      if (!isConnected) {
        setError('Please connect your wallet first')
        return
      }

      if (!bidAmount || parseFloat(bidAmount) < parseFloat(minimumBid)) {
        setError(`Minimum bid is ${minimumBid} ETH`)
        return
      }

      setError(null)
      const result = await placeBid(auctionId, bidAmount)
      
      if (result.success) {
        alert('Bid placed successfully!')
        // Reload auction data
        const auctionData = await getAuction(auctionId)
        setAuction(auctionData)
        const minBid = await getMinimumBid(auctionId)
        setMinimumBid(minBid)
        setBidAmount(minBid)
      } else {
        throw new Error(result.error || 'Failed to place bid')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Handle end auction
  const handleEndAuction = async () => {
    try {
      setError(null)
      const result = await endAuction(auctionId)
      
      if (result.success) {
        alert('Auction ended successfully!')
        navigate('/auctions')
      } else {
        throw new Error(result.error || 'Failed to end auction')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Handle cancel auction
  const handleCancelAuction = async () => {
    try {
      if (!confirm('Are you sure you want to cancel this auction?')) return

      setError(null)
      const result = await cancelAuction(auctionId)
      
      if (result.success) {
        alert('Auction cancelled successfully!')
        navigate('/auctions')
      } else {
        throw new Error(result.error || 'Failed to cancel auction')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Handle withdraw bid
  const handleWithdrawBid = async () => {
    try {
      setError(null)
      const result = await withdrawBid(auctionId)
      
      if (result.success) {
        alert('Bid withdrawn successfully!')
        setPendingReturns('0')
      } else {
        throw new Error(result.error || 'Failed to withdraw bid')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') return 'None'
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  if (loading) {
    return (
      <div className="auction-detail-page">
        <LoadingSpinner message="Loading auction details..." />
      </div>
    )
  }

  if (error && !auction) {
    return (
      <div className="auction-detail-page">
        <ErrorMessage message={error} />
        <button className="btn btn-secondary" onClick={() => navigate('/auctions')}>
          Back to Auctions
        </button>
      </div>
    )
  }

  return (
    <div className="auction-detail-page">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <div className="auction-detail-container">
        <div className="auction-image-section">
          {nftMetadata?.image ? (
            <img 
              src={nftMetadata.image} 
              alt={nftMetadata?.name || `NFT #${auction.tokenId}`}
              className="auction-detail-image"
            />
          ) : (
            <div className="auction-image-placeholder">
              <span>🖼️</span>
            </div>
          )}
        </div>

        <div className="auction-info-section">
          <h1 className="auction-name">
            {nftMetadata?.name || `NFT #${auction.tokenId}`}
          </h1>

          {nftMetadata?.description && (
            <p className="auction-description">{nftMetadata.description}</p>
          )}

          <div className={`auction-timer-large ${isExpired ? 'expired' : ''}`}>
            <span className="timer-label">⏱️ Time Remaining</span>
            <span className="timer-value">{timeLeft}</span>
          </div>

          <div className="auction-details-box">
            <div className="detail-row">
              <span className="label">Auction ID</span>
              <span className="value">#{auctionId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Token ID</span>
              <span className="value">#{auction.tokenId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Seller</span>
              <span className="value">{isOwner ? 'You' : formatAddress(auction.seller)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Starting Price</span>
              <span className="value">{auction.startingPrice} ETH</span>
            </div>
            <div className="detail-row">
              <span className="label">Reserve Price</span>
              <span className="value">{auction.reservePrice} ETH</span>
            </div>
            <div className="detail-row">
              <span className="label">Start Time</span>
              <span className="value">{formatDate(auction.startTime)}</span>
            </div>
            <div className="detail-row">
              <span className="label">End Time</span>
              <span className="value">{formatDate(auction.endTime)}</span>
            </div>
          </div>

          <div className="current-bid-section">
            <h3>Current Highest Bid</h3>
            <div className="current-bid-value">
              {parseFloat(auction.highestBid) > 0 
                ? `${auction.highestBid} ETH` 
                : 'No bids yet'}
            </div>
            {auction.highestBidder !== '0x0000000000000000000000000000000000000000' && (
              <div className="highest-bidder">
                Highest Bidder: {isHighestBidder ? '👑 You' : formatAddress(auction.highestBidder)}
              </div>
            )}
          </div>

          {/* Bid Section - Only show if auction is active and user is not the seller */}
          {!isExpired && !auction.ended && !auction.cancelled && !isOwner && (
            <div className="bid-section">
              <h3>Place Your Bid</h3>
              <div className="bid-input-group">
                <input
                  type="number"
                  step="0.001"
                  min={minimumBid}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: ${minimumBid} ETH`}
                  className="bid-input"
                />
                <span className="bid-currency">ETH</span>
              </div>
              <p className="minimum-bid-notice">Minimum bid: {minimumBid} ETH</p>
              <button 
                className="btn btn-primary btn-large"
                onClick={handlePlaceBid}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Place Bid'}
              </button>
            </div>
          )}

          {/* Pending Returns */}
          {parseFloat(pendingReturns) > 0 && (
            <div className="pending-returns-section">
              <h3>Your Pending Returns</h3>
              <p>You have {pendingReturns} ETH available to withdraw (from being outbid)</p>
              <button 
                className="btn btn-secondary"
                onClick={handleWithdrawBid}
                disabled={actionLoading}
              >
                Withdraw {pendingReturns} ETH
              </button>
            </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="owner-actions">
              {!auction.ended && !auction.cancelled && hasNoBids && !isExpired && (
                <button 
                  className="btn btn-danger"
                  onClick={handleCancelAuction}
                  disabled={actionLoading}
                >
                  Cancel Auction
                </button>
              )}
              
              {isExpired && !auction.ended && (
                <button 
                  className="btn btn-primary btn-large"
                  onClick={handleEndAuction}
                  disabled={actionLoading}
                >
                  End Auction & Settle
                </button>
              )}
            </div>
          )}

          {/* Anyone can end if expired */}
          {!isOwner && isExpired && !auction.ended && (
            <div className="end-auction-section">
              <p className="end-auction-notice">
                This auction has expired and can be finalized.
              </p>
              <button 
                className="btn btn-primary btn-large"
                onClick={handleEndAuction}
                disabled={actionLoading}
              >
                Finalize Auction
              </button>
            </div>
          )}

          {/* Status Messages */}
          {auction.ended && (
            <div className="auction-status ended">
              ✅ This auction has ended
              {parseFloat(auction.highestBid) >= parseFloat(auction.reservePrice) 
                ? ` - Sold for ${auction.highestBid} ETH`
                : ' - Reserve price not met'}
            </div>
          )}

          {auction.cancelled && (
            <div className="auction-status cancelled">
              ❌ This auction was cancelled
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuctionDetail
