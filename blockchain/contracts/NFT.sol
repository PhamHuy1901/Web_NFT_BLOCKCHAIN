// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NFT
 * @dev NFT Contract cho NFT Marketplace - ERC721 standard
 * @notice Contract này cho phép mint NFT với metadata URI từ IPFS
 */
contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping từ tokenId sang creator address
    mapping(uint256 => address) public tokenCreator;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event NFTTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor() ERC721("NFT Marketplace Token", "NFTM") {}

    /**
     * @dev Mint NFT mới với metadata URI
     * @param recipient Địa chỉ người nhận NFT
     * @param tokenURI URI của metadata (IPFS hash)
     * @return tokenId của NFT vừa được mint
     */
    function mintNFT(address recipient, string memory tokenURI) 
        external 
        returns (uint256) 
    {
        require(recipient != address(0), "Cannot mint to zero address");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        tokenCreator[newTokenId] = msg.sender;

        emit NFTMinted(newTokenId, msg.sender, tokenURI);

        return newTokenId;
    }

    /**
     * @dev Lấy tổng số NFT đã được mint
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Lấy thông tin creator của NFT
     */
    function getCreator(uint256 tokenId) external view returns (address) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenCreator[tokenId];
    }

    /**
     * @dev Override transfer function để emit custom event
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        super.transferFrom(from, to, tokenId);
        emit NFTTransferred(tokenId, from, to);
    }

    /**
     * @dev Override safeTransferFrom
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override(ERC721, IERC721) {
        super.safeTransferFrom(from, to, tokenId, data);
        emit NFTTransferred(tokenId, from, to);
    }

    /**
     * @dev Lấy tất cả NFT của một owner
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[index] = i;
                index++;
            }
        }

        return tokenIds;
    }
}
