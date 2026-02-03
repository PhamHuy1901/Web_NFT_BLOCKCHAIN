NFT Marketplace System

Hệ thống Marketplace cho NFT, cho phép người dùng kết nối ví điện tử, đúc NFT từ hình ảnh, và thực hiện giao dịch mua bán minh bạch trên Blockchain.

A. Quản lý định danh (Authentication)
🔐 Kết nối ví (Connect Wallet)

Không sử dụng cơ chế đăng nhập/mật khẩu truyền thống.

Người dùng đăng nhập thông qua việc kết nối ví điện tử (ví dụ: MetaMask).

Địa chỉ ví đóng vai trò là danh tính duy nhất của người dùng trên hệ thống.

💰 Xác thực số dư

Hệ thống tự động kiểm tra số dư ETH/Token trong ví.

Đảm bảo người dùng đủ khả năng:

Chi trả phí gas

Thực hiện mua NFT hoặc niêm yết bán

B. Sáng tạo & Số hóa (Minting NFT)
📤 Tải lên & Lưu trữ (Upload & IPFS)

Người dùng tải file ảnh lên hệ thống.

File được lưu trữ trên IPFS (InterPlanetary File System) thay vì server truyền thống.

Hệ thống nhận về Hash IPFS, đảm bảo:

Dữ liệu không bị mất

Không phụ thuộc vào server web

🪙 Đúc NFT (Minting)

Ghi metadata vào Smart Contract, bao gồm:

Tên NFT

Mô tả

Đường dẫn IPFS

Tạo ra một Token duy nhất, đại diện cho tài sản số trên Blockchain.

C. Giao dịch thị trường (Marketplace Operations)
🏷️ Niêm yết giá (Listing)

Chủ sở hữu NFT đặt giá bán (ví dụ: 0.1 ETH).

Smart Contract:

Tạm khóa NFT

Hoặc cấp quyền chuyển nhượng cho Marketplace

🛒 Mua NFT (Buying)

Người mua gửi ETH vào Smart Contract.

Hợp đồng thông minh tự động thực hiện Atomic Swap:

Chuyển ETH cho người bán

Chuyển quyền sở hữu NFT cho người mua

Giao dịch đảm bảo an toàn – không thể gian lận

🔄 Hủy bán / Cập nhật giá

Người bán có thể:

Gỡ NFT khỏi Marketplace

Thay đổi giá bán

Chỉ áp dụng khi NFT chưa có người mua

D. Quản lý tài sản (Dashboard / Profile)
🖼️ Bộ sưu tập cá nhân (My Assets)

Hiển thị toàn bộ NFT mà địa chỉ ví đang sở hữu.

Dữ liệu được truy xuất trực tiếp từ Blockchain.

📜 Lịch sử giao dịch

Hiển thị thông tin giao dịch:

Người bán

Người mua

Thời gian

Giá giao dịch

Đảm bảo tính minh bạch và không thể chỉnh sửa