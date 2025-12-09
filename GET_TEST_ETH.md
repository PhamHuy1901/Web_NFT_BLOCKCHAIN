# 💰 Hướng dẫn lấy Test ETH cho Sepolia Testnet

## 🎯 Tại sao cần test ETH?

- Để trả **gas fees** khi mint NFT
- Để test marketplace (list, buy NFT)
- **Hoàn toàn MIỄN PHÍ** - không phải ETH thật

## 🚰 Sepolia Faucets (Nguồn test ETH)

### Option 1: Alchemy Faucet (Khuyến nghị) ⭐
**Link**: https://www.alchemy.com/faucets/ethereum-sepolia

**Yêu cầu**:
- Đăng ký account Alchemy (miễn phí)
- Verify email

**Steps**:
1. Truy cập link trên
2. Login/Sign up Alchemy
3. Paste địa chỉ ví MetaMask
4. Solve captcha
5. Click "Send Me ETH"
6. ✅ Nhận 0.5 ETH (đủ cho nhiều transactions)

**Thời gian**: 1-2 phút

---

### Option 2: Infura Faucet
**Link**: https://www.infura.io/faucet/sepolia

**Yêu cầu**:
- Đăng ký account Infura (miễn phí)

**Steps**:
1. Truy cập link
2. Login/Sign up Infura
3. Paste địa chỉ ví
4. Request test ETH
5. ✅ Nhận 0.5 ETH

---

### Option 3: Sepolia PoW Faucet
**Link**: https://sepolia-faucet.pk910.de/

**Yêu cầu**:
- KHÔNG cần đăng ký
- Nhưng phải "mine" (chạy task trên browser)

**Steps**:
1. Truy cập link
2. Paste địa chỉ ví
3. Start mining (để browser chạy vài phút)
4. Claim ETH khi đủ
5. ✅ Nhận ETH

**Lưu ý**: Chậm hơn, nhưng không cần account

---

### Option 4: QuickNode Faucet
**Link**: https://faucet.quicknode.com/ethereum/sepolia

**Yêu cầu**:
- Account Twitter hoặc GitHub

**Steps**:
1. Connect Twitter/GitHub
2. Paste địa chỉ ví
3. Request
4. ✅ Nhận 0.1 ETH

---

## 📍 Lấy địa chỉ ví MetaMask

1. Mở MetaMask extension
2. Click vào account name (ở trên)
3. Click icon **Copy** bên cạnh tên
4. ✅ Đã copy: `0xYourAddress...`

Hoặc:

1. Mở app tại `http://localhost:3000`
2. Connect MetaMask
3. Address hiển thị ở header (0x1234...5678)
4. Click để copy

---

## ✅ Kiểm tra đã nhận ETH

### Cách 1: MetaMask
1. Mở MetaMask
2. Đảm bảo đang ở **Sepolia Test Network**
3. Xem số dư ở giữa màn hình
4. Nếu thấy số > 0 → Success! ✅

### Cách 2: Sepolia Etherscan
1. Truy cập: https://sepolia.etherscan.io/
2. Paste địa chỉ ví vào search box
3. Click Search
4. Xem **Balance**: `X ETH`

---

## 🎯 Bao nhiêu ETH cần cho testing?

| Action | Gas Cost | Notes |
|--------|----------|-------|
| Mint NFT | ~0.002 ETH | Mỗi lần mint |
| List NFT | ~0.001 ETH | List lên marketplace |
| Buy NFT | ~0.003 ETH | Bao gồm giá NFT + gas |
| Cancel Listing | ~0.001 ETH | Remove khỏi marketplace |

**Tổng cho test đầy đủ**: ~0.02 ETH  
**Faucet cho**: 0.1 - 0.5 ETH  
**→ Đủ cho nhiều lần test!** ✅

---

## 🔄 Chuyển Network sang Sepolia

Nếu MetaMask đang ở network khác:

1. Click dropdown ở trên cùng MetaMask
2. Không thấy Sepolia?
   - Click **"Show test networks"**
   - Settings → Advanced → Show test networks = ON
3. Select **Sepolia Test Network**
4. ✅ Network đã đổi

---

## 🐛 Troubleshooting

### Faucet báo "Rate limit exceeded"
- Đã request quá nhiều
- Đợi 24h hoặc dùng faucet khác
- Hoặc dùng địa chỉ ví khác

### Chưa nhận ETH sau vài phút
- Check lại network (phải là Sepolia)
- Check transaction trên Etherscan
- Có thể mất 1-2 phút

### Faucet yêu cầu mainnet ETH
- Một số faucet yêu cầu có >= 0.001 ETH trên mainnet
- Dùng faucet khác không yêu cầu
- Hoặc deposit mainnet ETH vào ví

### Account mới không request được
- Một số faucet block account mới
- Đợi vài ngày
- Hoặc dùng faucet khác

---

## 💡 Tips

1. **Lưu test ETH**: Đừng spam transactions, test có mục đích
2. **Nhiều faucets**: Nếu 1 faucet hết, dùng faucet khác
3. **Test contracts trước**: Deploy trên local/Hardhat network trước
4. **Share**: Nếu bạn có thừa, có thể gửi cho teammate

---

## 📋 Quick Checklist

- [ ] Có MetaMask installed
- [ ] Switched to Sepolia network
- [ ] Copy địa chỉ ví
- [ ] Request từ faucet
- [ ] Đợi 1-2 phút
- [ ] Check balance > 0
- [ ] ✅ Ready to mint NFT!

---

## 🚀 After Getting Test ETH

1. Quay lại app: `http://localhost:3000`
2. Connect MetaMask (nếu chưa)
3. Navigate to **Create NFT**
4. Upload ảnh và mint!
5. 🎉 First NFT!

**Chúc bạn test thành công!** 🚀
