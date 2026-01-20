const hre = require("hardhat");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  const TOKEN_ADDRESS = "0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF";
  
  console.log("\n" + "=".repeat(60));
  console.log("🪙  NFTToken Transfer Tool");
  console.log("=".repeat(60));

  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Your Address:", signer.address);
  
  const NFTToken = await hre.ethers.getContractFactory("NFTToken");
  const token = NFTToken.attach(TOKEN_ADDRESS);
  
  const balance = await token.balanceOf(signer.address);
  console.log("💰 Your Balance:", hre.ethers.formatEther(balance), "NFT");
  console.log("=".repeat(60));
  console.log("");

  // Input recipient address
  const recipient = await question("📮 Enter recipient address: ");
  
  if (!hre.ethers.isAddress(recipient)) {
    console.log("❌ Invalid address!");
    rl.close();
    return;
  }

  // Input amount
  const amountStr = await question("💵 Enter amount to transfer (NFT): ");
  const amount = hre.ethers.parseEther(amountStr);

  // Confirm
  console.log("");
  console.log("📋 Transfer Summary:");
  console.log("   From:", signer.address);
  console.log("   To:", recipient);
  console.log("   Amount:", amountStr, "NFT");
  console.log("");

  const confirm = await question("✅ Confirm transfer? (yes/no): ");
  
  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log("❌ Transfer cancelled");
    rl.close();
    return;
  }

  try {
    console.log("\n⏳ Processing transaction...");
    const tx = await token.transfer(recipient, amount);
    console.log("📤 Transaction hash:", tx.hash);
    
    console.log("⏳ Waiting for confirmation...");
    await tx.wait();
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Transfer Successful!");
    console.log("=".repeat(60));
    
    const newBalance = await token.balanceOf(signer.address);
    console.log("💰 Your New Balance:", hre.ethers.formatEther(newBalance), "NFT");
    
    const recipientBalance = await token.balanceOf(recipient);
    console.log("💰 Recipient Balance:", hre.ethers.formatEther(recipientBalance), "NFT");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }

  rl.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    rl.close();
    process.exit(1);
  });
