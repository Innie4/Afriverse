// Express routes
import express from "express"
import multer from "multer"
import { getStories, getStoryById, getStoryStats } from "../controllers/storyController.js"
import { uploadFile, uploadMetadata, healthCheck } from "../controllers/uploadController.js"
import logger from "../config/logger.js"

const router = express.Router()

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types for IPFS
    cb(null, true)
  },
})

// Health check
router.get("/health", healthCheck)

// Story routes
router.get("/stories", getStories)
router.get("/stories/stats", getStoryStats)
router.get("/stories/:id", getStoryById)

// Upload routes
router.post("/upload", upload.single("file"), uploadFile)
router.post("/upload/metadata", uploadMetadata)

// Error handling middleware for routes
router.use((err, req, res, next) => {
  logger.error("Route error", {
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

export default router

