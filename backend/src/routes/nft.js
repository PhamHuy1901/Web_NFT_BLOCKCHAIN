import express from 'express';

const router = express.Router();

// In-memory cache for NFT data (can be replaced with MongoDB)
let nftCache = [];

/**
 * GET /api/nft
 * Get all cached NFT data
 */
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      count: nftCache.length,
      nfts: nftCache
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch NFTs',
      message: error.message 
    });
  }
});

/**
 * GET /api/nft/:tokenId
 * Get specific NFT by token ID
 */
router.get('/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const nft = nftCache.find(n => n.tokenId === tokenId);

    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    res.json({
      success: true,
      nft
    });
  } catch (error) {
    console.error('Error fetching NFT:', error);
    res.status(500).json({ 
      error: 'Failed to fetch NFT',
      message: error.message 
    });
  }
});

/**
 * POST /api/nft/cache
 * Cache NFT data for faster retrieval
 */
router.post('/cache', async (req, res) => {
  try {
    const { tokenId, name, description, image, price, owner, seller } = req.body;

    if (!tokenId) {
      return res.status(400).json({ error: 'Token ID is required' });
    }

    // Check if NFT already exists in cache
    const existingIndex = nftCache.findIndex(n => n.tokenId === tokenId);
    
    const nftData = {
      tokenId,
      name,
      description,
      image,
      price,
      owner,
      seller,
      cachedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      // Update existing
      nftCache[existingIndex] = nftData;
    } else {
      // Add new
      nftCache.push(nftData);
    }

    res.json({
      success: true,
      message: 'NFT cached successfully',
      nft: nftData
    });
  } catch (error) {
    console.error('Error caching NFT:', error);
    res.status(500).json({ 
      error: 'Failed to cache NFT',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/nft/cache/:tokenId
 * Remove NFT from cache
 */
router.delete('/cache/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    nftCache = nftCache.filter(n => n.tokenId !== tokenId);

    res.json({
      success: true,
      message: 'NFT removed from cache'
    });
  } catch (error) {
    console.error('Error removing NFT from cache:', error);
    res.status(500).json({ 
      error: 'Failed to remove NFT',
      message: error.message 
    });
  }
});

export default router;
