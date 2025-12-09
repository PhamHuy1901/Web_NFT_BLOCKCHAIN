const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy NFT Contract
  console.log("📦 Deploying NFT Contract...");
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("✅ NFT Contract deployed to:", nftAddress);

  // Deploy Marketplace Contract
  console.log("\n📦 Deploying NFTMarketplace Contract...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy(nftAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ NFTMarketplace Contract deployed to:", marketplaceAddress);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("NFT Contract Address:         ", nftAddress);
  console.log("Marketplace Contract Address: ", marketplaceAddress);
  console.log("Network:                      ", hre.network.name);
  console.log("Deployer:                     ", deployer.address);
  console.log("=".repeat(60));

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      NFT: nftAddress,
      NFTMarketplace: marketplaceAddress,
    },
  };

  const deploymentPath = `./deployments/${hre.network.name}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✅ Deployment info saved to:", deploymentPath);

  // Verification instructions
  if (hre.network.name === "sepolia") {
    console.log("\n" + "=".repeat(60));
    console.log("🔍 TO VERIFY CONTRACTS ON ETHERSCAN:");
    console.log("=".repeat(60));
    console.log(`npx hardhat verify --network sepolia ${nftAddress}`);
    console.log(`npx hardhat verify --network sepolia ${marketplaceAddress} ${nftAddress}`);
    console.log("=".repeat(60));
  }

  // Next steps
  console.log("\n" + "=".repeat(60));
  console.log("📝 NEXT STEPS:");
  console.log("=".repeat(60));
  console.log("1. Copy contract addresses to frontend:");
  console.log("   - Update src/config/constants.js");
  console.log("2. Copy ABIs to frontend:");
  console.log("   - artifacts/contracts/NFT.sol/NFT.json");
  console.log("   - artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json");
  console.log("3. Test the contracts on Sepolia testnet");
  console.log("=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
