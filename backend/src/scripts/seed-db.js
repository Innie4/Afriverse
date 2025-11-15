// Standalone database seeding script
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

import { initDatabase } from "../config/database.js"
import { seedDatabase } from "./seed.js"

async function main() {
  try {
    console.log("Initializing database...")
    initDatabase()
    
    console.log("Starting database seeding...")
    const result = await seedDatabase()
    
    console.log("✅ Seeding completed successfully!")
    console.log(`   - Stories: ${result.stories}`)
    console.log(`   - Listings: ${result.listings}`)
    console.log(`   - Notifications: ${result.notifications}`)
    
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

main()

