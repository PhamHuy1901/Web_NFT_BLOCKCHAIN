# 🖼️ Hướng dẫn Xem NFT sau khi Mint

## ✅ Sau khi Create NFT thành công

Khi bạn mint NFT thành công, bạn sẽ thấy:
```
✓ NFT minted successfully! Token ID: 1
```

Frontend sẽ tự động redirect về **Profile page**.

---

## 🎯 Các cách để xem NFT

### Cách 1: Profile Page (My NFTs) ⭐ Khuyến nghị

**Navigate**: Click **"Profile"** trên header menu

**Địa chỉ**: `http://localhost:3000/profile`

**Hiển thị**:
- ✅ Tất cả NFT bạn sở hữu
- ✅ NFT status (Owned / Listed for sale)
- ✅ NFT metadata (image, name, description)
- ✅ Actions: List for sale, View details

**Tabs**:
- **Owned**: NFT bạn đang giữ (chưa bán)
- **Listed**: NFT bạn đã list lên marketplace

---

### Cách 2: NFT Detail Page

**Navigate**: Click vào NFT card bất kỳ

**Địa chỉ**: `http://localhost:3000/nft/:tokenId`

Ví dụ: `http://localhost:3000/nft/1`

**Hiển thị**:
- 🖼️ Ảnh NFT (to hơn)
- 📝 Name, Description
- 👤 Owner address
- 🔗 Token URI (IPFS link)
- 💰 Price (nếu đang được list)
- ⚡ Actions:
  - **Nếu bạn là owner**: List for sale / Cancel listing
  - **Nếu không phải owner**: Buy NFT

---

### Cách 3: Home Page (Marketplace)

**Navigate**: Click **"Home"** hoặc **"Explore"** trên header

**Địa chỉ**: `http://localhost:3000/`

**Hiển thị**:
- ✅ Tất cả NFT đang được **list for sale** (marketplace)
- ❌ **KHÔNG hiển thị** NFT chưa list
- 💰 Giá bán
- 🛒 Nút "Buy Now"

**Lưu ý**: NFT vừa mint **chưa tự động hiển thị ở đây** cho đến khi bạn list for sale.

---

## 📋 Flow xem NFT đầy đủ

```
1. Mint NFT thành công
   ↓
2. Redirect to Profile page
   ↓
3. See your NFT in "Owned" tab
   ↓
4. Click vào NFT card
   ↓
5. View NFT Detail page
   ↓
6. Actions available:
   - List for sale (to marketplace)
   - Transfer (future feature)
   - View on blockchain explorer
```

---

## 🎨 NFT Card hiển thị gì?

Mỗi NFT card trên Profile/Home page sẽ show:

```
┌─────────────────────┐
│                     │
│   [NFT IMAGE]       │
│                     │
├─────────────────────┤
│ NFT Name            │
│ Token #1            │
│                     │
│ 💰 0.1 ETH         │ (if listed)
│ 👤 0x1234...5678    │
│                     │
│ [View Details]      │
└─────────────────────┘
```

---

## 🔍 Kiểm tra NFT Details

### Profile Page

Navigate: `http://localhost:3000/profile`

**Bạn sẽ thấy**:
- Header với wallet address
- Balance (ETH)
- Tabs: Owned / Listed
- Grid các NFT cards

**Nếu không thấy NFT**:
- Check console log có lỗi không
- Verify đang connect đúng wallet
- Refresh page (F5)
- Check network (phải Sepolia)

### NFT Detail Page

Click vào NFT → Detail page

**Bạn sẽ thấy**:
- Ảnh NFT (full size)
- Metadata:
  - Name
  - Description
  - Token ID
  - Owner address
  - Creator address
- Listing info (nếu có):
  - Price
  - Seller address
- Actions:
  - List for Sale (button)
  - Cancel Listing (button, nếu đã list)
  - Buy Now (button, nếu bạn không phải owner)

---

## 🛒 List NFT for Sale

### Steps để bán NFT:

1. **Go to Profile**: `http://localhost:3000/profile`

2. **Click NFT card** → Detail page

3. **Click "List for Sale"**

4. **Popup form**:
   ```
   Price (ETH): [____]
   
   [Cancel] [List NFT]
   ```

5. **Enter price**: Ví dụ: `0.1` (0.1 ETH)

6. **Click "List NFT"**

7. **MetaMask popup 1**: Approve marketplace
   - Cho phép marketplace transfer NFT
   - Click **Confirm**

8. **MetaMask popup 2**: List NFT transaction
   - Ghi thông tin lên blockchain
   - Click **Confirm**

9. **Wait** ~15-30 seconds

10. ✅ **Listed!** NFT hiện trên marketplace

---

## 👁️ View NFT từ nhiều nơi

### 1. Direct URL (nếu biết Token ID)

```
http://localhost:3000/nft/1
http://localhost:3000/nft/2
```

### 2. Profile Page

```
http://localhost:3000/profile
```

→ Click NFT card

### 3. Home Page (sau khi list)

```
http://localhost:3000/
```

→ NFT hiện trong marketplace grid

### 4. Blockchain Explorer (Sepolia Etherscan)

```
https://sepolia.etherscan.io/token/0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6?a=1
```

Replace token ID `1` với ID của bạn

---

## 📊 NFT Information

Khi xem NFT, bạn sẽ thấy:

### Metadata (From IPFS)
- **Name**: Tên NFT
- **Description**: Mô tả
- **Image**: URL ảnh (IPFS gateway)

### Blockchain Data
- **Token ID**: Số ID unique của NFT
- **Owner**: Address đang sở hữu NFT
- **Creator**: Address đã mint NFT
- **Token URI**: IPFS link của metadata

### Marketplace Data (nếu listed)
- **Listed**: True/False
- **Price**: Giá bán (ETH)
- **Seller**: Address đang bán

---

## 🔄 Refresh NFT Data

Nếu data không update:

### Cách 1: Hard Refresh
```
Windows: Ctrl + F5
Mac: Cmd + Shift + R
```

### Cách 2: Navigate away và back
```
Profile → Home → Profile
```

### Cách 3: Check console
```
F12 → Console tab
Xem có error không
```

---

## 🐛 Troubleshooting

### Không thấy NFT trên Profile

**Nguyên nhân**:
1. Contract chưa return đúng owner
2. Frontend đang load
3. Network sai

**Fix**:
- Refresh page
- Check console log
- Verify wallet address
- Check Sepolia network

### Ảnh không hiển thị

**Nguyên nhân**:
1. IPFS hash fake (dùng Mock IPFS)
2. IPFS gateway chậm
3. Image URL broken

**Fix**:
- Dùng Pinata (real IPFS) thay vì Mock
- Đợi IPFS propagate
- Check image URL trong console

### Loading mãi không xong

**Nguyên nhân**:
- RPC node chậm
- Too many NFTs
- Network issue

**Fix**:
- Đợi thêm vài giây
- Refresh page
- Check internet connection

---

## 💡 Tips

### 1. Bookmark NFT Detail URL
```
http://localhost:3000/nft/1
```

Save để xem lại nhanh

### 2. Share NFT
Copy URL và share với bạn bè (sau khi deploy production)

### 3. Multiple Views
Mở nhiều tab để compare NFTs

### 4. Use Profile as Dashboard
Profile page = your NFT dashboard

---

## 📱 UI Components

### NFT Card Component
```jsx
<NFTCard
  tokenId="1"
  name="My NFT"
  image="ipfs://QmXXX"
  price="0.1"
  owner="0x123..."
  isListed={true}
/>
```

### NFT Grid Component
```jsx
<NFTGrid
  nfts={[...]}
  onSelectNFT={(nft) => navigate(`/nft/${nft.tokenId}`)}
/>
```

---

## 🎯 Quick Actions

**Xem NFT vừa mint**:
```
Profile → Owned tab → Click NFT
```

**List NFT lên marketplace**:
```
NFT Detail → List for Sale → Enter price → Confirm
```

**Xem tất cả NFT đang bán**:
```
Home → Browse marketplace grid
```

**Buy NFT**:
```
Home → Click NFT → Buy Now → Confirm
```

---

## 🚀 Test Full Flow

1. ✅ **Mint NFT** (Done)
2. ⏩ **View on Profile** → `http://localhost:3000/profile`
3. ⏩ **Click NFT** → Detail page
4. ⏩ **List for sale** → Enter price: 0.1 ETH
5. ⏩ **Approve + List** → Confirm in MetaMask
6. ⏩ **View on Home** → `http://localhost:3000/`
7. ⏩ **Buy với wallet khác** (optional)
8. ✅ **Complete!**

---

**Bây giờ vào Profile page để xem NFT của bạn!** 🎨

Navigate to: `http://localhost:3000/profile`
