# 🚀 Hướng dẫn Deploy NFT Marketplace lên Production

## 📋 Tổng quan

Bạn cần deploy 2 phần:
1. **Frontend** → Vercel (Miễn phí, tốt nhất cho React/Vite)
2. **Backend** → Railway hoặc Render (Miễn phí có giới hạn)

**Smart Contracts** đã deploy lên Sepolia rồi, không cần deploy lại!

---

## 🎯 Phần 1: Deploy Frontend lên Vercel

### Bước 1: Chuẩn bị Frontend

#### 1.1 Tạo file `.env.production`:
```powershell
cd d:\Blockchain\frontend
```

Tạo file `.env.production`:
```env
VITE_NFT_CONTRACT_ADDRESS=0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6
VITE_MARKETPLACE_ADDRESS=0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

#### 1.2 Update `constants.js` để dùng env variables:
```javascript
// frontend/src/config/constants.js
export const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6'
export const NFT_MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS || '0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0'
export const SEPOLIA_CHAIN_ID = import.meta.env.VITE_SEPOLIA_CHAIN_ID || 11155111
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
```

#### 1.3 Test build local:
```powershell
cd d:\Blockchain\frontend
npm run build
```

✅ Phải build thành công không lỗi!

---

### Bước 2: Deploy lên Vercel

#### Option A: Deploy qua Vercel CLI (Nhanh)

**1. Install Vercel CLI:**
```powershell
npm install -g vercel
```

**2. Login Vercel:**
```powershell
vercel login
```
→ Mở browser, login bằng GitHub/Email

**3. Deploy:**
```powershell
cd d:\Blockchain\frontend
vercel
```

Trả lời các câu hỏi:
- Set up and deploy? → **Y**
- Which scope? → Chọn account của bạn
- Link to existing project? → **N**
- Project name? → **nft-marketplace-frontend** (hoặc tên bạn muốn)
- Directory? → **./** (Enter)
- Want to override settings? → **N**

**4. Deploy production:**
```powershell
vercel --prod
```

✅ Nhận được link: `https://nft-marketplace-frontend.vercel.app`

---

#### Option B: Deploy qua Vercel Dashboard (Dễ hơn)

**1. Push code lên GitHub:**
```powershell
cd d:\Blockchain
git add .
git commit -m "Prepare for deployment"
git push origin Frontend_BaoHuy
```

**2. Vào Vercel Dashboard:**
- Truy cập: https://vercel.com/
- Click **"Add New"** → **"Project"**
- Import repo: `PhamHuy1901/Web_NFT_BLOCKCHAIN`
- Branch: `Frontend_BaoHuy`

**3. Configure Project:**
- Framework Preset: **Vite**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

**4. Environment Variables:**
Click **"Environment Variables"**, thêm:
```
VITE_NFT_CONTRACT_ADDRESS = 0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6
VITE_MARKETPLACE_ADDRESS = 0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0
VITE_SEPOLIA_CHAIN_ID = 11155111
VITE_API_BASE_URL = https://your-backend.railway.app/api
```

**5. Click "Deploy"**

✅ Done! Vercel sẽ tự động build và deploy.

---

## 🔧 Phần 2: Deploy Backend lên Railway

### Bước 1: Chuẩn bị Backend

#### 1.1 Thêm file `Procfile` (nếu cần):
```powershell
cd d:\Blockchain\backend
```

Tạo file `Procfile`:
```
web: node src/server.js
```

#### 1.2 Update `package.json`:
Đảm bảo có:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 1.3 Update CORS trong `server.js`:
```javascript
// Allow Vercel domain
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://nft-marketplace-frontend.vercel.app', // Thay bằng URL Vercel của bạn
    'https://*.vercel.app' // Allow all Vercel preview
  ],
  credentials: true
}));
```

---

### Bước 2: Deploy lên Railway

#### 1. Tạo tài khoản Railway:
- Truy cập: https://railway.app/
- Sign up với GitHub

#### 2. Create New Project:
- Click **"New Project"**
- Chọn **"Deploy from GitHub repo"**
- Chọn repo: `Web_NFT_BLOCKCHAIN`
- Branch: `Frontend_BaoHuy`

#### 3. Configure Service:
- Root Directory: `/backend`
- Start Command: `npm start`

#### 4. Add Environment Variables:
Click **"Variables"**, thêm:
```
PORT=5000
NODE_ENV=production
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
```

#### 5. Deploy:
Railway sẽ tự động deploy và cho bạn URL:
```
https://your-backend-production.up.railway.app
```

✅ Copy URL này để update vào frontend!

---

### Bước 3: Update Frontend với Backend URL

#### Quay lại Vercel:
1. Vào project settings
2. Environment Variables
3. Update `VITE_API_BASE_URL`:
```
VITE_API_BASE_URL = https://your-backend-production.up.railway.app/api
```
4. Redeploy

---

## 🎯 Alternative: Deploy Backend lên Render

Nếu không dùng Railway, có thể dùng Render:

### 1. Tạo tài khoản Render:
- https://render.com/
- Sign up với GitHub

### 2. Create Web Service:
- Click **"New +"** → **"Web Service"**
- Connect repo: `Web_NFT_BLOCKCHAIN`
- Branch: `Frontend_BaoHuy`

### 3. Configure:
- Name: `nft-marketplace-backend`
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

### 4. Environment Variables:
```
PORT=10000
NODE_ENV=production
```

### 5. Deploy:
Render sẽ cho URL:
```
https://nft-marketplace-backend.onrender.com
```

---

## 📱 Phần 3: Custom Domain (Optional)

### Vercel Custom Domain:
1. Mua domain (Namecheap, GoDaddy)
2. Vercel Dashboard → Settings → Domains
3. Add domain: `nftmarketplace.com`
4. Update DNS records theo hướng dẫn Vercel

### Railway Custom Domain:
1. Settings → Networking → Custom Domain
2. Add domain
3. Update DNS CNAME record

---

## ✅ Checklist Deploy

### Frontend (Vercel):
- [ ] Build thành công local
- [ ] Push code lên GitHub
- [ ] Create Vercel project
- [ ] Add environment variables
- [ ] Deploy thành công
- [ ] Test trên production URL

### Backend (Railway/Render):
- [ ] Update CORS origins
- [ ] Add Procfile/package.json
- [ ] Create Railway/Render project
- [ ] Add environment variables
- [ ] Deploy thành công
- [ ] Test API endpoints

### Integration:
- [ ] Update frontend với backend URL
- [ ] Test MetaMask connection
- [ ] Test Mint NFT
- [ ] Test Buy/Sell NFT
- [ ] Check IPFS upload

---

## 🐛 Troubleshooting

### Vercel Build Errors:
```bash
# Check build locally first
cd frontend
npm run build

# Check for missing dependencies
npm install
```

### Railway/Render 503 Error:
- Check logs trong dashboard
- Verify PORT environment variable
- Check start command

### CORS Errors:
```javascript
// backend/src/server.js
app.use(cors({
  origin: true, // Allow all origins (for testing)
  credentials: true
}));
```

### MetaMask Network Issues:
- Ensure contracts deployed on Sepolia
- Check contract addresses
- Verify RPC URL

---

## 📊 Cost Breakdown

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | ✅ Free | Unlimited sites, 100GB bandwidth/month |
| **Railway** | ✅ $5 credit/month | ~500 hours runtime |
| **Render** | ✅ Free | 750 hours/month, sleeps after 15min inactive |
| **Smart Contracts** | ⚠️ Gas fees only | Đã deploy rồi |

**Total Cost: $0-5/month** (nếu traffic thấp)

---

## 🚀 Quick Deploy Commands

### Full deployment script:

```powershell
# 1. Build frontend
cd d:\Blockchain\frontend
npm run build

# 2. Deploy frontend to Vercel
vercel --prod

# 3. Push backend code
cd d:\Blockchain
git add .
git commit -m "Deploy to production"
git push origin Frontend_BaoHuy

# 4. Railway sẽ tự động deploy backend
```

---

## 🌐 Production URLs

Sau khi deploy, bạn sẽ có:

```
Frontend:  https://nft-marketplace-frontend.vercel.app
Backend:   https://nft-marketplace-backend.railway.app
Contracts: 
  - NFT: 0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6
  - Marketplace: 0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0
Etherscan: https://sepolia.etherscan.io/
```

---

## 📝 Notes

### Nên dùng service nào?

**Vercel** (Frontend):
- ✅ Best cho React/Vite
- ✅ Auto deploy khi push GitHub
- ✅ Fast CDN worldwide
- ✅ Free SSL
- ✅ **RECOMMEND!**

**Railway** (Backend):
- ✅ Dễ setup
- ✅ $5 credit/month miễn phí
- ✅ Good for Node.js
- ⚠️ Cần thêm credit sau khi hết $5

**Render** (Backend):
- ✅ 100% free
- ⚠️ Sleep sau 15min không dùng
- ⚠️ Cold start ~30s
- ✅ Good cho demo/testing

---

## 🎉 Summary

**Deploy frontend:**
```bash
cd frontend && vercel --prod
```

**Deploy backend:**
Push code → Railway tự động deploy

**Total time: ~15 phút**

Sau đó bạn có NFT Marketplace live trên internet! 🚀

---

**Cần help?** Ping tôi khi deploy gặp lỗi!
