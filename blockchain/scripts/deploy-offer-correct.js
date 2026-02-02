const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying NFTOffer contract to Celo Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "CELO");

  // Use correct contract addresses from Celo Sepolia deployment
  const nftAddress = "0xe8Ba9Aae87178c43e68F2cD9A82dfDB4C2C564d6";
  const marketplaceAddress = "0x2570Dba6088a8D0bA146611d7c2AEb0e953224b0";
  
  console.log("📦 Using NFT contract:", nftAddress);
  console.log("📦 Using Marketplace contract:", marketplaceAddress);

  // Deploy NFTOffer
  const NFTOffer = await hre.ethers.getContractFactory("NFTOffer");
  console.log("⏳ Deploying...");
  const offer = await NFTOffer.deploy(nftAddress, marketplaceAddress);
  await offer.waitForDeployment();

  const offerAddress = await offer.getAddress();
  console.log("✅ NFTOffer deployed to:", offerAddress);

  // Save deployment info
  const deploymentPath = path.join(__dirname, "..", "deployments", "celoSepolia.json");
  let deployment = {};
  
  if (fs.existsSync(deploymentPath)) {
    deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  }

  deployment.offerContract = offerAddress;
  deployment.offerDeployedAt = new Date().toISOString();

  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log("💾 Deployment info saved");

  console.log("\n============================================================");
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("============================================================");
  console.log("Network:            celoSepolia");
  console.log("NFT Contract:       ", nftAddress);
  console.log("Marketplace:        ", marketplaceAddress);
  console.log("Offer Contract:     ", offerAddress);
  console.log("Deployer:           ", deployer.address);
  console.log("============================================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
