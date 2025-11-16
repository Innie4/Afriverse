// Script to create .env file if it doesn't exist
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.resolve(__dirname, "../.env")
const envExamplePath = path.resolve(__dirname, "../env.example")

const defaultEnv = `# Environment Variables for Afriverse Tales Backend

# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (Supabase)
# Get your connection string from: Supabase Dashboard → Project Settings → Database → Connection string
# Format: postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
USE_SUPABASE=true

# Web3 Provider (Infura, Alchemy, etc.)
RPC_URL=https://polygon-rpc.com
# For Story Protocol mainnet: https://rpc.story.foundation
# For Story Protocol testnet: https://rpc.aeneid.story.foundation

CONTRACT_ADDRESS=0xYourContractAddressHere
MARKETPLACE_CONTRACT_ADDRESS=0xYourMarketplaceContractAddressHere
PRIVATE_KEY=your_private_key_for_event_listener_here

# IPFS Configuration (web3.storage)
WEB3_STORAGE_TOKEN=did:key:z6Mkt28n67aLP2fxddTUwv2MZaBswGAkskugWf5VDQMTYpNm
STORAGE_TOKEN=did:key:z6Mkt28n67aLP2fxddTUwv2MZaBswGAkskugWf5VDQMTYpNm
IPFS_GATEWAY_URL=https://ipfs.io/ipfs/

# IPFS Configuration (Pinata - fallback option)
PINATA_API_KEY=227739987217b0ab4422
PINATA_SECRET_KEY=83741c8d7ac73998b5fba8b94331dfe4d30b073cc757630812b6e97cf7bfa00f

# IPFS Configuration (NFT.Storage - fallback option)
NFT_STORAGE_TOKEN=56b8fedc.9aaad058e89841c8be988a97c24dd2fc

# Redis Configuration (Optional - for caching)
# REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10

# Logging
LOG_LEVEL=info

# Blockchain / Event Listener
# Set to 'false' to bypass smart contract and disable event listener
ENABLE_EVENT_LISTENER=true
ENABLE_MARKETPLACE_LISTENER=true

# Database Seeding
# Set to 'true' to automatically seed database on startup
SEED_DATABASE=true

# API Base URL
API_BASE_URL=http://localhost:3001
`

  if (!fs.existsSync(envPath)) {
  console.log("Creating .env file...")
  fs.writeFileSync(envPath, defaultEnv, "utf8")
  console.log("✅ .env file created successfully!")
  console.log("\n📝 IMPORTANT: Update the .env file with your Supabase connection string:")
  console.log("   1. Go to: https://app.supabase.com")
  console.log("   2. Select your project → Settings → Database")
  console.log("   3. Copy the 'Connection string' (URI format)")
  console.log("   4. Replace [PROJECT-REF], [YOUR-PASSWORD], and [REGION] in DATABASE_URL")
  console.log("   5. Set USE_SUPABASE=true\n")
} else {
  // Check if DATABASE_URL is set correctly
  const envContent = fs.readFileSync(envPath, "utf8")
  if (!envContent.includes("DATABASE_URL=") || envContent.includes("[PROJECT-REF]")) {
    console.log("⚠️  .env file exists but DATABASE_URL needs to be configured")
    console.log("📝 Please update DATABASE_URL with your Supabase connection string")
    console.log("   Get it from: Supabase Dashboard → Settings → Database → Connection string\n")
  } else if (!envContent.includes("USE_SUPABASE=true")) {
    console.log("⚠️  .env file exists but USE_SUPABASE is not set")
    console.log("📝 Please add: USE_SUPABASE=true\n")
  } else {
    console.log("✅ .env file exists and appears to be configured")
    console.log("📝 Verify DATABASE_URL points to your Supabase project\n")
  }
}

