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
  const [filteredNfts, setFilteredNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Price filter states
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortOrder, setSortOrder] = useState('default') // 'default', 'low-high', 'high-low'
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'compact', 'list'

  // Load all listed NFTs
  const loadNFTs = async () => {
    try {
      setLoading(true)
      setError(null)

      const listings = await getAllListings()
      
      // Fetch metadata for each NFT and filter invalid listings
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

      // Filter: chỉ hiển thị listing nếu seller vẫn là owner của NFT
      const validListings = nftsWithMetadata.filter(nft => {
        if (!nft || !nft.owner || !nft.seller) return false
        return nft.owner.toLowerCase() === nft.seller.toLowerCase()
      })

      setNfts(validListings)
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

  // Filter and sort NFTs based on price
  useEffect(() => {
    let result = [...nfts]

    // Filter by price range
    if (minPrice !== '') {
      result = result.filter(nft => parseFloat(nft.price) >= parseFloat(minPrice))
    }
    if (maxPrice !== '') {
      result = result.filter(nft => parseFloat(nft.price) <= parseFloat(maxPrice))
    }

    // Sort by price
    if (sortOrder === 'low-high') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (sortOrder === 'high-low') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    }

    setFilteredNfts(result)
  }, [nfts, minPrice, maxPrice, sortOrder])

  // Reset filters
  const resetFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setSortOrder('default')
    setViewMode('grid')
  }

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

      {/* Price Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <div className="filter-title">
            <span className="filter-icon">🔍</span>
            <h3>Lọc & Hiển thị</h3>
          </div>
          
          {/* View Mode Toggle */}
          <div className="view-mode-group">
            <span className="view-mode-label">Chế độ xem:</span>
            <div className="view-mode-buttons">
              <button
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Lưới lớn"
              >
                <span className="view-icon">▦</span>
                Grid
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'compact' ? 'active' : ''}`}
                onClick={() => setViewMode('compact')}
                title="Lưới nhỏ gọn"
              >
                <span className="view-icon">▤</span>
                Compact
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Danh sách"
              >
                <span className="view-icon">☰</span>
                List
              </button>
            </div>
          </div>
        </div>
        
        <div className="filter-controls">
          <div className="price-range">
            <div className="price-input-group">
              <label>Giá tối thiểu (ETH)</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.001"
              />
            </div>
            <span className="price-separator">-</span>
            <div className="price-input-group">
              <label>Giá tối đa (ETH)</label>
              <input
                type="number"
                placeholder="999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.001"
              />
            </div>
          </div>

          <div className="sort-group">
            <label>Sắp xếp theo</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Mặc định</option>
              <option value="low-high">Giá: Thấp → Cao</option>
              <option value="high-low">Giá: Cao → Thấp</option>
            </select>
          </div>

          <button className="reset-filter-btn" onClick={resetFilters}>
            🔄 Đặt lại
          </button>
        </div>

        {filteredNfts.length !== nfts.length && (
          <div className="filter-result">
            Hiển thị {filteredNfts.length} / {nfts.length} NFT
          </div>
        )}
      </div>

      <NFTGrid
        nfts={filteredNfts}
        loading={loading}
        onBuy={handleBuyNFT}
        currentAccount={account}
        viewMode={viewMode}
      />

      {!loading && nfts.length === 0 && (
        <div className="empty-state">
          <h2>No NFTs listed yet</h2>
          <p>Be the first to create and list an NFT!</p>
        </div>
      )}

      {!loading && nfts.length > 0 && filteredNfts.length === 0 && (
        <div className="empty-state">
          <h2>Không tìm thấy NFT</h2>
          <p>Không có NFT nào trong khoảng giá này. Hãy thử điều chỉnh bộ lọc.</p>
          <button className="reset-filter-btn-large" onClick={resetFilters}>
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  )
}

export default HomePage
