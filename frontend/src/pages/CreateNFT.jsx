import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import { useNFTContract } from '../hooks/useNFTContract'
import { useIPFS } from '../hooks/useIPFS'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './CreateNFT.css'

const CreateNFT = () => {
  const navigate = useNavigate()
  const { isConnected } = useWallet()
  const { mintNFT, loading: minting } = useNFTContract()
  const { uploadToIPFS, uploadMetadata, uploading } = useIPFS()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null,
  })
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1) // 1: Form, 2: Uploading, 3: Minting

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setFormData((prev) => ({
        ...prev,
        file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!formData.name || !formData.file) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setError(null)

      // Step 1: Upload image to IPFS
      setStep(2)
      const imageUpload = await uploadToIPFS(formData.file)
      if (!imageUpload.success) {
        throw new Error(imageUpload.error || 'Failed to upload image')
      }

      // Step 2: Create and upload metadata to IPFS
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUpload.ipfsUrl,
      }

      const metadataUpload = await uploadMetadata(metadata)
      if (!metadataUpload.success) {
        throw new Error(metadataUpload.error || 'Failed to upload metadata')
      }

      // Step 3: Mint NFT
      setStep(3)
      const mintResult = await mintNFT(metadataUpload.ipfsUrl)
      
      if (mintResult.success) {
        alert(`NFT minted successfully! Token ID: ${mintResult.tokenId}`)
        navigate('/profile')
      } else {
        throw new Error(mintResult.error || 'Failed to mint NFT')
      }
    } catch (err) {
      console.error('Error creating NFT:', err)
      setError(err.message)
      setStep(1)
    }
  }

  if (!isConnected) {
    return (
      <div className="create-nft-page">
        <div className="not-connected">
          <h2>Wallet Not Connected</h2>
          <p>Please connect your wallet to create NFTs</p>
        </div>
      </div>
    )
  }

  if (step > 1) {
    return (
      <div className="create-nft-page">
        <LoadingSpinner 
          message={
            step === 2 
              ? 'Uploading to IPFS...' 
              : 'Minting NFT... Please confirm the transaction in MetaMask'
          } 
        />
      </div>
    )
  }

  return (
    <div className="create-nft-page">
      <div className="page-header">
        <h1>Create New NFT</h1>
        <p className="page-subtitle">Mint your digital artwork on the blockchain</p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <form className="create-nft-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Upload File</h3>
          <div className="file-upload-area">
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="preview-image" />
                <button
                  type="button"
                  className="change-file-btn"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, file: null }))
                    setPreview(null)
                  }}
                >
                  Change File
                </button>
              </div>
            ) : (
              <label className="file-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <div className="upload-placeholder">
                  <span className="upload-icon">📁</span>
                  <p>Click to upload or drag and drop</p>
                  <span className="upload-hint">PNG, JPG, GIF up to 10MB</span>
                </div>
              </label>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>NFT Details</h3>
          
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter NFT name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your NFT"
              rows="4"
              className="form-textarea"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={uploading || minting}
        >
          {uploading || minting ? 'Creating...' : 'Create NFT'}
        </button>
      </form>
    </div>
  )
}

export default CreateNFT
