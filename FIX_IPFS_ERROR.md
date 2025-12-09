# 🔧 Fix: Failed to upload file to IPFS

## ❌ Nguyên nhân lỗi

```
Error: ECONNREFUSED - Cannot connect to IPFS node at localhost:5001
```

Backend không thể kết nối tới IPFS node vì:
- IPFS Desktop chưa được cài đặt/chạy
- Local IPFS daemon không hoạt động
- Port 5001 không available

## ✅ Giải pháp đã áp dụng - Mock IPFS (Test Mode)

Đã chuyển sang sử dụng **Mock IPFS Service** để có thể test ngay:

- ✅ Backend tạo fake IPFS hash (dạng `QmXXX...`)
- ✅ Không cần cài đặt IPFS Desktop
- ✅ Flow tạo NFT hoạt động bình thường
- ⚠️ Hash không thật, không upload lên IPFS network

### Backend đã được update:
```javascript
// backend/src/routes/upload.js
import { uploadToIPFS, uploadJSONToIPFS, getIPFSUrl } 
  from '../services/ipfsServiceMock.js';  // ← Mock service
```

### Test lại Create NFT:
1. Refresh trang `http://localhost:3000`
2. Navigate to Create NFT
3. Upload ảnh
4. Fill form và submit
5. ✅ Sẽ thành công với mock hash

---

## 🌟 Giải pháp Production - Setup Pinata (Recommended)

Để upload THẬT lên IPFS network, sử dụng **Pinata** (miễn phí):

### Bước 1: Đăng ký Pinata

1. Truy cập: https://www.pinata.cloud/
2. Sign up (FREE account)
3. Verify email

### Bước 2: Lấy API Keys

1. Login vào Pinata
2. Click **API Keys** (menu bên trái)
3. Click **New Key**
4. Settings:
   - ✅ Enable **pinFileToIPFS**
   - ✅ Enable **pinJSONToIPFS**
   - Key Name: `NFT-Marketplace`
5. Click **Create Key**
6. **QUAN TRỌNG**: Copy ngay **JWT token** (chỉ hiện 1 lần!)

### Bước 3: Cấu hình Backend

Mở file `backend/.env` và thêm:

```env
# Pinata Configuration
PINATA_JWT=eyJhbGc...YOUR_JWT_TOKEN_HERE
```

### Bước 4: Switch sang Pinata Service

Mở file `backend/src/routes/upload.js`:

```javascript
// Đổi từ Mock sang Pinata
import { uploadToIPFS, uploadJSONToIPFS, getIPFSUrl } 
  from '../services/ipfsServicePinata.js';  // ← Pinata service
```

### Bước 5: Install dependencies (nếu cần)

```powershell
cd backend
npm install form-data
```

### Bước 6: Restart Backend

Backend sẽ tự restart khi save file, hoặc:

```powershell
# Stop server (Ctrl+C)
npm run dev
```

### Bước 7: Test với Pinata

1. Upload ảnh trên Create NFT page
2. Check backend console:
   ```
   ✅ File uploaded to IPFS via Pinata: QmRealHash123...
   ```
3. Copy hash và test: `https://ipfs.io/ipfs/QmRealHash123...`
4. ✅ Ảnh thật sẽ hiển thị!

---

## 📊 So sánh các Options

### Option 1: Mock IPFS (Hiện tại) ✅
- ✅ **Pros**: Setup nhanh, test flow ngay
- ❌ **Cons**: Hash giả, không lưu thật trên IPFS
- 🎯 **Use case**: Development, testing UI/UX

### Option 2: Pinata Cloud (Recommended) ⭐
- ✅ **Pros**: IPFS thật, miễn phí 1GB, không cần install
- ✅ **Pros**: Reliable, fast, production-ready
- ✅ **Pros**: Gateway riêng (nhanh hơn public gateway)
- ❌ **Cons**: Cần đăng ký account
- 🎯 **Use case**: Production, demo, testing thật

### Option 3: IPFS Desktop
- ✅ **Pros**: Self-hosted, không depend service
- ❌ **Cons**: Phải cài đặt, config phức tạp
- ❌ **Cons**: Chậm, không stable cho development
- 🎯 **Use case**: Advanced users, self-hosting

---

## 🚀 Current Status

```
✅ Backend: RUNNING với Mock IPFS
✅ Upload: WORKING (fake hash)
✅ Create NFT: WORKING
⏳ Pinata: Chưa setup (optional)
```

### Next Actions:

**Cho testing/development:**
- Tiếp tục dùng Mock IPFS
- Test full flow: Create → View → Buy NFT

**Cho production/demo:**
- Setup Pinata (5 phút)
- Upload IPFS thật
- Share NFT với real IPFS links

---

## 📝 Switching Guide

### Chuyển từ Mock → Pinata:

```javascript
// backend/src/routes/upload.js

// Từ:
import { ... } from '../services/ipfsServiceMock.js';

// Sang:
import { ... } from '../services/ipfsServicePinata.js';
```

### Chuyển từ Mock → Local IPFS:

```javascript
// backend/src/routes/upload.js

// Từ:
import { ... } from '../services/ipfsServiceMock.js';

// Sang:
import { ... } from '../services/ipfsService.js';
```

**Lưu ý**: Local IPFS cần IPFS Desktop chạy tại port 5001

---

## 💡 Tips

1. **Mock IPFS** tốt cho:
   - Test UI/UX flow
   - Demo functionality
   - Development nhanh

2. **Pinata** tốt cho:
   - Production deployment
   - Share NFT với người khác
   - Stable và fast

3. **Smart Contract** không care:
   - Contract chỉ lưu hash string
   - Mock hash vẫn mint được NFT
   - Nhưng URL sẽ không load được ảnh

---

## 🎯 Recommended Flow

```
1. Development: Mock IPFS (hiện tại) ✅
2. Testing: Pinata Free (5 phút setup)
3. Production: Pinata Paid hoặc Self-hosted IPFS
```

**Current: Bạn đang ở step 1 - Hoàn toàn OK cho development!** ✅
