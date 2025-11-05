const hre = require("hardhat");

async function main() {
  console.log("Deploying AfriverseTales contract...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy the contract
  // Constructor parameters: name, symbol, royaltyRecipient, royaltyFeeBps (500 = 5%)
  const AfriverseTales = await hre.ethers.getContractFactory("AfriverseTales");
  const royaltyRecipient = deployer.address; // Set royalty recipient to deployer
  const royaltyFeeBps = 500; // 5% royalty

  const afriverseTales = await AfriverseTales.deploy(
    "Afriverse Tales",
    "AFRT",
    royaltyRecipient,
    royaltyFeeBps
  );

  await afriverseTales.waitForDeployment();
  const address = await afriverseTales.getAddress();

  console.log("AfriverseTales deployed to:", address);
  console.log("\nDeployment details:");
  console.log("- Network:", hre.network.name);
  console.log("- Deployer:", deployer.address);
  console.log("- Royalty Recipient:", royaltyRecipient);
  console.log("- Royalty Fee:", royaltyFeeBps / 100, "%");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    deployer: deployer.address,
    royaltyRecipient: royaltyRecipient,
    royaltyFeeBps: royaltyFeeBps,
    timestamp: new Date().toISOString(),
  };

  console.log("\n📝 Copy this to your frontend .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

