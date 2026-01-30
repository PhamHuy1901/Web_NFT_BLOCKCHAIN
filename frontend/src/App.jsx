import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import CreateNFT from './pages/CreateNFT'
import NFTDetail from './pages/NFTDetail'
import Profile from './pages/Profile'
import AuctionPage from './pages/AuctionPage'
import AuctionDetail from './pages/AuctionDetail'
import CreateAuction from './pages/CreateAuction'
import './App.css'

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public route - Login page */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - require wallet connection */}
            <Route path="/" element={
              <ProtectedRoute>
                <Header />
                <main className="main-content">
                  <HomePage />
                </main>
              </ProtectedRoute>
            } />
            
            <Route path="/create" element={
              <ProtectedRoute>
                <Header />
                <main className="main-content">
                  <CreateNFT />
                </main>
              </ProtectedRoute>
            } />
            
            <Route path="/nft/:tokenId" element={
              <ProtectedRoute>
                <Header />
                <main className="main-content">
                  <NFTDetail />
                </main>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Header />
                <main className="main-content">
                  <Profile />
                </main>
              </ProtectedRoute>
            } />

            {/* Auction routes */}
            <Route path="/auctions" element={
              <ProtectedRoute>
                <Header />
                <main className="main-content">
                  <AuctionPage />
                </main>
              </ProtectedRoute>
            } />

            <Route path="/auction/create" element={
              <ProtectedRoute>
                <Header />
                <main className="main-content">
                  <CreateAuction />
                </main>
              </ProtectedRoute>
            } />

            <Route path="/auction/:auctionId" element={
              <ProtectedRoute>
                <Header />
                <main className="main-content">
                  <AuctionDetail />
                </main>
              </ProtectedRoute>
            } />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  )
}

export default App
