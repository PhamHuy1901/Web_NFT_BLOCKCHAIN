// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interface cho Marketplace contract
interface IMarketplace {
    function forceRemoveListing(uint256 tokenId) external;
    function getNFTListing(uint256 tokenId) external view returns (address seller, uint256 price, bool isListed);
}

/**
 * @title NFTOffer
 * @dev Contract cho phép trả giá (make offer) cho NFT
 * @notice Người mua có thể đề xuất giá, người bán có thể chấp nhận hoặc từ chối
 */
contract NFTOffer is ReentrancyGuard, Ownable {
    
    // Struct cho Offer
    struct Offer {
        uint256 offerId;
        uint256 tokenId;
        address offerer;        // Người trả giá
        uint256 offerPrice;     // Giá đề xuất
        uint256 expirationTime; // Thời gian hết hạn
        bool isActive;          // Còn hiệu lực không
        bool isAccepted;        // Đã được chấp nhận chưa
    }

    // NFT contract address
    IERC721 public nftContract;
    
    // Marketplace contract address
    IMarketplace public marketplaceContract;

    // Phí giao dịch (2.5% = 250 basis points)
    uint256 public offerFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Thời gian mặc định cho offer (7 ngày)
    uint256 public constant DEFAULT_EXPIRATION = 7 days;
    
    // Thời gian tối thiểu cho offer (1 giờ)
    uint256 public constant MIN_EXPIRATION = 1 hours;
    
    // Thời gian tối đa cho offer (30 ngày)
    uint256 public constant MAX_EXPIRATION = 30 days;

    // Offer ID counter
    uint256 private _offerIdCounter;

    // Mapping từ offerId sang Offer
    mapping(uint256 => Offer) public offers;

    // Mapping từ tokenId sang danh sách offerIds
    mapping(uint256 => uint256[]) public tokenOffers;
    
    // Mapping từ offerer sang danh sách offerIds
    mapping(address => uint256[]) public userOffers;

    // Tracking statistics
    uint256 public totalOffers;
    uint256 public totalAcceptedOffers;
    uint256 public totalVolume;
    uint256 public totalFees;

    // Events
    event OfferCreated(
        uint256 indexed offerId,
        uint256 indexed tokenId,
        address indexed offerer,
        uint256 offerPrice,
        uint256 expirationTime
    );

    event OfferAccepted(
        uint256 indexed offerId,
        uint256 indexed tokenId,
        address indexed seller,
        address offerer,
        uint256 price
    );

    event OfferCancelled(
        uint256 indexed offerId,
        uint256 indexed tokenId,
        address indexed offerer
    );

    event OfferUpdated(
        uint256 indexed offerId,
        uint256 oldPrice,
        uint256 newPrice
    );

    /**
     * @dev Constructor
     * @param _nftContract Địa chỉ của NFT contract
     * @param _marketplaceContract Địa chỉ của Marketplace contract
     */
    constructor(address _nftContract, address _marketplaceContract) {
        require(_nftContract != address(0), "Invalid NFT contract address");
        require(_marketplaceContract != address(0), "Invalid Marketplace contract address");
        nftContract = IERC721(_nftContract);
        marketplaceContract = IMarketplace(_marketplaceContract);
    }
    
    /**
     * @dev Cập nhật địa chỉ Marketplace contract (chỉ owner)
     * @param _marketplaceContract Địa chỉ mới của Marketplace contract
     */
    function setMarketplaceContract(address _marketplaceContract) external onlyOwner {
        require(_marketplaceContract != address(0), "Invalid Marketplace contract address");
        marketplaceContract = IMarketplace(_marketplaceContract);
    }

    /**
     * @dev Tạo offer mới cho một NFT
     * @param tokenId ID của NFT muốn trả giá
     * @param expirationDuration Thời gian hiệu lực của offer (seconds), 0 = mặc định 7 ngày
     */
    function makeOffer(uint256 tokenId, uint256 expirationDuration) 
        external 
        payable 
        nonReentrant 
    {
        require(msg.value > 0, "Offer must be greater than 0");
        
        // Kiểm tra NFT tồn tại
        address tokenOwner = nftContract.ownerOf(tokenId);
        require(tokenOwner != address(0), "Token does not exist");
        require(tokenOwner != msg.sender, "Cannot offer on your own NFT");

        // Xử lý expiration time
        uint256 expiration;
        if (expirationDuration == 0) {
            expiration = block.timestamp + DEFAULT_EXPIRATION;
        } else {
            require(expirationDuration >= MIN_EXPIRATION, "Expiration too short");
            require(expirationDuration <= MAX_EXPIRATION, "Expiration too long");
            expiration = block.timestamp + expirationDuration;
        }

        _offerIdCounter++;
        uint256 offerId = _offerIdCounter;

        offers[offerId] = Offer({
            offerId: offerId,
            tokenId: tokenId,
            offerer: msg.sender,
            offerPrice: msg.value,
            expirationTime: expiration,
            isActive: true,
            isAccepted: false
        });

        tokenOffers[tokenId].push(offerId);
        userOffers[msg.sender].push(offerId);
        totalOffers++;

        emit OfferCreated(offerId, tokenId, msg.sender, msg.value, expiration);
    }

    /**
     * @dev Chấp nhận offer (chỉ owner của NFT)
     * @param offerId ID của offer cần chấp nhận
     */
    function acceptOffer(uint256 offerId) 
        external 
        nonReentrant 
    {
        Offer storage offer = offers[offerId];
        
        require(offer.offerId != 0, "Offer does not exist");
        require(offer.isActive, "Offer is not active");
        require(!offer.isAccepted, "Offer already accepted");
        require(block.timestamp < offer.expirationTime, "Offer has expired");

        address tokenOwner = nftContract.ownerOf(offer.tokenId);
        require(msg.sender == tokenOwner, "Not token owner");
        require(
            nftContract.getApproved(offer.tokenId) == address(this) ||
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Contract not approved"
        );

        offer.isActive = false;
        offer.isAccepted = true;

        // Tính phí
        uint256 fee = (offer.offerPrice * offerFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = offer.offerPrice - fee;

        totalAcceptedOffers++;
        totalVolume += offer.offerPrice;
        totalFees += fee;

        // Transfer NFT cho offerer
        nftContract.safeTransferFrom(tokenOwner, offer.offerer, offer.tokenId);

        // Transfer tiền cho seller
        (bool successSeller, ) = payable(tokenOwner).call{value: sellerAmount}("");
        require(successSeller, "Transfer to seller failed");

        // Hủy các offer khác cho cùng tokenId
        _cancelOtherOffers(offer.tokenId, offerId);
        
        // Xóa listing trên Marketplace nếu có
        try marketplaceContract.forceRemoveListing(offer.tokenId) {
            // Listing đã được xóa thành công
        } catch {
            // Không có listing hoặc đã được xóa trước đó - bỏ qua lỗi
        }

        emit OfferAccepted(offerId, offer.tokenId, tokenOwner, offer.offerer, offer.offerPrice);
    }

    /**
     * @dev Hủy offer (chỉ người tạo offer)
     * @param offerId ID của offer cần hủy
     */
    function cancelOffer(uint256 offerId) 
        external 
        nonReentrant 
    {
        Offer storage offer = offers[offerId];
        
        require(offer.offerId != 0, "Offer does not exist");
        require(offer.isActive, "Offer is not active");
        require(msg.sender == offer.offerer, "Not the offerer");

        offer.isActive = false;

        // Hoàn tiền cho offerer
        (bool success, ) = payable(offer.offerer).call{value: offer.offerPrice}("");
        require(success, "Refund failed");

        emit OfferCancelled(offerId, offer.tokenId, offer.offerer);
    }

    /**
     * @dev Cập nhật giá offer
     * @param offerId ID của offer cần cập nhật
     */
    function updateOffer(uint256 offerId) 
        external 
        payable 
        nonReentrant 
    {
        Offer storage offer = offers[offerId];
        
        require(offer.offerId != 0, "Offer does not exist");
        require(offer.isActive, "Offer is not active");
        require(msg.sender == offer.offerer, "Not the offerer");
        require(msg.value > 0, "New offer must be greater than 0");

        uint256 oldPrice = offer.offerPrice;
        
        // Hoàn tiền cũ
        (bool successRefund, ) = payable(offer.offerer).call{value: oldPrice}("");
        require(successRefund, "Refund failed");

        // Cập nhật giá mới
        offer.offerPrice = msg.value;
        
        // Reset expiration time
        offer.expirationTime = block.timestamp + DEFAULT_EXPIRATION;

        emit OfferUpdated(offerId, oldPrice, msg.value);
    }

    /**
     * @dev Rút offer đã hết hạn (ai cũng có thể gọi để giúp refund)
     * @param offerId ID của offer đã hết hạn
     */
    function withdrawExpiredOffer(uint256 offerId) 
        external 
        nonReentrant 
    {
        Offer storage offer = offers[offerId];
        
        require(offer.offerId != 0, "Offer does not exist");
        require(offer.isActive, "Offer is not active");
        require(block.timestamp >= offer.expirationTime, "Offer not yet expired");

        offer.isActive = false;

        // Hoàn tiền cho offerer
        (bool success, ) = payable(offer.offerer).call{value: offer.offerPrice}("");
        require(success, "Refund failed");

        emit OfferCancelled(offerId, offer.tokenId, offer.offerer);
    }

    /**
     * @dev Lấy thông tin offer
     */
    function getOffer(uint256 offerId) 
        external 
        view 
        returns (Offer memory) 
    {
        require(offers[offerId].offerId != 0, "Offer does not exist");
        return offers[offerId];
    }

    /**
     * @dev Lấy tất cả offers cho một NFT
     */
    function getOffersForToken(uint256 tokenId) 
        external 
        view 
        returns (Offer[] memory) 
    {
        uint256[] memory offerIds = tokenOffers[tokenId];
        uint256 activeCount = 0;

        // Đếm số offer còn active
        for (uint256 i = 0; i < offerIds.length; i++) {
            Offer memory offer = offers[offerIds[i]];
            if (offer.isActive && block.timestamp < offer.expirationTime) {
                activeCount++;
            }
        }

        Offer[] memory activeOffers = new Offer[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < offerIds.length; i++) {
            Offer memory offer = offers[offerIds[i]];
            if (offer.isActive && block.timestamp < offer.expirationTime) {
                activeOffers[index] = offer;
                index++;
            }
        }

        return activeOffers;
    }

    /**
     * @dev Lấy offers của một user
     */
    function getOffersByUser(address user) 
        external 
        view 
        returns (Offer[] memory) 
    {
        uint256[] memory offerIds = userOffers[user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < offerIds.length; i++) {
            if (offers[offerIds[i]].isActive) {
                activeCount++;
            }
        }

        Offer[] memory userActiveOffers = new Offer[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < offerIds.length; i++) {
            if (offers[offerIds[i]].isActive) {
                userActiveOffers[index] = offers[offerIds[i]];
                index++;
            }
        }

        return userActiveOffers;
    }

    /**
     * @dev Lấy offer cao nhất cho một NFT
     */
    function getHighestOffer(uint256 tokenId) 
        external 
        view 
        returns (Offer memory highestOffer) 
    {
        uint256[] memory offerIds = tokenOffers[tokenId];
        uint256 highestPrice = 0;

        for (uint256 i = 0; i < offerIds.length; i++) {
            Offer memory offer = offers[offerIds[i]];
            if (offer.isActive && 
                block.timestamp < offer.expirationTime && 
                offer.offerPrice > highestPrice) {
                highestPrice = offer.offerPrice;
                highestOffer = offer;
            }
        }

        return highestOffer;
    }

    /**
     * @dev Kiểm tra user có offer active cho token không
     */
    function hasActiveOffer(uint256 tokenId, address user) 
        external 
        view 
        returns (bool, uint256) 
    {
        uint256[] memory offerIds = tokenOffers[tokenId];

        for (uint256 i = 0; i < offerIds.length; i++) {
            Offer memory offer = offers[offerIds[i]];
            if (offer.offerer == user && 
                offer.isActive && 
                block.timestamp < offer.expirationTime) {
                return (true, offer.offerId);
            }
        }

        return (false, 0);
    }

    /**
     * @dev Internal function để hủy các offer khác khi một offer được chấp nhận
     */
    function _cancelOtherOffers(uint256 tokenId, uint256 acceptedOfferId) private {
        uint256[] memory offerIds = tokenOffers[tokenId];

        for (uint256 i = 0; i < offerIds.length; i++) {
            if (offerIds[i] != acceptedOfferId) {
                Offer storage offer = offers[offerIds[i]];
                if (offer.isActive) {
                    offer.isActive = false;
                    // Hoàn tiền cho offerer
                    (bool success, ) = payable(offer.offerer).call{value: offer.offerPrice}("");
                    if (success) {
                        emit OfferCancelled(offer.offerId, tokenId, offer.offerer);
                    }
                }
            }
        }
    }

    /**
     * @dev Update offer fee (chỉ owner)
     */
    function setOfferFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        offerFee = newFee;
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
