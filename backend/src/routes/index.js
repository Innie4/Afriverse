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
import { recordBundle, getBundleById, getUserBundles } from "../controllers/bundleController.js"
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js"
import {
  createLazyMint,
  getLazyMint,
  markLazyMintMinted,
  getUserLazyMints,
} from "../controllers/lazyMintController.js"
import { createLicensePreset, listLicensePresets, attachLicenseToStory } from "../controllers/licenseController.js"
import { addReleases, getCompliance, registerManifest } from "../controllers/complianceController.js"
import { listPurchases, getDownloadLink, verifyDownload } from "../controllers/deliveryController.js"
import { createRequest, listRequests, updateRequestStatus } from "../controllers/requestController.js"
import { getAdminMetrics } from "../controllers/metricsController.js"
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

// Licensing routes
router.post("/licenses", createLicensePreset)
router.get("/licenses", listLicensePresets)
router.post("/datasets/:tokenId/license", attachLicenseToStory)

// Compliance routes
router.post("/datasets/:tokenId/releases", addReleases)
router.get("/datasets/:tokenId/compliance", getCompliance)
router.post("/datasets/:tokenId/register", registerManifest)

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

// Bundle routes
router.post("/marketplace/bundles", recordBundle)
router.get("/marketplace/bundles/:id", getBundleById)
router.get("/marketplace/users/:address/bundles", getUserBundles)

// Notification routes
router.get("/notifications/:address", getNotifications)
router.patch("/notifications/:id/read", markNotificationRead)
router.patch("/notifications/:address/read-all", markAllNotificationsRead)
router.get("/notifications/:address/unread-count", getUnreadNotificationCount)

// Lazy mint routes
router.post("/lazy-mints", createLazyMint)
router.get("/lazy-mints/:ipfsHash", getLazyMint)
router.patch("/lazy-mints/:ipfsHash/minted", markLazyMintMinted)
router.get("/lazy-mints/users/:address", getUserLazyMints)

// Delivery / purchases routes
router.get("/purchases/:address", listPurchases)
router.get("/purchases/:address/:tokenId/download", getDownloadLink)
router.get("/downloads/verify", verifyDownload)

// Requests routes
router.post("/requests", createRequest)
router.get("/requests", listRequests)
router.patch("/requests/:id/status", updateRequestStatus)

// Admin metrics
router.get("/admin/metrics", getAdminMetrics)

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

