import { Link } from 'react-router-dom'
import './NFTCard.css'

const NFTCard = ({ nft, onBuy, onCancelListing, isOwner }) => {
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(4)
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="nft-card">
      <Link to={`/nft/${nft.tokenId}`} className="nft-card-link">
        <div className="nft-image-container">
          <img 
            src={nft.image || '/placeholder.png'} 
            alt={nft.name || `NFT #${nft.tokenId}`}
            className="nft-image"
            onError={(e) => {
              e.target.src = '/placeholder.png'
            }}
          />
        </div>
      </Link>

      <div className="nft-card-content">
        <h3 className="nft-title">{nft.name || `NFT #${nft.tokenId}`}</h3>
        
        {nft.description && (
          <p className="nft-description">
            {nft.description.length > 80 
              ? `${nft.description.substring(0, 80)}...` 
              : nft.description}
          </p>
        )}

        <div className="nft-details">
          <div className="nft-owner">
            <span className="label">Owner:</span>
            <span className="value">{formatAddress(nft.owner)}</span>
          </div>

          {nft.isListed && (
            <div className="nft-price">
              <span className="label">Price:</span>
              <span className="value">{formatPrice(nft.price)} ETH</span>
            </div>
          )}
        </div>

        <div className="nft-card-actions">
          {nft.isListed && !isOwner && (
            <button 
              className="btn btn-primary btn-full"
              onClick={() => onBuy?.(nft)}
            >
              Buy Now
            </button>
          )}

          {isOwner && nft.isListed && (
            <button 
              className="btn btn-danger btn-full"
              onClick={() => onCancelListing?.(nft.tokenId)}
            >
              Cancel Listing
            </button>
          )}

          {isOwner && !nft.isListed && (
            <Link 
              to={`/nft/${nft.tokenId}`}
              className="btn btn-secondary btn-full"
            >
              List for Sale
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTCard
