import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuction } from '../hooks/useAuction'
import { useNFTContract } from '../hooks/useNFTContract'
import { useWallet } from '../contexts/WalletContext'
import { NFT_AUCTION_ADDRESS } from '../config/constants'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './CreateAuction.css'

const CreateAuction = () => {
  const navigate = useNavigate()
  const { account, isConnected } = useWallet()
  const { createAuction, isInAuction, loading: auctionLoading } = useAuction()
  const { getMyNFTs, approveAddress, getApproved } = useNFTContract()

  const [myNFTs, setMyNFTs] = useState([])
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [startingPrice, setStartingPrice] = useState('')
  const [reservePrice, setReservePrice] = useState('')
  const [duration, setDuration] = useState('24') // hours
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1) // 1: Select NFT, 2: Set Details, 3: Confirm

  // Load user's NFTs
  useEffect(() => {
    const loadNFTs = async () => {
      if (!isConnected || !account) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const nfts = await getMyNFTs()
        
        // Filter out NFTs already in auction
        const availableNFTs = await Promise.all(
          nfts.map(async (nft) => {
            const inAuction = await isInAuction(nft.tokenId)
            return { ...nft, inAuction }
          })
        )

        setMyNFTs(availableNFTs.filter(nft => !nft.inAuction && !nft.isListed))
      } catch (err) {
        console.error('Error loading NFTs:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadNFTs()
  }, [account, isConnected])

  // Handle NFT selection
  const handleSelectNFT = (nft) => {
    setSelectedNFT(nft)
    setStep(2)
  }

  // Handle create auction
  const handleCreateAuction = async () => {
    try {
      if (!selectedNFT) {
        setError('Please select an NFT')
        return
      }

      if (!startingPrice || parseFloat(startingPrice) <= 0) {
        setError('Please enter a valid starting price')
        return
      }

      if (!reservePrice || parseFloat(reservePrice) < parseFloat(startingPrice)) {
        setError('Reserve price must be greater than or equal to starting price')
        return
      }

      if (!duration || parseInt(duration) < 1) {
        setError('Duration must be at least 1 hour')
        return
      }

      setError(null)
      setStep(3)

      // Check approval
      const approved = await getApproved(selectedNFT.tokenId)
      if (approved.toLowerCase() !== NFT_AUCTION_ADDRESS.toLowerCase()) {
        // Need to approve first
        console.log('Approving auction contract...')
        const approveResult = await approveAddress(selectedNFT.tokenId, NFT_AUCTION_ADDRESS)
        if (!approveResult.success) {
          throw new Error('Failed to approve auction contract')
        }
      }

      // Create auction
      const result = await createAuction(
        selectedNFT.tokenId,
        startingPrice,
        reservePrice,
        parseInt(duration)
      )

      if (result.success) {
        alert(`Auction created successfully! Auction ID: ${result.auctionId}`)
        navigate(`/auction/${result.auctionId}`)
      } else {
        throw new Error(result.error || 'Failed to create auction')
      }
    } catch (err) {
      setError(err.message)
      setStep(2)
    }
  }

  if (loading) {
    return (
      <div className="create-auction-page">
        <LoadingSpinner message="Loading your NFTs..." />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="create-auction-page">
        <div className="connect-wallet-message">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to create an auction</p>
        </div>
      </div>
    )
  }

  return (
    <div className="create-auction-page">
      <h1>🔨 Create Auction</h1>
      
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <div className="auction-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Select NFT</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Set Details</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      {/* Step 1: Select NFT */}
      {step === 1 && (
        <div className="step-content">
          <h2>Select an NFT to Auction</h2>
          {myNFTs.length === 0 ? (
            <div className="no-nfts">
              <p>You don't have any NFTs available for auction.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/create')}
              >
                Create NFT
              </button>
            </div>
          ) : (
            <div className="nft-selection-grid">
              {myNFTs.map((nft) => (
                <div 
                  key={nft.tokenId}
                  className={`nft-selection-card ${selectedNFT?.tokenId === nft.tokenId ? 'selected' : ''}`}
                  onClick={() => handleSelectNFT(nft)}
                >
                  <img 
                    src={nft.image || '/placeholder.png'} 
                    alt={nft.name}
                    className="nft-selection-image"
                  />
                  <div className="nft-selection-info">
                    <h3>{nft.name || `NFT #${nft.tokenId}`}</h3>
                    <p>Token ID: #{nft.tokenId}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Set Details */}
      {step === 2 && selectedNFT && (
        <div className="step-content">
          <h2>Set Auction Details</h2>
          
          <div className="selected-nft-preview">
            <img 
              src={selectedNFT.image || '/placeholder.png'} 
              alt={selectedNFT.name}
            />
            <div className="selected-nft-info">
              <h3>{selectedNFT.name || `NFT #${selectedNFT.tokenId}`}</h3>
              <p>Token ID: #{selectedNFT.tokenId}</p>
            </div>
          </div>

          <div className="auction-form">
            <div className="form-group">
              <label>Starting Price (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="0.1"
              />
              <span className="help-text">The minimum price for the first bid</span>
            </div>

            <div className="form-group">
              <label>Reserve Price (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                placeholder="0.5"
              />
              <span className="help-text">
                Minimum price for the auction to be successful (must be ≥ starting price)
              </span>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="1">1 hour</option>
                <option value="6">6 hours</option>
                <option value="12">12 hours</option>
                <option value="24">1 day</option>
                <option value="72">3 days</option>
                <option value="168">7 days</option>
                <option value="336">14 days</option>
                <option value="720">30 days</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedNFT(null)
                  setStep(1)
                }}
              >
                Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateAuction}
                disabled={auctionLoading}
              >
                {auctionLoading ? 'Creating...' : 'Create Auction'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirm/Processing */}
      {step === 3 && (
        <div className="step-content">
          <div className="processing-section">
            <LoadingSpinner message="Creating your auction..." />
            <p>Please confirm the transactions in your wallet</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateAuction
