// Verification script for AfriverseTales contract
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const constructorArgs = process.argv.slice(2);

  if (!contractAddress) {
    console.error("Error: CONTRACT_ADDRESS environment variable not set");
    console.log("Usage: CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network mumbai");
    process.exit(1);
  }

  console.log("Verifying contract at:", contractAddress);
  console.log("Network:", hre.network.name);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
    });
    console.log("\n✅ Contract verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Contract is already verified!");
    } else {
      console.error("\n❌ Verification failed:");
      console.error(error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

