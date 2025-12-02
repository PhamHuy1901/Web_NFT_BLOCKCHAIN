import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CreateNFT from './pages/CreateNFT'
import NFTDetail from './pages/NFTDetail'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateNFT />} />
              <Route path="/nft/:tokenId" element={<NFTDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WalletProvider>
  )
}

export default App
