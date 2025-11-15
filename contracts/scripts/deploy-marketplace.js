// Deployment script for AfriverseMarketplace contract
const hre = require("hardhat")

async function main() {
  console.log("Deploying AfriverseMarketplace...")

  // Get the NFT contract address from environment or use placeholder
  const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"
  const PLATFORM_FEE_BPS = process.env.PLATFORM_FEE_BPS || 250 // 2.5%

  if (NFT_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.error("ERROR: NFT_CONTRACT_ADDRESS not set in environment")
    console.error("Please set NFT_CONTRACT_ADDRESS to your deployed AfriverseTales contract address")
    process.exit(1)
  }

  // Get the contract factory
  const Marketplace = await hre.ethers.getContractFactory("AfriverseMarketplace")

  // Deploy the contract
  console.log(`Deploying with NFT contract: ${NFT_CONTRACT_ADDRESS}`)
  console.log(`Platform fee: ${PLATFORM_FEE_BPS} bps (${PLATFORM_FEE_BPS / 100}%)`)

  const marketplace = await Marketplace.deploy(NFT_CONTRACT_ADDRESS, PLATFORM_FEE_BPS)

  await marketplace.waitForDeployment()

  const address = await marketplace.getAddress()
  console.log("✅ AfriverseMarketplace deployed to:", address)

  // Verify contract (optional, for testnets)
  if (hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...")
    await marketplace.deploymentTransaction()?.wait(5)

    console.log("Verifying contract on block explorer...")
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [NFT_CONTRACT_ADDRESS, PLATFORM_FEE_BPS],
      })
      console.log("✅ Contract verified!")
    } catch (error) {
      console.log("⚠️  Verification failed (may already be verified):", error.message)
    }
  }

  console.log("\n📋 Deployment Summary:")
  console.log("=" .repeat(50))
  console.log(`Contract Address: ${address}`)
  console.log(`NFT Contract: ${NFT_CONTRACT_ADDRESS}`)
  console.log(`Platform Fee: ${PLATFORM_FEE_BPS} bps (${PLATFORM_FEE_BPS / 100}%)`)
  console.log(`Network: ${hre.network.name}`)
  console.log("=" .repeat(50))
  console.log("\n⚠️  IMPORTANT: Update your environment variables:")
  console.log(`   VITE_MARKETPLACE_ADDRESS=${address}`)
  console.log(`   MARKETPLACE_CONTRACT_ADDRESS=${address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

