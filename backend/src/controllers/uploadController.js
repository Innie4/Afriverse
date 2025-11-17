// Upload controller - handles IPFS uploads (SOLID: Single Responsibility)
import { uploadToIPFS, uploadMetadataToIPFS, getIPFSGatewayURL } from "../services/ipfs.js"
import logger from "../config/logger.js"
import { query } from "../config/database.js"
import { asyncHandler, sendSuccess, sendBadRequest } from "../utils/responseHandler.js"
import crypto from "crypto"

/**
 * Upload file to IPFS
 */
export const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file && !req.body.file) {
      return sendBadRequest(res, "No file provided")
    }

    let file, filename
    const vertical = (req.body.vertical || "").toString() || null

    if (req.file) {
      // File uploaded via multer
      file = req.file.buffer
      filename = req.file.originalname || `file-${Date.now()}`
    } else if (req.body.file) {
      // File provided as base64 string
      const fileData = req.body.file.split(",")[1] || req.body.file
      file = Buffer.from(fileData, "base64")
      filename = req.body.filename || `file-${Date.now()}`
    }

    const cid = await uploadToIPFS(file, filename)

    logger.info(`File uploaded successfully: ${cid}`)

    // Enqueue processing job
    const jobId = crypto.randomBytes(12).toString("hex")
    await query(
      `INSERT INTO processing_jobs (job_id, status, input_cid, vertical) VALUES ($1, 'queued', $2, $3)`,
      [jobId, cid, vertical]
    )

    sendSuccess(res, {
      cid,
      ipfsUrl: getIPFSGatewayURL(cid),
      filename,
      jobId,
    })
})

/**
 * Upload metadata to IPFS
 */
export const uploadMetadata = asyncHandler(async (req, res) => {
    const { metadata } = req.body

    if (!metadata || typeof metadata !== "object") {
      return sendBadRequest(res, "Metadata object is required")
    }

    const cid = await uploadMetadataToIPFS(metadata)

    logger.info(`Metadata uploaded successfully: ${cid}`)

    sendSuccess(res, {
      cid,
      ipfsUrl: getIPFSGatewayURL(cid),
    })
})

/**
 * Health check endpoint
 */
export const healthCheck = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Afriverse Tales Backend",
  })
})

