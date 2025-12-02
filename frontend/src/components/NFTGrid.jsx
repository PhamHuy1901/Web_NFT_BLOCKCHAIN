import NFTCard from './NFTCard'
import './NFTGrid.css'

const NFTGrid = ({ nfts, loading, onBuy, onCancelListing, currentAccount }) => {
  if (loading) {
    return (
      <div className="nft-grid-loading">
        <div className="spinner"></div>
        <p>Loading NFTs...</p>
      </div>
    )
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="nft-grid-empty">
        <p>No NFTs found</p>
      </div>
    )
  }

  return (
    <div className="nft-grid">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.tokenId}
          nft={nft}
          onBuy={onBuy}
          onCancelListing={onCancelListing}
          isOwner={nft.owner?.toLowerCase() === currentAccount?.toLowerCase()}
        />
      ))}
    </div>
  )
}

export default NFTGrid
