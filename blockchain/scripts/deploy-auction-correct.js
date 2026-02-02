const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying NFTAuction contract to Celo Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Use correct NFT address from Celo Sepolia deployment
  const nftAddress = "0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6";
  console.log("📦 Using NFT contract:", nftAddress);

  // Deploy NFTAuction
  const NFTAuction = await hre.ethers.getContractFactory("NFTAuction");
  console.log("⏳ Deploying...");
  const auction = await NFTAuction.deploy(nftAddress);
  await auction.waitForDeployment();

  const auctionAddress = await auction.getAddress();
  console.log("✅ NFTAuction deployed to:", auctionAddress);

  // Save deployment info
  const deploymentPath = path.join(__dirname, "..", "deployments", "celoSepolia.json");
  let deployment = {};
  
  if (fs.existsSync(deploymentPath)) {
    deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  }

  deployment.auctionContract = auctionAddress;
  deployment.auctionDeployedAt = new Date().toISOString();

  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log("💾 Deployment info saved");

  console.log("\n============================================================");
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("============================================================");
  console.log("Network:          celoSepolia");
  console.log("NFT Contract:     ", nftAddress);
  console.log("Auction Contract: ", auctionAddress);
  console.log("Deployer:         ", deployer.address);
  console.log("============================================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
