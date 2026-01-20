const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * Module deploy cho NFT Contract
 * Sử dụng Hardhat Ignition - phương pháp deploy mới của Hardhat
 * 
 * Để deploy:
 * npx hardhat ignition deploy ./ignition/modules/NFT.js --network sepolia
 */
module.exports = buildModule("NFTModule", (m) => {
  // Deploy NFT contract
  const nft = m.contract("NFT");

  // Log thông tin sau khi deploy
  console.log("✅ NFT Contract deployed!");
  
  return { nft };
});
