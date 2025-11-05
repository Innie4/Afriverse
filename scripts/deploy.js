// Deployment script for AfriverseTales contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying AfriverseTales contract...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Contract parameters
  const name = "Afriverse Tales";
  const symbol = "AFRT";
  const royaltyRecipient = deployer.address; // Can be changed to a different address
  const royaltyFeeBps = 500; // 5% royalty (500 basis points)

  // Deploy the contract
  const AfriverseTales = await hre.ethers.getContractFactory("AfriverseTales");
  const afriverseTales = await AfriverseTales.deploy(
    name,
    symbol,
    royaltyRecipient,
    royaltyFeeBps
  );

  await afriverseTales.waitForDeployment();
  const contractAddress = await afriverseTales.getAddress();

  console.log("\n=== Deployment Successful ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("Royalty Recipient:", royaltyRecipient);
  console.log("Royalty Fee:", royaltyFeeBps / 100, "%");

  // Wait for a few blocks before verification
  if (hre.network.name !== "hardhat") {
    console.log("\nWaiting for block confirmations...");
    await afriverseTales.deploymentTransaction().wait(5);
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    name: name,
    symbol: symbol,
    royaltyRecipient: royaltyRecipient,
    royaltyFeeBps: royaltyFeeBps,
  };

  console.log("\n=== Deployment Info ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for verification
  if (hre.network.name === "mumbai" || hre.network.name === "polygon") {
    console.log("\n=== Verification Command ===");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${name}" "${symbol}" "${royaltyRecipient}" ${royaltyFeeBps}`);
  }

  return contractAddress;
}

main()
  .then((address) => {
    console.log("\n✅ Deployment completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

