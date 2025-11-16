// Marketplace controller - handles marketplace operations (SOLID: Single Responsibility)
import { query } from "../config/database.js"
import { getCached, setCached } from "../config/cache.js"
import logger from "../config/logger.js"
import { asyncHandler, sendSuccess, sendError, sendNotFound, sendBadRequest } from "../utils/responseHandler.js"

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
export const getListings = asyncHandler(async (req, res) => {
    const { status = "active", page = 1, limit = 20, minPrice, maxPrice, tribe, language, tokenId, vertical, licenseKey, consentScope, hasReleases, hasProvenance } = req.query

    const cacheKey = `listings:${status}:${page}:${limit}:${minPrice || "all"}:${maxPrice || "all"}:${tribe || "all"}:${language || "all"}:${tokenId || "all"}:${vertical || "all"}:${licenseKey || "all"}:${consentScope || "all"}:${hasReleases || "all"}:${hasProvenance || "all"}`

    const cached = await getCached(cacheKey)
    if (cached) {
      logger.debug("Serving listings from cache")
      return sendSuccess(res, cached)
    }

    let queryText = `
      SELECT l.*, s.title, s.description, s.tribe, s.language, s.vertical, s.ipfs_hash, s.metadata, lic.key as license_key, r.consent_scope, p.manifest_uri
      FROM listings l
      LEFT JOIN stories s ON l.token_id = s.token_id
      LEFT JOIN story_licenses sl ON sl.token_id = s.token_id
      LEFT JOIN licenses lic ON lic.id = sl.license_id
      LEFT JOIN releases r ON r.token_id = s.token_id
      LEFT JOIN provenance p ON p.token_id = s.token_id
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

    if (vertical) {
      queryText += ` AND s.vertical = $${paramIndex++}`
      params.push(vertical)
    }

    if (licenseKey) {
      queryText += ` AND lic.key = $${paramIndex++}`
      params.push(licenseKey)
    }

    if (consentScope) {
      queryText += ` AND r.consent_scope = $${paramIndex++}`
      params.push(consentScope)
    }

    if (hasReleases === "true") {
      queryText += ` AND r.id IS NOT NULL`
    } else if (hasReleases === "false") {
      queryText += ` AND r.id IS NULL`
    }

    if (hasProvenance === "true") {
      queryText += ` AND p.id IS NOT NULL`
    } else if (hasProvenance === "false") {
      queryText += ` AND p.id IS NULL`
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
        vertical: row.vertical,
        ipfsHash: row.ipfs_hash,
        metadata: row.metadata,
      },
      licenseKey: row.license_key || null,
      consentScope: row.consent_scope || null,
      hasProvenance: !!row.manifest_uri,
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

    sendSuccess(res, response)
})

/**
 * Get listing by ID
 */
export const getListingById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const cacheKey = `listing:${id}`

    const cached = await getCached(cacheKey)
    if (cached) {
      return sendSuccess(res, cached)
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
      return sendNotFound(res, "Listing")
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

    sendSuccess(res, listing)
})

/**
 * Create a new listing (off-chain record)
 */
export const createListing = asyncHandler(async (req, res) => {
    const { listingId, tokenId, sellerAddress, priceWei, priceMatic, listingType = "fixed", endTime } = req.body

    if (!listingId || !tokenId || !sellerAddress || !priceWei) {
      return sendBadRequest(res, "Missing required fields: listingId, tokenId, sellerAddress, priceWei")
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
    sendSuccess(res, { listing }, 201)
})

/**
 * Update listing status
 */
export const updateListingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    if (!status || !["active", "sold", "cancelled", "ended"].includes(status)) {
      return sendBadRequest(res, "Invalid status. Must be one of: active, sold, cancelled, ended")
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
      return sendNotFound(res, "Listing")
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

    sendSuccess(res, { listing: result.rows[0] })
})

/**
 * Record a sale
 */
export const recordSale = asyncHandler(async (req, res) => {
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
      return sendBadRequest(res, "Missing required fields: tokenId, sellerAddress, buyerAddress, priceWei, transactionHash")
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

    // Create purchase entitlement
    const licenseRow = await query(
      `SELECT l.* FROM story_licenses sl JOIN licenses l ON sl.license_id = l.id WHERE sl.token_id = $1`,
      [parseInt(tokenId)]
    )
    const delivery = await query(`SELECT ipfs_hash FROM stories WHERE token_id = $1`, [parseInt(tokenId)])
    const deliveryUris = delivery.rows.length ? [{ type: "ipfs", uri: `ipfs://${delivery.rows[0].ipfs_hash}` }] : []
    await query(
      `INSERT INTO purchases (token_id, buyer_address, license_snapshot, delivery_uris, transaction_hash)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
      [parseInt(tokenId), buyerAddress, licenseRow.rows[0] || null, JSON.stringify(deliveryUris), transactionHash]
    )

    logger.info(`Sale recorded: token_id ${tokenId}, tx ${transactionHash}`)
    sendSuccess(res, { saleId: result.rows[0].id }, 201)
})

/**
 * Get sales history
 */
export const getSales = asyncHandler(async (req, res) => {
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

    sendSuccess(res, { sales, pagination: { page: parseInt(page), limit: parseInt(limit), total: sales.length } })
})

/**
 * Get offers for a token
 */
export const getOffers = asyncHandler(async (req, res) => {
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

    sendSuccess(res, { offers })
})

/**
 * Create an offer
 */
export const createOffer = asyncHandler(async (req, res) => {
    const { offerId, tokenId, offererAddress, priceWei, priceMatic, expiresAt } = req.body

    if (!offerId || !tokenId || !offererAddress || !priceWei) {
      return sendBadRequest(res, "Missing required fields: offerId, tokenId, offererAddress, priceWei")
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

    sendSuccess(res, {
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
    }, 201)
})

/**
 * Update offer status
 */
export const updateOfferStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    if (!status || !["pending", "accepted", "rejected", "expired"].includes(status)) {
      return sendBadRequest(res, "Invalid status. Must be one of: pending, accepted, rejected, expired")
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
      return sendNotFound(res, "Offer")
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

    sendSuccess(res, { offer: result.rows[0] })
})

/**
 * Get price history for a token
 */
export const getPriceHistory = asyncHandler(async (req, res) => {
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

    sendSuccess(res, { history })
})

/**
 * Get user's NFTs (owned, created, listed)
 */
export const getUserNFTs = asyncHandler(async (req, res) => {
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

    sendSuccess(res, {
      owned: owned.length > 0 ? owned : [], // Placeholder
      created,
      listed,
    })
})

