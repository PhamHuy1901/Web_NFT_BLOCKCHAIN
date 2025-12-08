import { Link, useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const { 
    account, 
    balance, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnectWallet,
    isMetaMaskInstalled 
  } = useWallet()

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatBalance = (bal) => {
    return parseFloat(bal).toFixed(4)
  }

  const handleDisconnect = () => {
    disconnectWallet()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <h1>🎨 NFT Marketplace</h1>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Marketplace</Link>
          <Link to="/create" className="nav-link">Create NFT</Link>
          {isConnected && <Link to="/profile" className="nav-link">My Profile</Link>}
        </nav>

        <div className="header-wallet">
          {!isMetaMaskInstalled ? (
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Install MetaMask
            </a>
          ) : isConnected ? (
            <div className="wallet-info">
              <div className="wallet-balance">
                {formatBalance(balance)} ETH
              </div>
              <div className="wallet-dropdown">
                <button 
                  className="btn btn-secondary wallet-address"
                  title={account}
                >
                  {formatAddress(account)}
                </button>
                <button 
                  className="btn btn-logout"
                  onClick={handleDisconnect}
                  title="Disconnect wallet"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
