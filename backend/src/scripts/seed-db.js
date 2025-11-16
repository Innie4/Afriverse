// Standalone database seeding script
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

import { initDatabase, createTables } from "../config/database.js"
import { seedDatabase } from "./seed.js"

async function main() {
  try {
    console.log("Initializing database connection...")
    initDatabase()
    
    console.log("Creating tables if they don't exist...")
    await createTables()
    console.log("✅ Tables ready")
    
    console.log("Starting database seeding...")
    const result = await seedDatabase()
    
    console.log("\n✅ Seeding completed successfully!")
    console.log(`   - Stories: ${result.stories}`)
    console.log(`   - Listings: ${result.listings}`)
    console.log(`   - Notifications: ${result.notifications}`)
    
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message)
    
    if (error.code === "ECONNREFUSED") {
      console.error("\n⚠️  PostgreSQL is not running or not accessible.")
      console.error("Please:")
      console.error("1. Start PostgreSQL service")
      console.error("2. Run: npm run setup-db (to create database and tables)")
      console.error("3. Then run: npm run seed")
    } else if (error.message.includes("DATABASE_URL")) {
      console.error("\n⚠️  DATABASE_URL not set in .env file")
      console.error("Please create .env file with: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/Afriverse")
    }
    
    process.exit(1)
  }
}

main()

