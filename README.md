A. Quản lý định danh (Authentication)
Kết nối Ví (Connect Wallet): Không sử dụng đăng nhập/mật khẩu truyền thống. Người dùng đăng nhập bằng cách kết nối ví điện tử (như MetaMask).
Xác thực số dư: Hệ thống tự động kiểm tra số dư (ETH/Token) trong ví để đảm bảo người dùng đủ khả năng chi trả phí gas hoặc mua vật phẩm.
B. Sáng tạo & Số hóa (Minting NFT)
Tải lên & Lưu trữ (Upload & IPFS): Người dùng tải file ảnh lên. Hệ thống sẽ đẩy file này lên mạng IPFS (để lấy mã băm - Hash) thay vì lưu trên server, đảm bảo ảnh không bị mất dù server web bị sập.
Đúc NFT (Minting): Ghi thông tin metadata (tên ảnh, mô tả, đường dẫn IPFS) vào Smart Contract để tạo ra một Token duy nhất đại diện cho bức ảnh đó trên Blockchain.
C. Giao dịch thị trường (Marketplace Operations)
Niêm yết giá (Listing): Chủ sở hữu NFT đặt mức giá bán (ví dụ: 0.1 ETH). Smart Contract sẽ tạm khóa NFT hoặc cấp quyền chuyển nhượng cho sàn.
Mua NFT (Buying): Người mua gửi ETH vào Smart Contract. Hợp đồng thông minh tự động thực hiện 2 việc cùng lúc: chuyển tiền cho người bán và chuyển quyền sở hữu NFT cho người mua (Atomic Swap - Giao dịch nguyên tử).
Hủy bán/Cập nhật giá: Người bán có thể gỡ sản phẩm khỏi sàn hoặc thay đổi giá nếu chưa có ai mua.
D. Quản lý tài sản (Dashboard/Profile)
Bộ sưu tập cá nhân (My Assets): Hiển thị danh sách các NFT mà địa chỉ ví đang sở hữu.
Lịch sử giao dịch: Truy xuất dữ liệu từ Blockchain để hiển thị ai đã mua của ai, vào thời gian nào, giá bao nhiêu (tính minh bạch).
