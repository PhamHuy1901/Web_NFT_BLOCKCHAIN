import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AuctionCard.css'

const AuctionCard = ({ auction, account }) => {
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  const isOwner = account && auction.seller.toLowerCase() === account.toLowerCase()
  const isHighestBidder = account && auction.highestBidder.toLowerCase() === account.toLowerCase()

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000)
      const endTime = auction.endTime
      const diff = endTime - now

      if (diff <= 0) {
        setTimeLeft('Ended')
        setIsExpired(true)
        return
      }

      const days = Math.floor(diff / (24 * 60 * 60))
      const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60))
      const minutes = Math.floor((diff % (60 * 60)) / 60)
      const seconds = diff % 60

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
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
  }, [auction.endTime])

  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') return 'No bids yet'
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(4)
  }

  return (
    <div className={`auction-card ${isExpired ? 'expired' : ''}`}>
      <Link to={`/auction/${auction.auctionId}`} className="auction-card-link">
        <div className="auction-image-container">
          {auction.nftMetadata?.image ? (
            <img 
              src={auction.nftMetadata.image} 
              alt={auction.nftMetadata?.name || `NFT #${auction.tokenId}`}
              className="auction-image"
              onError={(e) => {
                e.target.src = '/placeholder.png'
              }}
            />
          ) : (
            <div className="auction-image-placeholder">
              <span>🖼️</span>
            </div>
          )}
          <div className={`auction-timer ${isExpired ? 'expired' : timeLeft.includes('m') && !timeLeft.includes('d') && !timeLeft.includes('h') ? 'ending-soon' : ''}`}>
            ⏱️ {timeLeft}
          </div>
        </div>
      </Link>

      <div className="auction-card-content">
        <h3 className="auction-title">
          {auction.nftMetadata?.name || `NFT #${auction.tokenId}`}
        </h3>

        <div className="auction-info">
          <div className="auction-info-row">
            <span className="label">Starting Price:</span>
            <span className="value">{formatPrice(auction.startingPrice)} ETH</span>
          </div>
          
          <div className="auction-info-row highlight">
            <span className="label">Current Bid:</span>
            <span className="value">
              {parseFloat(auction.highestBid) > 0 
                ? `${formatPrice(auction.highestBid)} ETH` 
                : 'No bids yet'}
            </span>
          </div>

          <div className="auction-info-row">
            <span className="label">Highest Bidder:</span>
            <span className="value">
              {isHighestBidder ? '👑 You' : formatAddress(auction.highestBidder)}
            </span>
          </div>

          <div className="auction-info-row">
            <span className="label">Seller:</span>
            <span className="value">
              {isOwner ? 'You' : formatAddress(auction.seller)}
            </span>
          </div>
        </div>

        <div className="auction-card-actions">
          <Link 
            to={`/auction/${auction.auctionId}`}
            className={`btn btn-full ${isExpired ? 'btn-secondary' : 'btn-primary'}`}
          >
            {isExpired ? 'View Details' : 'Place Bid'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard
