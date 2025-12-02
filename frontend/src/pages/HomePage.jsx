import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useMarketplace } from '../hooks/useMarketplace'
import { useNFTContract } from '../hooks/useNFTContract'
import NFTGrid from '../components/NFTGrid'
import ErrorMessage from '../components/ErrorMessage'
import './HomePage.css'

const HomePage = () => {
  const { account, isConnected } = useWallet()
  const { getAllListings, buyNFT, loading: marketplaceLoading } = useMarketplace()
  const { getNFTMetadata } = useNFTContract()

  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Load all listed NFTs
  const loadNFTs = async () => {
    try {
      setLoading(true)
      setError(null)

      const listings = await getAllListings()
      
      // Fetch metadata for each NFT
      const nftsWithMetadata = await Promise.all(
        listings.map(async (listing) => {
          const metadata = await getNFTMetadata(listing.tokenId)
          return {
            ...listing,
            ...metadata,
            isListed: true,
          }
        })
      )

      setNfts(nftsWithMetadata)
    } catch (err) {
      console.error('Error loading NFTs:', err)
      setError('Failed to load NFTs. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNFTs()
  }, [])

  // Handle buy NFT
  const handleBuyNFT = async (nft) => {
    try {
      if (!isConnected) {
        setError('Please connect your wallet first')
        return
      }

      setError(null)
      setSuccessMessage(null)

      const result = await buyNFT(nft.tokenId, nft.price)

      if (result.success) {
        setSuccessMessage(`Successfully purchased ${nft.name}!`)
        // Reload NFTs after purchase
        setTimeout(() => {
          loadNFTs()
        }, 2000)
      } else {
        setError(result.error || 'Failed to purchase NFT')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Explore NFT Marketplace</h1>
        <p className="page-subtitle">
          Discover, collect, and sell extraordinary NFTs
        </p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      
      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          <p>{successMessage}</p>
        </div>
      )}

      {!isConnected && (
        <div className="info-banner">
          <p>Connect your wallet to start buying NFTs</p>
        </div>
      )}

      <NFTGrid
        nfts={nfts}
        loading={loading}
        onBuy={handleBuyNFT}
        currentAccount={account}
      />

      {!loading && nfts.length === 0 && (
        <div className="empty-state">
          <h2>No NFTs listed yet</h2>
          <p>Be the first to create and list an NFT!</p>
        </div>
      )}
    </div>
  )
}

export default HomePage
