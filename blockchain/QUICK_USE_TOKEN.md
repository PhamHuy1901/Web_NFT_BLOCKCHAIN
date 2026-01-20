# 🚀 Quick Start - Sử Dụng NFTToken

## ✅ Token Đã Deploy Thành Công!

```
🪙 Token: NFTToken (NFT)
📍 Address: 0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF
💰 Balance: 1,000,000 NFT
👤 Owner: 0xd19f7cF40D4a16013995BEa0AC444Ca13B13cbE1
🌐 Network: Hoodi (Chain ID: 560048)
```

---

## 🔗 THÊM TOKEN VÀO METAMASK (3 Bước)

### 1️⃣ Thêm Mạng Hoodi
```
Network Name: Hoodi Network
RPC URL: https://0xrpc.io/hoodi
Chain ID: 560048
Currency: ETH
```

### 2️⃣ Import Ví (Nếu Chưa Có)
```
Private Key: 0x5f6686bec8c40d1304879188c86d605d0df9e252b9643efbe63f7ec4bb682833
```

### 3️⃣ Import Token
```
Contract: 0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF
Symbol: NFT
Decimals: 18
```

**→ Xong! Token sẽ hiện 1,000,000 NFT trong ví** ✅

---

## 💸 TRANSFER TOKEN

### Cách 1: Qua MetaMask (Dễ Nhất)
1. Mở MetaMask
2. Chọn token **NFT**
3. Click **Send**
4. Nhập địa chỉ và số lượng
5. Confirm!

### Cách 2: Qua Script
```bash
# Interactive transfer
npx hardhat run scripts/transfer-token.js --network hoodi

# Check balance
npx hardhat run scripts/interact-token.js --network hoodi
```

---

## 📱 SỬ DỤNG TRONG WEBSITE

```javascript
// 1. Kết nối MetaMask
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// 2. Connect token contract
const tokenAddress = "0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF";
const abi = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];
const token = new ethers.Contract(tokenAddress, abi, signer);

// 3. Transfer
await token.transfer(recipientAddress, ethers.parseEther("100"));
```

---

## 🎯 Commands

```bash
# Xem balance
npx hardhat run scripts/interact-token.js --network hoodi

# Transfer token
npx hardhat run scripts/transfer-token.js --network hoodi

# Console
npx hardhat console --network hoodi
```

---

Chi tiết xem: [WALLET_GUIDE.md](WALLET_GUIDE.md)
