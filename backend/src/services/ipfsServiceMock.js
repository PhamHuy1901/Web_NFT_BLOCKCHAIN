import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Mock IPFS Service - For testing without IPFS node
 * Tạo fake IPFS hash để test flow
 */

/**
 * Generate fake IPFS hash
 */
function generateFakeIPFSHash(buffer) {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return `Qm${hash.substring(0, 44)}`; // IPFS CIDv0 format
}

/**
 * Upload file buffer to "IPFS" (Mock)
 * @param {Buffer} fileBuffer - File data
 * @returns {Promise<string>} Fake IPFS hash
 */
export async function uploadToIPFS(fileBuffer) {
  try {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fakeHash = generateFakeIPFSHash(fileBuffer);
    console.log('✅ File uploaded to Mock IPFS:', fakeHash);
    console.log('⚠️  NOTE: This is a MOCK hash. Setup Pinata for real IPFS upload.');
    
    return fakeHash;
  } catch (error) {
    console.error('❌ Mock IPFS upload error:', error);
    throw new Error('Failed to upload file to Mock IPFS');
  }
}

/**
 * Upload JSON metadata to "IPFS" (Mock)
 * @param {Object} metadata - NFT metadata object
 * @returns {Promise<string>} Fake IPFS hash
 */
export async function uploadJSONToIPFS(metadata) {
  try {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const jsonString = JSON.stringify(metadata);
    const buffer = Buffer.from(jsonString);
    const fakeHash = generateFakeIPFSHash(buffer);
    
    console.log('✅ Metadata uploaded to Mock IPFS:', fakeHash);
    console.log('⚠️  NOTE: This is a MOCK hash. Setup Pinata for real IPFS upload.');
    
    return fakeHash;
  } catch (error) {
    console.error('❌ Mock IPFS metadata upload error:', error);
    throw new Error('Failed to upload metadata to Mock IPFS');
  }
}

/**
 * Get IPFS gateway URL
 * @param {string} hash - IPFS hash
 * @returns {string} Full gateway URL
 */
export function getIPFSUrl(hash) {
  return `https://ipfs.io/ipfs/${hash}`;
}

export default {
  uploadToIPFS,
  uploadJSONToIPFS,
  getIPFSUrl,
};
