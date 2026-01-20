const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("=".repeat(60));
  console.log("🔍 Checking NFT Token Balances");
  console.log("=".repeat(60));

  // Load deployment info
  const deploymentFile = `deployments/nfttoken-${hre.network.name}.json`;
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found:", deploymentFile);
    console.log("💡 Please deploy the token first using: npx hardhat run scripts/deploy-token.js --network", hre.network.name);
    return;
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  const tokenAddress = deploymentInfo.contract.address;
  
  console.log("📍 Token Address:", tokenAddress);
  console.log("🌐 Network:", hre.network.name);
  console.log("");

  // Get contract instance
  const NFTToken = await hre.ethers.getContractFactory("NFTToken");
  const nftToken = NFTToken.attach(tokenAddress);

  // Get all signers
  const signers = await hre.ethers.getSigners();
  
  // Check token info
  const tokenName = await nftToken.name();
  const tokenSymbol = await nftToken.symbol();
  const totalSupply = await nftToken.totalSupply();
  
  console.log("🏷️  Token Name:", tokenName);
  console.log("🪙  Token Symbol:", tokenSymbol);
  console.log("💎 Total Supply:", hre.ethers.formatEther(totalSupply), tokenSymbol);
  console.log("");
  console.log("=".repeat(60));
  console.log("👥 Account Balances:");
  console.log("=".repeat(60));

  // Check balance for each account
  for (let i = 0; i < Math.min(signers.length, 5); i++) {
    const address = signers[i].address;
    const tokenBalance = await nftToken.balanceOf(address);
    const ethBalance = await hre.ethers.provider.getBalance(address);
    
    console.log(`\n👤 Account ${i + 1}: ${address}`);
    console.log(`   💰 Token Balance: ${hre.ethers.formatEther(tokenBalance)} ${tokenSymbol}`);
    console.log(`   💵 ETH Balance: ${hre.ethers.formatEther(ethBalance)} ETH`);
  }

  console.log("\n" + "=".repeat(60));
  
  // Allow checking custom address
  if (process.env.CHECK_ADDRESS) {
    const customAddress = process.env.CHECK_ADDRESS;
    console.log("\n🔍 Checking custom address:", customAddress);
    try {
      const tokenBalance = await nftToken.balanceOf(customAddress);
      const ethBalance = await hre.ethers.provider.getBalance(customAddress);
      
      console.log(`   💰 Token Balance: ${hre.ethers.formatEther(tokenBalance)} ${tokenSymbol}`);
      console.log(`   💵 ETH Balance: ${hre.ethers.formatEther(ethBalance)} ETH`);
    } catch (error) {
      console.error("❌ Error checking address:", error.message);
    }
    console.log("=".repeat(60));
  }

  console.log("\n💡 Tip: To check a specific address, run:");
  console.log(`   CHECK_ADDRESS=0x... npx hardhat run scripts/check-nft-token-balance.js --network ${hre.network.name}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
