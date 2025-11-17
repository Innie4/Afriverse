// Main Express application
import express from "express"
import cors from "cors"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"
import logger from "./config/logger.js"
import { initDatabase, createTables } from "./config/database.js"
import { initRedis } from "./config/cache.js"
import { initIPFS } from "./services/ipfs.js"
import { initEventListener, startEventListener } from "./services/eventListener.js"
import { initMarketplaceEventListener, startMarketplaceEventListener } from "./services/marketplaceEventListener.js"
import routes from "./routes/index.js"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger.js"
import { seedDatabase } from "./scripts/seed.js"

// Load environment variables explicitly from backend/.env regardless of cwd
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../.env") })

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  })
  next()
})

// Rate limiting for upload endpoints
const uploadLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // 10 requests per window
  message: "Too many upload requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiting to upload routes
app.use("/api/upload", uploadLimiter)

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Afriverse Tales API Documentation",
}))

// Routes
app.use("/api", routes)

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Afriverse Tales Backend API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      stories: "/api/stories",
      storyById: "/api/stories/:id",
      upload: "/api/upload",
      health: "/api/health",
      marketplace: "/api/marketplace",
      notifications: "/api/notifications",
      lazyMints: "/api/lazy-mints",
    },
  })
})

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  })
})

// Initialize services
async function initializeServices() {
  try {
    logger.info("Initializing services...")

    // Initialize database
    try {
      initDatabase()
      await createTables()
      logger.info("Database initialized")
    } catch (dbError) {
      logger.warn("Database initialization failed, will retry on first request:", dbError.message)
      // Don't fail server startup - database will be initialized on first use
    }

    // Seed database if enabled
    if (process.env.SEED_DATABASE === "true") {
      try {
        logger.info("Seeding database...")
        await seedDatabase()
        logger.info("Database seeded successfully")
      } catch (error) {
        logger.warn("Database seeding failed:", error.message)
      }
    }

    // Initialize Redis (optional)
    await initRedis()
    logger.info("Redis initialized (if configured)")

    // Initialize IPFS
    initIPFS()
    logger.info("IPFS service initialized")

    // Conditionally initialize/start event listener (bypassable)
    const enableListener = (process.env.ENABLE_EVENT_LISTENER || "true").toLowerCase() !== "false"
    const validContract = /^0x[a-fA-F0-9]{40}$/.test(process.env.CONTRACT_ADDRESS || "")
    if (enableListener && process.env.RPC_URL && validContract) {
      initEventListener()
      logger.info("Event listener initialized")
      await startEventListener()
      logger.info("Event listener started")
    } else {
      logger.warn("Event listener disabled or not started - check ENABLE_EVENT_LISTENER, RPC_URL, valid CONTRACT_ADDRESS")
    }

    // Initialize marketplace event listener for notifications
    const enableMarketplaceListener = (process.env.ENABLE_MARKETPLACE_LISTENER || "true").toLowerCase() !== "false"
    const validMarketplaceContract = /^0x[a-fA-F0-9]{40}$/.test(process.env.MARKETPLACE_CONTRACT_ADDRESS || "")
    if (enableMarketplaceListener && process.env.RPC_URL && validMarketplaceContract) {
      initMarketplaceEventListener()
      logger.info("Marketplace event listener initialized")
      await startMarketplaceEventListener()
      logger.info("Marketplace event listener started")
    } else {
      logger.warn("Marketplace event listener disabled - check ENABLE_MARKETPLACE_LISTENER, RPC_URL, valid MARKETPLACE_CONTRACT_ADDRESS")
    }

    logger.info("All services initialized successfully")
  } catch (error) {
    logger.error("Error initializing services", error)
    throw error
  }
}

// Start server
async function startServer() {
  try {
    await initializeServices()

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    logger.error("Failed to start server", error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server")
  process.exit(0)
})

startServer()

export default app

