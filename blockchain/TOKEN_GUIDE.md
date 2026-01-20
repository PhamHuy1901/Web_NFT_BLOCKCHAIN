# 🪙 Tạo Token ERC20 "NFTToken" (NFT)

## 📋 Thông Tin Token

- **Token Name:** NFTToken
- **Symbol:** NFT  
- **Decimals:** 18 (mặc định)
- **Initial Supply:** 1,000,000 NFT
- **Owner:** 0xd19f7cF40D4a16013995BEa0AC444Ca13B13cbE1

---

## 🚀 Các Bước Deploy Token

### ✅ Đã Hoàn Thành:
- ✅ Contract NFTToken.sol đã được tạo
- ✅ Ignition module đã được tạo
- ✅ Contract đã compile thành công

### 📝 Cần Làm Tiếp:

#### **Option 1: Deploy trên Local Hardhat Network (Test)**

```bash
# Bước 1: Khởi động local node (Terminal 1)
npx hardhat node

# Bước 2: Deploy token (Terminal 2)
npx hardhat ignition deploy ./ignition/modules/NFTToken.js --network localhost
```

**Lợi ích:** Không cần test ETH, deploy ngay được!

---

#### **Option 2: Deploy trên Hoodi Network (Production)**

```bash
# Deploy token lên Hoodi
npm run ignition:token:hoodi
```

**⚠️ Yêu cầu:** Cần có ETH trong ví `0xd19f7cf40d4a16013995bea0ac444ca13b13cbe1`

**Cách lấy Test ETH cho Hoodi:**
1. Thêm mạng Hoodi vào MetaMask:
   - Network Name: `Hoodi Network`
   - RPC URL: `https://0xrpc.io/hoodi`
   - Chain ID: `560048`
   - Currency Symbol: `ETH`

2. Import ví bằng Private Key:
   ```
   0x5f6686bec8c40d1304879188c86d605d0df9e252b9643efbe63f7ec4bb682833
   ```

3. Tìm Hoodi Faucet:
   - Google: "Hoodi testnet faucet"
   - Hoặc liên hệ Hoodi team

4. Request test ETH (cần ít nhất 0.01 ETH)

---

## 🔧 Commands Hữu Ích

```bash
# Compile contracts
npx hardhat compile

# Kiểm tra balance
npx hardhat run scripts/check-balance.js --network hoodi

# Deploy token trên local
npx hardhat ignition deploy ./ignition/modules/NFTToken.js --network localhost

# Deploy token trên Hoodi
npm run ignition:token:hoodi

# Test contracts
npx hardhat test
```

---

## 📊 Sau Khi Deploy Thành Công

Bạn sẽ nhận được:
- ✅ Địa chỉ contract của NFTToken
- ✅ 1,000,000 NFT tokens trong ví của bạn
- ✅ Token có thể transfer, approve, và sử dụng như bất kỳ ERC20 token nào

### Để sử dụng token:

1. **Thêm token vào MetaMask:**
   - Vào MetaMask → Import Tokens
   - Paste địa chỉ contract
   - Symbol: NFT
   - Decimals: 18

2. **Transfer token:**
   ```javascript
   await nftToken.transfer(recipientAddress, amount);
   ```

3. **Check balance:**
   ```javascript
   await nftToken.balanceOf(yourAddress);
   ```

---

## 🧪 Test Trên Local Network (Khuyên Dùng Trước)

Để test mà không cần test ETH:

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npx hardhat ignition deploy ./ignition/modules/NFTToken.js --network localhost

# Kiểm tra token đã deploy
npx hardhat console --network localhost
> const NFTToken = await ethers.getContractFactory("NFTToken")
> const token = await NFTToken.attach("CONTRACT_ADDRESS")
> await token.name()
> await token.symbol()
> await token.totalSupply()
```

---

## 📁 File Đã Tạo

- [contracts/NFTToken.sol](contracts/NFTToken.sol) - Smart contract ERC20
- [ignition/modules/NFTToken.js](ignition/modules/NFTToken.js) - Deploy module

---

## 🆚 So Sánh ERC20 vs ERC721

| ERC20 (Token) | ERC721 (NFT) |
|---------------|--------------|
| Fungible (có thể thay thế) | Non-fungible (duy nhất) |
| Ví dụ: 100 NFT = 100 NFT | Mỗi NFT là độc nhất |
| Dùng làm tiền tệ | Dùng làm tài sản số |
| Balance (số lượng) | TokenID (định danh) |

**Token của bạn là ERC20**, nên có thể dùng như tiền tệ!

---

## 🎉 Kết Luận

Bạn đã sẵn sàng deploy token NFT! Chọn:
- **Local test:** An toàn, nhanh, không cần ETH
- **Hoodi network:** Thật, cần test ETH

Gợi ý: Test trên local trước, sau đó deploy lên Hoodi khi có ETH! 🚀
