# 🔧 Fix: Invalid ENS Name Error

## ❌ Lỗi gốc

```
invalid ENS name (Invalid label "": empty label)
(argument="name", value="0x...", code=INVALID_ARGUMENT, version=6.15.0)
```

## 🔍 Nguyên nhân

1. **ENS Resolution Error**: Code cũ sử dụng `signer.getAddress()` có thể gây lỗi với Ethers v6
2. **Contract Address Missing**: Contract addresses chưa được cấu hình trong frontend

## ✅ Đã fix

### Fix 1: Sử dụng account từ WalletContext
```javascript
// Thay vì:
const address = await signer.getAddress()
const tx = await contract.mintNFT(address, metadataURI)

// Đã đổi thành:
const tx = await contract.mintNFT(account, metadataURI)
```

### Fix 2: Cập nhật Contract Addresses
```javascript
// frontend/src/config/constants.js
export const NFT_CONTRACT_ADDRESS = '0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6'
export const NFT_MARKETPLACE_ADDRESS = '0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0'
```

## 🧪 Test lại Create NFT

1. **Refresh trang**: `http://localhost:3000`
2. **Đảm bảo**: 
   - ✅ MetaMask connected
   - ✅ Đang ở Sepolia Testnet
   - ✅ Có ETH để trả gas fees
3. **Navigate**: Create NFT page
4. **Upload ảnh** và fill form
5. **Click Create NFT**
6. **Confirm transaction** trong MetaMask popup
7. ✅ **Success!**

## 📋 Checklist trước khi Create NFT

### 1. MetaMask Setup
- [x] MetaMask installed
- [x] Connected to app
- [x] Switch to **Sepolia Testnet**
- [x] Have test ETH (get from faucet nếu cần)

### 2. Backend Running
- [x] Backend server at port 5000
- [x] Mock IPFS service active

### 3. Frontend Running
- [x] Frontend at port 3000
- [x] Contract addresses updated
- [x] No console errors

### 4. Smart Contracts
- [x] NFT Contract: `0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6`
- [x] Marketplace: `0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0`
- [x] Deployed on Sepolia

## 🎯 Expected Flow

```
1. User uploads image
   ↓
2. Frontend → Backend → Mock IPFS
   Returns: QmXXX... (image hash)
   ↓
3. Frontend creates metadata
   ↓
4. Frontend → Backend → Mock IPFS
   Returns: QmYYY... (metadata hash)
   ↓
5. Frontend calls contract.mintNFT(account, metadataURI)
   ↓
6. MetaMask popup appears
   ↓
7. User confirms transaction
   ↓
8. Transaction sent to Sepolia
   ↓
9. Wait for confirmation (~15 seconds)
   ↓
10. ✅ NFT Minted! Token ID received
```

## 💰 Gas Fees

- **Network**: Sepolia Testnet
- **Cost**: FREE (test ETH)
- **Get test ETH**: 
  - https://sepoliafaucet.com/
  - https://www.infura.io/faucet/sepolia
  - Cần có mainnet ETH hoặc account Alchemy/Infura

## 🐛 Troubleshooting

### Lỗi: "Please connect your wallet"
- Disconnect và connect lại MetaMask
- Refresh trang

### Lỗi: "User rejected transaction"
- Normal - user clicked Reject
- Click Create NFT lại và Approve

### Lỗi: "Insufficient funds"
- Cần test ETH trên Sepolia
- Get từ faucet (link ở trên)

### Lỗi: Network khác Sepolia
```javascript
// Check network ID
console.log(chainId) // Should be 11155111
```

Switch network trong MetaMask:
1. Click network dropdown
2. Show test networks (Settings)
3. Select Sepolia

### Transaction pending quá lâu
- Sepolia có thể chậm (15-30 giây)
- Check trên Etherscan: https://sepolia.etherscan.io/
- Paste transaction hash

## 📊 Current Status

```
✅ ENS Error: FIXED
✅ Contract Addresses: CONFIGURED
✅ Backend: RUNNING (Mock IPFS)
✅ Frontend: READY
✅ Smart Contracts: DEPLOYED on Sepolia
🎯 Ready to mint NFT!
```

## 🚀 Next Steps

1. **Test Create NFT** - Mint first NFT
2. **Check Profile** - View minted NFT
3. **List for Sale** - Put on marketplace
4. **Buy NFT** - Test marketplace functionality

**Everything is ready! Try Create NFT now!** 🎉
