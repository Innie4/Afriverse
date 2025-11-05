#!/usr/bin/env node

// Quick setup script to verify configuration
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { readFileSync, existsSync } from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, ".env") })

console.log("🔍 Checking Afriverse Tales Backend Configuration...\n")

const requiredEnvVars = [
  "DATABASE_URL",
  "RPC_URL",
  "CONTRACT_ADDRESS",
  "WEB3_STORAGE_TOKEN",
]

const optionalEnvVars = ["REDIS_URL", "PRIVATE_KEY"]

let hasErrors = false

console.log("Required Environment Variables:")
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (!value || value.includes("YOUR_") || value.includes("your_")) {
    console.log(`  ❌ ${varName} - Not set or using placeholder`)
    hasErrors = true
  } else {
    console.log(`  ✅ ${varName} - Set`)
  }
})

console.log("\nOptional Environment Variables:")
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (!value || value.includes("YOUR_") || value.includes("your_")) {
    console.log(`  ⚠️  ${varName} - Not set (optional)`)
  } else {
    console.log(`  ✅ ${varName} - Set`)
  }
})

console.log("\nServer Configuration:")
console.log(`  Port: ${process.env.PORT || 3001}`)
console.log(`  Environment: ${process.env.NODE_ENV || "development"}`)

if (hasErrors) {
  console.log("\n❌ Configuration incomplete!")
  console.log("Please copy env.example to .env and fill in the required values.\n")
  process.exit(1)
} else {
  console.log("\n✅ Configuration looks good!")
  console.log("You can now start the server with: npm start\n")
}

