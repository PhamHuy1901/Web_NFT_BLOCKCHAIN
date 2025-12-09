# 🔗 Smart Contracts - NFT Marketplace

Smart Contracts cho dự án NFT Marketplace được viết bằng Solidity và deploy lên Sepolia Testnet.

## 📦 Contracts

### 1. NFT.sol (ERC-721)
Contract chính cho NFT tokens với các tính năng:
- ✅ **Mint NFT** với metadata URI (IPFS)
- ✅ **Transfer** NFT giữa các địa chỉ
- ✅ **Track creator** của mỗi NFT
- ✅ **Token enumeration** - lấy danh sách NFT của owner
- ✅ **ERC-721 standard compliant**

**Các function chính:**
```solidity
function mintNFT(address recipient, string memory tokenURI) external returns (uint256)
function totalSupply() external view returns (uint256)
function getCreator(uint256 tokenId) external view returns (address)
function tokensOfOwner(address owner) external view returns (uint256[] memory)
```

### 2. NFTMarketplace.sol
Contract marketplace cho phép mua bán NFT:
- ✅ **List NFT** với giá xác định
- ✅ **Buy NFT** với atomic swap (ETH ↔ NFT)
- ✅ **Cancel listing**
- ✅ **Update price** của listing
- ✅ **Marketplace fee** (2.5% mặc định)
- ✅ **Fee management** cho owner
- ✅ **Reentrancy protection**

**Các function chính:**
```solidity
function listNFT(uint256 tokenId, uint256 price) external
function buyNFT(uint256 tokenId) external payable
function cancelListing(uint256 tokenId) external
function updatePrice(uint256 tokenId, uint256 newPrice) external
function getNFTListing(uint256 tokenId) external view returns (...)
function getAllListings() external view returns (Listing[] memory)
```

## 🚀 Setup & Installation

### Bước 1: Cài đặt dependencies

```bash
cd blockchain
npm install
```

Dependencies bao gồm:
- Hardhat - Development framework
- OpenZeppelin Contracts - Standard implementations
- Ethers.js v6 - Ethereum library
- Chai - Testing framework

### Bước 2: Cấu hình Environment

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:

```env
# 1. Lấy Sepolia RPC URL từ Alchemy hoặc Infura
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# 2. Private key của ví để deploy (KHÔNG COMMIT!)
PRIVATE_KEY=your_private_key_here

# 3. Etherscan API key để verify contracts
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ QUAN TRỌNG:**
- **KHÔNG BAO GIỜ** commit file `.env` lên Git
- Ví phải có Sepolia ETH để trả gas fee
- Lấy Sepolia ETH từ faucet: https://sepoliafaucet.com/

### Bước 3: Compile Contracts

```bash
npm run compile
```

Output sẽ tạo folder `artifacts/` chứa ABI và bytecode.

### Bước 4: Run Tests

```bash
npm test
```

Test suite bao gồm:
- ✅ 40+ test cases
- ✅ NFT minting, transfers, approvals
- ✅ Marketplace listing, buying, canceling
- ✅ Fee calculations
- ✅ Access control
- ✅ Edge cases và security

**Expected output:**
```
NFT Contract
  ✓ Should mint NFT successfully
  ✓ Should not mint to zero address
  ... (40+ tests)

NFTMarketplace Contract
  ✓ Should list NFT successfully
  ✓ Should buy NFT successfully
  ... (40+ tests)
```

## 🌐 Deployment

### Deploy lên Sepolia Testnet

```bash
npm run deploy:sepolia
```

Script sẽ:
1. Deploy NFT Contract
2. Deploy NFTMarketplace Contract
3. Lưu deployment info vào `deployments/sepolia.json`
4. Hiển thị contract addresses

**Output mẫu:**
```
🚀 Starting deployment...
📝 Deploying contracts with account: 0x1234...
💰 Account balance: 0.5 ETH

✅ NFT Contract deployed to: 0xABC...
✅ NFTMarketplace Contract deployed to: 0xDEF...

📋 DEPLOYMENT SUMMARY
====================================
NFT Contract Address:          0xABC...
Marketplace Contract Address:  0xDEF...
Network:                       sepolia
====================================
```

### Verify Contracts trên Etherscan

```bash
npm run verify
```

Hoặc manual:
```bash
npx hardhat verify --network sepolia <NFT_ADDRESS>
npx hardhat verify --network sepolia <MARKETPLACE_ADDRESS> <NFT_ADDRESS>
```

## 📝 Sau khi Deploy

### 1. Copy Contract Addresses

Từ file `deployments/sepolia.json`, copy addresses vào frontend:

**File:** `frontend/src/config/constants.js`
```javascript
export const NFT_CONTRACT_ADDRESS = '0xABC...' // Địa chỉ NFT contract
export const NFT_MARKETPLACE_ADDRESS = '0xDEF...' // Địa chỉ Marketplace contract
```

### 2. Copy ABIs

Copy ABI từ compiled contracts sang frontend:

**From:**
- `artifacts/contracts/NFT.sol/NFT.json`
- `artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json`

**To:**
- `frontend/src/config/contractABI.js`

**Cách copy:**
```javascript
// Mở file artifacts/contracts/NFT.sol/NFT.json
// Copy phần "abi": [...]

// Paste vào frontend/src/config/contractABI.js
export const NFT_ABI = [
  // ... paste ABI here
]
```

### 3. Test trên Sepolia

1. Truy cập Etherscan Sepolia: https://sepolia.etherscan.io/
2. Tìm contract addresses
3. Xem transactions và events
4. Test các functions trực tiếp trên Etherscan

## 🔧 Development Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Run tests with gas report
REPORT_GAS=true npm test

# Deploy to local network
npx hardhat run scripts/deploy.js

# Deploy to Sepolia
npm run deploy:sepolia

# Verify contracts
npm run verify

# Clean artifacts
npx hardhat clean

# Run Hardhat console
npx hardhat console --network sepolia
```

## 📊 Contract Architecture

```
┌─────────────────┐
│   NFT Contract  │ (ERC-721)
│                 │
│ - mint()        │
│ - transfer()    │
│ - approve()     │
└────────┬────────┘
         │
         │ References
         ↓
┌─────────────────────┐
│ Marketplace Contract│
│                     │
│ - listNFT()         │
│ - buyNFT()          │ ← Atomic Swap (ETH ↔ NFT)
│ - cancelListing()   │
│ - updatePrice()     │
└─────────────────────┘
```

## 🔒 Security Features

1. **ReentrancyGuard** - Chống reentrancy attacks
2. **Ownable** - Access control cho admin functions
3. **Input Validation** - Check tất cả inputs
4. **Safe Transfers** - Sử dụng `safeTransferFrom`
5. **Atomic Swaps** - Giao dịch mua/bán là atomic
6. **Fee Limits** - Max marketplace fee 10%

## 💰 Gas Optimization

- ✅ Using `Counters` library
- ✅ Efficient storage patterns
- ✅ Minimal loops
- ✅ Events for off-chain indexing
- ✅ Optimizer enabled (200 runs)

## 📈 Test Coverage

Run coverage report:
```bash
npx hardhat coverage
```

Target coverage: >90%

## 🐛 Troubleshooting

### Lỗi: "Insufficient funds"
**Giải pháp:** Lấy Sepolia ETH từ faucet:
- https://sepoliafaucet.com/
- https://sepolia-faucet.pk910.de/

### Lỗi: "Nonce too high"
**Giải pháp:** Reset account trên MetaMask:
Settings → Advanced → Clear activity tab data

### Lỗi: "Already Verified"
**Giải pháp:** Contract đã được verify rồi, không cần verify lại

### Lỗi: "Invalid API Key"
**Giải pháp:** Kiểm tra `ETHERSCAN_API_KEY` trong `.env`

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Sepolia Testnet](https://sepolia.dev/)

## 🎯 Checklist Trước Khi Deploy

- [ ] Đã test tất cả functions
- [ ] Đã có Sepolia ETH trong ví
- [ ] Đã cấu hình `.env` file
- [ ] Đã review code contracts
- [ ] Đã kiểm tra gas costs
- [ ] Đã backup private key an toàn
- [ ] Đã chuẩn bị verify trên Etherscan

## 📞 Next Steps

Sau khi deploy thành công:

1. ✅ Copy contract addresses sang frontend
2. ✅ Copy ABIs sang frontend
3. ✅ Verify contracts trên Etherscan
4. ✅ Test mint NFT từ frontend
5. ✅ Test list và buy NFT
6. ✅ Document contract addresses cho team

## 🏆 Features Completed

- ✅ NFT Contract (ERC-721)
- ✅ Marketplace Contract
- ✅ Comprehensive Tests (40+ cases)
- ✅ Deployment Scripts
- ✅ Verification Scripts
- ✅ Gas Optimization
- ✅ Security Measures
- ✅ Documentation

**Smart Contracts hoàn chỉnh 100%!** 🎉
