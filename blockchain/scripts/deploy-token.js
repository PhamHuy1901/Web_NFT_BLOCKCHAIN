const hre = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("🚀 Deploying NFTToken (ERC20) Contract...");
  console.log("=".repeat(60));

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // Deploy NFTToken
  const NFTToken = await hre.ethers.getContractFactory("NFTToken");
  console.log("⏳ Deploying NFTToken contract...");
  
  const nftToken = await NFTToken.deploy();
  await nftToken.waitForDeployment();
  
  const tokenAddress = await nftToken.getAddress();
  
  console.log("");
  console.log("=".repeat(60));
  console.log("✅ NFTToken Contract Deployed Successfully!");
  console.log("=".repeat(60));
  console.log("📍 Contract Address:", tokenAddress);
  console.log("🏷️  Token Name:", await nftToken.name());
  console.log("🪙  Token Symbol:", await nftToken.symbol());
  console.log("🔢 Decimals:", await nftToken.decimals());
  
  const totalSupply = await nftToken.totalSupply();
  console.log("💎 Total Supply:", hre.ethers.formatEther(totalSupply), "NFT");
  
  const deployerBalance = await nftToken.balanceOf(deployer.address);
  console.log("💰 Deployer Balance:", hre.ethers.formatEther(deployerBalance), "NFT");
  console.log("=".repeat(60));
  console.log("");
  console.log("📋 To add token to MetaMask:");
  console.log("   Contract Address:", tokenAddress);
  console.log("   Token Symbol: NFT");
  console.log("   Decimals: 18");
  console.log("=".repeat(60));

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contract: {
      name: "NFTToken",
      address: tokenAddress,
      tokenName: await nftToken.name(),
      symbol: await nftToken.symbol(),
      decimals: Number(await nftToken.decimals()),
      totalSupply: hre.ethers.formatEther(totalSupply)
    }
  };

  const filename = `deployments/nfttoken-${hre.network.name}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", filename);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
