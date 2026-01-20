const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * Module deploy cho NFTToken (ERC20)
 * Deploy token NFT với supply ban đầu 1,000,000 tokens
 * 
 * Để deploy:
 * npx hardhat ignition deploy ./ignition/modules/NFTToken.js --network hoodi
 */
module.exports = buildModule("NFTTokenModule", (m) => {
  // Deploy NFTToken contract
  const nftToken = m.contract("NFTToken");

  // Log thông tin sau khi deploy
  console.log("✅ NFTToken (ERC20) deployed!");
  console.log("📊 Token Name: NFTToken");
  console.log("🏷️  Symbol: NFT");
  console.log("💰 Initial Supply: 1,000,000 NFT");
  
  return { nftToken };
});
