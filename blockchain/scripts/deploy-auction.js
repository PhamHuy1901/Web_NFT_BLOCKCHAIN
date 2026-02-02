// Script để deploy NFTAuction contract
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying NFTAuction contract...");

  // Lấy deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Lấy balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Đọc địa chỉ NFT contract từ file deployment
  let nftAddress;
  const network = hre.network.name;
  
  try {
    // Thử đọc từ file deployment tương ứng với network
    const deploymentPath = path.join(__dirname, "..", "deployments", `${network}.json`);
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
      nftAddress = deployment.nftContract || deployment.NFT;
    }
    
    // Nếu không tìm thấy, thử đọc từ hoodi.json
    if (!nftAddress) {
      const hoodiPath = path.join(__dirname, "..", "deployments", "hoodi.json");
      if (fs.existsSync(hoodiPath)) {
        const hoodiDeployment = JSON.parse(fs.readFileSync(hoodiPath, "utf8"));
        nftAddress = hoodiDeployment.nftContract || hoodiDeployment.NFT;
      }
    }
  } catch (error) {
    console.log("Could not read deployment file:", error.message);
  }

  // Nếu vẫn không có, dùng địa chỉ hardcoded
  if (!nftAddress) {
    nftAddress = "0x74414Ce4a0CEAC93bE30bd1bd4c6DFCf7c037723"; // Default NFT address trên Hoodi
  }

  console.log("Using NFT contract address:", nftAddress);

  // Deploy NFTAuction contract
  const NFTAuction = await hre.ethers.getContractFactory("NFTAuction");
  const nftAuction = await NFTAuction.deploy(nftAddress);

  await nftAuction.waitForDeployment();

  const auctionAddress = await nftAuction.getAddress();
  console.log("NFTAuction deployed to:", auctionAddress);

  // Lưu thông tin deployment
  const deploymentInfo = {
    network: network,
    nftContract: nftAddress,
    auctionContract: auctionAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  // Đọc file deployment hiện có và thêm auction address
  const deploymentPath = path.join(__dirname, "..", "deployments", `${network}.json`);
  let existingDeployment = {};
  
  if (fs.existsSync(deploymentPath)) {
    existingDeployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  }

  const updatedDeployment = {
    ...existingDeployment,
    auctionContract: auctionAddress,
    auctionDeployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(deploymentPath, JSON.stringify(updatedDeployment, null, 2));
  console.log(`Deployment info saved to deployments/${network}.json`);

  // Lưu riêng file auction deployment
  const auctionDeploymentPath = path.join(__dirname, "..", "deployments", `auction-${network}.json`);
  fs.writeFileSync(auctionDeploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Auction deployment info saved to deployments/auction-${network}.json`);

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", network);
  console.log("NFT Contract:", nftAddress);
  console.log("Auction Contract:", auctionAddress);
  console.log("Deployer:", deployer.address);
  console.log("========================\n");

  // Verify contract nếu có ETHERSCAN_API_KEY
  if (process.env.ETHERSCAN_API_KEY && network !== "localhost" && network !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await nftAuction.deploymentTransaction().wait(6);
    
    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: auctionAddress,
        constructorArguments: [nftAddress],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
