import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import { useNFTContract } from '../hooks/useNFTContract'
import { useMarketplace } from '../hooks/useMarketplace'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './NFTDetail.css'

const NFTDetail = () => {
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const { account, isConnected } = useWallet()
  const { getNFTMetadata, approveMarketplace } = useNFTContract()
  const { listNFT, buyNFT, cancelListing, getListing } = useMarketplace()

  const [nft, setNft] = useState(null)
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [listPrice, setListPrice] = useState('')
  const [showListForm, setShowListForm] = useState(false)

  const isOwner = nft && account && nft.owner.toLowerCase() === account.toLowerCase()

  // Load NFT data
  useEffect(() => {
    const loadNFT = async () => {
      try {
        setLoading(true)
        setError(null)

        const metadata = await getNFTMetadata(tokenId)
        if (!metadata) {
          throw new Error('NFT not found')
        }

        setNft(metadata)

        // Get listing info
        const listingInfo = await getListing(tokenId)
        setListing(listingInfo)
      } catch (err) {
        console.error('Error loading NFT:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadNFT()
  }, [tokenId])

  // Handle list NFT
  const handleList = async () => {
    try {
      if (!listPrice || parseFloat(listPrice) <= 0) {
        setError('Please enter a valid price')
        return
      }

      setError(null)

      // First approve marketplace
      const approveResult = await approveMarketplace(tokenId)
      if (!approveResult.success) {
        throw new Error('Failed to approve marketplace')
      }

      // Then list NFT
      const result = await listNFT(tokenId, listPrice)
      if (result.success) {
        alert('NFT listed successfully!')
        setShowListForm(false)
        setListPrice('')
        // Reload listing info
        const listingInfo = await getListing(tokenId)
        setListing(listingInfo)
      } else {
        throw new Error(result.error || 'Failed to list NFT')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Handle buy NFT
  const handleBuy = async () => {
    try {
      if (!isConnected) {
        setError('Please connect your wallet first')
        return
      }

      setError(null)

      const result = await buyNFT(tokenId, listing.price)
      if (result.success) {
        alert('NFT purchased successfully!')
        navigate('/profile')
      } else {
        throw new Error(result.error || 'Failed to purchase NFT')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Handle cancel listing
  const handleCancelListing = async () => {
    try {
      setError(null)

      const result = await cancelListing(tokenId)
      if (result.success) {
        alert('Listing cancelled successfully!')
        // Reload listing info
        const listingInfo = await getListing(tokenId)
        setListing(listingInfo)
      } else {
        throw new Error(result.error || 'Failed to cancel listing')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="nft-detail-page">
        <LoadingSpinner message="Loading NFT details..." />
      </div>
    )
  }

  if (error && !nft) {
    return (
      <div className="nft-detail-page">
        <ErrorMessage message={error} />
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Marketplace
        </button>
      </div>
    )
  }

  return (
    <div className="nft-detail-page">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <div className="nft-detail-container">
        <div className="nft-image-section">
          <img 
            src={nft.image || '/placeholder.png'} 
            alt={nft.name}
            className="nft-detail-image"
          />
        </div>

        <div className="nft-info-section">
          <h1 className="nft-name">{nft.name}</h1>
          
          <div className="nft-owner-info">
            <span className="label">Owned by</span>
            <span className="owner-address">
              {isOwner ? 'You' : `${nft.owner.substring(0, 6)}...${nft.owner.substring(nft.owner.length - 4)}`}
            </span>
          </div>

          {nft.description && (
            <div className="nft-description">
              <h3>Description</h3>
              <p>{nft.description}</p>
            </div>
          )}

          <div className="nft-details-box">
            <div className="detail-item">
              <span className="label">Token ID</span>
              <span className="value">#{tokenId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Token Standard</span>
              <span className="value">ERC-721</span>
            </div>
          </div>

          {listing && listing.isListed && (
            <div className="price-section">
              <h3>Current Price</h3>
              <div className="price-value">{listing.price} ETH</div>
            </div>
          )}

          <div className="action-buttons">
            {listing && listing.isListed && !isOwner && (
              <button className="btn btn-primary btn-large" onClick={handleBuy}>
                Buy Now for {listing.price} ETH
              </button>
            )}

            {isOwner && listing && listing.isListed && (
              <button className="btn btn-danger btn-large" onClick={handleCancelListing}>
                Cancel Listing
              </button>
            )}

            {isOwner && (!listing || !listing.isListed) && (
              <div className="list-nft-section">
                {!showListForm ? (
                  <button 
                    className="btn btn-primary btn-large"
                    onClick={() => setShowListForm(true)}
                  >
                    List for Sale
                  </button>
                ) : (
                  <div className="list-form">
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Price in ETH"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      className="price-input"
                    />
                    <div className="list-form-buttons">
                      <button className="btn btn-primary" onClick={handleList}>
                        Confirm
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowListForm(false)
                          setListPrice('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTDetail
