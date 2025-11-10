// IPFS upload service with multiple providers (web3.storage, Pinata, NFT.Storage)
import { Web3Storage } from "web3.storage"
import { File } from "web3.storage"
import axios from "axios"
import FormData from "form-data"
import logger from "../config/logger.js"

let storageClient = null
let currentProvider = "web3storage" // Default provider

// Hardcoded provider credentials (per user request)
const HARDCODED = {
  WEB3_STORAGE_TOKEN: "did:key:z6Mkt28n67aLP2fxddTUwv2MZaBswGAkskugWf5VDQMTYpNm",
  STORAGE_TOKEN: "did:key:z6Mkt28n67aLP2fxddTUwv2MZaBswGAkskugWf5VDQMTYpNm",
  PINATA_API_KEY: "227739987217b0ab4422",
  PINATA_SECRET_KEY: "83741c8d7ac73998b5fba8b94331dfe4d30b073cc757630812b6e97cf7bfa00f",
  NFT_STORAGE_TOKEN: "56b8fedc.9aaad058e89841c8be988a97c24dd2fc",
  IPFS_GATEWAY_URL: "https://ipfs.io/ipfs/",
}

// Provider configuration
const providers = {
  web3storage: {
    name: "Web3.Storage",
    enabled: !!HARDCODED.WEB3_STORAGE_TOKEN,
  },
  pinata: {
    name: "Pinata",
    enabled: !!(HARDCODED.PINATA_API_KEY && HARDCODED.PINATA_SECRET_KEY),
  },
  nftstorage: {
    name: "NFT.Storage",
    enabled: !!HARDCODED.NFT_STORAGE_TOKEN,
  },
}

export function initIPFS() {
  // Initialize web3.storage if token exists
  if (HARDCODED.WEB3_STORAGE_TOKEN) {
    try {
      storageClient = new Web3Storage({ token: HARDCODED.WEB3_STORAGE_TOKEN })
      logger.info("Web3.Storage client initialized")
      currentProvider = "web3storage"
    } catch (error) {
      logger.warn("Failed to initialize Web3.Storage", error)
    }
  }

  // Check available providers
  const availableProviders = Object.entries(providers)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => config.name)

  if (availableProviders.length === 0) {
    // Do not block server startup; warn and continue. Upload endpoints will fail until configured.
    logger.warn(
      "No IPFS provider configured. Set WEB3_STORAGE_TOKEN, PINATA_API_KEY+PINATA_SECRET_KEY, or NFT_STORAGE_TOKEN to enable IPFS uploads."
    )
    return null
  }

  logger.info(`Available IPFS providers: ${availableProviders.join(", ")}`)
  return storageClient
}

/**
 * Upload to Web3.Storage
 */
async function uploadToWeb3Storage(file, filename) {
  if (!storageClient) {
    storageClient = new Web3Storage({ token: HARDCODED.WEB3_STORAGE_TOKEN })
  }

  let fileObj
  if (Buffer.isBuffer(file)) {
    fileObj = new File([file], filename)
  } else if (file instanceof File) {
    fileObj = file
  } else {
    throw new Error("Invalid file type. Expected Buffer or File.")
  }

  const cid = await storageClient.put([fileObj], {
    name: filename,
    wrapWithDirectory: false,
  })

  return cid
}

/**
 * Upload to Pinata
 */
async function uploadToPinata(file, filename) {
  const formData = new FormData()
  
  if (Buffer.isBuffer(file)) {
    formData.append("file", file, filename)
  } else if (file instanceof File) {
    formData.append("file", file, filename)
  } else {
    throw new Error("Invalid file type. Expected Buffer or File.")
  }

  const metadata = JSON.stringify({
    name: filename,
  })
  formData.append("pinataMetadata", metadata)

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: HARDCODED.PINATA_API_KEY,
        pinata_secret_api_key: HARDCODED.PINATA_SECRET_KEY,
      },
      maxBodyLength: Infinity,
    }
  )

  return response.data.IpfsHash
}

/**
 * Upload to NFT.Storage
 */
async function uploadToNFTStorage(file, filename) {
  const formData = new FormData()
  
  if (Buffer.isBuffer(file)) {
    formData.append("file", file, filename)
  } else if (file instanceof File) {
    formData.append("file", file, filename)
  } else {
    throw new Error("Invalid file type. Expected Buffer or File.")
  }

  const response = await axios.post(
    "https://api.nft.storage/upload",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${HARDCODED.NFT_STORAGE_TOKEN}`,
      },
      maxBodyLength: Infinity,
    }
  )

  return response.data.value.cid
}

/**
 * Upload file(s) to IPFS with automatic fallback to alternative providers
 * @param {Buffer|File} file - File buffer or File object
 * @param {string} filename - Name of the file
 * @param {Object} options - Upload options
 * @returns {Promise<{cid: string, provider: string}>} IPFS CID and provider used
 */
export async function uploadToIPFS(file, filename, options = {}) {
  const { retries = 2, preferredProvider = currentProvider } = options

  // Define upload order based on preference
  const uploadOrder = []
  
  if (preferredProvider && providers[preferredProvider]?.enabled) {
    uploadOrder.push(preferredProvider)
  }
  
  // Add other enabled providers as fallbacks
  Object.keys(providers).forEach((providerKey) => {
    if (providers[providerKey].enabled && providerKey !== preferredProvider) {
      uploadOrder.push(providerKey)
    }
  })

  if (uploadOrder.length === 0) {
    throw new Error("No IPFS providers are configured")
  }

  let lastError = null

  // Try each provider in order
  for (const providerKey of uploadOrder) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.info(
          `Uploading to IPFS via ${providers[providerKey].name} (attempt ${attempt}/${retries}): ${filename}`
        )

        let cid
        switch (providerKey) {
          case "web3storage":
            cid = await uploadToWeb3Storage(file, filename)
            break
          case "pinata":
            cid = await uploadToPinata(file, filename)
            break
          case "nftstorage":
            cid = await uploadToNFTStorage(file, filename)
            break
          default:
            throw new Error(`Unknown provider: ${providerKey}`)
        }

        logger.info(
          `File uploaded successfully via ${providers[providerKey].name}. CID: ${cid}`
        )
        
        // Update current provider to successful one
        currentProvider = providerKey
        
        return { cid, provider: providers[providerKey].name }
      } catch (error) {
        lastError = error
        logger.warn(
          `Upload failed via ${providers[providerKey].name} (attempt ${attempt}/${retries})`,
          { error: error.message }
        )

        // If not the last attempt for this provider, wait before retrying
        if (attempt < retries) {
          const waitTime = 1000 * Math.pow(2, attempt - 1) // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, waitTime))
        }
      }
    }

    // If we've tried all retries for this provider, log and move to next
    logger.warn(
      `All retry attempts exhausted for ${providers[providerKey].name}, trying next provider...`
    )
  }

  // If all providers failed
  logger.error("All IPFS providers failed", { error: lastError?.message })
  throw new Error(
    `Failed to upload to IPFS after trying all available providers. Last error: ${lastError?.message}`
  )
}

/**
 * Upload JSON metadata to IPFS
 * @param {Object} metadata - JSON object to upload
 * @param {string} filename - Name for the metadata file
 * @param {Object} options - Upload options
 * @returns {Promise<{cid: string, provider: string}>} IPFS CID and provider used
 */
export async function uploadMetadataToIPFS(
  metadata,
  filename = "metadata.json",
  options = {}
) {
  const jsonString = JSON.stringify(metadata, null, 2)
  const buffer = Buffer.from(jsonString, "utf-8")
  return uploadToIPFS(buffer, filename, options)
}

/**
 * Get IPFS gateway URL for a CID
 * @param {string} cid - IPFS CID
 * @param {string} gateway - Optional custom gateway
 * @returns {string} Gateway URL
 */
export function getIPFSGatewayURL(cid, gateway = null) {
  if (!cid || typeof cid !== "string") return null
  
  // If IPFS is down and we saved a placeholder, do not return a gateway URL
  if (cid.startsWith("PENDING_IPFS")) return null
  
  const defaultGateway = gateway || HARDCODED.IPFS_GATEWAY_URL || process.env.IPFS_GATEWAY_URL || "https://ipfs.io/ipfs/"
  return `${defaultGateway}${cid}`
}

/**
 * Get provider status
 * @returns {Object} Status of all providers
 */
export function getProviderStatus() {
  return Object.entries(providers).reduce((acc, [key, config]) => {
    acc[key] = {
      name: config.name,
      enabled: config.enabled,
      current: key === currentProvider,
    }
    return acc
  }, {})
}

/**
 * Manually set preferred provider
 * @param {string} providerKey - Provider key (web3storage, pinata, nftstorage)
 */
export function setPreferredProvider(providerKey) {
  if (!providers[providerKey]) {
    throw new Error(`Invalid provider: ${providerKey}`)
  }
  if (!providers[providerKey].enabled) {
    throw new Error(`Provider not configured: ${providerKey}`)
  }
  currentProvider = providerKey
  logger.info(`Preferred IPFS provider set to: ${providers[providerKey].name}`)
}

export { storageClient, currentProvider, providers }