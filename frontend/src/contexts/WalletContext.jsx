import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [balance, setBalance] = useState('0')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [chainId, setChainId] = useState(null)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.')
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const web3Signer = await web3Provider.getSigner()
      const network = await web3Provider.getNetwork()

      setProvider(web3Provider)
      setSigner(web3Signer)
      setAccount(accounts[0])
      setChainId(Number(network.chainId))

      // Get balance
      const accountBalance = await web3Provider.getBalance(accounts[0])
      setBalance(ethers.formatEther(accountBalance))

      console.log('Wallet connected:', accounts[0])
    } catch (err) {
      console.error('Error connecting wallet:', err)
      setError(err.message)
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setBalance('0')
    setChainId(null)
    setError(null)
  }

  // Switch to specific network (e.g., Sepolia testnet)
  const switchNetwork = async (targetChainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.toQuantity(targetChainId) }],
      })
    } catch (err) {
      // If network doesn't exist, add it
      if (err.code === 4902) {
        // You can add network addition logic here
        throw new Error('Network not found in MetaMask. Please add it manually.')
      }
      throw err
    }
  }

  // Check if user has sufficient balance
  const hasSufficientBalance = (requiredAmount) => {
    try {
      const balanceInWei = ethers.parseEther(balance)
      const requiredInWei = ethers.parseEther(requiredAmount.toString())
      return balanceInWei >= requiredInWei
    } catch (err) {
      console.error('Error checking balance:', err)
      return false
    }
  }

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== account) {
        setAccount(accounts[0])
        // Reload balance
        if (provider) {
          provider.getBalance(accounts[0]).then((bal) => {
            setBalance(ethers.formatEther(bal))
          })
        }
      }
    }

    const handleChainChanged = (chainId) => {
      setChainId(Number(chainId))
      // Reload the page to reset state
      window.location.reload()
    }

    const handleDisconnect = () => {
      disconnectWallet()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', handleDisconnect)

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
        window.ethereum.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [account, provider])

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          })
          if (accounts.length > 0) {
            await connectWallet()
          }
        } catch (err) {
          console.error('Error checking connection:', err)
        }
      }
    }
    checkConnection()
  }, [])

  const value = {
    account,
    provider,
    signer,
    balance,
    chainId,
    isConnecting,
    error,
    isConnected: !!account,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectWallet,
    disconnectWallet,
    switchNetwork,
    hasSufficientBalance,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
