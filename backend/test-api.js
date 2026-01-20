import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing Backend APIs...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', healthRes.data);
    console.log('');

    // Test 2: Get all NFTs (empty initially)
    console.log('2️⃣ Testing Get All NFTs...');
    const nftsRes = await axios.get(`${BASE_URL}/api/nft`);
    console.log('✅ NFTs:', nftsRes.data);
    console.log('');

    // Test 3: Cache a test NFT
    console.log('3️⃣ Testing Cache NFT...');
    const cacheRes = await axios.post(`${BASE_URL}/api/nft/cache`, {
      tokenId: '1',
      name: 'Test NFT',
      description: 'This is a test NFT testing',
      image: 'ipfs://QmTest...',
      price: '0.1',
      owner: '0xTestOwner...',
      seller: '0xTestSeller...'
    });
    console.log('✅ Cached NFT:', cacheRes.data);
    console.log('');

    // Test 4: Get user profile
    console.log('4️⃣ Testing Get User Profile...');
    const userRes = await axios.get(`${BASE_URL}/api/user/0xTestAddress`);
    console.log('✅ User Profile:', userRes.data);
    console.log('');

    // Test 5: Update user profile
    console.log('5️⃣ Testing Update User Profile...');
    const updateRes = await axios.post(`${BASE_URL}/api/user/0xTestAddress`, {
      username: 'testuser',
      bio: 'This is my bio',
      avatar: 'ipfs://QmAvatar...'
    });
    console.log('✅ Updated Profile:', updateRes.data);
    console.log('');

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBackend();
