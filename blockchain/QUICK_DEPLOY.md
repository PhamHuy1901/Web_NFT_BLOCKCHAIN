# 🚀 Quick Start - Deploy Contract Mới

## Các Bước Nhanh (5 phút)

### 1️⃣ Cài đặt
```bash
cd d:\Blockchain\Web_NFT_BLOCKCHAIN\blockchain
npm install
```

### 2️⃣ Cấu hình .env
```bash
# Tạo file .env và điền:
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### 3️⃣ Compile
```bash
npx hardhat compile
```

### 4️⃣ Deploy
```bash
# Deploy cả NFT + Marketplace
npx hardhat ignition deploy ./ignition/modules/NFTMarketplace.js --network sepolia

# HOẶC dùng npm script:
npm run ignition:marketplace
```

### 5️⃣ Cập nhật Frontend
Sau khi nhận địa chỉ contract mới, cập nhật vào:
- `frontend/src/config/constants.js`
- `blockchain/deployments/sepolia.json`

---

## 📍 Vị Trí File Quan Trọng

```
blockchain/
├── ignition/modules/           # ⭐ DEPLOY FILES Ở ĐÂY
│   ├── NFT.js                 # Deploy chỉ NFT
│   └── NFTMarketplace.js      # Deploy NFT + Marketplace
│
├── contracts/                 # Smart contracts
│   ├── NFT.sol
│   └── NFTMarketplace.sol
│
├── .env                       # ⚙️ Cấu hình (KHÔNG commit)
└── hardhat.config.js          # Cấu hình Hardhat
```

---

## 🎯 Commands Thường Dùng

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npm run ignition:marketplace

# Test contracts
npx hardhat test

# Clean cache
npx hardhat clean
```

---

## 🆚 So Sánh Với Phương Pháp Bạn Quen

### ✅ Phương Pháp Bạn Quen (Ignition):
```bash
npm install --save-dev hardhat
npx hardhat init
npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/NFTMarketplace.js --network sepolia
```

### 🎯 Trong Dự Án Này:
```bash
# Bạn chỉ cần chạy 3 lệnh:
npm install                    # (1 lần đầu tiên)
npx hardhat compile            # Compile
npm run ignition:marketplace   # Deploy
```

**→ Đơn giản hơn vì đã setup sẵn!**

---

## 📞 Cần Trợ Giúp?

Xem hướng dẫn chi tiết tại: [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)
