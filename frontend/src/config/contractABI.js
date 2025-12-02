// NFT Marketplace ABI - Basic structure
// TODO: Update with actual ABI after contract compilation
export const MARKETPLACE_ABI = [
  // Read functions
  'function getNFTListing(uint256 tokenId) view returns (address seller, uint256 price, bool isListed)',
  'function getAllListings() view returns (tuple(uint256 tokenId, address seller, uint256 price)[])',
  
  // Write functions
  'function listNFT(uint256 tokenId, uint256 price) external',
  'function buyNFT(uint256 tokenId) external payable',
  'function cancelListing(uint256 tokenId) external',
  'function updatePrice(uint256 tokenId, uint256 newPrice) external',
  
  // Events
  'event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price)',
  'event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price)',
  'event ListingCancelled(uint256 indexed tokenId)',
  'event PriceUpdated(uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice)',
]

// NFT Contract ABI (ERC-721)
// TODO: Update with actual ABI after contract compilation
export const NFT_ABI = [
  // Read functions
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  
  // Write functions
  'function mintNFT(address recipient, string tokenURI) external returns (uint256)',
  'function approve(address to, uint256 tokenId) external',
  'function setApprovalForAll(address operator, bool approved) external',
  'function transferFrom(address from, address to, uint256 tokenId) external',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
]
