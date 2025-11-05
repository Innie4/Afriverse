// Database connection and query utilities
import pg from "pg"

const { Pool } = pg

let pool

export function initDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required")
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("supabase") ? { rejectUnauthorized: false } : false,
  })

  pool.on("error", async (err) => {
    const logger = (await import("./logger.js")).default
    logger.error("Unexpected error on idle client", err)
  })

  return pool
}

export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    // Only log in development to avoid noise
    if (process.env.NODE_ENV === "development") {
      const logger = (await import("./logger.js")).default
      logger.debug("Executed query", { text, duration, rows: res.rowCount })
    }
    return res
  } catch (error) {
    const logger = (await import("./logger.js")).default
    logger.error("Database query error", { error: error.message, text })
    throw error
  }
}

export async function createTables() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS stories (
      id SERIAL PRIMARY KEY,
      token_id INTEGER UNIQUE NOT NULL,
      ipfs_hash VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      tribe VARCHAR(100),
      language VARCHAR(50),
      title VARCHAR(500),
      description TEXT,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  const indexQueries = [
    "CREATE INDEX IF NOT EXISTS idx_token_id ON stories(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_author ON stories(author)",
    "CREATE INDEX IF NOT EXISTS idx_tribe ON stories(tribe)",
    "CREATE INDEX IF NOT EXISTS idx_language ON stories(language)",
    "CREATE INDEX IF NOT EXISTS idx_created_at ON stories(created_at)",
  ]

  try {
    await query(createTableQuery)
    
    // Create indexes
    for (const indexQuery of indexQueries) {
      try {
        await query(indexQuery)
      } catch (indexError) {
        // Index might already exist, continue
        if (!indexError.message.includes("already exists")) {
          throw indexError
        }
      }
    }

    const logger = (await import("./logger.js")).default
    logger.info("Database tables created successfully")
  } catch (error) {
    const logger = (await import("./logger.js")).default
    logger.error("Error creating tables", error)
    throw error
  }
}

export { pool }

