# 🚀 HƯỚNG DẪN DEPLOY NFT MARKETPLACE LÊN PRODUCTION

## 📋 Tổng quan
- **Frontend**: Deploy lên Vercel (miễn phí)
- **Backend**: Deploy lên Railway (free tier $5/tháng)
- **Smart Contracts**: Đã deploy trên Sepolia Testnet

---

## BƯỚC 1: CHUẨN BỊ

### 1.1 Đảm bảo code đã push lên GitHub
```powershell
cd d:\Blockchain
git add .
git commit -m "Ready for production deployment"
git push origin Frontend_BaoHuy
```

### 1.2 Cài đặt Vercel CLI
```powershell
npm install -g vercel
```

---

## BƯỚC 2: DEPLOY BACKEND LÊN RAILWAY

### 2.1 Truy cập Railway
1. Vào https://railway.app/
2. Đăng nhập bằng GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Chọn repository: `Web_NFT_BLOCKCHAIN`
5. Chọn branch: `Frontend_BaoHuy`

### 2.2 Cấu hình Backend Service
1. Railway sẽ tự động detect Node.js project
2. Click vào service backend vừa tạo
3. Vào tab **"Variables"** → Add các environment variables:

```env
NODE_ENV=production
PORT=5000
PINATA_JWT=your_pinata_jwt_token_here
FRONTEND_URL=https://your-app.vercel.app
```

**Lấy Pinata JWT:**
- Vào https://app.pinata.cloud/
- Đăng ký tài khoản miễn phí
- Vào **API Keys** → **New Key** → Copy JWT token

### 2.3 Cấu hình Root Directory (QUAN TRỌNG!)
1. Vào tab **"Settings"**
2. Tìm **"Root Directory"**
3. Nhập: `backend`
4. Click **"Deploy"**

### 2.4 Lấy Backend URL
Sau khi deploy xong, Railway sẽ tạo URL dạng:
```
https://web-nft-blockchain-production-xxxx.up.railway.app
```
**→ Copy URL này, sẽ dùng ở bước 3**

---

## BƯỚC 3: DEPLOY FRONTEND LÊN VERCEL

### 3.1 Deploy bằng Vercel CLI
```powershell
cd d:\Blockchain\frontend
vercel login
```

Làm theo hướng dẫn để đăng nhập (mở browser, confirm)

### 3.2 Deploy lần đầu
```powershell
vercel
```

Trả lời các câu hỏi:
- **Set up and deploy "frontend"?** → Yes
- **Which scope?** → Chọn tài khoản của bạn
- **Link to existing project?** → No
- **Project name?** → `nft-marketplace` (hoặc tên khác)
- **Directory?** → `./` (Enter)
- **Override settings?** → No

### 3.3 Cấu hình Environment Variables trên Vercel

Sau khi deploy xong:
1. Vào https://vercel.com/dashboard
2. Click vào project `nft-marketplace`
3. Vào tab **"Settings"** → **"Environment Variables"**
4. Add các biến sau:

```env
VITE_NFT_CONTRACT_ADDRESS=0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6
VITE_MARKETPLACE_ADDRESS=0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
VITE_API_BASE_URL=https://web-nft-blockchain-production-xxxx.up.railway.app/api
```

**⚠️ QUAN TRỌNG**: Thay `VITE_API_BASE_URL` bằng URL Railway từ bước 2.4!

### 3.4 Deploy Production
```powershell
vercel --prod
```

### 3.5 Lấy Frontend URL
Vercel sẽ trả về URL dạng:
```
https://nft-marketplace-xxxxx.vercel.app
```

---

## BƯỚC 4: CẬP NHẬT CORS TRÊN RAILWAY

1. Vào Railway Dashboard → Backend Service
2. Vào tab **"Variables"**
3. Update `FRONTEND_URL`:
```env
FRONTEND_URL=https://nft-marketplace-xxxxx.vercel.app
```
4. Railway sẽ tự động redeploy

---

## BƯỚC 5: KIỂM TRA DEPLOYMENT

### 5.1 Test Backend
Mở browser, truy cập:
```
https://your-backend.railway.app/health
```
Kết quả mong đợi:
```json
{
  "status": "ok",
  "message": "Backend service is running"
}
```

### 5.2 Test Frontend
1. Truy cập `https://nft-marketplace-xxxxx.vercel.app`
2. Connect MetaMask (chọn Sepolia Testnet)
3. Thử mint 1 NFT mới
4. Kiểm tra NFT hiển thị trong Profile

---

## 🎉 HOÀN TẤT!

Website của bạn đã live trên production:
- **Frontend**: https://nft-marketplace-xxxxx.vercel.app
- **Backend**: https://your-backend.railway.app
- **Smart Contracts**: Sepolia Testnet

---

## 📝 GHI CHÚ QUAN TRỌNG

### Chi phí hàng tháng:
- Vercel: **$0** (Free tier)
- Railway: **$0-5** (Free tier có $5 credit/tháng)
- **Tổng: $0-5/tháng**

### Giới hạn Free Tier:
- **Vercel**: Unlimited bandwidth (trong giới hạn hợp lý)
- **Railway**: 500 hours/tháng (~20 ngày) hoặc $5 credit

### Custom Domain (Tùy chọn):
Nếu muốn dùng domain riêng (ví dụ: `nftmarketplace.com`):
1. Mua domain từ Namecheap/GoDaddy (~$10/năm)
2. Vercel: Settings → Domains → Add Domain
3. Railway: Settings → Public Networking → Add Custom Domain

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Failed to fetch NFTs"
- Kiểm tra `VITE_API_BASE_URL` đã đúng chưa
- Vào Railway logs: `railway logs`

### Lỗi: MetaMask không connect được
- Đảm bảo đã chọn Sepolia Testnet
- Clear cache browser và thử lại

### Lỗi: "CORS policy blocked"
- Kiểm tra `FRONTEND_URL` trên Railway
- Đảm bảo không có trailing slash (/)

### Backend không chạy trên Railway:
- Vào Railway → Settings → Root Directory = `backend`
- Kiểm tra file `railway.json` có trong `backend/`

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Check Railway logs: Click vào service → Tab "Deployments" → View logs
2. Check Vercel logs: Vercel Dashboard → Project → Tab "Logs"
3. Check browser console (F12) để xem lỗi frontend

**Các lệnh hữu ích:**
```powershell
# Xem logs Railway
railway logs

# Redeploy Vercel
vercel --prod --force

# Xem logs local
cd d:\Blockchain\backend
npm start
```

Good luck! 🚀
