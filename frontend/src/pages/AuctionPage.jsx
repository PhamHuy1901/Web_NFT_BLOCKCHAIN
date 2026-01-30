import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuction } from '../hooks/useAuction'
import { useNFTContract } from '../hooks/useNFTContract'
import { useWallet } from '../contexts/WalletContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import AuctionCard from '../components/AuctionCard'
import './AuctionPage.css'

const AuctionPage = () => {
  const { account } = useWallet()
  const { getActiveAuctions, loading: auctionLoading, error: auctionError } = useAuction()
  const { getNFTMetadata } = useNFTContract()
  
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load active auctions
  useEffect(() => {
    const loadAuctions = async () => {
      try {
        setLoading(true)
        setError(null)

        const activeAuctions = await getActiveAuctions()
        
        // Load NFT metadata for each auction
        const auctionsWithMetadata = await Promise.all(
          activeAuctions.map(async (auction) => {
            try {
              const metadata = await getNFTMetadata(auction.tokenId)
              return {
                ...auction,
                nftMetadata: metadata,
              }
            } catch (err) {
              console.error(`Error loading metadata for token ${auction.tokenId}:`, err)
              return {
                ...auction,
                nftMetadata: null,
              }
            }
          })
        )

        setAuctions(auctionsWithMetadata)
      } catch (err) {
        console.error('Error loading auctions:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAuctions()
  }, [])

  if (loading) {
    return (
      <div className="auction-page">
        <LoadingSpinner message="Loading auctions..." />
      </div>
    )
  }

  return (
    <div className="auction-page">
      <div className="auction-header">
        <h1>🔨 NFT Auctions</h1>
        <p className="auction-subtitle">Bid on exclusive NFTs and win amazing collectibles</p>
        <Link to="/auction/create" className="btn btn-primary">
          + Create Auction
        </Link>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {auctions.length === 0 ? (
        <div className="no-auctions">
          <div className="no-auctions-icon">🎨</div>
          <h3>No Active Auctions</h3>
          <p>Be the first to create an auction!</p>
          <Link to="/auction/create" className="btn btn-primary">
            Create Auction
          </Link>
        </div>
      ) : (
        <div className="auctions-grid">
          {auctions.map((auction) => (
            <AuctionCard
              key={auction.auctionId}
              auction={auction}
              account={account}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AuctionPage
