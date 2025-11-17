// Database connection and query utilities
import pg from "pg"

const { Pool } = pg

let pool

export function initDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required")
  }

  // Supabase requires SSL connections
  const isSupabase = process.env.DATABASE_URL.includes("supabase") || process.env.USE_SUPABASE === "true"
  
  // Configure connection with proper timeouts and SSL
  const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isSupabase ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
  }
  
  pool = new Pool(poolConfig)

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
      vertical VARCHAR(50),
      title VARCHAR(500),
      description TEXT,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS licenses (
      id SERIAL PRIMARY KEY,
      key VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      legal_text_uri VARCHAR(500),
      machine_terms JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS story_licenses (
      id SERIAL PRIMARY KEY,
      token_id INTEGER UNIQUE NOT NULL REFERENCES stories(token_id) ON DELETE CASCADE,
      license_id INTEGER NOT NULL REFERENCES licenses(id),
      attached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS releases (
      id SERIAL PRIMARY KEY,
      token_id INTEGER NOT NULL REFERENCES stories(token_id) ON DELETE CASCADE,
      model_release_uri VARCHAR(500),
      location_release_uri VARCHAR(500),
      consent_scope VARCHAR(100),
      capture_region VARCHAR(100),
      capture_date TIMESTAMP,
      deid_attestation BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS provenance (
      id SERIAL PRIMARY KEY,
      token_id INTEGER UNIQUE NOT NULL REFERENCES stories(token_id) ON DELETE CASCADE,
      device_fingerprint VARCHAR(255),
      capture_gps JSONB,
      capture_time TIMESTAMP,
      content_hash VARCHAR(255),
      manifest_uri VARCHAR(500),
      qc_report_uri VARCHAR(500),
      version_map JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS processing_jobs (
      id SERIAL PRIMARY KEY,
      job_id VARCHAR(64) UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'queued',
      error TEXT,
      input_cid VARCHAR(255),
      output_preview_uri VARCHAR(500),
      qc_report_uri VARCHAR(500),
      token_id INTEGER,
      vertical VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      token_id INTEGER NOT NULL REFERENCES stories(token_id) ON DELETE CASCADE,
      buyer_address VARCHAR(255) NOT NULL,
      license_snapshot JSONB,
      delivery_uris JSONB,
      transaction_hash VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (token_id, buyer_address, transaction_hash)
    );

    CREATE TABLE IF NOT EXISTS requests (
      id SERIAL PRIMARY KEY,
      requester_address VARCHAR(255) NOT NULL,
      vertical VARCHAR(50) NOT NULL,
      specs JSONB NOT NULL,
      bounty_matic NUMERIC(20, 8),
      status VARCHAR(20) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER UNIQUE NOT NULL,
      token_id INTEGER NOT NULL REFERENCES stories(token_id),
      seller_address VARCHAR(255) NOT NULL,
      price_wei BIGINT NOT NULL,
      price_matic NUMERIC(20, 8),
      currency VARCHAR(10) DEFAULT 'MATIC',
      listing_type VARCHAR(20) DEFAULT 'fixed',
      status VARCHAR(20) DEFAULT 'active',
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      token_id INTEGER NOT NULL,
      listing_id INTEGER,
      seller_address VARCHAR(255) NOT NULL,
      buyer_address VARCHAR(255) NOT NULL,
      price_wei BIGINT NOT NULL,
      price_matic NUMERIC(20, 8),
      platform_fee_wei BIGINT NOT NULL,
      royalty_wei BIGINT NOT NULL,
      transaction_hash VARCHAR(255) NOT NULL,
      block_number INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS offers (
      id SERIAL PRIMARY KEY,
      offer_id INTEGER UNIQUE NOT NULL,
      token_id INTEGER NOT NULL REFERENCES stories(token_id),
      offerer_address VARCHAR(255) NOT NULL,
      price_wei BIGINT NOT NULL,
      price_matic NUMERIC(20, 8),
      status VARCHAR(20) DEFAULT 'pending',
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS auctions (
      id SERIAL PRIMARY KEY,
      auction_id INTEGER UNIQUE NOT NULL,
      token_id INTEGER NOT NULL REFERENCES stories(token_id),
      listing_id INTEGER REFERENCES listings(listing_id),
      seller_address VARCHAR(255) NOT NULL,
      starting_price_wei BIGINT NOT NULL,
      current_bid_wei BIGINT DEFAULT 0,
      current_bidder_address VARCHAR(255),
      end_time TIMESTAMP NOT NULL,
      ended BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id SERIAL PRIMARY KEY,
      token_id INTEGER NOT NULL REFERENCES stories(token_id),
      price_wei BIGINT NOT NULL,
      price_matic NUMERIC(20, 8),
      transaction_hash VARCHAR(255),
      event_type VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bundles (
      id SERIAL PRIMARY KEY,
      bundle_id VARCHAR(255) UNIQUE NOT NULL,
      buyer_address VARCHAR(255) NOT NULL,
      listing_ids INTEGER[] NOT NULL,
      token_ids INTEGER[] NOT NULL,
      total_price_wei BIGINT NOT NULL,
      total_price_matic NUMERIC(20, 8),
      discount_bps INTEGER DEFAULT 0,
      discount_amount_wei BIGINT,
      discount_amount_matic NUMERIC(20, 8),
      platform_fee_wei BIGINT,
      transaction_hash VARCHAR(255),
      block_number INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_address VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT,
      data JSONB,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lazy_mints (
      id SERIAL PRIMARY KEY,
      ipfs_hash VARCHAR(255) UNIQUE NOT NULL,
      author_address VARCHAR(255) NOT NULL,
      tribe VARCHAR(100),
      language VARCHAR(50),
      metadata JSONB,
      minted BOOLEAN DEFAULT FALSE,
      token_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      minted_at TIMESTAMP
    );
  `

  const indexQueries = [
    "CREATE INDEX IF NOT EXISTS idx_token_id ON stories(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_author ON stories(author)",
    "CREATE INDEX IF NOT EXISTS idx_tribe ON stories(tribe)",
    "CREATE INDEX IF NOT EXISTS idx_vertical ON stories(vertical)",
    "CREATE INDEX IF NOT EXISTS idx_story_license_token ON story_licenses(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_releases_token ON releases(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_provenance_token ON provenance(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_processing_status ON processing_jobs(status)",
    "CREATE INDEX IF NOT EXISTS idx_purchases_buyer ON purchases(buyer_address)",
    "CREATE INDEX IF NOT EXISTS idx_requests_vertical ON requests(vertical)",
    "CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_address)",
    "CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read)",
    "CREATE INDEX IF NOT EXISTS idx_lazy_mints_hash ON lazy_mints(ipfs_hash)",
    "CREATE INDEX IF NOT EXISTS idx_lazy_mints_author ON lazy_mints(author_address)",
    "CREATE INDEX IF NOT EXISTS idx_bundles_buyer ON bundles(buyer_address)",
    "CREATE INDEX IF NOT EXISTS idx_language ON stories(language)",
    "CREATE INDEX IF NOT EXISTS idx_created_at ON stories(created_at)",
    "CREATE INDEX IF NOT EXISTS idx_listings_token_id ON listings(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_address)",
    "CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status)",
    "CREATE INDEX IF NOT EXISTS idx_sales_token_id ON sales(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_sales_buyer ON sales(buyer_address)",
    "CREATE INDEX IF NOT EXISTS idx_sales_seller ON sales(seller_address)",
    "CREATE INDEX IF NOT EXISTS idx_offers_token_id ON offers(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_offers_offerer ON offers(offerer_address)",
    "CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status)",
    "CREATE INDEX IF NOT EXISTS idx_auctions_token_id ON auctions(token_id)",
    "CREATE INDEX IF NOT EXISTS idx_auctions_seller ON auctions(seller_address)",
    "CREATE INDEX IF NOT EXISTS idx_price_history_token_id ON price_history(token_id)",
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

