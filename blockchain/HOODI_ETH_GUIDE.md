# 🚀 Deploy NFT Marketplace lên Hoodi Network (Sử dụng ETH)

## 🎯 Tổng Quan

NFT Marketplace của bạn đã được thiết kế để sử dụng **ETH (Ethereum native currency)** để thanh toán, KHÔNG sử dụng ERC20 token.

### Cách hoạt động:
- ✅ **Tạo NFT**: Miễn phí (chỉ mất gas fee)
- ✅ **List NFT**: Đặt giá bằng ETH (ví dụ: 0.1 ETH)
- ✅ **Mua NFT**: Người mua trả bằng ETH
- ✅ **Marketplace Fee**: 2.5% được trừ tự động (bằng ETH)

---

## 📋 Yêu Cầu Trước Khi Deploy

### 1. Kiểm tra ETH trong ví
```bash
cd d:/Blockchain/Web_NFT_BLOCKCHAIN/blockchain
npx hardhat run scripts/check-balance.js --network hoodi
```

**Cần có:** Ít nhất 0.01 ETH để deploy contracts

### 2. Nếu chưa có ETH
- Thêm mạng Hoodi vào MetaMask
- Import ví của bạn (private key trong .env)
- Tìm Hoodi faucet để lấy test ETH

---

## 🚀 Deploy NFT Marketplace

### Cách 1: Dùng Script Mới (Khuyên dùng)

```bash
# Deploy cả NFT + Marketplace với logging đẹp
npm run deploy:marketplace:hoodi
```

### Cách 2: Dùng Hardhat Ignition

```bash
# Deploy NFT + Marketplace
npm run ignition:marketplace:hoodi
```

---

## 📝 Sau Khi Deploy Thành Công

### 1. Bạn sẽ nhận được địa chỉ contracts:
```
NFT Contract:         0x...
Marketplace Contract: 0x...
```

### 2. Cập nhật Frontend
Mở file: `frontend/src/config/constants.js`

```javascript
export const NFT_CONTRACT_ADDRESS = '0x...' // Địa chỉ NFT Contract
export const NFT_MARKETPLACE_ADDRESS = '0x...' // Địa chỉ Marketplace Contract
export const HOODI_CHAIN_ID = 560048
```

### 3. Thêm Hoodi Network vào MetaMask

```
Network Name: Hoodi Network
RPC URL: https://0xrpc.io/hoodi
Chain ID: 560048
Currency Symbol: ETH
```

---

## 💰 Cách Sử Dụng Marketplace

### Cho Người Bán (Seller):

1. **Tạo NFT** (Mint)
   - Upload ảnh lên IPFS
   - Mint NFT (mất gas fee ETH)

2. **List NFT lên Marketplace**
   - Chọn NFT
   - Đặt giá bằng ETH (ví dụ: 0.5 ETH)
   - Approve marketplace (1 lần)
   - List NFT

3. **Nhận Tiền**
   - Khi NFT được bán, nhận 97.5% giá (2.5% là marketplace fee)
   - Tiền nhận bằng ETH tự động

### Cho Người Mua (Buyer):

1. **Tìm NFT**
   - Xem danh sách NFT đang bán

2. **Mua NFT**
   - Click "Buy"
   - Trả giá bằng ETH
   - NFT sẽ được chuyển vào ví của bạn

---

## 🔧 Cấu Trúc Smart Contract

### NFT.sol
```solidity
// ERC721 NFT contract
// Mint NFT với metadata từ IPFS
// Không liên quan đến payment
```

### NFTMarketplace.sol
```solidity
// Marketplace contract
function buyNFT(uint256 tokenId) external payable {
    // Nhận ETH từ buyer
    // Tính marketplace fee (2.5%)
    // Chuyển ETH cho seller
    // Transfer NFT cho buyer
}
```

**Key Points:**
- ✅ Hàm `buyNFT()` có modifier `payable` → nhận ETH
- ✅ `msg.value` chứa số ETH người mua gửi
- ✅ Không có gì liên quan đến ERC20 token
- ✅ 100% thanh toán bằng ETH native

---

## 📊 Thống Kê Marketplace

### Check thống kê:
```bash
npx hardhat console --network hoodi
```

```javascript
const marketplace = await ethers.getContractAt(
  "NFTMarketplace", 
  "0x..." // Địa chỉ marketplace của bạn
)

// Total volume (tổng khối lượng giao dịch)
await marketplace.totalVolume() // Bằng wei

// Total fees collected
await marketplace.totalFees()

// Current marketplace fee
await marketplace.marketplaceFee() // 250 = 2.5%

// Get all active listings
await marketplace.getAllListings()
```

---

## 🎨 Ví Dụ Workflow Hoàn Chỉnh

### 1. Alice tạo và bán NFT:
```
1. Alice mint NFT (artwork) → Mất 0.001 ETH gas
2. Alice list NFT với giá 1 ETH
3. Bob mua NFT với 1 ETH
4. Alice nhận: 0.975 ETH (1 - 2.5%)
5. Marketplace fee: 0.025 ETH
6. Bob sở hữu NFT
```

### 2. Bob bán lại NFT:
```
1. Bob list NFT với giá 1.5 ETH
2. Charlie mua với 1.5 ETH
3. Bob nhận: 1.4625 ETH (1.5 - 2.5%)
4. Charlie sở hữu NFT
```

---

## 🔐 Security Features

1. **ReentrancyGuard**: Chống reentrancy attack
2. **Ownable**: Chỉ owner mới withdraw fees
3. **Safe Transfers**: Dùng `call()` thay vì `transfer()`
4. **Input Validation**: Kiểm tra tất cả inputs

---

## 🆘 Troubleshooting

### Lỗi: "Insufficient payment"
→ Gửi đúng số ETH bằng giá NFT

### Lỗi: "Marketplace not approved"
→ Approve marketplace trước khi list:
```javascript
await nftContract.approve(marketplaceAddress, tokenId)
```

### Lỗi: "Not token owner"
→ Chỉ owner mới có thể list NFT

### Balance không đủ
→ Cần thêm ETH vào ví

---

## 📞 Commands Tổng Hợp

```bash
# Deploy marketplace
npm run deploy:marketplace:hoodi

# Check ETH balance
npm run check:balance

# Compile contracts
npx hardhat compile

# Test contracts
npx hardhat test

# Hardhat console
npx hardhat console --network hoodi
```

---

## 🎉 Kết Luận

Smart contract của bạn đã hoàn hảo cho việc sử dụng ETH:
- ✅ Không cần ERC20 token
- ✅ Thanh toán 100% bằng ETH
- ✅ An toàn và tối ưu
- ✅ Đơn giản cho người dùng

Chỉ cần deploy và bắt đầu sử dụng! 🚀
