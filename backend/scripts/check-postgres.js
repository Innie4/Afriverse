// Script to check PostgreSQL installation and provide setup instructions
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function checkPostgreSQL() {
  console.log("🔍 Checking PostgreSQL installation...\n")

  // Check if PostgreSQL is installed
  try {
    const { stdout } = await execAsync("psql --version")
    console.log("✅ PostgreSQL is installed:")
    console.log(`   ${stdout.trim()}\n`)
  } catch (error) {
    console.log("❌ PostgreSQL command-line tools not found in PATH")
    console.log("   (This doesn't mean PostgreSQL isn't installed, just that psql isn't in PATH)\n")
  }

  // Check if PostgreSQL service is running
  try {
    const { stdout } = await execAsync('powershell -Command "Get-Service | Where-Object {$_.Name -like \'*postgres*\'} | Select-Object -First 1 Name, Status"')
    if (stdout.trim()) {
      console.log("📋 PostgreSQL Service Status:")
      console.log(stdout)
    } else {
      console.log("⚠️  No PostgreSQL service found")
      console.log("   PostgreSQL may not be installed or service name is different\n")
    }
  } catch (error) {
    console.log("⚠️  Could not check PostgreSQL service status\n")
  }

  // Test connection
  console.log("🔌 Testing database connection...")
  try {
    const pg = await import("pg")
    const { Pool } = pg.default

    // Try connecting to postgres database first
    const pool = new Pool({
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "postgres",
      connectionTimeoutMillis: 5000,
    })

    await pool.query("SELECT 1")
    await pool.end()
    console.log("✅ Successfully connected to PostgreSQL!\n")
    return true
  } catch (error) {
    console.log(`❌ Connection failed: ${error.code || error.message}\n`)
    
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      console.log("📝 PostgreSQL service is running but not accepting connections.\n")
      console.log("Possible solutions:")
      console.log("1. Check if PostgreSQL is listening on port 5432:")
      console.log("   netstat -an | findstr 5432\n")
      console.log("2. Check PostgreSQL configuration (pg_hba.conf):")
      console.log("   Ensure 'trust' or 'md5' authentication for localhost\n")
      console.log("3. Restart PostgreSQL service:")
      console.log("   net stop postgresql-x64-13")
      console.log("   net start postgresql-x64-13\n")
    } else if (error.code === "28P01") {
      console.log("📝 Authentication failed - wrong password.\n")
      console.log("Solutions:")
      console.log("1. Check your PostgreSQL password")
      console.log("2. Update DATABASE_URL in .env file with correct password")
      console.log("   Format: postgresql://postgres:YOUR_PASSWORD@localhost:5432/Afriverse\n")
      console.log("3. Or reset PostgreSQL password:")
      console.log("   - Open pgAdmin")
      console.log("   - Right-click server → Properties → Change password\n")
    } else {
      console.log("📝 Setup Instructions:\n")
      console.log("1. Verify PostgreSQL is running:")
      console.log("   Get-Service postgresql-x64-13\n")
      console.log("2. Check connection settings in .env:")
      console.log("   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/Afriverse\n")
      console.log("3. If password is different, update .env file\n")
    }
    
    console.log("4. Once connection works, run:")
    console.log("   npm run setup-db    # Create database")
    console.log("   npm run seed        # Seed data\n")
    
    return false
  }
}

checkPostgreSQL()
  .then((connected) => {
    if (connected) {
      console.log("🎉 PostgreSQL is ready!")
      console.log("   You can now run: npm run setup")
    }
    process.exit(connected ? 0 : 1)
  })
  .catch((error) => {
    console.error("Error:", error.message)
    process.exit(1)
  })

