// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTAuction
 * @dev Contract cho phép đấu giá NFT
 * @notice Contract này cho phép tạo auction, đặt bid, kết thúc và hủy auction
 */
contract NFTAuction is ReentrancyGuard, Ownable {
    
    // Struct cho Auction
    struct Auction {
        uint256 auctionId;
        uint256 tokenId;
        address seller;
        uint256 startingPrice;
        uint256 reservePrice;      // Giá tối thiểu để auction thành công
        uint256 highestBid;
        address highestBidder;
        uint256 startTime;
        uint256 endTime;
        bool ended;
        bool cancelled;
    }

    // NFT contract address
    IERC721 public nftContract;

    // Phí đấu giá (2.5% = 250 basis points)
    uint256 public auctionFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Thời gian tối thiểu cho auction (1 giờ)
    uint256 public constant MIN_AUCTION_DURATION = 1 hours;
    
    // Thời gian tối đa cho auction (30 ngày)
    uint256 public constant MAX_AUCTION_DURATION = 30 days;
    
    // Thời gian gia hạn khi có bid trong phút cuối (5 phút)
    uint256 public constant TIME_EXTENSION = 5 minutes;
    
    // Phần trăm tối thiểu phải bid cao hơn (5%)
    uint256 public constant MIN_BID_INCREMENT = 500; // 5%

    // Auction ID counter
    uint256 private _auctionIdCounter;

    // Mapping từ auctionId sang Auction
    mapping(uint256 => Auction) public auctions;

    // Mapping từ tokenId sang auctionId (để check NFT đang được đấu giá)
    mapping(uint256 => uint256) public tokenAuction;

    // Mapping để track bid của user trong mỗi auction (để refund)
    mapping(uint256 => mapping(address => uint256)) public pendingReturns;

    // Danh sách auction IDs đang active
    uint256[] private activeAuctionIds;
    mapping(uint256 => uint256) private auctionIdToIndex;

    // Tracking statistics
    uint256 public totalAuctions;
    uint256 public totalVolume;
    uint256 public totalFees;

    // Events
    event AuctionCreated(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 startingPrice,
        uint256 reservePrice,
        uint256 startTime,
        uint256 endTime
    );

    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount,
        uint256 newEndTime
    );

    event AuctionEnded(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed winner,
        uint256 finalPrice
    );

    event AuctionCancelled(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed seller
    );

    event BidWithdrawn(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );

    /**
     * @dev Constructor
     * @param _nftContract Địa chỉ của NFT contract
     */
    constructor(address _nftContract) {
        require(_nftContract != address(0), "Invalid NFT contract address");
        nftContract = IERC721(_nftContract);
    }

    /**
     * @dev Tạo auction mới
     * @param tokenId ID của NFT cần đấu giá
     * @param startingPrice Giá khởi điểm (wei)
     * @param reservePrice Giá tối thiểu để auction thành công (wei)
     * @param duration Thời gian đấu giá (seconds)
     */
    function createAuction(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 reservePrice,
        uint256 duration
    ) external nonReentrant {
        require(startingPrice > 0, "Starting price must be > 0");
        require(reservePrice >= startingPrice, "Reserve must be >= starting price");
        require(duration >= MIN_AUCTION_DURATION, "Duration too short");
        require(duration <= MAX_AUCTION_DURATION, "Duration too long");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(
            nftContract.getApproved(tokenId) == address(this) ||
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Auction not approved"
        );
        require(tokenAuction[tokenId] == 0, "NFT already in auction");

        _auctionIdCounter++;
        uint256 auctionId = _auctionIdCounter;

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;

        auctions[auctionId] = Auction({
            auctionId: auctionId,
            tokenId: tokenId,
            seller: msg.sender,
            startingPrice: startingPrice,
            reservePrice: reservePrice,
            highestBid: 0,
            highestBidder: address(0),
            startTime: startTime,
            endTime: endTime,
            ended: false,
            cancelled: false
        });

        tokenAuction[tokenId] = auctionId;

        // Thêm vào danh sách active
        auctionIdToIndex[auctionId] = activeAuctionIds.length;
        activeAuctionIds.push(auctionId);

        totalAuctions++;

        // Transfer NFT vào contract để giữ
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        emit AuctionCreated(
            auctionId,
            tokenId,
            msg.sender,
            startingPrice,
            reservePrice,
            startTime,
            endTime
        );
    }

    /**
     * @dev Đặt bid cho auction
     * @param auctionId ID của auction
     */
    function placeBid(uint256 auctionId) external payable nonReentrant {
        Auction storage auction = auctions[auctionId];
        
        require(auction.auctionId != 0, "Auction does not exist");
        require(!auction.ended, "Auction already ended");
        require(!auction.cancelled, "Auction cancelled");
        require(block.timestamp >= auction.startTime, "Auction not started");
        require(block.timestamp < auction.endTime, "Auction expired");
        require(msg.sender != auction.seller, "Seller cannot bid");

        uint256 currentBid = auction.highestBid;
        uint256 minBid;

        if (currentBid == 0) {
            // Bid đầu tiên phải >= starting price
            minBid = auction.startingPrice;
        } else {
            // Bid tiếp theo phải cao hơn ít nhất MIN_BID_INCREMENT%
            minBid = currentBid + (currentBid * MIN_BID_INCREMENT / FEE_DENOMINATOR);
        }

        require(msg.value >= minBid, "Bid too low");

        // Hoàn tiền cho bidder trước đó
        if (auction.highestBidder != address(0)) {
            pendingReturns[auctionId][auction.highestBidder] += auction.highestBid;
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        // Gia hạn thời gian nếu bid trong TIME_EXTENSION cuối
        uint256 newEndTime = auction.endTime;
        if (auction.endTime - block.timestamp < TIME_EXTENSION) {
            newEndTime = block.timestamp + TIME_EXTENSION;
            auction.endTime = newEndTime;
        }

        emit BidPlaced(auctionId, msg.sender, msg.value, newEndTime);
    }

    /**
     * @dev Kết thúc auction
     * @param auctionId ID của auction
     */
    function endAuction(uint256 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        
        require(auction.auctionId != 0, "Auction does not exist");
        require(!auction.ended, "Auction already ended");
        require(!auction.cancelled, "Auction cancelled");
        require(block.timestamp >= auction.endTime, "Auction not yet ended");

        auction.ended = true;
        _removeActiveAuction(auctionId);
        delete tokenAuction[auction.tokenId];

        if (auction.highestBid >= auction.reservePrice && auction.highestBidder != address(0)) {
            // Auction thành công
            uint256 fee = (auction.highestBid * auctionFee) / FEE_DENOMINATOR;
            uint256 sellerAmount = auction.highestBid - fee;

            totalVolume += auction.highestBid;
            totalFees += fee;

            // Transfer NFT cho winner
            nftContract.safeTransferFrom(address(this), auction.highestBidder, auction.tokenId);

            // Transfer tiền cho seller
            (bool successSeller, ) = payable(auction.seller).call{value: sellerAmount}("");
            require(successSeller, "Transfer to seller failed");

            emit AuctionEnded(auctionId, auction.tokenId, auction.highestBidder, auction.highestBid);
        } else {
            // Auction thất bại - trả NFT về cho seller
            nftContract.safeTransferFrom(address(this), auction.seller, auction.tokenId);

            // Hoàn tiền cho highest bidder nếu có
            if (auction.highestBidder != address(0)) {
                pendingReturns[auctionId][auction.highestBidder] += auction.highestBid;
            }

            emit AuctionEnded(auctionId, auction.tokenId, address(0), 0);
        }
    }

    /**
     * @dev Hủy auction (chỉ khi chưa có bid hoặc seller muốn hủy)
     * @param auctionId ID của auction
     */
    function cancelAuction(uint256 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        
        require(auction.auctionId != 0, "Auction does not exist");
        require(!auction.ended, "Auction already ended");
        require(!auction.cancelled, "Auction already cancelled");
        require(msg.sender == auction.seller, "Not the seller");
        require(auction.highestBidder == address(0), "Cannot cancel with active bids");

        auction.cancelled = true;
        _removeActiveAuction(auctionId);
        delete tokenAuction[auction.tokenId];

        // Trả NFT về cho seller
        nftContract.safeTransferFrom(address(this), auction.seller, auction.tokenId);

        emit AuctionCancelled(auctionId, auction.tokenId, auction.seller);
    }

    /**
     * @dev Rút tiền bid đã bị outbid
     * @param auctionId ID của auction
     */
    function withdrawBid(uint256 auctionId) external nonReentrant {
        uint256 amount = pendingReturns[auctionId][msg.sender];
        require(amount > 0, "No funds to withdraw");

        pendingReturns[auctionId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit BidWithdrawn(auctionId, msg.sender, amount);
    }

    /**
     * @dev Lấy thông tin auction
     */
    function getAuction(uint256 auctionId) 
        external 
        view 
        returns (Auction memory) 
    {
        require(auctions[auctionId].auctionId != 0, "Auction does not exist");
        return auctions[auctionId];
    }

    /**
     * @dev Lấy tất cả auctions đang active
     */
    function getActiveAuctions() 
        external 
        view 
        returns (Auction[] memory) 
    {
        uint256 activeCount = 0;
        
        // Đếm số auction thực sự còn active (chưa hết hạn)
        for (uint256 i = 0; i < activeAuctionIds.length; i++) {
            Auction memory auction = auctions[activeAuctionIds[i]];
            if (!auction.ended && !auction.cancelled && block.timestamp < auction.endTime) {
                activeCount++;
            }
        }

        Auction[] memory activeAuctions = new Auction[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < activeAuctionIds.length; i++) {
            Auction memory auction = auctions[activeAuctionIds[i]];
            if (!auction.ended && !auction.cancelled && block.timestamp < auction.endTime) {
                activeAuctions[index] = auction;
                index++;
            }
        }
        
        return activeAuctions;
    }

    /**
     * @dev Lấy auctions của một seller
     */
    function getAuctionsBySeller(address seller) 
        external 
        view 
        returns (Auction[] memory) 
    {
        uint256 count = 0;
        
        // Đếm số auction của seller
        for (uint256 i = 1; i <= _auctionIdCounter; i++) {
            if (auctions[i].seller == seller) {
                count++;
            }
        }

        Auction[] memory sellerAuctions = new Auction[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _auctionIdCounter; i++) {
            if (auctions[i].seller == seller) {
                sellerAuctions[index] = auctions[i];
                index++;
            }
        }
        
        return sellerAuctions;
    }

    /**
     * @dev Lấy auctions mà user đã bid
     */
    function getAuctionsByBidder(address bidder) 
        external 
        view 
        returns (Auction[] memory) 
    {
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _auctionIdCounter; i++) {
            if (auctions[i].highestBidder == bidder || pendingReturns[i][bidder] > 0) {
                count++;
            }
        }

        Auction[] memory bidderAuctions = new Auction[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _auctionIdCounter; i++) {
            if (auctions[i].highestBidder == bidder || pendingReturns[i][bidder] > 0) {
                bidderAuctions[index] = auctions[i];
                index++;
            }
        }
        
        return bidderAuctions;
    }

    /**
     * @dev Kiểm tra NFT có đang trong auction không
     */
    function isInAuction(uint256 tokenId) external view returns (bool) {
        uint256 auctionId = tokenAuction[tokenId];
        if (auctionId == 0) return false;
        
        Auction memory auction = auctions[auctionId];
        return !auction.ended && !auction.cancelled && block.timestamp < auction.endTime;
    }

    /**
     * @dev Lấy số tiền pending có thể withdraw
     */
    function getPendingReturns(uint256 auctionId, address bidder) 
        external 
        view 
        returns (uint256) 
    {
        return pendingReturns[auctionId][bidder];
    }

    /**
     * @dev Tính minimum bid tiếp theo
     */
    function getMinimumBid(uint256 auctionId) external view returns (uint256) {
        Auction memory auction = auctions[auctionId];
        require(auction.auctionId != 0, "Auction does not exist");
        
        if (auction.highestBid == 0) {
            return auction.startingPrice;
        }
        return auction.highestBid + (auction.highestBid * MIN_BID_INCREMENT / FEE_DENOMINATOR);
    }

    /**
     * @dev Update auction fee (chỉ owner)
     */
    function setAuctionFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        auctionFee = newFee;
    }

    /**
     * @dev Withdraw accumulated fees (chỉ owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Internal function để xóa auction khỏi danh sách active
     */
    function _removeActiveAuction(uint256 auctionId) private {
        uint256 index = auctionIdToIndex[auctionId];
        uint256 lastIndex = activeAuctionIds.length - 1;

        if (index != lastIndex) {
            uint256 lastAuctionId = activeAuctionIds[lastIndex];
            activeAuctionIds[index] = lastAuctionId;
            auctionIdToIndex[lastAuctionId] = index;
        }

        activeAuctionIds.pop();
        delete auctionIdToIndex[auctionId];
    }

    /**
     * @dev Receive function để nhận ETH
     */
    receive() external payable {}

    /**
     * @dev Required for ERC721 safeTransferFrom
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
