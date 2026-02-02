// Script để deploy NFTOffer contract
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying NFTOffer contract...");

  // Lấy deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Lấy balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Đọc địa chỉ NFT contract và Marketplace contract
  const nftAddress = "0x74414Ce4a0CEAC93bE30bd1bd4c6DFCf7c037723";
  const marketplaceAddress = "0x188bEe20006886F69cE1464662E0D309736Bc1dC";
  console.log("Using NFT contract address:", nftAddress);
  console.log("Using Marketplace contract address:", marketplaceAddress);

  // Deploy NFTOffer contract
  const NFTOffer = await hre.ethers.getContractFactory("NFTOffer");
  const nftOffer = await NFTOffer.deploy(nftAddress, marketplaceAddress);

  await nftOffer.waitForDeployment();

  const offerAddress = await nftOffer.getAddress();
  console.log("NFTOffer deployed to:", offerAddress);

  // Lưu thông tin deployment
  const network = hre.network.name;
  const deploymentInfo = {
    network: network,
    nftContract: nftAddress,
    marketplaceContract: marketplaceAddress,
    offerContract: offerAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  // Lưu file deployment
  const deploymentPath = path.join(__dirname, "..", "deployments", `offer-${network}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info saved to deployments/offer-${network}.json`);

  // Cập nhật file deployment chính
  const mainDeploymentPath = path.join(__dirname, "..", "deployments", `${network}.json`);
  let existingDeployment = {};
  
  if (fs.existsSync(mainDeploymentPath)) {
    existingDeployment = JSON.parse(fs.readFileSync(mainDeploymentPath, "utf8"));
  }

  const updatedDeployment = {
    ...existingDeployment,
    offerContract: offerAddress,
    offerDeployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(mainDeploymentPath, JSON.stringify(updatedDeployment, null, 2));

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", network);
  console.log("NFT Contract:", nftAddress);
  console.log("Offer Contract:", offerAddress);
  console.log("Deployer:", deployer.address);
  console.log("========================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
