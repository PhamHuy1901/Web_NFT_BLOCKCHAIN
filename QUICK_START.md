# 🚀 Quick Start - Backend Testing

## ✅ Checklist hiện tại

- [x] Backend code đã được tạo
- [x] Dependencies đã được cài đặt
- [x] Backend server đang chạy tại http://localhost:5000
- [x] Frontend đã được update để sử dụng backend API
- [ ] IPFS setup (optional - có thể dùng Pinata)
- [ ] Test upload ảnh từ frontend

---

## 🎯 Bước tiếp theo

### 1. Verify Backend đang chạy

Mở browser: http://localhost:5000/health

Kết quả mong đợi:
```json
{
  "status": "ok",
  "message": "Backend service is running"
}
```

### 2. Test API với Postman (Optional)

#### Test Cache NFT
```
POST http://localhost:5000/api/nft/cache
Content-Type: application/json

{
  "tokenId": "1",
  "name": "Test NFT",
  "description": "My first test NFT",
  "image": "ipfs://QmTest",
  "price": "0.1",
  "owner": "0xYourAddress",
  "seller": "0xYourAddress"
}
```

#### Test Get NFTs
```
GET http://localhost:5000/api/nft
```

### 3. Chạy Frontend

```powershell
# Mở terminal mới
cd frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### 4. Test từ Frontend

1. Login với MetaMask
2. Navigate đến Create NFT page
3. Chọn một ảnh
4. Fill form và submit
5. Backend sẽ xử lý upload IPFS

---

## 📝 Flow test hoàn chỉnh

```
Terminal 1: Backend Server
cd backend
npm run dev
→ Running at http://localhost:5000

Terminal 2: Frontend
cd frontend  
npm run dev
→ Running at http://localhost:3000

Browser: http://localhost:3000
→ Login với MetaMask
→ Test tạo NFT
```

---

## 🔧 IPFS Setup Options

### Option 1: Không setup IPFS (Recommended for quick testing)
- Backend sẽ báo lỗi khi upload
- Có thể test các API khác (cache, user profile)
- Sau này setup Pinata hoặc IPFS Desktop

### Option 2: Pinata Cloud (Recommended)
```powershell
# Đăng ký tài khoản: https://www.pinata.cloud/
# Lấy JWT token
# Cập nhật backend/.env

PINATA_JWT=your_pinata_jwt_token_here
```

Restart backend để apply changes.

### Option 3: IPFS Desktop
1. Download: https://github.com/ipfs/ipfs-desktop/releases
2. Install và run
3. IPFS sẽ chạy tại localhost:5001
4. Backend tự động connect

---

## 🎓 Kiểm tra Backend hoạt động

### Test 1: Health Check ✅
```
GET http://localhost:5000/health
```

### Test 2: Get Empty NFT List ✅
```
GET http://localhost:5000/api/nft
Response: { "success": true, "count": 0, "nfts": [] }
```

### Test 3: Cache NFT ✅
```
POST http://localhost:5000/api/nft/cache
Body: { tokenId: "1", name: "Test" }
```

### Test 4: Get NFT List Again ✅
```
GET http://localhost:5000/api/nft
Response: { "success": true, "count": 1, "nfts": [...] }
```

### Test 5: User Profile ✅
```
GET http://localhost:5000/api/user/0xTestAddress
```

---

## 🐛 Common Issues

### Backend không start
```powershell
# Kiểm tra port 5000
netstat -ano | findstr :5000

# Kill process nếu cần
taskkill /PID <process_id> /F

# Restart backend
cd backend
npm run dev
```

### IPFS upload error
- Normal nếu chưa setup IPFS
- Setup Pinata (miễn phí) để test upload
- Hoặc cài IPFS Desktop

### Frontend không kết nối backend
- Kiểm tra backend đang chạy
- Kiểm tra console log có lỗi CORS không
- Verify API_BASE_URL trong constants.js

---

## 📚 Files quan trọng

### Backend
- `backend/src/server.js` - Main server
- `backend/src/routes/upload.js` - IPFS upload
- `backend/src/routes/nft.js` - NFT cache
- `backend/.env` - Configuration

### Frontend
- `frontend/src/hooks/useIPFS.js` - IPFS hook
- `frontend/src/services/backendAPI.js` - API service
- `frontend/src/config/constants.js` - API URL

### Documentation
- `BACKEND_SETUP.md` - Setup guide
- `BACKEND_SUMMARY.md` - Complete summary
- `MEMBER3_COMPLETED.md` - Achievement report

---

## ✨ Current Status

```
✅ Backend Server: RUNNING (port 5000)
✅ API Endpoints: READY (8 endpoints)
✅ Frontend Integration: COMPLETED
⏳ IPFS Setup: OPTIONAL (can use Pinata)
✅ Documentation: COMPLETE

Ready to test NFT creation flow! 🎉
```

---

## 🎯 Next Action Items

1. **Immediate**: Keep backend running
2. **Test**: Access http://localhost:5000/health
3. **Frontend**: Start frontend và test login
4. **IPFS**: Setup Pinata nếu muốn test upload
5. **Create NFT**: Test full flow tạo NFT

**Backend Service for Member 3: COMPLETE AND READY!** ✅
