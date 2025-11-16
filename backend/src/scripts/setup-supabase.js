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
    
    // Initialize connection
    initDatabase()
    console.log("✅ Connected to Supabase")
    
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
      console.error("\n⚠️  Could not connect to Supabase.")
      console.error("\nPossible issues:")
      console.error("1. Project might be paused (free tier pauses after inactivity)")
      console.error("   → Go to Supabase Dashboard and click 'Restore' if paused")
      console.error("2. Using direct connection instead of pooler")
      console.error("   → Use pooler connection string (port 6543) for better reliability")
      console.error("   → Format: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres")
      console.error("3. Network/DNS issue")
      console.error("   → Check your internet connection")
      console.error("\nGet your connection string from:")
      console.error("   Supabase Dashboard → Settings → Database → Connection string → URI")
      console.error("   → Use 'Transaction' mode (port 6543) for best results")
    } else if (error.code === "28P01") {
      console.error("\n⚠️  Authentication failed.")
      console.error("Please check your Supabase password in DATABASE_URL")
    } else if (error.message.includes("DATABASE_URL")) {
      console.error("\n⚠️  DATABASE_URL not set in .env file")
      console.error("Please set DATABASE_URL with your Supabase connection string")
    }
    
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

