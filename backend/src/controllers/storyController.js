// Story controller - handles story-related operations
import { query } from "../config/database.js"
import { getCached, setCached } from "../config/cache.js"
import { getIPFSGatewayURL } from "../services/ipfs.js"
import logger from "../config/logger.js"

/**
 * Get all stories with optional filters
 */
export async function getStories(req, res, next) {
  try {
    const { tribe, language, author, page = 1, limit = 20 } = req.query

    // Build cache key
    const cacheKey = `stories:${tribe || "all"}:${language || "all"}:${author || "all"}:${page}:${limit}`

    // Try cache first
    const cached = await getCached(cacheKey)
    if (cached) {
      logger.debug("Serving stories from cache")
      return res.json(cached)
    }

    // Build query
    let queryText = "SELECT * FROM stories WHERE 1=1"
    const params = []
    let paramIndex = 1

    if (tribe) {
      queryText += ` AND tribe = $${paramIndex++}`
      params.push(tribe)
    }

    if (language) {
      queryText += ` AND language = $${paramIndex++}`
      params.push(language)
    }

    if (author) {
      queryText += ` AND author = $${paramIndex++}`
      params.push(author)
    }

    // Order by created_at descending
    queryText += " ORDER BY created_at DESC"

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit)
    queryText += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(parseInt(limit), offset)

    const result = await query(queryText, params)

    // Format response with IPFS gateway URLs
    const stories = result.rows.map((story) => ({
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
    }))

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

    res.json(response)
  } catch (error) {
    logger.error("Error fetching stories", error)
    next(error)
  }
}

/**
 * Get story by token ID
 */
export async function getStoryById(req, res, next) {
  try {
    const { id } = req.params

    const cacheKey = `story:${id}`

    // Try cache first
    const cached = await getCached(cacheKey)
    if (cached) {
      logger.debug(`Serving story ${id} from cache`)
      return res.json(cached)
    }

    const result = await query("SELECT * FROM stories WHERE token_id = $1", [parseInt(id)])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" })
    }

    const story = result.rows[0]

    const response = {
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

    // Cache for 10 minutes
    await setCached(cacheKey, response, 600)

    res.json(response)
  } catch (error) {
    logger.error("Error fetching story", error)
    next(error)
  }
}

/**
 * Get story statistics
 */
export async function getStoryStats(req, res, next) {
  try {
    const cacheKey = "stats:stories"

    const cached = await getCached(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    const [totalResult, tribeResult, languageResult] = await Promise.all([
      query("SELECT COUNT(*) as total FROM stories"),
      query("SELECT tribe, COUNT(*) as count FROM stories GROUP BY tribe ORDER BY count DESC"),
      query("SELECT language, COUNT(*) as count FROM stories GROUP BY language ORDER BY count DESC"),
    ])

    const stats = {
      total: parseInt(totalResult.rows[0].total),
      byTribe: tribeResult.rows.map((r) => ({ tribe: r.tribe, count: parseInt(r.count) })),
      byLanguage: languageResult.rows.map((r) => ({ language: r.language, count: parseInt(r.count) })),
    }

    await setCached(cacheKey, stats, 600)

    res.json(stats)
  } catch (error) {
    logger.error("Error fetching story stats", error)
    next(error)
  }
}

/**
 * Create a story record off-chain (bypass smart contract)
 */
export async function createStory(req, res, next) {
  try {
    const { ipfsHash, author, tribe, language, title, description, metadata } = req.body

    // Allow creation without IPFS when service is down; use a placeholder
    const effectiveIpfsHash = typeof ipfsHash === "string" && ipfsHash.trim().length > 0 ? ipfsHash : `PENDING_IPFS_${Date.now()}`

    if (!author || typeof author !== "string") {
      return res.status(400).json({ error: "author is required" })
    }

    // Derive next tokenId when bypassing on-chain mint
    const nextIdResult = await query("SELECT COALESCE(MAX(token_id), -1) + 1 AS next_id FROM stories")
    const tokenId = parseInt(nextIdResult.rows[0].next_id)

    const insertQuery = `
      INSERT INTO stories (token_id, ipfs_hash, author, tribe, language, title, description, metadata, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id
    `

    const result = await query(insertQuery, [
      tokenId,
      effectiveIpfsHash,
      author,
      tribe || null,
      language || null,
      title || null,
      description || null,
      metadata ? JSON.stringify(metadata) : null,
    ])

    const created = {
      id: result.rows[0].id,
      tokenId,
      ipfsHash: effectiveIpfsHash,
      ipfsUrl: getIPFSGatewayURL(effectiveIpfsHash),
      ipfsPending: effectiveIpfsHash.startsWith("PENDING_IPFS"),
      author,
      tribe: tribe || null,
      language: language || null,
      title: title || null,
      description: description || null,
      metadata: metadata || null,
      createdAt: new Date().toISOString(),
    }

    logger.info(`Off-chain story created: token_id ${tokenId}`)
    res.status(201).json({ success: true, story: created })
  } catch (error) {
    logger.error("Error creating off-chain story", error)
    next(error)
  }
}

