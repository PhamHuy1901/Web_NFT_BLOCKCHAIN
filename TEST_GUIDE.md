# 🧪 Hướng dẫn Test Frontend với Blockchain

## 🚀 Quick Start

### 1. Chạy Frontend
```powershell
cd d:\Blockchain\frontend
& npm.cmd run dev
```
Mở: http://localhost:3000

### 2. Cấu hình MetaMask
- Switch sang **Sepolia Test Network**
- Lấy Sepolia ETH: https://sepoliafaucet.com/

---

## 📝 Test Cases Chi Tiết

### Test 1: Connect Wallet ✅
**Steps:**
1. Truy cập http://localhost:3000
2. Click **"Connect Wallet"**
3. Approve trong MetaMask

**Expected:**
- Header hiển thị: `0x1234...5678`
- Network badge: "Sepolia"

---

### Test 2: Mint NFT 🎨
**Steps:**
1. Click **"Create NFT"**
2. Fill form:
   - Name: "My Test NFT"
   - Description: "Test description"
   - Upload image
3. Click **"Create NFT"**
4. Confirm trong MetaMask
5. Đợi ~15-30s

**Expected:**
- Success message
- NFT xuất hiện trong Profile
- Transaction trên Etherscan: https://sepolia.etherscan.io/address/0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6

**Gas Cost:** ~0.001-0.003 ETH

---

### Test 3: View Profile 👤
**Steps:**
1. Click **"Profile"**
2. Kiểm tra NFT list

**Expected:**
- Thấy tất cả NFTs bạn sở hữu
- Mỗi NFT hiển thị: image, name, tokenId

---

### Test 4: List NFT for Sale 💰
**Steps:**
1. Click vào NFT trong Profile
2. Click **"List for Sale"**
3. Nhập giá: `0.01` ETH
4. **TX 1:** Approve Marketplace → Confirm
5. **TX 2:** List NFT → Confirm

**Expected:**
- NFT hiện trên Marketplace (Home page)
- Status: "For Sale"
- Price: 0.01 ETH

**Gas Cost:** 
- Approve: ~0.0005 ETH
- List: ~0.001 ETH

---

### Test 5: Buy NFT 🛒
**Setup:**
- Cần 2 MetaMask accounts
- Account 2 cần có Sepolia ETH

**Steps (với Account 2):**
1. Switch sang Account 2
2. Connect wallet
3. Go to Marketplace (Home)
4. Click vào NFT đang sell
5. Click **"Buy Now"**
6. Confirm (pay 0.01 ETH + gas)

**Expected:**
- NFT transfer sang Account 2
- Account 1 nhận ~0.00975 ETH (0.01 - 2.5% fee)
- Marketplace nhận 0.00025 ETH fee

**Gas Cost:** ~0.002-0.003 ETH

---

### Test 6: Cancel Listing ❌
**Steps:**
1. Go to NFT detail
2. Click **"Cancel Listing"**
3. Confirm transaction

**Expected:**
- NFT removed khỏi Marketplace
- Status: "Not for sale"

**Gas Cost:** ~0.0005 ETH

---

### Test 7: Update Price 💵
**Steps:**
1. Go to listed NFT detail
2. Click **"Update Price"**
3. Nhập giá mới: `0.02` ETH
4. Confirm transaction

**Expected:**
- Price updated thành 0.02 ETH
- Event `PriceUpdated` trên Etherscan

**Gas Cost:** ~0.0005 ETH

---

## 🔍 Verification trên Etherscan

### Check NFT Contract
```
https://sepolia.etherscan.io/address/0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6#events
```

**Events:**
- `Transfer` - NFT transfers
- `NFTMinted` - Mint events
- `Approval` - Approvals

### Check Marketplace Contract
```
https://sepolia.etherscan.io/address/0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0#events
```

**Events:**
- `NFTListed` - List events
- `NFTSold` - Sale events
- `ListingCancelled` - Cancel events
- `PriceUpdated` - Price update events

---

## 🐛 Common Issues

### "User rejected transaction"
→ Bạn đã cancel trong MetaMask. Try again.

### "Insufficient funds"
→ Get more Sepolia ETH: https://sepoliafaucet.com/

### "execution reverted"
**Check:**
- Có phải owner của NFT?
- NFT đã approved chưa?
- Có đủ ETH để mua?

### "Network mismatch"
→ Switch MetaMask sang Sepolia

### NFT không hiện
→ Đợi 30s, refresh trang (F5)

### Transaction pending lâu
→ Increase gas price trong MetaMask

---

## 📊 Contract Functions

### NFT Contract (0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6)

```javascript
// Read
await nftContract.ownerOf(tokenId)
await nftContract.tokenURI(tokenId)
await nftContract.tokensOfOwner(address)
await nftContract.totalSupply()
await nftContract.getCreator(tokenId)

// Write
await nftContract.mintNFT(recipient, "ipfs://...")
await nftContract.approve(marketplaceAddress, tokenId)
await nftContract.transferFrom(from, to, tokenId)
```

### Marketplace Contract (0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0)

```javascript
// Read
await marketplace.getNFTListing(tokenId)
await marketplace.getAllListings()
await marketplace.marketplaceFee() // 250 = 2.5%
await marketplace.totalVolume()
await marketplace.totalFees()

// Write
await marketplace.listNFT(tokenId, ethers.parseEther("0.01"))
await marketplace.buyNFT(tokenId, { value: ethers.parseEther("0.01") })
await marketplace.cancelListing(tokenId)
await marketplace.updatePrice(tokenId, ethers.parseEther("0.02"))
await marketplace.withdrawFees() // Owner only
```

---

## ✅ Test Checklist

**Setup:**
- [ ] Frontend running on localhost:3000
- [ ] MetaMask installed
- [ ] Switched to Sepolia network
- [ ] Have Sepolia ETH

**Basic Tests:**
- [ ] Connect wallet
- [ ] Mint NFT
- [ ] View NFT in Profile
- [ ] View NFT detail page

**Marketplace Tests:**
- [ ] List NFT for sale
- [ ] View listing on Marketplace
- [ ] Buy NFT (với account khác)
- [ ] Cancel listing
- [ ] Update price

**Blockchain Verification:**
- [ ] Check transactions trên Etherscan
- [ ] Verify events emitted
- [ ] Verify NFT ownership changed

---

## 💡 Testing Tips

### Multiple Accounts
```
Account 1: Seller (mint + list NFTs)
Account 2: Buyer (buy NFTs)
Account 3: Testing (various operations)
```

### Gas Management
- Keep ~0.1 ETH trong mỗi account
- Monitor gas prices: https://etherscan.io/gastracker
- Use "Medium" gas speed cho test

### IPFS for Images
Free IPFS services:
- Pinata: https://pinata.cloud/
- NFT.Storage: https://nft.storage/
- Web3.Storage: https://web3.storage/

### Browser Dev Tools
```javascript
// Console commands để test
const { ethereum } = window
const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
const chainId = await ethereum.request({ method: 'eth_chainId' })
console.log('Account:', accounts[0])
console.log('Chain:', chainId) // Should be 0xaa36a7 (Sepolia)
```

---

## 🎯 Performance Testing

### Load Testing
1. Mint 10 NFTs
2. List tất cả
3. Check HomePage load time
4. **Expected:** < 3 seconds

### Transaction Testing
1. Execute 5 transactions liên tiếp
2. Monitor gas costs
3. **Expected:** All confirm trong 2 minutes

### Error Handling
1. Try buy NFT without enough ETH
2. Try list NFT bạn không own
3. Try cancel listing của người khác
4. **Expected:** Clear error messages

---

**Happy Testing! 🚀**

Nếu gặp vấn đề, check:
- Browser console (F12)
- MetaMask activity tab
- Etherscan transactions
- Network connection
