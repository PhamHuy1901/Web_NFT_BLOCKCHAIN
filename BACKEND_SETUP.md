# Hướng dẫn Setup Backend & IPFS

## Bước 1: Cài đặt IPFS Desktop

### Download IPFS Desktop (Khuyến nghị)
1. Truy cập: https://github.com/ipfs/ipfs-desktop/releases
2. Tải phiên bản mới nhất cho Windows: `IPFS-Desktop-Setup-x.x.x.exe`
3. Cài đặt và chạy IPFS Desktop
4. IPFS sẽ tự động chạy tại `http://localhost:5001`

### Cấu hình CORS cho IPFS
Mở Command Prompt hoặc PowerShell và chạy:

```powershell
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST", "PUT"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization", "Content-Type"]'
```

Sau đó restart IPFS Desktop.

## Bước 2: Chạy Backend Server

### Terminal 1: Backend Server

```powershell
cd backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

Bạn sẽ thấy:
```
🚀 Backend server running on http://localhost:5000
📡 API endpoints:
   - POST /api/upload - Upload file to IPFS
   - GET  /api/nft - Get cached NFT data
   - GET  /api/user/:address - Get user profile
```

## Bước 3: Chạy Frontend

### Terminal 2: Frontend

```powershell
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## Kiểm tra hoạt động

### 1. Kiểm tra Backend Health
Mở browser: `http://localhost:5000/health`

Kết quả:
```json
{
  "status": "ok",
  "message": "Backend service is running"
}
```

### 2. Kiểm tra IPFS
Mở browser: `http://localhost:5001/webui`

Bạn sẽ thấy IPFS Web UI.

### 3. Test Upload IPFS qua Backend

Sử dụng Postman hoặc curl:

```powershell
# Upload một file ảnh
curl -X POST http://localhost:5000/api/upload -F "file=@path/to/image.jpg"
```

Kết quả:
```json
{
  "success": true,
  "hash": "QmXXXX...",
  "url": "https://ipfs.io/ipfs/QmXXXX...",
  "size": 12345,
  "mimetype": "image/jpeg"
}
```

## Cấu trúc chạy đầy đủ

```
Terminal 1: Backend (Port 5000)
Terminal 2: Frontend (Port 3000)
Background: IPFS Desktop (Port 5001)
```

## Troubleshooting

### Lỗi: Cannot connect to IPFS
- Kiểm tra IPFS Desktop đang chạy
- Kiểm tra port 5001 không bị chiếm
- Restart IPFS Desktop

### Lỗi: Backend port already in use
- Thay đổi PORT trong `backend/.env`
- Hoặc stop process đang chiếm port 5000

### Lỗi: CORS error khi upload
- Chạy lại lệnh cấu hình CORS cho IPFS
- Restart IPFS Desktop
- Clear browser cache

## Flow hoạt động

1. **User chọn ảnh trên Frontend** (localhost:3000)
2. **Frontend gửi ảnh đến Backend** (localhost:5000/api/upload)
3. **Backend upload ảnh lên IPFS** (localhost:5001)
4. **IPFS trả về hash** (QmXXXX...)
5. **Backend trả hash về Frontend**
6. **Frontend sử dụng hash để mint NFT** trên Smart Contract

## Next Steps

Sau khi backend và IPFS đã chạy:

1. ✅ Login với MetaMask trên frontend
2. ✅ Navigate đến trang Create NFT
3. ✅ Upload ảnh và tạo NFT
4. ✅ Kiểm tra IPFS hash được tạo
5. ✅ Mint NFT với metadata từ IPFS

## Ghi chú quan trọng

- **Backend** xử lý upload IPFS để tránh CORS issues
- **In-memory cache** được sử dụng (data mất khi restart)
- Để production, cần tích hợp **MongoDB** cho persistent storage
- IPFS hash có thể mất 1-2 phút để propagate qua network
