import { Link } from 'react-router-dom'
import './NFTCard.css'

const NFTCard = ({ nft, onBuy, onCancelListing, isOwner, viewMode = 'grid' }) => {
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(4)
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const cardClassName = `nft-card nft-card-${viewMode}`

  // List view - horizontal layout
  if (viewMode === 'list') {
    return (
      <div className={cardClassName}>
        <Link to={`/nft/${nft.tokenId}`} className="nft-card-link-list">
          <div className="nft-image-container-list">
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

        <div className="nft-card-content-list">
          <div className="nft-list-info">
            <h3 className="nft-title">{nft.name || `NFT #${nft.tokenId}`}</h3>
            {nft.description && (
              <p className="nft-description-list">
                {nft.description.length > 120 
                  ? `${nft.description.substring(0, 120)}...` 
                  : nft.description}
              </p>
            )}
            <div className="nft-owner-list">
              <span className="label">Owner:</span>
              <span className="value">{formatAddress(nft.owner)}</span>
            </div>
          </div>

          <div className="nft-list-actions">
            {nft.isListed && (
              <div className="nft-price-list">
                <span className="price-label">Price</span>
                <span className="price-value">{formatPrice(nft.price)} ETH</span>
              </div>
            )}
            
            {nft.isListed && !isOwner && (
              <button 
                className="btn btn-primary"
                onClick={() => onBuy?.(nft)}
              >
                Buy Now
              </button>
            )}

            {isOwner && nft.isListed && (
              <button 
                className="btn btn-danger"
                onClick={() => onCancelListing?.(nft.tokenId)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Grid and Compact view - vertical layout
  return (
    <div className={cardClassName}>
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
        
        {nft.description && viewMode !== 'compact' && (
          <p className="nft-description">
            {nft.description.length > 80 
              ? `${nft.description.substring(0, 80)}...` 
              : nft.description}
          </p>
        )}

        <div className="nft-details">
          {viewMode !== 'compact' && (
            <div className="nft-owner">
              <span className="label">Owner:</span>
              <span className="value">{formatAddress(nft.owner)}</span>
            </div>
          )}

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
              {viewMode === 'compact' ? 'Buy' : 'Buy Now'}
            </button>
          )}

          {isOwner && nft.isListed && (
            <button 
              className="btn btn-danger btn-full"
              onClick={() => onCancelListing?.(nft.tokenId)}
            >
              {viewMode === 'compact' ? 'Cancel' : 'Cancel Listing'}
            </button>
          )}

          {isOwner && !nft.isListed && (
            <Link 
              to={`/nft/${nft.tokenId}`}
              className="btn btn-secondary btn-full"
            >
              {viewMode === 'compact' ? 'Sell' : 'List for Sale'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTCard
