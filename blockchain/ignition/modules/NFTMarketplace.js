const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * Module deploy cho NFTMarketplace Contract
 * Deploy cả NFT và NFTMarketplace cùng lúc
 * 
 * Để deploy:
 * npx hardhat ignition deploy ./ignition/modules/NFTMarketplace.js --network sepolia
 */
module.exports = buildModule("NFTMarketplaceModule", (m) => {
  // Bước 1: Deploy NFT contract trước
  const nft = m.contract("NFT");

  // Bước 2: Deploy NFTMarketplace contract với địa chỉ NFT contract
  const marketplace = m.contract("NFTMarketplace", [nft]);

  // Log thông tin sau khi deploy
  console.log("✅ NFT Contract deployed!");
  console.log("✅ NFTMarketplace Contract deployed!");
  
  return { nft, marketplace };
});
