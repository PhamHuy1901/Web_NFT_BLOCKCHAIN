const hre = require("hardhat");

async function main() {
  // Địa chỉ contract NFTToken trên Hoodi
  const TOKEN_ADDRESS = "0x945828e3d1014D54229850dbd4A07Fd1B8A5d2DF";
  
  console.log("=".repeat(60));
  console.log("🪙  NFTToken Interaction Script");
  console.log("=".repeat(60));

  // Get signer (ví của bạn)
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Your Address:", signer.address);
  
  // Connect to token contract
  const NFTToken = await hre.ethers.getContractFactory("NFTToken");
  const token = NFTToken.attach(TOKEN_ADDRESS);
  
  console.log("📍 Token Contract:", TOKEN_ADDRESS);
  console.log("");

  // Get token info
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();
  
  console.log("📊 Token Information:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals.toString());
  console.log("   Total Supply:", hre.ethers.formatEther(totalSupply), symbol);
  console.log("");

  // Get your balance
  const balance = await token.balanceOf(signer.address);
  console.log("💰 Your Balance:", hre.ethers.formatEther(balance), symbol);
  console.log("=".repeat(60));
  console.log("");

  // Ví dụ các hành động:
  console.log("📝 Available Actions:");
  console.log("   1. Transfer tokens to another address");
  console.log("   2. Approve another address to spend your tokens");
  console.log("   3. Check balance of any address");
  console.log("");

  // Uncomment các dòng dưới để thực hiện action

  // // 1. TRANSFER TOKENS
  // const recipientAddress = "0x..."; // Địa chỉ người nhận
  // const amount = hre.ethers.parseEther("100"); // 100 NFT
  // const tx = await token.transfer(recipientAddress, amount);
  // await tx.wait();
  // console.log("✅ Transferred 100 NFT to", recipientAddress);

  // // 2. APPROVE SPENDING
  // const spenderAddress = "0x..."; // Địa chỉ được phép spend
  // const approveAmount = hre.ethers.parseEther("1000"); // 1000 NFT
  // const approveTx = await token.approve(spenderAddress, approveAmount);
  // await approveTx.wait();
  // console.log("✅ Approved", spenderAddress, "to spend 1000 NFT");

  // // 3. CHECK BALANCE OF ADDRESS
  // const addressToCheck = "0x...";
  // const bal = await token.balanceOf(addressToCheck);
  // console.log("Balance of", addressToCheck, ":", hre.ethers.formatEther(bal), symbol);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
