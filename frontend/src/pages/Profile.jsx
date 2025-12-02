import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useNFTContract } from '../hooks/useNFTContract'
import { useMarketplace } from '../hooks/useMarketplace'
import NFTGrid from '../components/NFTGrid'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './Profile.css'

const Profile = () => {
  const { account, balance, isConnected } = useWallet()
  const { getUserNFTs } = useNFTContract()
  const { cancelListing, getListing } = useMarketplace()

  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('owned') // 'owned' or 'listed'

  // Load user's NFTs
  const loadNFTs = async () => {
    try {
      setLoading(true)
      setError(null)

      // Note: This is a simplified version
      // In production, you would fetch user's NFTs from your backend indexer
      // or use events from the blockchain
      const userNFTs = await getUserNFTs(account)
      
      // Add listing info to each NFT
      const nftsWithListingInfo = await Promise.all(
        userNFTs.map(async (nft) => {
          const listingInfo = await getListing(nft.tokenId)
          return {
            ...nft,
            ...listingInfo,
          }
        })
      )

      setNfts(nftsWithListingInfo)
    } catch (err) {
      console.error('Error loading NFTs:', err)
      setError('Failed to load your NFTs. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && account) {
      loadNFTs()
    }
  }, [isConnected, account])

  // Handle cancel listing
  const handleCancelListing = async (tokenId) => {
    try {
      setError(null)
      const result = await cancelListing(tokenId)

      if (result.success) {
        alert('Listing cancelled successfully!')
        loadNFTs()
      } else {
        throw new Error(result.error || 'Failed to cancel listing')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (!isConnected) {
    return (
      <div className="profile-page">
        <div className="not-connected">
          <h2>Wallet Not Connected</h2>
          <p>Please connect your wallet to view your profile</p>
        </div>
      </div>
    )
  }

  const ownedNFTs = nfts.filter((nft) => !nft.isListed)
  const listedNFTs = nfts.filter((nft) => nft.isListed)

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {account && account.substring(0, 2).toUpperCase()}
          </div>
          <div className="profile-details">
            <h1>My Profile</h1>
            <div className="profile-address">
              {account && `${account.substring(0, 10)}...${account.substring(account.length - 8)}`}
            </div>
            <div className="profile-balance">
              Balance: <span className="balance-value">{parseFloat(balance).toFixed(4)} ETH</span>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'owned' ? 'active' : ''}`}
          onClick={() => setActiveTab('owned')}
        >
          Owned ({ownedNFTs.length})
        </button>
        <button
          className={`tab ${activeTab === 'listed' ? 'active' : ''}`}
          onClick={() => setActiveTab('listed')}
        >
          Listed ({listedNFTs.length})
        </button>
      </div>

      <div className="profile-content">
        {loading ? (
          <LoadingSpinner message="Loading your NFTs..." />
        ) : (
          <>
            {activeTab === 'owned' && (
              <NFTGrid
                nfts={ownedNFTs}
                loading={false}
                currentAccount={account}
              />
            )}

            {activeTab === 'listed' && (
              <NFTGrid
                nfts={listedNFTs}
                loading={false}
                onCancelListing={handleCancelListing}
                currentAccount={account}
              />
            )}

            {!loading && 
              ((activeTab === 'owned' && ownedNFTs.length === 0) ||
               (activeTab === 'listed' && listedNFTs.length === 0)) && (
              <div className="empty-state">
                <h2>No NFTs found</h2>
                <p>
                  {activeTab === 'owned'
                    ? "You don't own any NFTs yet. Start collecting!"
                    : "You don't have any listed NFTs."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
