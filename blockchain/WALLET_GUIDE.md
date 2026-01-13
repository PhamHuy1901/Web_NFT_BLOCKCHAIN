# 🪙 Hướng Dẫn Kết Nối Ví và Trao Đổi NFTToken

## 📍 Thông Tin Token Của Bạn

```
Token Name: NFTToken
Symbol: NFT
Contract Address: 0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF
Network: Hoodi Network
Chain ID: 560048
Total Supply: 1,000,000 NFT
Owner: 0xd19f7cF40D4a16013995BEa0AC444Ca13B13cbE1
```

---

## 🔗 BƯỚC 1: Thêm Mạng Hoodi vào MetaMask

### Cách 1: Thêm Thủ Công

1. **Mở MetaMask** → Click vào dropdown network ở trên
2. Click **"Add Network"** hoặc **"Add a network manually"**
3. Điền thông tin:

```
Network Name: Hoodi Network
New RPC URL: https://0xrpc.io/hoodi
Chain ID: 560048
Currency Symbol: ETH
Block Explorer URL: (để trống nếu không có)
```

4. Click **"Save"**
5. Chuyển sang mạng **Hoodi Network**

### Cách 2: Nhanh (Nếu có file config)

```javascript
// Trong MetaMask, vào Settings → Networks → Add Network
// Import file này hoặc copy thông tin trên
```

---

## 💰 BƯỚC 2: Import Ví Vào MetaMask

Bạn có 2 lựa chọn:

### Option A: Dùng Ví Hiện Tại (An Toàn Hơn)
- Chuyển NFT từ ví deploy sang ví MetaMask của bạn

### Option B: Import Ví Deploy
1. Mở MetaMask
2. Click vào icon tài khoản → **"Import Account"**
3. Chọn **"Private Key"**
4. Paste private key:
   ```
   0x5f6686bec8c40d1304879188c86d605d0df9e252b9643efbe63f7ec4bb682833
   ```
5. Click **"Import"**

⚠️ **LƯU Ý:** KHÔNG BAO GIỜ chia sẻ private key với ai!

---

## 🪙 BƯỚC 3: Thêm Token NFT vào MetaMask

1. Đảm bảo đang ở mạng **Hoodi Network**
2. Trong MetaMask, kéo xuống dưới và click **"Import tokens"**
3. Chọn tab **"Custom token"**
4. Điền thông tin:

```
Token Contract Address: 0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF
Token Symbol: NFT
Token Decimal: 18
```

5. Click **"Add Custom Token"**
6. Click **"Import Tokens"**
7. ✅ Token NFT của bạn sẽ hiện ra với số dư **1,000,000 NFT**!

---

## 💸 BƯỚC 4: Thực Hiện Giao Dịch

### A. Qua MetaMask (Đơn Giản Nhất)

1. Mở MetaMask, chọn token **NFT**
2. Click **"Send"**
3. Nhập địa chỉ người nhận
4. Nhập số lượng NFT muốn gửi
5. Click **"Next"** → **"Confirm"**
6. ✅ Hoàn thành!

### B. Qua Script (Linh Hoạt Hơn)

#### 1. Kiểm Tra Balance:
```bash
npx hardhat run scripts/interact-token.js --network hoodi
```

#### 2. Transfer Token (Interactive):
```bash
npx hardhat run scripts/transfer-token.js --network hoodi
```

Sau đó nhập:
- Địa chỉ người nhận
- Số lượng NFT
- Xác nhận giao dịch

#### 3. Transfer Token (Trực Tiếp):

Chỉnh sửa file `scripts/interact-token.js`:

```javascript
// Uncomment và điền thông tin:
const recipientAddress = "0x..."; // Địa chỉ người nhận
const amount = hre.ethers.parseEther("100"); // 100 NFT
const tx = await token.transfer(recipientAddress, amount);
await tx.wait();
console.log("✅ Transferred 100 NFT");
```

Chạy:
```bash
npx hardhat run scripts/interact-token.js --network hoodi
```

---

## 🔧 BƯỚC 5: Các Thao Tác Khác

### Check Balance Của Bất Kỳ Địa Chỉ Nào:

```bash
npx hardhat console --network hoodi
```

Trong console:
```javascript
const token = await ethers.getContractAt("NFTToken", "0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF")

// Check balance
await token.balanceOf("0x...")

// Check token info
await token.name()
await token.symbol()
await token.totalSupply()
```

### Approve Token (Cho Smart Contract Khác Dùng):

```javascript
const spender = "0x..."; // Địa chỉ contract hoặc ví khác
const amount = ethers.parseEther("1000");
await token.approve(spender, amount);
```

### Transfer From (Sau khi được approve):

```javascript
const from = "0x...";
const to = "0x...";
const amount = ethers.parseEther("100");
await token.transferFrom(from, to, amount);
```

---

## 🎯 Commands Nhanh

```bash
# Xem thông tin token và balance
npx hardhat run scripts/interact-token.js --network hoodi

# Transfer token (interactive)
npx hardhat run scripts/transfer-token.js --network hoodi

# Console để thao tác tự do
npx hardhat console --network hoodi

# Check balance ví
npx hardhat run scripts/check-balance.js --network hoodi
```

---

## 🌐 Tích Hợp Vào Website/DApp

### Kết Nối MetaMask Trong Web:

```javascript
// Kết nối ví
async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer;
  }
}

// Switch sang Hoodi network
async function switchToHoodi() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x88E50' }], // 560048 in hex
    });
  } catch (error) {
    // Nếu chưa có network, thêm mới
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x88E50',
          chainName: 'Hoodi Network',
          rpcUrls: ['https://0xrpc.io/hoodi'],
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
        }]
      });
    }
  }
}

// Interact với token
async function getTokenBalance(address) {
  const signer = await connectWallet();
  const tokenAddress = "0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF";
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
  ];
  const token = new ethers.Contract(tokenAddress, abi, signer);
  return await token.balanceOf(address);
}

async function transferToken(to, amount) {
  const signer = await connectWallet();
  const tokenAddress = "0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF";
  const abi = ["function transfer(address to, uint256 amount) returns (bool)"];
  const token = new ethers.Contract(tokenAddress, abi, signer);
  const tx = await token.transfer(to, ethers.parseEther(amount));
  await tx.wait();
  return tx.hash;
}
```

---

## 📱 Ví Dụ Transfer Token

```bash
# Bước 1: Chạy script transfer
npx hardhat run scripts/transfer-token.js --network hoodi

# Bước 2: Nhập thông tin khi được hỏi
📮 Enter recipient address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
💵 Enter amount to transfer (NFT): 1000
✅ Confirm transfer? (yes/no): yes

# Bước 3: Đợi transaction complete
✅ Transfer Successful!
💰 Your New Balance: 999000.0 NFT
💰 Recipient Balance: 1000.0 NFT
```

---

## 🔐 Bảo Mật

- ✅ KHÔNG chia sẻ private key
- ✅ KHÔNG commit file `.env` lên Git
- ✅ Luôn kiểm tra địa chỉ người nhận trước khi transfer
- ✅ Test với số lượng nhỏ trước
- ✅ Backup private key an toàn

---

## 🎉 Hoàn Thành!

Bây giờ bạn có thể:
- ✅ Xem token NFT trong MetaMask
- ✅ Transfer token cho người khác
- ✅ Sử dụng token trong DApp
- ✅ Tích hợp vào website của bạn

Token của bạn đã sẵn sàng để giao dịch! 🚀
