const hre = require("hardhat");

async function main() {
  const address = "0xd19f7cf40d4a16013995bea0ac444ca13b13cbe1";
  const balance = await hre.ethers.provider.getBalance(address);
  
  console.log("=".repeat(50));
  console.log("Ví của bạn:", address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);
  console.log("=".repeat(50));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
