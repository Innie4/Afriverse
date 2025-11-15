// Marketplace controller - handles marketplace operations
import { query } from "../config/database.js"
import { getCached, setCached } from "../config/cache.js"
import logger from "../config/logger.js"

// Helper to convert wei to MATIC (18 decimals)
function weiToMatic(wei) {
  return Number(wei) / 1e18
}

// Helper to convert MATIC to wei
function maticToWei(matic) {
  return BigInt(Math.floor(Number(matic) * 1e18))
}

/**
 * Get all active listings
 */
export async function getListings(req, res, next) {
  try {
    const { status = "active", page = 1, limit = 20, minPrice, maxPrice, tribe, language, tokenId } = req.query

    const cacheKey = `listings:${status}:${page}:${limit}:${minPrice || "all"}:${maxPrice || "all"}:${tribe || "all"}:${language || "all"}:${tokenId || "all"}`

    const cached = await getCached(cacheKey)
    if (cached) {
      logger.debug("Serving listings from cache")
      return res.json(cached)
    }

    let queryText = `
      SELECT l.*, s.title, s.description, s.tribe, s.language, s.ipfs_hash, s.metadata
      FROM listings l
      LEFT JOIN stories s ON l.token_id = s.token_id
      WHERE l.status = $1
    `
    const params = [status]
    let paramIndex = 2

    if (tokenId) {
      queryText += ` AND l.token_id = $${paramIndex++}`
      params.push(parseInt(tokenId))
    }

    if (minPrice) {
      queryText += ` AND l.price_matic >= $${paramIndex++}`
      params.push(parseFloat(minPrice))
    }

    if (maxPrice) {
      queryText += ` AND l.price_matic <= $${paramIndex++}`
      params.push(parseFloat(maxPrice))
    }

    if (tribe) {
      queryText += ` AND s.tribe = $${paramIndex++}`
      params.push(tribe)
    }

    if (language) {
      queryText += ` AND s.language = $${paramIndex++}`
      params.push(language)
    }

    queryText += " ORDER BY l.created_at DESC"

    const offset = (parseInt(page) - 1) * parseInt(limit)
    queryText += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(parseInt(limit), offset)

    const result = await query(queryText, params)

    const listings = result.rows.map((row) => ({
      id: row.id,
      listingId: row.listing_id,
      tokenId: row.token_id,
      seller: row.seller_address,
      priceWei: row.price_wei?.toString(),
      priceMatic: row.price_matic,
      currency: row.currency,
      listingType: row.listing_type,
      status: row.status,
      startTime: row.start_time,
      endTime: row.end_time,
      createdAt: row.created_at,
      story: {
        title: row.title,
        description: row.description,
        tribe: row.tribe,
        language: row.language,
        ipfsHash: row.ipfs_hash,
        metadata: row.metadata,
      },
    }))

    const response = {
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: listings.length,
      },
    }

    await setCached(cacheKey, response, 300) // Cache for 5 minutes

    res.json(response)
  } catch (error) {
    logger.error("Error fetching listings", error)
    next(error)
  }
}

/**
 * Get listing by ID
 */
export async function getListingById(req, res, next) {
  try {
    const { id } = req.params

    const cacheKey = `listing:${id}`

    const cached = await getCached(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    const result = await query(
      `
      SELECT l.*, s.title, s.description, s.tribe, s.language, s.ipfs_hash, s.metadata, s.author
      FROM listings l
      LEFT JOIN stories s ON l.token_id = s.token_id
      WHERE l.listing_id = $1 OR l.id = $1
    `,
      [parseInt(id)]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" })
    }

    const row = result.rows[0]
    const listing = {
      id: row.id,
      listingId: row.listing_id,
      tokenId: row.token_id,
      seller: row.seller_address,
      priceWei: row.price_wei?.toString(),
      priceMatic: row.price_matic,
      currency: row.currency,
      listingType: row.listing_type,
      status: row.status,
      startTime: row.start_time,
      endTime: row.end_time,
      createdAt: row.created_at,
      story: {
        title: row.title,
        description: row.description,
        tribe: row.tribe,
        language: row.language,
        ipfsHash: row.ipfs_hash,
        metadata: row.metadata,
        author: row.author,
      },
    }

    await setCached(cacheKey, listing, 600)

    res.json(listing)
  } catch (error) {
    logger.error("Error fetching listing", error)
    next(error)
  }
}

/**
 * Create a new listing (off-chain record)
 */
export async function createListing(req, res, next) {
  try {
    const { listingId, tokenId, sellerAddress, priceWei, priceMatic, listingType = "fixed", endTime } = req.body

    if (!listingId || !tokenId || !sellerAddress || !priceWei) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Calculate price in MATIC if not provided
    const priceMaticValue = priceMatic || weiToMatic(priceWei)

    const insertQuery = `
      INSERT INTO listings (listing_id, token_id, seller_address, price_wei, price_matic, listing_type, status, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW(), $7)
      RETURNING id
    `

    const result = await query(insertQuery, [
      parseInt(listingId),
      parseInt(tokenId),
      sellerAddress,
      BigInt(priceWei),
      priceMaticValue,
      listingType,
      endTime || null,
    ])

    // Add to price history
    await query(
      `
      INSERT INTO price_history (token_id, price_wei, price_matic, event_type)
      VALUES ($1, $2, $3, 'listed')
    `,
      [parseInt(tokenId), BigInt(priceWei), priceMaticValue]
    )

    const listing = {
      id: result.rows[0].id,
      listingId: parseInt(listingId),
      tokenId: parseInt(tokenId),
      seller: sellerAddress,
      priceWei: priceWei.toString(),
      priceMatic: priceMaticValue,
      listingType,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    logger.info(`Listing created: listing_id ${listingId}, token_id ${tokenId}`)
    res.status(201).json({ success: true, listing })
  } catch (error) {
    logger.error("Error creating listing", error)
    next(error)
  }
}

/**
 * Update listing status
 */
export async function updateListingStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !["active", "sold", "cancelled", "ended"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const result = await query(
      `
      UPDATE listings
      SET status = $1, updated_at = NOW()
      WHERE listing_id = $2 OR id = $2
      RETURNING *
    `,
      [status, parseInt(id)]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" })
    }

    // If sold, add to price history
    if (status === "sold") {
      const listing = result.rows[0]
      await query(
        `
        INSERT INTO price_history (token_id, price_wei, price_matic, event_type)
        VALUES ($1, $2, $3, 'sold')
      `,
        [listing.token_id, listing.price_wei, listing.price_matic]
      )
    }

    res.json({ success: true, listing: result.rows[0] })
  } catch (error) {
    logger.error("Error updating listing status", error)
    next(error)
  }
}

/**
 * Record a sale
 */
export async function recordSale(req, res, next) {
  try {
    const {
      tokenId,
      listingId,
      sellerAddress,
      buyerAddress,
      priceWei,
      priceMatic,
      platformFeeWei,
      royaltyWei,
      transactionHash,
      blockNumber,
    } = req.body

    if (!tokenId || !sellerAddress || !buyerAddress || !priceWei || !transactionHash) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const priceMaticValue = priceMatic || weiToMatic(priceWei)
    const platformFeeMatic = platformFeeWei ? weiToMatic(platformFeeWei) : null
    const royaltyMatic = royaltyWei ? weiToMatic(royaltyWei) : null

    const insertQuery = `
      INSERT INTO sales (token_id, listing_id, seller_address, buyer_address, price_wei, price_matic, platform_fee_wei, royalty_wei, transaction_hash, block_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `

    const result = await query(insertQuery, [
      parseInt(tokenId),
      listingId ? parseInt(listingId) : null,
      sellerAddress,
      buyerAddress,
      BigInt(priceWei),
      priceMaticValue,
      platformFeeWei ? BigInt(platformFeeWei) : null,
      royaltyWei ? BigInt(royaltyWei) : null,
      transactionHash,
      blockNumber || null,
    ])

    // Update listing status if exists
    if (listingId) {
      await query(
        `
        UPDATE listings
        SET status = 'sold', updated_at = NOW()
        WHERE listing_id = $1
      `,
        [parseInt(listingId)]
      )
    }

    // Add to price history
    await query(
      `
      INSERT INTO price_history (token_id, price_wei, price_matic, transaction_hash, event_type)
      VALUES ($1, $2, $3, $4, 'sold')
    `,
      [parseInt(tokenId), BigInt(priceWei), priceMaticValue, transactionHash]
    )

    logger.info(`Sale recorded: token_id ${tokenId}, tx ${transactionHash}`)
    res.status(201).json({ success: true, saleId: result.rows[0].id })
  } catch (error) {
    logger.error("Error recording sale", error)
    next(error)
  }
}

/**
 * Get sales history
 */
export async function getSales(req, res, next) {
  try {
    const { tokenId, seller, buyer, page = 1, limit = 20 } = req.query

    let queryText = "SELECT * FROM sales WHERE 1=1"
    const params = []
    let paramIndex = 1

    if (tokenId) {
      queryText += ` AND token_id = $${paramIndex++}`
      params.push(parseInt(tokenId))
    }

    if (seller) {
      queryText += ` AND seller_address = $${paramIndex++}`
      params.push(seller)
    }

    if (buyer) {
      queryText += ` AND buyer_address = $${paramIndex++}`
      params.push(buyer)
    }

    queryText += " ORDER BY created_at DESC"

    const offset = (parseInt(page) - 1) * parseInt(limit)
    queryText += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(parseInt(limit), offset)

    const result = await query(queryText, params)

    const sales = result.rows.map((row) => ({
      id: row.id,
      tokenId: row.token_id,
      listingId: row.listing_id,
      seller: row.seller_address,
      buyer: row.buyer_address,
      priceWei: row.price_wei?.toString(),
      priceMatic: row.price_matic,
      platformFeeWei: row.platform_fee_wei?.toString(),
      royaltyWei: row.royalty_wei?.toString(),
      transactionHash: row.transaction_hash,
      blockNumber: row.block_number,
      createdAt: row.created_at,
    }))

    res.json({ sales, pagination: { page: parseInt(page), limit: parseInt(limit), total: sales.length } })
  } catch (error) {
    logger.error("Error fetching sales", error)
    next(error)
  }
}

/**
 * Get offers for a token
 */
export async function getOffers(req, res, next) {
  try {
    const { tokenId } = req.params

    const result = await query(
      `
      SELECT * FROM offers
      WHERE token_id = $1
      ORDER BY created_at DESC
    `,
      [parseInt(tokenId)]
    )

    const offers = result.rows.map((row) => ({
      id: row.id,
      offerId: row.offer_id,
      tokenId: row.token_id,
      offerer: row.offerer_address,
      priceWei: row.price_wei?.toString(),
      priceMatic: row.price_matic,
      status: row.status,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
    }))

    res.json({ offers })
  } catch (error) {
    logger.error("Error fetching offers", error)
    next(error)
  }
}

/**
 * Create an offer
 */
export async function createOffer(req, res, next) {
  try {
    const { offerId, tokenId, offererAddress, priceWei, priceMatic, expiresAt } = req.body

    if (!offerId || !tokenId || !offererAddress || !priceWei) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const priceMaticValue = priceMatic || weiToMatic(priceWei)

    const insertQuery = `
      INSERT INTO offers (offer_id, token_id, offerer_address, price_wei, price_matic, status, expires_at)
      VALUES ($1, $2, $3, $4, $5, 'pending', $6)
      RETURNING id
    `

    const result = await query(insertQuery, [
      parseInt(offerId),
      parseInt(tokenId),
      offererAddress,
      BigInt(priceWei),
      priceMaticValue,
      expiresAt || null,
    ])

    res.status(201).json({
      success: true,
      offer: {
        id: result.rows[0].id,
        offerId: parseInt(offerId),
        tokenId: parseInt(tokenId),
        offerer: offererAddress,
        priceWei: priceWei.toString(),
        priceMatic: priceMaticValue,
        status: "pending",
        expiresAt,
      },
    })
  } catch (error) {
    logger.error("Error creating offer", error)
    next(error)
  }
}

/**
 * Update offer status
 */
export async function updateOfferStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !["pending", "accepted", "rejected", "expired"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const result = await query(
      `
      UPDATE offers
      SET status = $1, updated_at = NOW()
      WHERE offer_id = $2 OR id = $2
      RETURNING *
    `,
      [status, parseInt(id)]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Offer not found" })
    }

    // If accepted, record as sale
    if (status === "accepted") {
      const offer = result.rows[0]
      await query(
        `
        INSERT INTO sales (token_id, seller_address, buyer_address, price_wei, price_matic, transaction_hash)
        VALUES ($1, (SELECT author FROM stories WHERE token_id = $1), $2, $3, $4, 'offer_accepted')
        ON CONFLICT DO NOTHING
      `,
        [offer.token_id, offer.offerer_address, offer.price_wei, offer.price_matic]
      )
    }

    res.json({ success: true, offer: result.rows[0] })
  } catch (error) {
    logger.error("Error updating offer status", error)
    next(error)
  }
}

/**
 * Get price history for a token
 */
export async function getPriceHistory(req, res, next) {
  try {
    const { tokenId } = req.params

    const result = await query(
      `
      SELECT * FROM price_history
      WHERE token_id = $1
      ORDER BY created_at DESC
      LIMIT 100
    `,
      [parseInt(tokenId)]
    )

    const history = result.rows.map((row) => ({
      id: row.id,
      tokenId: row.token_id,
      priceWei: row.price_wei?.toString(),
      priceMatic: row.price_matic,
      transactionHash: row.transaction_hash,
      eventType: row.event_type,
      createdAt: row.created_at,
    }))

    res.json({ history })
  } catch (error) {
    logger.error("Error fetching price history", error)
    next(error)
  }
}

/**
 * Get user's NFTs (owned, created, listed)
 */
export async function getUserNFTs(req, res, next) {
  try {
    const { address } = req.params
    const { type = "all" } = req.query // 'owned', 'created', 'listed', 'all'

    // This is a placeholder - in production, you'd query the blockchain
    // For now, we'll return stories by author (created) and check listings (listed)
    let owned = []
    let created = []
    let listed = []

    if (type === "all" || type === "created") {
      const createdResult = await query("SELECT * FROM stories WHERE author = $1 ORDER BY created_at DESC", [address])
      created = createdResult.rows
    }

    if (type === "all" || type === "listed") {
      const listedResult = await query(
        "SELECT l.*, s.* FROM listings l JOIN stories s ON l.token_id = s.token_id WHERE l.seller_address = $1 AND l.status = 'active'",
        [address]
      )
      listed = listedResult.rows
    }

    // Note: 'owned' would require querying the blockchain contract
    // This is a placeholder - implement blockchain query in production

    res.json({
      owned: owned.length > 0 ? owned : [], // Placeholder
      created,
      listed,
    })
  } catch (error) {
    logger.error("Error fetching user NFTs", error)
    next(error)
  }
}

