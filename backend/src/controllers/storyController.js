// Story controller - handles HTTP requests/responses (SOLID: Single Responsibility)
import * as storyService from "../services/storyService.js"
import { asyncHandler, sendSuccess, sendNotFound, sendBadRequest } from "../utils/responseHandler.js"
import { buildAndStoreDatasetCard } from "../services/datasetCard.js"

/**
 * Get all stories with optional filters
 */
export const getStories = asyncHandler(async (req, res) => {
  const { tribe, language, author, vertical, page, limit } = req.query
  const result = await storyService.getAllStories({ tribe, language, author, vertical, page, limit })
  sendSuccess(res, result)
})

/**
 * Get story by token ID
 */
export const getStoryById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const story = await storyService.getStoryByTokenId(id)
  
  if (!story) {
    return sendNotFound(res, "Story")
  }
  
  sendSuccess(res, story)
})

/**
 * Get story statistics
 */
export const getStoryStats = asyncHandler(async (req, res) => {
  const stats = await storyService.getStoryStatistics()
  sendSuccess(res, stats)
})

/**
 * Create a story record off-chain (bypass smart contract)
 */
export const createStory = asyncHandler(async (req, res) => {
  const { ipfsHash, author, tribe, language, vertical, title, description, metadata } = req.body

  if (!author || typeof author !== "string") {
    return sendBadRequest(res, "author is required")
  }

  // Allow creation without IPFS when service is down; use a placeholder
  const effectiveIpfsHash = typeof ipfsHash === "string" && ipfsHash.trim().length > 0 ? ipfsHash : `PENDING_IPFS_${Date.now()}`

  let enrichedMetadata = metadata && typeof metadata === "object" ? { ...metadata } : {}

  // Build a minimal dataset card and store on IPFS
  try {
    const cardUri = await buildAndStoreDatasetCard({
      tokenId: undefined,
      ipfsHash: effectiveIpfsHash,
      vertical,
      metadata: enrichedMetadata,
    })
    enrichedMetadata = { ...enrichedMetadata, datasetCardUri: cardUri }
  } catch {}

  const story = await storyService.createStory({
    ipfsHash: effectiveIpfsHash,
    author,
    tribe,
    language,
    vertical,
    title,
    description,
    metadata: enrichedMetadata,
  })

  sendSuccess(res, { story, ipfsPending: effectiveIpfsHash.startsWith("PENDING_IPFS") }, 201)
})

