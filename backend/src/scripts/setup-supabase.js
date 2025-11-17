// Supabase database setup script - creates tables in Supabase
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

export async function setupSupabase() {
  try {
    console.log("🔌 Connecting to Supabase...")
    
    // Import database functions
    const { initDatabase, createTables } = await import("../config/database.js")
    
    // Initialize connection with retry logic
    let retries = 3
    let connected = false
    
    while (retries > 0 && !connected) {
      try {
        initDatabase()
        // Test connection
        const { query } = await import("../config/database.js")
        await query("SELECT 1")
        connected = true
        console.log("✅ Connected to Supabase")
      } catch (connError) {
        retries--
        if (retries > 0) {
          console.log(`⚠️  Connection attempt failed, retrying... (${retries} attempts left)`)
          await new Promise(resolve => setTimeout(resolve, 2000))
        } else {
          throw connError
        }
      }
    }
    
    // Create tables
    console.log("📊 Creating tables...")
    await createTables()
    console.log("✅ Tables created successfully")
    
    console.log("\n🎉 Supabase setup completed successfully!")
    console.log("📝 Next steps:")
    console.log("   1. Run: npm run seed (to seed sample data)")
    console.log("   2. Run: npm run dev (to start the server)")
    
    return true
  } catch (error) {
    console.error("\n❌ Supabase setup failed:", error.message)
    
    if (error.code === "ENOTFOUND" || error.code === "ETIMEDOUT") {
      console.error("\n⚠️  Connection issue detected.")
      console.error("The database connection string may need to be updated.")
      console.error("However, tables will be created automatically when the server starts.")
      console.error("\nTo fix connection:")
      console.error("1. Check Supabase Dashboard - ensure project is active (not paused)")
      console.error("2. Update DATABASE_URL in .env with pooler connection (port 6543)")
      console.error("3. Or the connection will work when server starts if project is active")
    } else if (error.code === "28P01") {
      console.error("\n⚠️  Authentication failed.")
      console.error("Please check your Supabase password in DATABASE_URL")
    } else if (error.message.includes("DATABASE_URL")) {
      console.error("\n⚠️  DATABASE_URL not set in .env file")
      console.error("Please set DATABASE_URL with your Supabase connection string")
    }
    
    // Don't fail completely - tables will be created on server start
    console.log("\n📝 Note: Database tables will be created automatically when server starts")
    return false
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSupabase()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error("Fatal error:", error)
      process.exit(1)
    })
}

