// Express routes
import express from "express"
import multer from "multer"
import { getStories, getStoryById, getStoryStats, createStory } from "../controllers/storyController.js"
import { uploadFile, uploadMetadata, healthCheck } from "../controllers/uploadController.js"
import {
  getListings,
  getListingById,
  createListing,
  updateListingStatus,
  recordSale,
  getSales,
  getOffers,
  createOffer,
  updateOfferStatus,
  getPriceHistory,
  getUserNFTs,
} from "../controllers/marketplaceController.js"
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
router.post("/stories", createStory)

// Upload routes
router.post("/upload", upload.single("file"), uploadFile)
router.post("/upload/metadata", uploadMetadata)

// Marketplace routes
router.get("/marketplace/listings", getListings)
router.get("/marketplace/listings/:id", getListingById)
router.post("/marketplace/listings", createListing)
router.patch("/marketplace/listings/:id/status", updateListingStatus)
router.post("/marketplace/sales", recordSale)
router.get("/marketplace/sales", getSales)
router.get("/marketplace/offers/:tokenId", getOffers)
router.post("/marketplace/offers", createOffer)
router.patch("/marketplace/offers/:id/status", updateOfferStatus)
router.get("/marketplace/price-history/:tokenId", getPriceHistory)
router.get("/marketplace/users/:address/nfts", getUserNFTs)

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

