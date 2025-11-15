// Lazy mint controller - handles lazy minting operations
import { query } from "../config/database.js"
import logger from "../config/logger.js"

/**
 * Create a lazy mint
 */
export async function createLazyMint(req, res, next) {
  try {
    const { ipfsHash, authorAddress, tribe, language, metadata } = req.body

    if (!ipfsHash || !authorAddress) {
      return res.status(400).json({ error: "Missing required fields" })
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
    res.status(201).json({
      success: true,
      lazyMint: {
        id: result.rows[0].id,
        ipfsHash,
        authorAddress,
        tribe,
        language,
        metadata,
        minted: false,
      },
    })
  } catch (error) {
    logger.error("Error creating lazy mint", error)
    next(error)
  }
}

/**
 * Get lazy mint by IPFS hash
 */
export async function getLazyMint(req, res, next) {
  try {
    const { ipfsHash } = req.params

    const result = await query(
      `
      SELECT * FROM lazy_mints
      WHERE ipfs_hash = $1
    `,
      [ipfsHash]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lazy mint not found" })
    }

    const lazyMint = result.rows[0]
    res.json({
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
  } catch (error) {
    logger.error("Error fetching lazy mint", error)
    next(error)
  }
}

/**
 * Mark lazy mint as minted
 */
export async function markLazyMintMinted(req, res, next) {
  try {
    const { ipfsHash } = req.params
    const { tokenId } = req.body

    if (!tokenId) {
      return res.status(400).json({ error: "Token ID required" })
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
      return res.status(404).json({ error: "Lazy mint not found" })
    }

    logger.info(`Lazy mint marked as minted: ${ipfsHash} -> token ${tokenId}`)
    res.json({ success: true, lazyMint: result.rows[0] })
  } catch (error) {
    logger.error("Error marking lazy mint as minted", error)
    next(error)
  }
}

/**
 * Get user's lazy mints
 */
export async function getUserLazyMints(req, res, next) {
  try {
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

    res.json({ lazyMints })
  } catch (error) {
    logger.error("Error fetching user lazy mints", error)
    next(error)
  }
}

