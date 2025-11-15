// Story service - Business logic layer (SOLID: Single Responsibility)
import { query } from "../config/database.js"
import { getCached, setCached } from "../config/cache.js"
import { getIPFSGatewayURL } from "./ipfs.js"
import logger from "../config/logger.js"

/**
 * Build query with filters (DRY: Don't Repeat Yourself)
 */
function buildStoryQuery(filters) {
  let queryText = "SELECT * FROM stories WHERE 1=1"
  const params = []
  let paramIndex = 1

  if (filters.tribe) {
    queryText += ` AND tribe = $${paramIndex++}`
    params.push(filters.tribe)
  }

  if (filters.language) {
    queryText += ` AND language = $${paramIndex++}`
    params.push(filters.language)
  }

  if (filters.author) {
    queryText += ` AND author = $${paramIndex++}`
    params.push(filters.author)
  }

  queryText += " ORDER BY created_at DESC"

  if (filters.pagination) {
    const offset = (filters.pagination.page - 1) * filters.pagination.limit
    queryText += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(filters.pagination.limit, offset)
  }

  return { queryText, params }
}

/**
 * Format story from database row (DRY)
 */
function formatStory(story) {
  return {
    id: story.id,
    tokenId: story.token_id,
    ipfsHash: story.ipfs_hash,
    ipfsUrl: getIPFSGatewayURL(story.ipfs_hash),
    author: story.author,
    tribe: story.tribe,
    language: story.language,
    title: story.title,
    description: story.description,
    metadata: story.metadata,
    createdAt: story.created_at,
    updatedAt: story.updated_at,
  }
}

/**
 * Get all stories with filters
 */
export async function getAllStories(filters = {}) {
  const { tribe, language, author, page = 1, limit = 20 } = filters

  // Build cache key
  const cacheKey = `stories:${tribe || "all"}:${language || "all"}:${author || "all"}:${page}:${limit}`

  // Try cache first
  const cached = await getCached(cacheKey)
  if (cached) {
    logger.debug("Serving stories from cache")
    return cached
  }

  // Build and execute query
  const { queryText, params } = buildStoryQuery({
    tribe,
    language,
    author,
    pagination: { page: parseInt(page), limit: parseInt(limit) },
  })

  const result = await query(queryText, params)
  const stories = result.rows.map(formatStory)

  const response = {
    stories,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: stories.length,
    },
  }

  // Cache for 5 minutes
  await setCached(cacheKey, response, 300)

  return response
}

/**
 * Get story by token ID
 */
export async function getStoryByTokenId(tokenId) {
  const cacheKey = `story:${tokenId}`

  const cached = await getCached(cacheKey)
  if (cached) {
    logger.debug("Serving story from cache")
    return cached
  }

  const result = await query("SELECT * FROM stories WHERE token_id = $1", [parseInt(tokenId)])

  if (result.rows.length === 0) {
    return null
  }

  const story = formatStory(result.rows[0])

  // Cache for 5 minutes
  await setCached(cacheKey, story, 300)

  return story
}

/**
 * Get story statistics
 */
export async function getStoryStatistics() {
  const cacheKey = "story:stats"

  const cached = await getCached(cacheKey)
  if (cached) {
    return cached
  }

  const [totalResult, tribeResult, languageResult] = await Promise.all([
    query("SELECT COUNT(*) as total FROM stories"),
    query("SELECT tribe, COUNT(*) as count FROM stories WHERE tribe IS NOT NULL GROUP BY tribe ORDER BY count DESC"),
    query("SELECT language, COUNT(*) as count FROM stories WHERE language IS NOT NULL GROUP BY language ORDER BY count DESC"),
  ])

  const stats = {
    total: parseInt(totalResult.rows[0].total),
    byTribe: tribeResult.rows.map((r) => ({ tribe: r.tribe, count: parseInt(r.count) })),
    byLanguage: languageResult.rows.map((r) => ({ language: r.language, count: parseInt(r.count) })),
  }

  // Cache for 10 minutes
  await setCached(cacheKey, stats, 600)

  return stats
}

/**
 * Create a new story
 */
export async function createStory(storyData) {
  const { ipfsHash, author, tribe, language, title, description, metadata } = storyData

  if (!ipfsHash || !author) {
    throw new Error("IPFS hash and author are required")
  }

  // Get next token ID
  const maxResult = await query("SELECT COALESCE(MAX(token_id), -1) + 1 AS next_id FROM stories")
  const nextTokenId = parseInt(maxResult.rows[0].next_id)

  const result = await query(
    `INSERT INTO stories (token_id, ipfs_hash, author, tribe, language, title, description, metadata, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     RETURNING *`,
    [nextTokenId, ipfsHash, author, tribe || null, language || null, title || null, description || null, metadata ? JSON.stringify(metadata) : null]
  )

  return formatStory(result.rows[0])
}

