// Main Express application
import express from "express"
import cors from "cors"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import logger from "./config/logger.js"
import { initDatabase, createTables } from "./config/database.js"
import { initRedis } from "./config/cache.js"
import { initIPFS } from "./services/ipfs.js"
import { initEventListener, startEventListener } from "./services/eventListener.js"
import routes from "./routes/index.js"

// Load environment variables
dotenv.config()

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

// Routes
app.use("/api", routes)

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Afriverse Tales Backend API",
    version: "1.0.0",
    endpoints: {
      stories: "/api/stories",
      storyById: "/api/stories/:id",
      upload: "/api/upload",
      health: "/api/health",
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
    initDatabase()
    await createTables()
    logger.info("Database initialized")

    // Initialize Redis (optional)
    await initRedis()
    logger.info("Redis initialized (if configured)")

    // Initialize IPFS
    initIPFS()
    logger.info("IPFS service initialized")

    // Initialize event listener
    initEventListener()
    logger.info("Event listener initialized")

    // Start listening for events
    if (process.env.RPC_URL && process.env.CONTRACT_ADDRESS) {
      await startEventListener()
      logger.info("Event listener started")
    } else {
      logger.warn("Event listener not started - missing RPC_URL or CONTRACT_ADDRESS")
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

