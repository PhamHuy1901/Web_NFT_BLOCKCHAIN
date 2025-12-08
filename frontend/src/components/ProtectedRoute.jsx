import { Navigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isConnected, isConnecting } = useWallet()

  // Show loading while checking connection
  if (isConnecting) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Checking wallet connection..." />
      </div>
    )
  }

  // Redirect to login if not connected
  if (!isConnected) {
    return <Navigate to={redirectTo} replace />
  }

  // Render the protected content
  return children
}

export default ProtectedRoute
