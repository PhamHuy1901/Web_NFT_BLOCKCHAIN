import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';

dotenv.config();

// Configure IPFS client
const ipfsClient = create({
  host: process.env.IPFS_HOST || 'localhost',
  port: process.env.IPFS_PORT || 5001,
  protocol: process.env.IPFS_PROTOCOL || 'http'
});

/**
 * Upload file buffer to IPFS
 * @param {Buffer} fileBuffer - File data
 * @returns {Promise<string>} IPFS hash
 */
export async function uploadToIPFS(fileBuffer) {
  try {
    const result = await ipfsClient.add(fileBuffer);
    console.log('✅ File uploaded to IPFS:', result.path);
    return result.path; // Returns the IPFS hash (CID)
  } catch (error) {
    console.error('❌ IPFS upload error:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Upload JSON metadata to IPFS
 * @param {Object} metadata - NFT metadata object
 * @returns {Promise<string>} IPFS hash
 */
export async function uploadJSONToIPFS(metadata) {
  try {
    const jsonString = JSON.stringify(metadata);
    const result = await ipfsClient.add(jsonString);
    console.log('✅ Metadata uploaded to IPFS:', result.path);
    return result.path;
  } catch (error) {
    console.error('❌ IPFS metadata upload error:', error);
    throw new Error('Failed to upload metadata to IPFS');
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

export default ipfsClient;
