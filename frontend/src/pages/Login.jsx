import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { 
    account,
    isConnected, 
    isConnecting, 
    connectWallet, 
    isMetaMaskInstalled,
    error 
  } = useWallet()

  // Redirect to home if already connected
  useEffect(() => {
    if (isConnected && account) {
      navigate('/')
    }
  }, [isConnected, account, navigate])

  const handleConnect = async () => {
    const result = await connectWallet()
    if (result?.success) {
      navigate('/')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          {/* Logo/Brand */}
          <div className="login-header">
            <div className="logo-icon">🎨</div>
            <h1>NFT Marketplace</h1>
            <p className="tagline">Discover, Collect, and Sell Extraordinary NFTs</p>
          </div>

          {/* Login Card */}
          <div className="login-card">
            <h2>Welcome Back</h2>
            <p className="login-description">
              Connect your wallet to access the marketplace
            </p>

            {error && (
              <div className="login-error">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {!isMetaMaskInstalled ? (
              <div className="metamask-install">
                <p className="install-message">
                  MetaMask is not installed in your browser
                </p>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-install"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                    alt="MetaMask"
                    className="metamask-icon"
                  />
                  Install MetaMask
                </a>
                <p className="install-note">
                  You'll need MetaMask to use this application
                </p>
              </div>
            ) : (
              <div className="connect-section">
                <button 
                  className="btn btn-connect"
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="spinner-small"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                        alt="MetaMask"
                        className="metamask-icon"
                      />
                      <span>Connect with MetaMask</span>
                    </>
                  )}
                </button>

                <div className="login-info">
                  <div className="info-item">
                    <span className="info-icon">🔒</span>
                    <div className="info-text">
                      <strong>Secure</strong>
                      <p>Your keys, your crypto</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">⚡</span>
                    <div className="info-text">
                      <strong>Fast</strong>
                      <p>Instant transactions</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🌐</span>
                    <div className="info-text">
                      <strong>Decentralized</strong>
                      <p>No middleman needed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>New to Ethereum wallets?</p>
            <a 
              href="https://ethereum.org/en/wallets/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="learn-more-link"
            >
              Learn more about wallets →
            </a>
          </div>
        </div>

        {/* Background decoration */}
        <div className="login-bg">
          <div className="bg-circle circle-1"></div>
          <div className="bg-circle circle-2"></div>
          <div className="bg-circle circle-3"></div>
        </div>
      </div>
    </div>
  )
}

export default Login
