// Database setup script - detects Supabase vs local PostgreSQL and sets up accordingly
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

async function setupDatabase() {
  const dbUrl = process.env.DATABASE_URL || ""
  const isSupabase = dbUrl.includes("supabase") || process.env.USE_SUPABASE === "true"

  if (isSupabase) {
    console.log("🔍 Detected Supabase connection")
    console.log("📝 Using Supabase setup...\n")
    
    // Use Supabase setup script
    const { setupSupabase } = await import("./setup-supabase.js")
    return await setupSupabase()
  } else {
    console.log("🔍 Detected local PostgreSQL connection")
    console.log("📝 Setting up local PostgreSQL...\n")
    
    // Use local PostgreSQL setup
    const pg = await import("pg")
    const { Pool } = pg.default
    
    const adminPool = new Pool({
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "postgres",
    })

    try {
      console.log("Connecting to PostgreSQL...")
      await adminPool.query("SELECT 1")
      console.log("✅ Connected to PostgreSQL")

      const dbCheck = await adminPool.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        ["Afriverse"]
      )

      if (dbCheck.rows.length === 0) {
        console.log("Creating database 'Afriverse'...")
        await adminPool.query('CREATE DATABASE "Afriverse"')
        console.log("✅ Database 'Afriverse' created")
      } else {
        console.log("✅ Database 'Afriverse' already exists")
      }

      await adminPool.end()

      const pool = new Pool({
        connectionString: dbUrl || "postgresql://postgres:postgres@localhost:5432/Afriverse",
      })

      console.log("Connecting to 'Afriverse' database...")
      await pool.query("SELECT 1")
      console.log("✅ Connected to 'Afriverse' database")

      const { createTables } = await import("../config/database.js")
      await createTables()
      console.log("✅ Tables created successfully")

      await pool.end()
      console.log("\n🎉 Database setup completed successfully!")
      return true
    } catch (error) {
      console.error("\n❌ Database setup failed:", error.message)
      await adminPool.end().catch(() => {})
      return false
    }
  }
}

setupDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })

