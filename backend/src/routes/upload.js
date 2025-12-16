import express from 'express';
import multer from 'multer';

// Sử dụng Pinata IPFS service (cloud-based, real IPFS)
// Nếu muốn dùng Mock IPFS, đổi thành: '../services/ipfsServiceMock.js'
// Nếu muốn dùng local IPFS, đổi thành: '../services/ipfsService.js'
import { uploadToIPFS, uploadJSONToIPFS, getIPFSUrl } from '../services/ipfsServicePinata.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

/**
 * POST /api/upload
 * Upload image file to IPFS
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📤 Uploading file to IPFS:', req.file.originalname);
    
    // Upload file to IPFS
    const imageHash = await uploadToIPFS(req.file.buffer);
    const imageUrl = getIPFSUrl(imageHash);

    res.json({
      success: true,
      hash: imageHash,
      url: imageUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      message: error.message 
    });
  }
});

/**
 * POST /api/upload/metadata
 * Upload NFT metadata to IPFS
 */
router.post('/metadata', async (req, res) => {
  try {
    const { name, description, imageHash, attributes } = req.body;

    if (!name || !imageHash) {
      return res.status(400).json({ 
        error: 'Missing required fields: name and imageHash' 
      });
    }

    // Create NFT metadata JSON
    const metadata = {
      name,
      description: description || '',
      image: getIPFSUrl(imageHash),
      attributes: attributes || []
    };

    console.log('📤 Uploading metadata to IPFS:', metadata);

    // Upload metadata to IPFS
    const metadataHash = await uploadJSONToIPFS(metadata);
    const metadataUrl = getIPFSUrl(metadataHash);

    res.json({
      success: true,
      hash: metadataHash,
      url: metadataUrl,
      metadata
    });

  } catch (error) {
    console.error('Metadata upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload metadata',
      message: error.message 
    });
  }
});

export default router;
