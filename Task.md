1. Thành viên 1: Smart Contract & Blockchain Core (Thay thế vị trí Database)
Nhiệm vụ:
Viết code Solidity cho Smart Contract (ERC-721).
Xử lý các hàm: Mint (Tạo NFT) , Transfer (Chuyển quyền sở hữu), Buy/Sell (Giao dịch).
Triển khai (Deploy) contract lên mạng Testnet (Sepolia).
Viết Unit Test để đảm bảo tiền không bị mất.
Tương ứng trong file của bạn: Mục B (Minting) và C (Giao dịch).

2. Thành viên 2: Frontend & Web3 Integration
Vị trí này nặng nhất về mặt tương tác người dùng.
Nhiệm vụ:
Thiết kế giao diện (UI) Marketplace.
Quan trọng: Tích hợp thư viện Web3 (Ethers.js hoặc Wagmi) để kết nối ví MetaMask.
Xử lý logic hiển thị: Lấy danh sách NFT từ Blockchain về hiển thị lên web.
Xử lý trải nghiệm người dùng (Loading, thông báo lỗi khi giao dịch thất bại).
Tương ứng trong file của bạn: Mục A (Định danh) và D (Quản lý tài sản).

3. Thành viên 3: Storage & Backend Service (Hỗ trợ)
Vị trí này xử lý các phần dữ liệu "ngoài chuỗi" (Off-chain) để giảm tải cho Blockchain.
Nhiệm vụ:
Xử lý IPFS: Viết API hoặc Service để upload ảnh lên IPFS và lấy mã Hash về cho Smart Contract.
Làm Backend phụ (Optional): Dùng Node.js/.NET để lưu thông tin phụ (như User Profile, Lượt like, Comment) mà Blockchain không lưu.
Indexing: Vì truy vấn dữ liệu trực tiếp từ Blockchain rất chậm, bạn này có thể làm một database đệm (như MongoDB) để đồng bộ dữ liệu từ Blockchain về, giúp website load nhanh hơn.