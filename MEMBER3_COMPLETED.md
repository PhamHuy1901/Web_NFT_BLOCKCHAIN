# 🎯 Hướng dẫn Sử dụng Backend - Thành viên 3

## ✅ Hoàn thành

Tôi đã thiết lập hoàn chỉnh Backend Service cho NFT Marketplace với các tính năng:

### 1. 📦 Backend Server (Node.js + Express)
- ✅ Server Express chạy tại `http://localhost:5000`
- ✅ CORS enabled cho frontend
- ✅ Error handling middleware
- ✅ Health check endpoint

### 2. 🌐 IPFS Service
- ✅ Upload file/ảnh lên IPFS
- ✅ Upload metadata JSON lên IPFS
- ✅ Trả về IPFS hash và gateway URL
- ✅ Hỗ trợ cả local IPFS node và Pinata cloud

### 3. 💾 Caching System
- ✅ Cache NFT data (in-memory)
- ✅ GET/POST/DELETE operations
- ✅ Tăng tốc độ truy vấn NFT

### 4. 👤 User Profile Management
- ✅ Lưu trữ user profile (username, bio, avatar)
- ✅ Like/Unlike NFT functionality
- ✅ Track user interactions

### 5. 🔗 Frontend Integration
- ✅ Update `useIPFS` hook
- ✅ Tạo `backendAPI.js` service
- ✅ Frontend sẵn sàng gọi backend API

---

## 🚀 Cách Sử dụng

### Bước 1: Start Backend Server

Mở terminal và chạy:

```powershell
cd backend
npm run dev
```

Server sẽ hiển thị:
```
🚀 Backend server running on http://localhost:5000
📡 API endpoints:
   - POST /api/upload - Upload file to IPFS
   - GET  /api/nft - Get cached NFT data
   - GET  /api/user/:address - Get user profile
```

### Bước 2: Kiểm tra Backend hoạt động

Mở browser: `http://localhost:5000/health`

Bạn sẽ thấy:
```json
{
  "status": "ok",
  "message": "Backend service is running"
}
```

### Bước 3: Chạy Frontend (terminal mới)

```powershell
cd frontend
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

---

## 📡 API Endpoints

### 1. Upload Image to IPFS
```
POST http://localhost:5000/api/upload
Content-Type: multipart/form-data

Body:
- file: [image file]

Response:
{
  "success": true,
  "hash": "QmXXXX...",
  "url": "https://ipfs.io/ipfs/QmXXXX...",
  "size": 12345,
  "mimetype": "image/png"
}
```

### 2. Upload Metadata to IPFS
```
POST http://localhost:5000/api/upload/metadata
Content-Type: application/json

Body:
{
  "name": "My NFT",
  "description": "Description",
  "imageHash": "QmXXXX...",
  "attributes": []
}

Response:
{
  "success": true,
  "hash": "QmYYYY...",
  "url": "https://ipfs.io/ipfs/QmYYYY...",
  "metadata": {...}
}
```

### 3. Get All NFTs (Cached)
```
GET http://localhost:5000/api/nft

Response:
{
  "success": true,
  "count": 5,
  "nfts": [...]
}
```

### 4. Cache NFT Data
```
POST http://localhost:5000/api/nft/cache

Body:
{
  "tokenId": "1",
  "name": "NFT Name",
  "description": "...",
  "image": "ipfs://QmXXX",
  "price": "0.1",
  "owner": "0xABC...",
  "seller": "0xDEF..."
}
```

### 5. User Profile APIs
```
GET  http://localhost:5000/api/user/:address
POST http://localhost:5000/api/user/:address
POST http://localhost:5000/api/user/:address/like/:tokenId
```

---

## 🔧 Cấu hình IPFS

### Option 1: Không cần IPFS local (Khuyến nghị)

Backend sẽ fallback sang mock data nếu không có IPFS. Hoặc sử dụng Pinata:

1. Đăng ký tài khoản miễn phí: https://www.pinata.cloud/
2. Lấy API keys
3. Cập nhật file `backend/.env`:

```
PINATA_JWT=your_jwt_token
```

### Option 2: Sử dụng IPFS Desktop

1. Tải IPFS Desktop: https://github.com/ipfs/ipfs-desktop/releases
2. Cài đặt và chạy
3. IPFS sẽ chạy tại `http://localhost:5001`

---

## 📂 Cấu trúc Backend

```
backend/
├── src/
│   ├── server.js              # Main server file
│   ├── routes/
│   │   ├── upload.js          # IPFS upload routes
│   │   ├── nft.js             # NFT caching routes
│   │   └── user.js            # User profile routes
│   └── services/
│       ├── ipfsService.js     # Local IPFS service
│       └── ipfsServicePinata.js # Pinata cloud IPFS
├── .env                       # Environment variables
├── .env.example               # Example config
└── package.json
```

---

## 🎓 Cách Frontend sử dụng Backend

### Example: Upload ảnh từ Frontend

```javascript
import { useIPFS } from '../hooks/useIPFS'

function CreateNFT() {
  const { uploadToIPFS } = useIPFS()
  
  const handleUpload = async (file) => {
    const result = await uploadToIPFS(file)
    console.log('IPFS Hash:', result.ipfsHash)
    console.log('IPFS URL:', result.ipfsUrl)
  }
}
```

### Example: Cache NFT data

```javascript
import { cacheNFTData } from '../services/backendAPI'

await cacheNFTData({
  tokenId: '1',
  name: 'My NFT',
  image: 'ipfs://QmXXX',
  price: '0.1',
  owner: walletAddress
})
```

---

## 🌟 Flow hoạt động hoàn chỉnh

```
User action trên Frontend (localhost:3000)
    ↓
Frontend gọi backendAPI.js
    ↓
Backend nhận request (localhost:5000)
    ↓
Backend xử lý và upload lên IPFS
    ↓
IPFS trả về hash
    ↓
Backend cache data và trả về Frontend
    ↓
Frontend sử dụng hash để mint NFT
    ↓
Smart Contract lưu tokenId + IPFS hash
```

---

## 📝 Next Steps

Giờ bạn có thể:

1. ✅ **Test upload ảnh** trên trang Create NFT
2. ✅ **Mint NFT** với metadata từ IPFS
3. ✅ **View NFT** với data được cache từ backend
4. ✅ **Like NFT** và lưu vào user profile
5. 🔜 **Optional**: Tích hợp MongoDB cho persistent storage

---

## ⚠️ Troubleshooting

### Backend không chạy được
- Kiểm tra port 5000 không bị chiếm
- Chạy: `npm install` trong thư mục backend
- Kiểm tra file `.env` đã tồn tại

### IPFS upload lỗi
- Nếu dùng local IPFS: Kiểm tra IPFS Desktop đang chạy
- Nếu không có IPFS: Sử dụng Pinata (miễn phí)
- Backend sẽ báo lỗi rõ ràng trong console

### Frontend không kết nối được backend
- Kiểm tra backend đang chạy tại port 5000
- Kiểm tra `constants.js`: `API_BASE_URL = 'http://localhost:5000/api'`
- Xem CORS có được enable trong backend

---

## 📚 Tài liệu tham khảo

- **IPFS Docs**: https://docs.ipfs.tech/
- **Pinata Docs**: https://docs.pinata.cloud/
- **Express.js**: https://expressjs.com/
- **Backend README**: `backend/README.md`

---

## 👥 Vai trò Thành viên 3 - Hoàn thành ✅

- [x] Xử lý IPFS upload service
- [x] Tạo backend API endpoints
- [x] Implement caching system
- [x] User profile management
- [x] Tích hợp frontend với backend
- [x] Documentation và testing
- [ ] Optional: MongoDB integration (nếu cần persistent storage)

**Status**: Backend đã sẵn sàng cho development và testing! 🎉
