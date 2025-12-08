# 🔐 Hướng dẫn Đăng nhập MetaMask

## ✅ Đã hoàn thành

Tôi đã tạo xong hệ thống đăng nhập bằng MetaMask với các tính năng sau:

### 🎯 Các tính năng chính

1. **Trang Login** (`/login`)
   - UI đẹp với animation background
   - Hiển thị thông tin về ưu điểm của blockchain
   - Kiểm tra MetaMask đã cài đặt chưa
   - Button install MetaMask nếu chưa có
   - Button connect wallet
   - Loading state khi đang kết nối
   - Error handling với thông báo rõ ràng

2. **Protected Routes**
   - Tất cả các trang (Home, Create, Profile, NFTDetail) đều yêu cầu login
   - Tự động redirect về `/login` nếu chưa đăng nhập
   - Tự động redirect về `/` sau khi login thành công

3. **WalletContext cải tiến**
   - Hàm `connectWallet()` trả về kết quả `{ success, account }` hoặc `{ success, error }`
   - Hàm `signMessage()` để sign message (verify ownership)
   - Error handling tốt hơn với message thân thiện
   - Console log rõ ràng với emoji để dễ debug

4. **Header có nút Logout**
   - Hiển thị địa chỉ ví và balance
   - Button "Logout" màu đỏ
   - Click logout sẽ disconnect và redirect về `/login`

## 🚀 Cách chạy

Server đã đang chạy tại: **http://localhost:3000**

### Bước 1: Cài đặt MetaMask
- Download và cài đặt MetaMask extension: https://metamask.io/download/
- Tạo hoặc import ví
- Chuyển sang Sepolia Testnet (Settings > Networks > Show test networks)
- Lấy test ETH từ faucet: https://sepoliafaucet.com/

### Bước 2: Test đăng nhập

1. **Truy cập trang login**
   ```
   http://localhost:3000/login
   ```

2. **Click "Connect with MetaMask"**
   - MetaMask popup sẽ hiện lên
   - Click "Next" và "Connect"
   - Approve connection

3. **Sau khi connect thành công:**
   - Tự động redirect về trang Home (Marketplace)
   - Header hiển thị địa chỉ ví và balance
   - Có nút "Logout" màu đỏ

4. **Test protected routes:**
   - Thử truy cập `/profile`, `/create`, `/nft/1`
   - Nếu chưa login → tự động redirect về `/login`
   - Nếu đã login → hiển thị trang bình thường

5. **Test logout:**
   - Click nút "Logout" trên Header
   - Sẽ disconnect và redirect về `/login`

## 📁 Files đã tạo/sửa

### Mới tạo:
1. `src/pages/Login.jsx` - Trang login chính
2. `src/pages/Login.css` - Styles cho trang login
3. `src/components/ProtectedRoute.jsx` - Component bảo vệ routes

### Đã sửa:
1. `src/App.jsx` - Thêm route `/login` và protect các routes khác
2. `src/contexts/WalletContext.jsx` - Thêm return value cho `connectWallet()` và hàm `signMessage()`
3. `src/components/Header.jsx` - Thêm nút Logout
4. `src/components/Header.css` - Style cho nút Logout
5. `src/hooks/useNFTContract.js` - Fix import bug

## 🎨 UI Features

### Login Page:
- ✅ Animated background với floating circles
- ✅ Logo với animation float
- ✅ Gradient text effects
- ✅ Glass morphism card design
- ✅ MetaMask logo và branding
- ✅ 3 info cards: Secure, Fast, Decentralized
- ✅ Responsive design cho mobile
- ✅ Loading spinner khi connecting
- ✅ Error message với icon

### Header:
- ✅ Wallet address hiển thị dạng rút gọn
- ✅ Balance hiển thị với màu xanh
- ✅ Nút Logout màu đỏ với hover effect
- ✅ Smooth transitions

## 🔧 API đã thêm vào WalletContext

```javascript
const { 
  // States
  account,           // Địa chỉ ví
  balance,          // Số dư ETH
  isConnected,      // Đã kết nối chưa
  isConnecting,     // Đang kết nối
  error,            // Error message
  chainId,          // Chain ID hiện tại
  provider,         // Ethers provider
  signer,           // Ethers signer
  
  // Functions
  connectWallet,    // Kết nối ví → returns { success, account } hoặc { success, error }
  disconnectWallet, // Ngắt kết nối
  signMessage,      // Sign message → returns { success, signature } hoặc { success, error }
  switchNetwork,    // Chuyển network
  hasSufficientBalance, // Kiểm tra đủ balance không
  isMetaMaskInstalled,  // MetaMask đã cài đặt chưa
} = useWallet()
```

## 📝 Ví dụ sử dụng signMessage()

Để verify ownership của ví, bạn có thể dùng:

```javascript
import { useWallet } from '../contexts/WalletContext'

function MyComponent() {
  const { signMessage } = useWallet()

  const handleVerify = async () => {
    const message = `Welcome to NFT Marketplace!\n\nSign this message to verify your wallet ownership.\n\nTimestamp: ${Date.now()}`
    
    const result = await signMessage(message)
    
    if (result.success) {
      console.log('Signature:', result.signature)
      // Send signature to backend for verification
    } else {
      console.error('Error:', result.error)
    }
  }

  return <button onClick={handleVerify}>Verify Wallet</button>
}
```

## 🔒 Security Features

1. **No password needed** - Dùng cryptographic signature từ wallet
2. **Non-custodial** - User giữ private keys
3. **Session management** - Tự động disconnect khi user đóng MetaMask
4. **Network detection** - Phát hiện khi user chuyển network
5. **Account change detection** - Phát hiện khi user chuyển account

## 🎯 Workflow hoàn chỉnh

```
User visit site
    ↓
Check wallet connected?
    ↓ No
Redirect to /login
    ↓
User clicks "Connect with MetaMask"
    ↓
MetaMask popup → User approves
    ↓
WalletContext saves: account, provider, signer, balance
    ↓
Redirect to / (Home)
    ↓
User can access all protected routes
    ↓
User clicks "Logout"
    ↓
WalletContext clears all data
    ↓
Redirect to /login
```

## 🚨 Error Handling

Các lỗi phổ biến và xử lý:

| Error | Message | Action |
|-------|---------|--------|
| MetaMask not installed | "MetaMask is not installed..." | Show install button |
| User rejected connection | "Connection request rejected..." | Show error, allow retry |
| Wrong network | Auto-detected via chainId | Can add auto-switch later |
| No accounts | "No accounts found" | Ask user to unlock MetaMask |

## 🎉 Kết luận

Hệ thống đăng nhập MetaMask đã hoàn chỉnh với:
- ✅ Trang login đẹp
- ✅ Protected routes
- ✅ Auto-connect nếu đã connect trước đó
- ✅ Logout functionality
- ✅ Error handling tốt
- ✅ Responsive design
- ✅ Sign message capability (để verify)

**Frontend đã sẵn sàng!** 🚀

Bạn có thể:
1. Test đăng nhập/đăng xuất
2. Thêm tính năng verify signature nếu cần
3. Customize UI theo ý thích
4. Chờ Smart Contract và Backend để test full flow

---

**Questions?** Hỏi tôi bất cứ điều gì! 😊
