// Lazy mint controller - handles lazy minting operations (SOLID: Single Responsibility)
import { query } from "../config/database.js"
import logger from "../config/logger.js"
import { asyncHandler, sendSuccess, sendBadRequest, sendNotFound } from "../utils/responseHandler.js"

/**
 * Create a lazy mint
 */
export const createLazyMint = asyncHandler(async (req, res) => {
    const { ipfsHash, authorAddress, tribe, language, metadata } = req.body

    if (!ipfsHash || !authorAddress) {
      return sendBadRequest(res, "Missing required fields: ipfsHash, authorAddress")
    }

    const insertQuery = `
      INSERT INTO lazy_mints (ipfs_hash, author_address, tribe, language, metadata)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (ipfs_hash) DO UPDATE
      SET updated_at = NOW()
      RETURNING id
    `

    const result = await query(insertQuery, [
      ipfsHash,
      authorAddress,
      tribe || null,
      language || null,
      metadata ? JSON.stringify(metadata) : null,
    ])

    logger.info(`Lazy mint created: ${ipfsHash} by ${authorAddress}`)
    sendSuccess(res, {
      lazyMint: {
        id: result.rows[0].id,
        ipfsHash,
        authorAddress,
        tribe,
        language,
        metadata,
        minted: false,
      },
    }, 201)
})

/**
 * Get lazy mint by IPFS hash
 */
export const getLazyMint = asyncHandler(async (req, res) => {
    const { ipfsHash } = req.params

    const result = await query(
      `
      SELECT * FROM lazy_mints
      WHERE ipfs_hash = $1
    `,
      [ipfsHash]
    )

    if (result.rows.length === 0) {
      return sendNotFound(res, "Lazy mint")
    }

    const lazyMint = result.rows[0]
    sendSuccess(res, {
      id: lazyMint.id,
      ipfsHash: lazyMint.ipfs_hash,
      authorAddress: lazyMint.author_address,
      tribe: lazyMint.tribe,
      language: lazyMint.language,
      metadata: lazyMint.metadata,
      minted: lazyMint.minted,
      tokenId: lazyMint.token_id,
      createdAt: lazyMint.created_at,
      mintedAt: lazyMint.minted_at,
    })
})

/**
 * Mark lazy mint as minted
 */
export const markLazyMintMinted = asyncHandler(async (req, res) => {
    const { ipfsHash } = req.params
    const { tokenId } = req.body

    if (!tokenId) {
      return sendBadRequest(res, "Token ID required")
    }

    const result = await query(
      `
      UPDATE lazy_mints
      SET minted = TRUE, token_id = $1, minted_at = NOW()
      WHERE ipfs_hash = $2
      RETURNING *
    `,
      [parseInt(tokenId), ipfsHash]
    )

    if (result.rows.length === 0) {
      return sendNotFound(res, "Lazy mint")
    }

    logger.info(`Lazy mint marked as minted: ${ipfsHash} -> token ${tokenId}`)
    sendSuccess(res, { lazyMint: result.rows[0] })
})

/**
 * Get user's lazy mints
 */
export const getUserLazyMints = asyncHandler(async (req, res) => {
    const { address } = req.params
    const { minted = "all" } = req.query // 'all', 'true', 'false'

    let queryText = `
      SELECT * FROM lazy_mints
      WHERE author_address = $1
    `
    const params = [address]

    if (minted === "true") {
      queryText += " AND minted = TRUE"
    } else if (minted === "false") {
      queryText += " AND minted = FALSE"
    }

    queryText += " ORDER BY created_at DESC"

    const result = await query(queryText, params)

    const lazyMints = result.rows.map((row) => ({
      id: row.id,
      ipfsHash: row.ipfs_hash,
      authorAddress: row.author_address,
      tribe: row.tribe,
      language: row.language,
      metadata: row.metadata,
      minted: row.minted,
      tokenId: row.token_id,
      createdAt: row.created_at,
      mintedAt: row.minted_at,
    }))

    sendSuccess(res, { lazyMints })
})

