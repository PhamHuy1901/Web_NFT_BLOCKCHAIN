const hre = require("hardhat");

async function main() {
  // Lấy deployment info
  const fs = require("fs");
  const network = hre.network.name;
  const deploymentPath = `./deployments/${network}.json`;

  if (!fs.existsSync(deploymentPath)) {
    console.error(`❌ Deployment file not found: ${deploymentPath}`);
    console.log("💡 Please deploy contracts first using: npm run deploy");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  
  console.log("🔍 Verifying contracts on Etherscan...\n");
  console.log("Network:", network);
  console.log("NFT Address:", deployment.contracts.NFT);
  console.log("Marketplace Address:", deployment.contracts.NFTMarketplace);
  console.log("");

  try {
    // Verify NFT Contract
    console.log("📝 Verifying NFT Contract...");
    await hre.run("verify:verify", {
      address: deployment.contracts.NFT,
      constructorArguments: [],
    });
    console.log("✅ NFT Contract verified!\n");

    // Verify Marketplace Contract
    console.log("📝 Verifying NFTMarketplace Contract...");
    await hre.run("verify:verify", {
      address: deployment.contracts.NFTMarketplace,
      constructorArguments: [deployment.contracts.NFT],
    });
    console.log("✅ NFTMarketplace Contract verified!\n");

    console.log("🎉 All contracts verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contracts are already verified");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
