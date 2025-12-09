# NFT Marketplace Backend

Backend service cho NFT Marketplace - Xử lý IPFS upload và data caching.

## 🚀 Tính năng

### 1. IPFS Service
- Upload ảnh lên IPFS
- Upload metadata JSON lên IPFS
- Trả về IPFS hash và gateway URL

### 2. NFT Caching
- Cache dữ liệu NFT để truy vấn nhanh hơn
- Tránh phải query blockchain liên tục
- CRUD operations cho cached data

### 3. User Profile Management
- Lưu thông tin user profile (username, bio, avatar)
- Quản lý lượt like NFT
- Theo dõi hoạt động user

## 📦 Cài đặt

```bash
cd backend
npm install
```

## ⚙️ Cấu hình

Tạo file `.env` từ `.env.example`:

```bash
copy .env.example .env
```

Cấu hình các biến môi trường:
- `PORT`: Cổng backend server (mặc định: 5000)
- `IPFS_HOST`, `IPFS_PORT`: Cấu hình IPFS node

## 🏃 Chạy server

### Development mode (với nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📡 API Endpoints

### Upload APIs

#### Upload ảnh lên IPFS
```
POST /api/upload
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

#### Upload metadata lên IPFS
```
POST /api/upload/metadata
Content-Type: application/json

Body:
{
  "name": "My NFT",
  "description": "NFT description",
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

### NFT APIs

#### Lấy tất cả NFT (cached)
```
GET /api/nft

Response:
{
  "success": true,
  "count": 10,
  "nfts": [...]
}
```

#### Lấy NFT theo tokenId
```
GET /api/nft/:tokenId
```

#### Cache NFT data
```
POST /api/nft/cache

Body:
{
  "tokenId": "1",
  "name": "NFT Name",
  "description": "...",
  "image": "ipfs://...",
  "price": "0.1",
  "owner": "0xABC...",
  "seller": "0xDEF..."
}
```

### User APIs

#### Lấy user profile
```
GET /api/user/:address
```

#### Cập nhật user profile
```
POST /api/user/:address

Body:
{
  "username": "myusername",
  "bio": "My bio",
  "avatar": "ipfs://..."
}
```

#### Like/Unlike NFT
```
POST /api/user/:address/like/:tokenId
```

## 🔧 Cấu hình IPFS

### Option 1: IPFS Desktop (Khuyến nghị cho development)
1. Tải IPFS Desktop: https://github.com/ipfs/ipfs-desktop/releases
2. Cài đặt và chạy
3. IPFS API sẽ chạy tại `http://localhost:5001`

### Option 2: IPFS CLI
```bash
# Cài đặt IPFS
# Download từ: https://dist.ipfs.tech/#go-ipfs

# Khởi tạo
ipfs init

# Chạy daemon
ipfs daemon
```

### Option 3: Sử dụng Pinata/Infura (Production)
Thay đổi cấu hình trong `src/services/ipfsService.js` để sử dụng API của Pinata hoặc Infura.

## 📝 Ghi chú

- Backend sử dụng in-memory storage cho cache và user data
- Để production, nên tích hợp MongoDB (code đã chuẩn bị sẵn)
- IPFS upload yêu cầu IPFS node đang chạy
- CORS đã được enable để frontend có thể gọi API

## 🔗 Tích hợp với Frontend

Frontend cần gọi API backend thay vì upload trực tiếp lên IPFS:

```javascript
// Upload image
const formData = new FormData();
formData.append('file', file);

const response = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData
});

const { hash, url } = await response.json();
```

## 🐛 Troubleshooting

**IPFS connection error:**
- Kiểm tra IPFS daemon đang chạy
- Kiểm tra cấu hình CORS trong IPFS: 
  ```bash
  ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
  ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST"]'
  ```

**Port already in use:**
- Thay đổi PORT trong file `.env`
