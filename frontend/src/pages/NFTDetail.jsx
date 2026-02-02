import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import { useNFTContract } from '../hooks/useNFTContract'
import { useMarketplace } from '../hooks/useMarketplace'
import { useOffer } from '../hooks/useOffer'
import { NFT_OFFER_ADDRESS } from '../config/constants'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './NFTDetail.css'

const NFTDetail = () => {
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const { account, isConnected } = useWallet()
  const { getNFTMetadata, approveMarketplace, approveAddress } = useNFTContract()
  const { listNFT, buyNFT, cancelListing, getListing } = useMarketplace()
  const { makeOffer, acceptOffer, cancelOffer, getOffersForToken, hasActiveOffer } = useOffer()

  const [nft, setNft] = useState(null)
  const [listing, setListing] = useState(null)
  const [offers, setOffers] = useState([])
  const [userOffer, setUserOffer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [listPrice, setListPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [showListForm, setShowListForm] = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

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

        // Get offers for this NFT
        const tokenOffers = await getOffersForToken(tokenId)
        setOffers(tokenOffers)

        // Check if current user has an active offer
        if (account) {
          const { hasOffer, offerId } = await hasActiveOffer(tokenId, account)
          if (hasOffer) {
            const userOfferData = tokenOffers.find(o => o.offerId === offerId)
            setUserOffer(userOfferData)
          }
        }
      } catch (err) {
        console.error('Error loading NFT:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadNFT()
  }, [tokenId, account])

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

  // Handle make offer
  const handleMakeOffer = async () => {
    try {
      if (!offerPrice || parseFloat(offerPrice) <= 0) {
        setError('Please enter a valid offer price')
        return
      }

      setError(null)
      setActionLoading(true)

      const result = await makeOffer(tokenId, offerPrice, 168) // 7 days expiration
      if (result.success) {
        alert('Offer submitted successfully!')
        setShowOfferForm(false)
        setOfferPrice('')
        // Reload offers
        const tokenOffers = await getOffersForToken(tokenId)
        setOffers(tokenOffers)
        const { hasOffer, offerId } = await hasActiveOffer(tokenId, account)
        if (hasOffer) {
          const userOfferData = tokenOffers.find(o => o.offerId === offerId)
          setUserOffer(userOfferData)
        }
      } else {
        throw new Error(result.error || 'Failed to submit offer')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Handle accept offer (for owner)
  const handleAcceptOffer = async (offerId) => {
    try {
      if (!confirm('Are you sure you want to accept this offer?')) return

      setError(null)
      setActionLoading(true)

      // First approve the offer contract
      const approveResult = await approveAddress(tokenId, NFT_OFFER_ADDRESS)
      if (!approveResult.success) {
        throw new Error('Failed to approve offer contract')
      }

      const result = await acceptOffer(offerId)
      if (result.success) {
        alert('Offer accepted! NFT has been transferred.')
        navigate('/profile')
      } else {
        throw new Error(result.error || 'Failed to accept offer')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Handle cancel offer (for offerer)
  const handleCancelOffer = async (offerId) => {
    try {
      if (!confirm('Are you sure you want to cancel your offer?')) return

      setError(null)
      setActionLoading(true)

      const result = await cancelOffer(offerId)
      if (result.success) {
        alert('Offer cancelled successfully!')
        setUserOffer(null)
        // Reload offers
        const tokenOffers = await getOffersForToken(tokenId)
        setOffers(tokenOffers)
      } else {
        throw new Error(result.error || 'Failed to cancel offer')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatTimeLeft = (expirationTime) => {
    const now = Math.floor(Date.now() / 1000)
    const diff = expirationTime - now
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (24 * 60 * 60))
    const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
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

            {/* Make Offer Section - for non-owners */}
            {!isOwner && isConnected && (
              <div className="make-offer-section">
                {userOffer ? (
                  <div className="user-offer-info">
                    <p>Your offer: <strong>{userOffer.offerPrice} ETH</strong></p>
                    <p className="offer-expiry">{formatTimeLeft(userOffer.expirationTime)}</p>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleCancelOffer(userOffer.offerId)}
                      disabled={actionLoading}
                    >
                      Cancel Your Offer
                    </button>
                  </div>
                ) : !showOfferForm ? (
                  <button 
                    className="btn btn-secondary btn-large"
                    onClick={() => setShowOfferForm(true)}
                  >
                    💰 Make an Offer
                  </button>
                ) : (
                  <div className="offer-form">
                    <h4>Make an Offer</h4>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Your offer in ETH"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="price-input"
                    />
                    <p className="offer-note">Offer expires in 7 days</p>
                    <div className="offer-form-buttons">
                      <button 
                        className="btn btn-primary" 
                        onClick={handleMakeOffer}
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Submitting...' : 'Submit Offer'}
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowOfferForm(false)
                          setOfferPrice('')
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

          {/* Offers Section - visible to owner */}
          {isOwner && offers.length > 0 && (
            <div className="offers-section">
              <h3>💰 Offers ({offers.length})</h3>
              <div className="offers-list">
                {offers.map((offer) => (
                  <div key={offer.offerId} className="offer-item">
                    <div className="offer-info">
                      <span className="offer-price">{offer.offerPrice} ETH</span>
                      <span className="offer-from">from {formatAddress(offer.offerer)}</span>
                      <span className="offer-expiry">{formatTimeLeft(offer.expirationTime)}</span>
                    </div>
                    <button 
                      className="btn btn-success btn-small"
                      onClick={() => handleAcceptOffer(offer.offerId)}
                      disabled={actionLoading}
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show offers count to non-owners */}
          {!isOwner && offers.length > 0 && (
            <div className="offers-info">
              <p>📊 {offers.length} offer{offers.length > 1 ? 's' : ''} on this NFT</p>
              {offers.length > 0 && (
                <p className="highest-offer">
                  Highest offer: {Math.max(...offers.map(o => parseFloat(o.offerPrice))).toFixed(4)} ETH
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTDetail
