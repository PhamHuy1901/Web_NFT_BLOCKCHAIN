import express from 'express';

const router = express.Router();

// In-memory storage for user profiles (can be replaced with MongoDB)
let userProfiles = {};

/**
 * GET /api/user/:address
 * Get user profile by wallet address
 */
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const profile = userProfiles[address] || {
      address,
      username: null,
      bio: null,
      avatar: null,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      message: error.message 
    });
  }
});

/**
 * POST /api/user/:address
 * Update user profile
 */
router.post('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { username, bio, avatar } = req.body;

    userProfiles[address] = {
      address,
      username: username || null,
      bio: bio || null,
      avatar: avatar || null,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: userProfiles[address]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

/**
 * POST /api/user/:address/like/:tokenId
 * Like an NFT
 */
router.post('/:address/like/:tokenId', async (req, res) => {
  try {
    const { address, tokenId } = req.params;

    if (!userProfiles[address]) {
      userProfiles[address] = { address, likes: [] };
    }

    if (!userProfiles[address].likes) {
      userProfiles[address].likes = [];
    }

    // Toggle like
    const likeIndex = userProfiles[address].likes.indexOf(tokenId);
    if (likeIndex === -1) {
      userProfiles[address].likes.push(tokenId);
    } else {
      userProfiles[address].likes.splice(likeIndex, 1);
    }

    res.json({
      success: true,
      liked: likeIndex === -1,
      likes: userProfiles[address].likes
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ 
      error: 'Failed to toggle like',
      message: error.message 
    });
  }
});

export default router;
