// IPFS upload service using web3.storage
import { Web3Storage } from "web3.storage"
import { File } from "web3.storage"
import logger from "./logger.js"

let storageClient = null

export function initIPFS() {
  if (!process.env.WEB3_STORAGE_TOKEN) {
    throw new Error("WEB3_STORAGE_TOKEN environment variable is required")
  }

  storageClient = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN })
  logger.info("Web3.Storage client initialized")
  return storageClient
}

/**
 * Upload file(s) to IPFS via web3.storage
 * @param {Buffer|File} file - File buffer or File object
 * @param {string} filename - Name of the file
 * @returns {Promise<string>} IPFS CID
 */
export async function uploadToIPFS(file, filename) {
  if (!storageClient) {
    throw new Error("IPFS client not initialized. Call initIPFS() first.")
  }

  try {
    let fileObj

    if (Buffer.isBuffer(file)) {
      fileObj = new File([file], filename)
    } else if (file instanceof File) {
      fileObj = file
    } else {
      throw new Error("Invalid file type. Expected Buffer or File.")
    }

    logger.info(`Uploading file to IPFS: ${filename}`)
    const cid = await storageClient.put([fileObj], {
      name: filename,
      wrapWithDirectory: false,
    })

    logger.info(`File uploaded successfully. CID: ${cid}`)
    return cid
  } catch (error) {
    logger.error("IPFS upload error", error)
    throw new Error(`Failed to upload to IPFS: ${error.message}`)
  }
}

/**
 * Upload JSON metadata to IPFS
 * @param {Object} metadata - JSON object to upload
 * @param {string} filename - Name for the metadata file
 * @returns {Promise<string>} IPFS CID
 */
export async function uploadMetadataToIPFS(metadata, filename = "metadata.json") {
  const jsonString = JSON.stringify(metadata, null, 2)
  const buffer = Buffer.from(jsonString, "utf-8")
  return uploadToIPFS(buffer, filename)
}

/**
 * Get IPFS gateway URL for a CID
 * @param {string} cid - IPFS CID
 * @returns {string} Gateway URL
 */
export function getIPFSGatewayURL(cid) {
  const gateway = process.env.IPFS_GATEWAY_URL || "https://ipfs.io/ipfs/"
  return `${gateway}${cid}`
}

export { storageClient }

