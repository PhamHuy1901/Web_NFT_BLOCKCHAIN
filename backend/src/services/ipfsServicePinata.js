import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

/**
 * IPFS Service using Pinata (Cloud IPFS service)
 * Không cần chạy IPFS node local
 */

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

// Pinata API endpoints
const PINATA_PIN_FILE_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_PIN_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

/**
 * Upload file buffer to IPFS via Pinata
 * @param {Buffer} fileBuffer - File data
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} IPFS hash
 */
export async function uploadToIPFS(fileBuffer, fileName = 'file') {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);

    const metadata = JSON.stringify({
      name: fileName,
    });
    formData.append('pinataMetadata', metadata);

    const headers = {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
    };

    // Add authentication
    if (PINATA_JWT) {
      headers['Authorization'] = `Bearer ${PINATA_JWT}`;
    } else if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      headers['pinata_api_key'] = PINATA_API_KEY;
      headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
    } else {
      throw new Error('Pinata credentials not configured');
    }

    const response = await axios.post(PINATA_PIN_FILE_URL, formData, { headers });

    console.log('✅ File uploaded to IPFS via Pinata:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('❌ Pinata upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload file to IPFS via Pinata');
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param {Object} metadata - NFT metadata object
 * @returns {Promise<string>} IPFS hash
 */
export async function uploadJSONToIPFS(metadata) {
  try {
    const data = {
      pinataContent: metadata,
      pinataMetadata: {
        name: metadata.name || 'NFT Metadata',
      },
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add authentication
    if (PINATA_JWT) {
      headers['Authorization'] = `Bearer ${PINATA_JWT}`;
    } else if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      headers['pinata_api_key'] = PINATA_API_KEY;
      headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
    } else {
      throw new Error('Pinata credentials not configured');
    }

    const response = await axios.post(PINATA_PIN_JSON_URL, data, { headers });

    console.log('✅ Metadata uploaded to IPFS via Pinata:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('❌ Pinata metadata upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload metadata to IPFS via Pinata');
  }
}

/**
 * Get IPFS gateway URL
 * @param {string} hash - IPFS hash
 * @returns {string} Full gateway URL
 */
export function getIPFSUrl(hash) {
  // Sử dụng Pinata gateway hoặc public gateway
  if (process.env.PINATA_GATEWAY) {
    return `https://${process.env.PINATA_GATEWAY}/ipfs/${hash}`;
  }
  return `https://ipfs.io/ipfs/${hash}`;
}

export default {
  uploadToIPFS,
  uploadJSONToIPFS,
  getIPFSUrl,
};
