// Ethers.js event listener for StoryMinted events
import { ethers } from "ethers"
import logger from "../config/logger.js"
import { query } from "../config/database.js"
import { deleteCached } from "../config/cache.js"

// Dynamic import to avoid circular dependency
let deleteCachedFn = deleteCached

let provider = null
let contract = null
let listenerRunning = false

// Simple ABI for StoryMinted event
const STORY_MINTED_ABI = [
  "event StoryMinted(uint256 indexed tokenId, string ipfsHash, address indexed author, string tribe, uint256 timestamp)",
]

export function initEventListener() {
  if (!process.env.RPC_URL) {
    throw new Error("RPC_URL environment variable is required")
  }

  if (!process.env.CONTRACT_ADDRESS) {
    throw new Error("CONTRACT_ADDRESS environment variable is required")
  }

  provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, STORY_MINTED_ABI, provider)

  logger.info("Event listener initialized", {
    contractAddress: process.env.CONTRACT_ADDRESS,
    rpcUrl: process.env.RPC_URL,
  })

  return { provider, contract }
}

/**
 * Start listening for StoryMinted events
 */
export async function startEventListener() {
  if (listenerRunning) {
    logger.warn("Event listener is already running")
    return
  }

  if (!contract) {
    initEventListener()
  }

  try {
    // Listen for new events
    contract.on("StoryMinted", async (tokenId, ipfsHash, author, tribe, timestamp, event) => {
      try {
        logger.info("StoryMinted event detected", {
          tokenId: tokenId.toString(),
          ipfsHash,
          author,
          tribe,
          timestamp: timestamp.toString(),
        })

        await handleStoryMinted({
          tokenId: parseInt(tokenId.toString()),
          ipfsHash,
          author,
          tribe,
          timestamp: new Date(parseInt(timestamp.toString()) * 1000),
        })

        // Invalidate cache
        try {
          await deleteCachedFn("stories:*")
        } catch (cacheError) {
          logger.warn("Cache invalidation failed", cacheError)
        }
      } catch (error) {
        logger.error("Error handling StoryMinted event", error)
      }
    })

    listenerRunning = true
    logger.info("Event listener started successfully")
  } catch (error) {
    logger.error("Error starting event listener", error)
    throw error
  }
}

/**
 * Stop listening for events
 */
export function stopEventListener() {
  if (contract && listenerRunning) {
    contract.removeAllListeners("StoryMinted")
    listenerRunning = false
    logger.info("Event listener stopped")
  }
}

/**
 * Handle StoryMinted event - store in database
 */
async function handleStoryMinted({ tokenId, ipfsHash, author, tribe, timestamp }) {
  try {
    // Check if story already exists
    const existing = await query("SELECT id FROM stories WHERE token_id = $1", [tokenId])

    if (existing.rows.length > 0) {
      logger.warn(`Story with token_id ${tokenId} already exists`)
      return
    }

    // Try to fetch metadata from IPFS
    let metadata = null
    let title = null
    let description = null
    let language = null

    try {
      const metadataURL = `https://ipfs.io/ipfs/${ipfsHash}`
      const response = await fetch(metadataURL)
      if (response.ok) {
        metadata = await response.json()
        title = metadata.name || metadata.title
        description = metadata.description
        language = metadata.language || metadata.lang
      }
    } catch (ipfsError) {
      logger.warn(`Could not fetch metadata from IPFS for ${ipfsHash}`, ipfsError)
    }

    // Insert into database
    const insertQuery = `
      INSERT INTO stories (token_id, ipfs_hash, author, tribe, language, title, description, metadata, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (token_id) DO NOTHING
      RETURNING id
    `

    const result = await query(insertQuery, [
      tokenId,
      ipfsHash,
      author,
      tribe,
      language,
      title,
      description,
      metadata ? JSON.stringify(metadata) : null,
      timestamp,
    ])

    if (result.rows.length > 0) {
      logger.info(`Story stored successfully: token_id ${tokenId}`)
    }
  } catch (error) {
    logger.error("Error storing story in database", error)
    throw error
  }
}

/**
 * Sync historical events (useful for initial setup)
 */
export async function syncHistoricalEvents(fromBlock = 0, toBlock = "latest") {
  if (!contract) {
    initEventListener()
  }

  try {
    logger.info(`Syncing historical events from block ${fromBlock} to ${toBlock}`)

    const filter = contract.filters.StoryMinted()
    const events = await contract.queryFilter(filter, fromBlock, toBlock)

    logger.info(`Found ${events.length} historical events`)

    for (const event of events) {
      const { tokenId, ipfsHash, author, tribe, timestamp } = event.args
      await handleStoryMinted({
        tokenId: parseInt(tokenId.toString()),
        ipfsHash,
        author,
        tribe,
        timestamp: new Date(parseInt(timestamp.toString()) * 1000),
      })
    }

    logger.info("Historical events synced successfully")
  } catch (error) {
    logger.error("Error syncing historical events", error)
    throw error
  }
}

export { provider, contract }

