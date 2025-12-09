# 🚀 Quick Start - Deploy Smart Contracts

## TL;DR - Cách deploy nhanh nhất

### 1. Cài đặt (2 phút)
```powershell
cd d:\Blockchain\blockchain
& npm.cmd install
```

### 2. Cấu hình (3 phút)
```powershell
# Copy file .env
copy .env.example .env
```

Edit `.env` file:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Lấy Sepolia RPC URL:**
1. Đăng ký tài khoản tại: https://www.alchemy.com/
2. Create new app → Chọn Sepolia
3. Copy API Key

**Lấy Private Key:**
1. Mở MetaMask
2. Account menu → Account details → Export private key
3. ⚠️ **NGUY HIỂM!** Không chia sẻ với ai!

**Lấy Sepolia ETH:**
https://sepoliafaucet.com/ (cần 0.5 Sepolia ETH)

### 3. Test Contracts (1 phút)
```powershell
& npm.cmd test
```

Phải thấy: `✓ 40+ passing tests`

### 4. Deploy to Sepolia (2 phút)
```powershell
& npm.cmd run deploy:sepolia
```

**Output sẽ cho bạn:**
```
NFT Contract Address:          0xABC123...
Marketplace Contract Address:  0xDEF456...
```

### 5. Copy sang Frontend (1 phút)

**File:** `d:\Blockchain\frontend\src\config\constants.js`
```javascript
export const NFT_CONTRACT_ADDRESS = '0xABC123...'
export const NFT_MARKETPLACE_ADDRESS = '0xDEF456...'
```

**File:** `d:\Blockchain\frontend\src\config\contractABI.js`
- Mở: `blockchain\artifacts\contracts\NFT.sol\NFT.json`
- Copy phần `"abi": [...]`
- Paste vào `NFT_ABI = [...]`
- Làm tương tự cho `NFTMarketplace.json`

### 6. Verify trên Etherscan (Optional, 2 phút)
```powershell
& npm.cmd run verify
```

## ✅ Done!

Bây giờ frontend có thể tương tác với contracts!

Test bằng cách:
1. Chạy frontend: `cd ..\frontend; & npm.cmd run dev`
2. Connect MetaMask
3. Try mint NFT
4. Try list và buy NFT

---

## 🆘 Gặp lỗi?

**"Cannot find module"**
→ Chạy: `& npm.cmd install`

**"Insufficient funds"**
→ Lấy Sepolia ETH: https://sepoliafaucet.com/

**"Invalid API Key"**
→ Check file `.env`, đảm bảo không có dấu cách thừa

**"execution reverted"**
→ Check balance, check approval

---

## 📝 Contract Functions Reference

### NFT Contract
```javascript
// Mint NFT mới
await nftContract.mintNFT(recipientAddress, "ipfs://...")

// Approve marketplace
await nftContract.approve(marketplaceAddress, tokenId)

// Check owner
await nftContract.ownerOf(tokenId)
```

### Marketplace Contract
```javascript
// List NFT
await marketplace.listNFT(tokenId, ethers.parseEther("1.0"))

// Buy NFT
await marketplace.buyNFT(tokenId, { value: ethers.parseEther("1.0") })

// Cancel listing
await marketplace.cancelListing(tokenId)

// Update price
await marketplace.updatePrice(tokenId, ethers.parseEther("2.0"))

// Get all listings
const listings = await marketplace.getAllListings()
```

---

**Need help?** Đọc full documentation trong `README.md`
