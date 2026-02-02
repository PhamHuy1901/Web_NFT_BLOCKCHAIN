// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTMarketplace
 * @dev Marketplace contract cho việc mua bán NFT
 * @notice Contract này cho phép list, buy, cancel và update giá NFT
 */
contract NFTMarketplace is ReentrancyGuard, Ownable {
    
    // Struct cho listing
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isListed;
    }

    // NFT contract address
    IERC721 public nftContract;

    // Phí marketplace (2.5% = 250 basis points)
    uint256 public marketplaceFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Mapping từ tokenId sang Listing
    mapping(uint256 => Listing) public listings;

    // Danh sách tất cả token IDs đang được list
    uint256[] private listedTokenIds;
    mapping(uint256 => uint256) private tokenIdToIndex;

    // Tracking tổng doanh thu và phí
    uint256 public totalVolume;
    uint256 public totalFees;

    // Events
    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event NFTSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    event ListingCancelled(
        uint256 indexed tokenId,
        address indexed seller
    );

    event PriceUpdated(
        uint256 indexed tokenId,
        uint256 oldPrice,
        uint256 newPrice
    );

    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);

    /**
     * @dev Constructor
     * @param _nftContract Địa chỉ của NFT contract
     */
    constructor(address _nftContract) {
        require(_nftContract != address(0), "Invalid NFT contract address");
        nftContract = IERC721(_nftContract);
    }

    /**
     * @dev List NFT lên marketplace
     * @param tokenId ID của NFT cần list
     * @param price Giá bán (wei)
     */
    function listNFT(uint256 tokenId, uint256 price) 
        external 
        nonReentrant 
    {
        require(price > 0, "Price must be greater than 0");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(
            nftContract.getApproved(tokenId) == address(this) ||
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );
        require(!listings[tokenId].isListed, "Already listed");

        // Tạo listing
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isListed: true
        });

        // Thêm vào danh sách
        tokenIdToIndex[tokenId] = listedTokenIds.length;
        listedTokenIds.push(tokenId);

        emit NFTListed(tokenId, msg.sender, price);
    }

    /**
     * @dev Mua NFT từ marketplace
     * @param tokenId ID của NFT cần mua
     */
    function buyNFT(uint256 tokenId) 
        external 
        payable 
        nonReentrant 
    {
        Listing memory listing = listings[tokenId];
        
        require(listing.isListed, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy your own NFT");

        address seller = listing.seller;
        uint256 price = listing.price;

        // Xóa listing
        _removeListing(tokenId);

        // Tính phí và số tiền cho seller
        uint256 fee = (price * marketplaceFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = price - fee;

        // Update statistics
        totalVolume += price;
        totalFees += fee;

        // Transfer NFT cho buyer
        nftContract.safeTransferFrom(seller, msg.sender, tokenId);

        // Transfer tiền cho seller
        (bool successSeller, ) = payable(seller).call{value: sellerAmount}("");
        require(successSeller, "Transfer to seller failed");

        // Hoàn lại tiền thừa nếu có
        if (msg.value > price) {
            (bool successRefund, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(successRefund, "Refund failed");
        }

        emit NFTSold(tokenId, seller, msg.sender, price);
    }

    /**
     * @dev Hủy listing
     * @param tokenId ID của NFT cần hủy
     */
    function cancelListing(uint256 tokenId) 
        external 
        nonReentrant 
    {
        Listing memory listing = listings[tokenId];
        
        require(listing.isListed, "NFT not listed");
        require(msg.sender == listing.seller, "Not the seller");

        _removeListing(tokenId);

        emit ListingCancelled(tokenId, msg.sender);
    }

    /**
     * @dev Cập nhật giá listing
     * @param tokenId ID của NFT
     * @param newPrice Giá mới
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) 
        external 
        nonReentrant 
    {
        require(newPrice > 0, "Price must be greater than 0");
        
        Listing storage listing = listings[tokenId];
        
        require(listing.isListed, "NFT not listed");
        require(msg.sender == listing.seller, "Not the seller");

        uint256 oldPrice = listing.price;
        listing.price = newPrice;

        emit PriceUpdated(tokenId, oldPrice, newPrice);
    }

    /**
     * @dev Lấy thông tin listing
     */
    function getNFTListing(uint256 tokenId) 
        external 
        view 
        returns (
            address seller,
            uint256 price,
            bool isListed
        ) 
    {
        Listing memory listing = listings[tokenId];
        return (listing.seller, listing.price, listing.isListed);
    }

    /**
     * @dev Lấy tất cả listings
     */
    function getAllListings() 
        external 
        view 
        returns (Listing[] memory) 
    {
        Listing[] memory activeListings = new Listing[](listedTokenIds.length);
        
        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            activeListings[i] = listings[listedTokenIds[i]];
        }
        
        return activeListings;
    }

    /**
     * @dev Lấy số lượng listings đang active
     */
    function getListingCount() external view returns (uint256) {
        return listedTokenIds.length;
    }

    /**
     * @dev Update marketplace fee (chỉ owner)
     */
    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        uint256 oldFee = marketplaceFee;
        marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(oldFee, newFee);
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
     * @dev Internal function để xóa listing
     */
    function _removeListing(uint256 tokenId) private {
        delete listings[tokenId];

        // Remove from array
        uint256 index = tokenIdToIndex[tokenId];
        uint256 lastIndex = listedTokenIds.length - 1;

        if (index != lastIndex) {
            uint256 lastTokenId = listedTokenIds[lastIndex];
            listedTokenIds[index] = lastTokenId;
            tokenIdToIndex[lastTokenId] = index;
        }

        listedTokenIds.pop();
        delete tokenIdToIndex[tokenId];
    }

    /**
     * @dev Force cancel listing khi NFT đã được bán qua contract khác (Offer, Auction)
     * Ai cũng có thể gọi, nhưng chỉ xóa nếu seller không còn sở hữu NFT
     * @param tokenId ID của NFT cần cancel listing
     */
    function forceRemoveListing(uint256 tokenId) external nonReentrant {
        Listing memory listing = listings[tokenId];
        
        // Chỉ xử lý nếu đang được list
        if (!listing.isListed) {
            return;
        }
        
        // Kiểm tra owner hiện tại của NFT
        address currentOwner = nftContract.ownerOf(tokenId);
        
        // Nếu seller không còn là owner → xóa listing
        require(currentOwner != listing.seller, "Seller still owns the NFT");
        
        _removeListing(tokenId);
        
        emit ListingCancelled(tokenId, listing.seller);
    }

    /**
     * @dev Receive function để nhận ETH
     */
    receive() external payable {}
}
