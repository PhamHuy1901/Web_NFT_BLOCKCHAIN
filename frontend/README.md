# NFT Marketplace - Frontend

Frontend application cho NFT Marketplace được xây dựng với React, Vite và Web3 integration.

## 🚀 Công nghệ sử dụng

- **React 18** - UI Library
- **Vite** - Build tool
- **Ethers.js v6** - Web3 library để tương tác với Ethereum
- **React Router** - Routing
- **Axios** - HTTP client

## 📁 Cấu trúc dự án

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── NFTCard.jsx
│   │   ├── NFTGrid.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── contexts/        # React Context (Global state)
│   │   └── WalletContext.jsx
│   ├── hooks/           # Custom hooks
│   │   ├── useNFTContract.js
│   │   ├── useMarketplace.js
│   │   └── useIPFS.js
│   ├── pages/           # Page components
│   │   ├── HomePage.jsx
│   │   ├── CreateNFT.jsx
│   │   ├── NFTDetail.jsx
│   │   └── Profile.jsx
│   ├── config/          # Configuration
│   │   ├── constants.js
│   │   └── contractABI.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2. Cấu hình

Sau khi Smart Contract được deploy, cập nhật các địa chỉ contract trong `src/config/constants.js`:

```javascript
export const NFT_MARKETPLACE_ADDRESS = '0x...' // Địa chỉ Marketplace contract
export const NFT_CONTRACT_ADDRESS = '0x...'    // Địa chỉ NFT contract
```

Cập nhật ABI trong `src/config/contractABI.js` sau khi compile Smart Contract.

### 3. Chạy development server

```bash
npm run dev

'''
Chạy dev server:
powershell
cd d:\Blockchain\frontend
& npm.cmd run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 📖 Các tính năng chính

### 1. Kết nối ví MetaMask (WalletContext)
- Tự động phát hiện MetaMask
- Kết nối/ngắt kết nối ví
- Hiển thị địa chỉ ví và số dư
- Lắng nghe thay đổi tài khoản và network

### 2. Tạo NFT (CreateNFT Page)
- Upload ảnh lên IPFS
- Tạo metadata
- Mint NFT trên blockchain

### 3. Marketplace (HomePage)
- Hiển thị danh sách NFT đang bán
- Mua NFT
- Xem chi tiết NFT

### 4. Quản lý NFT (Profile Page)
- Xem NFT đang sở hữu
- Xem NFT đang list bán
- Hủy listing

### 5. Chi tiết NFT (NFTDetail Page)
- Xem thông tin chi tiết NFT
- List NFT for sale
- Mua NFT
- Hủy listing (nếu là owner)

## 🎨 Components

### Header
- Navigation bar với kết nối wallet
- Hiển thị số dư và địa chỉ ví

### NFTCard
- Card hiển thị thông tin NFT
- Actions: Buy, List, Cancel listing

### NFTGrid
- Grid layout để hiển thị danh sách NFT
- Loading và empty states

### LoadingSpinner
- Loading indicator cho các async operations

### ErrorMessage
- Hiển thị thông báo lỗi với khả năng dismiss

## 🔗 Custom Hooks

### useWallet
```javascript
const { 
  account, 
  balance, 
  isConnected, 
  connectWallet, 
  disconnectWallet 
} = useWallet()
```

### useNFTContract
```javascript
const { 
  mintNFT, 
  getNFTMetadata, 
  approveMarketplace 
} = useNFTContract()
```

### useMarketplace
```javascript
const { 
  listNFT, 
  buyNFT, 
  cancelListing, 
  getAllListings 
} = useMarketplace()
```

### useIPFS
```javascript
const { 
  uploadToIPFS, 
  uploadMetadata 
} = useIPFS()
```

## 🌐 Tích hợp với Backend

Frontend kết nối với Backend API để:
- Upload file lên IPFS
- Lấy metadata từ IPFS
- Query dữ liệu đã được index

Backend API URL được cấu hình trong `src/config/constants.js`:
```javascript
export const API_BASE_URL = 'http://localhost:5000/api'
```

## 📝 Workflow sử dụng

### Mint NFT mới:
1. Kết nối ví MetaMask
2. Đi đến trang "Create NFT"
3. Upload ảnh và điền thông tin
4. Xác nhận transaction trong MetaMask
5. Chờ NFT được mint

### List NFT for sale:
1. Đi đến trang "My Profile"
2. Click vào NFT muốn bán
3. Click "List for Sale"
4. Nhập giá (ETH)
5. Approve marketplace (transaction 1)
6. Confirm listing (transaction 2)

### Mua NFT:
1. Browse marketplace
2. Click vào NFT muốn mua
3. Click "Buy Now"
4. Xác nhận transaction trong MetaMask

## ⚠️ Lưu ý quan trọng

1. **MetaMask**: Phải cài đặt MetaMask extension
2. **Network**: Đảm bảo đang kết nối đúng network (Sepolia Testnet)
3. **Gas Fee**: Cần có ETH trong ví để trả phí gas
4. **Contract Addresses**: Phải update địa chỉ contract sau khi deploy
5. **IPFS**: Backend phải chạy để upload file lên IPFS

## 🐛 Troubleshooting

### MetaMask không kết nối được:
- Kiểm tra MetaMask đã được cài đặt
- Refresh trang
- Kiểm tra console để xem lỗi

### Transaction failed:
- Kiểm tra gas fee
- Kiểm tra network đúng chưa
- Kiểm tra đủ balance không

### NFT không hiển thị:
- Kiểm tra contract address đã đúng chưa
- Kiểm tra backend có chạy không
- Xem console logs

## 🚀 Build cho Production

```bash
npm run build
```

Build output sẽ nằm trong thư mục `dist/`

## 📚 Tài liệu tham khảo

- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 👥 Phân công nhiệm vụ

**Thành viên 2** chịu trách nhiệm:
- ✅ Thiết kế giao diện UI/UX
- ✅ Tích hợp Web3 (Ethers.js)
- ✅ Kết nối MetaMask
- ✅ Xử lý logic hiển thị NFT
- ✅ Loading & Error handling
- ✅ Responsive design

## 📞 Support

Nếu gặp vấn đề, liên hệ team leader hoặc tạo issue trên GitHub.
