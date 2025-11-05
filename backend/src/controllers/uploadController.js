// Upload controller - handles IPFS uploads
import { uploadToIPFS, uploadMetadataToIPFS, getIPFSGatewayURL } from "../services/ipfs.js"
import logger from "../config/logger.js"

/**
 * Upload file to IPFS
 */
export async function uploadFile(req, res, next) {
  try {
    if (!req.file && !req.body.file) {
      return res.status(400).json({ error: "No file provided" })
    }

    let file, filename

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

    res.json({
      success: true,
      cid,
      ipfsUrl: getIPFSGatewayURL(cid),
      filename,
    })
  } catch (error) {
    logger.error("Error uploading file", error)
    next(error)
  }
}

/**
 * Upload metadata to IPFS
 */
export async function uploadMetadata(req, res, next) {
  try {
    const { metadata } = req.body

    if (!metadata || typeof metadata !== "object") {
      return res.status(400).json({ error: "Metadata object is required" })
    }

    const cid = await uploadMetadataToIPFS(metadata)

    logger.info(`Metadata uploaded successfully: ${cid}`)

    res.json({
      success: true,
      cid,
      ipfsUrl: getIPFSGatewayURL(cid),
    })
  } catch (error) {
    logger.error("Error uploading metadata", error)
    next(error)
  }
}

/**
 * Health check endpoint
 */
export async function healthCheck(req, res) {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Afriverse Tales Backend",
  })
}

