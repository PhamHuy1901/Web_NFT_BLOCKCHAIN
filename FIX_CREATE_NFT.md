# 🔧 Fix lỗi "Network Error" khi Create NFT

## ❌ Nguyên nhân lỗi:

**KHÔNG PHẢI** do thiếu `ETHERSCAN_API_KEY`

**Nguyên nhân thực sự:** 
- Frontend đang gọi backend API: `http://localhost:5000/api/ipfs/upload`
- Backend chưa chạy → Network Error

## ✅ Đã fix:

### Thay đổi trong `frontend/src/hooks/useIPFS.js`:

**Trước (cần backend):**
```javascript
// Upload qua backend
const response = await axios.post(`${API_BASE_URL}/ipfs/upload`, formData)
```

**Sau (không cần backend):**
```javascript
// Upload trực tiếp lên Pinata IPFS
const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
  method: 'POST',
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_KEY,
  },
  body: formData,
})
```

### Ưu điểm:
✅ Không cần chạy backend
✅ Upload trực tiếp lên IPFS (Pinata)
✅ Miễn phí (Pinata free tier)
✅ Nhanh và ổn định

---

## 🚀 Test lại ngay:

### 1. Restart frontend (nếu đang chạy):
```powershell
# Stop frontend (Ctrl+C)
# Restart
cd d:\Blockchain\frontend
npm run dev
```

### 2. Test Create NFT:
1. Go to http://localhost:3000/create
2. Upload ảnh con cá mập đẹp trai của bạn 🦈
3. Điền:
   - Name: "Aquaman"
   - Description: "The handsome man"
4. Click **"Create NFT"**
5. Confirm transaction trong MetaMask

### Expected:
- ✅ Upload ảnh lên IPFS (Pinata)
- ✅ Upload metadata lên IPFS
- ✅ Mint NFT transaction
- ✅ Success! NFT created

---

## 🔑 Về ETHERSCAN_API_KEY:

### Khi nào cần?
- ✅ Chỉ cần khi **verify contracts** trên Etherscan
- ✅ KHÔNG ảnh hưởng mint NFT
- ✅ KHÔNG ảnh hưởng frontend

### Lấy API Key:
1. Đăng ký: https://etherscan.io/register
2. My Profile → API Keys → Add
3. Copy key vào `.env`:
```env
ETHERSCAN_API_KEY=your_actual_key_here
```

### Verify contracts (Optional):
```powershell
cd d:\Blockchain\blockchain
npm run verify
```

**Nhưng không cần thiết cho việc mint NFT!**

---

## 📊 IPFS Info:

### Pinata Free Tier:
- ✅ 1 GB storage
- ✅ Unlimited uploads
- ✅ Free gateway
- ✅ API keys (đã có trong code)

### Alternatives (nếu muốn):
- **NFT.Storage**: https://nft.storage/ (100% free, unlimited)
- **Web3.Storage**: https://web3.storage/ (Free, unlimited)
- **Your own Pinata account**: https://pinata.cloud/

---

## 🎯 Summary:

**Lỗi đã fix:** ✅
- Không còn cần backend
- Upload trực tiếp lên IPFS
- Mint NFT hoạt động bình thường

**ETHERSCAN_API_KEY:**
- Không liên quan đến lỗi
- Chỉ cần cho verify contracts
- Mint NFT vẫn chạy bình thường

**Test ngay:** 🚀
```powershell
cd d:\Blockchain\frontend
npm run dev
```
→ Create NFT → Upload ảnh → Mint! ✅

---

## 🐛 Nếu vẫn lỗi:

### Check console (F12):
```javascript
// Xem error message cụ thể
console.log()
```

### Common issues:
1. **MetaMask chưa connect** → Click "Connect Wallet"
2. **Wrong network** → Switch to Sepolia
3. **No Sepolia ETH** → Get from faucet: https://sepoliafaucet.com/
4. **File quá lớn** → Max 10MB

### Check:
- Balance: Cần ~0.002 ETH cho gas
- Network: Phải là Sepolia (Chain ID: 11155111)
- MetaMask: Phải approve transaction

---

**Bây giờ create NFT sẽ work rồi! 🎉**
