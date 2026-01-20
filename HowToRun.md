# 🚀 Hướng dẫn Deploy và Run NFT Marketplace

## Phần 1: Deploy Smart Contracts (Thành viên 1)

### Bước 1: Cài đặt dependencies
```powershell
cd d:\Blockchain\blockchain
& npm.cmd install
```

### Bước 2: Cấu hình .env
```powershell
copy .env.example .env
notepad .env
```

Điền thông tin:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Lấy Sepolia RPC:**
- Đăng ký: https://www.alchemy.com/
- Create App → Chọn Sepolia
- Copy API Key

**Lấy Sepolia ETH:**
- https://sepoliafaucet.com/
- Cần ~0.5 ETH

### Bước 3: Test
```powershell
& npm.cmd test
```

### Bước 4: Deploy
```powershell
& npm.cmd run deploy:sepolia
```

**Lưu lại 2 địa chỉ contracts:**
- NFT Contract Address: `0xABC...`
- Marketplace Contract Address: `0xDEF...`

### Bước 5: Verify (Optional)
```powershell
& npm.cmd run verify
```

---

## Phần 2: Run Frontend (Thành viên 2)

### Bước 1: Cài dependencies
```powershell
cd d:\Blockchain\frontend
& npm.cmd install
```

### Bước 2: Cập nhật Contract Addresses

**File:** `frontend/src/config/constants.js`
```javascript
export const NFT_CONTRACT_ADDRESS = '0xABC...'       // Từ deploy
export const NFT_MARKETPLACE_ADDRESS = '0xDEF...'   // Từ deploy
```

**File:** `frontend/src/config/contractABI.js`
- Copy ABI từ `blockchain/artifacts/contracts/NFT.sol/NFT.json`
- Copy ABI từ `blockchain/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json`

### Bước 3: Chạy dev server
```powershell
cd d:\Blockchain\frontend
& npm.cmd run dev
```

Mở: http://localhost:3000

### Bước 4: Connect MetaMask
1. Chuyển network sang **Sepolia**
2. Click "Connect Wallet"
3. Approve trong MetaMask

### Bước 5: Test Workflow
1. **Mint NFT:** `/create` → Upload ảnh → Mint
2. **List NFT:** `/profile` → Click NFT → List for Sale
3. **Buy NFT:** Switch account → `/` → Buy

---

## Quick Commands

**Backend (Smart Contracts):**
```powershell
cd d:\Blockchain\blockchain
& npm.cmd install          # Install
& npm.cmd test            # Run tests  
& npm.cmd run compile     # Compile contracts
& npm.cmd run deploy:sepolia  # Deploy
& npm.cmd run verify      # Verify on Etherscan
```

**Frontend:**
```powershell
cd d:\Blockchain\frontend
& npm.cmd install         # Install
& npm.cmd run dev         # Dev server (port 3000)
& npm.cmd run build       # Production build
& npm.cmd run preview     # Preview build
```

---

## Troubleshooting

**"Cannot find module"**
→ Run: `& npm.cmd install`

**"Insufficient funds"**
→ Get Sepolia ETH: https://sepoliafaucet.com/

**MetaMask không connect**
→ Check network là Sepolia (Chain ID: 11155111)

**Contract function fails**
→ Check Sepolia ETH balance, check approval

---

## Thông tin quan trọng

- **Network:** Sepolia Testnet
- **Chain ID:** 11155111
- **Block Explorer:** https://sepolia.etherscan.io/
- **Faucet:** https://sepoliafaucet.com/

Xem thêm chi tiết:
- `blockchain/README.md` - Smart Contracts documentation
- `blockchain/QUICKSTART.md` - Quick deploy guide
- `frontend/README.md` - Frontend documentation