const hre = require("hardhat");
const fs = require("fs");

/**
 * Deploy NFT Marketplace lên Hoodi Network
 * Marketplace sử dụng ETH native để thanh toán
 * KHÔNG sử dụng ERC20 token
 */
async function main() {
  console.log("\n" + "=".repeat(70));
  console.log("🚀 DEPLOYING NFT MARKETPLACE TO HOODI NETWORK");
  console.log("💰 Payment Method: ETH (Native Currency)");
  console.log("=".repeat(70) + "\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account ETH balance:", hre.ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.error("\n❌ ERROR: No ETH balance!");
    console.log("💡 You need ETH to deploy contracts.");
    console.log("   Please fund your wallet first.");
    return;
  }

  console.log("🌐 Network:", hre.network.name);
  console.log("🔗 Chain ID:", hre.network.config.chainId);
  console.log("");

  // STEP 1: Deploy NFT Contract
  console.log("📦 Step 1/2: Deploying NFT Contract...");
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  
  console.log("✅ NFT Contract deployed to:", nftAddress);
  console.log("");

  // STEP 2: Deploy NFTMarketplace Contract
  console.log("📦 Step 2/2: Deploying NFTMarketplace Contract...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy(nftAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  
  console.log("✅ NFTMarketplace Contract deployed to:", marketplaceAddress);
  console.log("");

  // Get marketplace info
  const marketplaceFee = await marketplace.marketplaceFee();
  const feeDenominator = await marketplace.FEE_DENOMINATOR();
  const feePercentage = (Number(marketplaceFee) / Number(feeDenominator)) * 100;

  console.log("=".repeat(70));
  console.log("✅ DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(70));
  console.log("");
  console.log("📋 Contract Information:");
  console.log("   NFT Contract:         ", nftAddress);
  console.log("   Marketplace Contract: ", marketplaceAddress);
  console.log("   Owner:                ", deployer.address);
  console.log("   Marketplace Fee:      ", feePercentage.toFixed(2) + "%");
  console.log("   Network:              ", hre.network.name);
  console.log("   Chain ID:             ", hre.network.config.chainId);
  console.log("");
  console.log("💰 Payment Method:");
  console.log("   Currency: ETH (Native)");
  console.log("   Users pay with ETH when buying NFTs");
  console.log("   NO ERC20 token required!");
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      nft: {
        address: nftAddress,
        name: "NFT Marketplace Token",
        symbol: "NFTM"
      },
      marketplace: {
        address: marketplaceAddress,
        fee: feePercentage,
        paymentMethod: "ETH"
      }
    },
    instructions: {
      frontend: `Update frontend/src/config/constants.js with these addresses`,
      metamask: `Add Hoodi Network to MetaMask:
        Network Name: Hoodi Network
        RPC URL: https://0xrpc.io/hoodi
        Chain ID: 560048
        Currency Symbol: ETH`,
      usage: `Users will pay with ETH when buying NFTs from the marketplace`
    }
  };

  const filename = `deployments/hoodi-marketplace.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", filename);
  console.log("");

  console.log("=".repeat(70));
  console.log("📝 NEXT STEPS:");
  console.log("=".repeat(70));
  console.log("");
  console.log("1. Update Frontend Config:");
  console.log("   File: frontend/src/config/constants.js");
  console.log("   NFT_CONTRACT_ADDRESS =", nftAddress);
  console.log("   NFT_MARKETPLACE_ADDRESS =", marketplaceAddress);
  console.log("");
  console.log("2. Add Hoodi Network to MetaMask:");
  console.log("   Network Name: Hoodi Network");
  console.log("   RPC URL: https://0xrpc.io/hoodi");
  console.log("   Chain ID: 560048");
  console.log("   Currency Symbol: ETH");
  console.log("");
  console.log("3. Fund your wallet with ETH on Hoodi Network");
  console.log("");
  console.log("4. Start using the marketplace!");
  console.log("   - Create NFTs");
  console.log("   - List NFTs for sale (price in ETH)");
  console.log("   - Buy NFTs with ETH");
  console.log("");
  console.log("=".repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ DEPLOYMENT FAILED!");
    console.error(error);
    process.exit(1);
  });
