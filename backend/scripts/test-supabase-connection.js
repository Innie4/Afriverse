// Test Supabase connection
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../.env") })

async function testConnection() {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    console.error("❌ DATABASE_URL not set in .env file")
    process.exit(1)
  }

  console.log("🔌 Testing Supabase connection...")
  console.log(`📍 Connection string: ${dbUrl.replace(/:[^:@]+@/, ':****@')}\n`)

  try {
    const pg = await import("pg")
    const { Pool } = pg.default

    const pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    })

    console.log("⏳ Attempting to connect...")
    const result = await pool.query("SELECT version(), current_database()")
    
    console.log("✅ Connection successful!")
    console.log(`   Database: ${result.rows[0].current_database}`)
    console.log(`   PostgreSQL: ${result.rows[0].version.split(',')[0]}\n`)
    
    // Test table creation
    console.log("📊 Testing table creation...")
    await pool.query("CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())")
    console.log("✅ Table creation works!\n")
    
    // Cleanup
    await pool.query("DROP TABLE IF EXISTS test_connection")
    
    await pool.end()
    console.log("🎉 All tests passed! Your Supabase connection is working.\n")
    console.log("📝 Next steps:")
    console.log("   1. Run: npm run setup-db (to create all tables)")
    console.log("   2. Run: npm run seed (to seed sample data)")
    console.log("   3. Run: npm run dev (to start the server)")
    
    process.exit(0)
  } catch (error) {
    console.error(`❌ Connection failed: ${error.code || error.message}\n`)
    
    if (error.code === "ENOTFOUND") {
      console.error("⚠️  DNS resolution failed. Possible issues:")
      console.error("   1. Project might be paused")
      console.error("      → Go to https://app.supabase.com")
      console.error("      → Check if project shows 'Paused' and click 'Restore'")
      console.error("\n   2. Wrong connection string format")
      console.error("      → Use pooler connection (port 6543) instead of direct (port 5432)")
      console.error("      → Get it from: Settings → Database → Connection string → Transaction mode")
      console.error("      → Format: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres")
    } else if (error.code === "ETIMEDOUT") {
      console.error("⚠️  Connection timeout. Check:")
      console.error("   1. Internet connection")
      console.error("   2. Firewall settings")
      console.error("   3. Project is active (not paused)")
    } else if (error.code === "28P01") {
      console.error("⚠️  Authentication failed")
      console.error("   → Check password in DATABASE_URL")
      console.error("   → Reset password in Supabase Dashboard if needed")
    } else {
      console.error("Error details:", error.message)
    }
    
    process.exit(1)
  }
}

testConnection()

