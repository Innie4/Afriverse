// Bundle controller - handles bundle purchase operations (SOLID: Single Responsibility)
import { query } from "../config/database.js"
import { getCached, setCached } from "../config/cache.js"
import logger from "../config/logger.js"
import { createNotification } from "../services/notificationService.js"
import { asyncHandler, sendSuccess, sendBadRequest, sendNotFound } from "../utils/responseHandler.js"

// Helper to convert wei to MATIC
function weiToMatic(wei) {
  return Number(wei) / 1e18
}

/**
 * Record a bundle purchase
 */
export const recordBundle = asyncHandler(async (req, res) => {
    const {
      bundleId,
      buyerAddress,
      listingIds,
      tokenIds,
      totalPriceWei,
      totalPriceMatic,
      discountBps,
      discountAmountWei,
      discountAmountMatic,
      platformFeeWei,
      transactionHash,
      blockNumber,
    } = req.body

    if (!bundleId || !buyerAddress || !listingIds || !tokenIds || !totalPriceWei) {
      return sendBadRequest(res, "Missing required fields: bundleId, buyerAddress, listingIds, tokenIds, totalPriceWei")
    }

    const totalPriceMaticValue = totalPriceMatic || weiToMatic(totalPriceWei)
    const discountAmountMaticValue = discountAmountMatic || (discountAmountWei ? weiToMatic(discountAmountWei) : 0)
    const platformFeeMatic = platformFeeWei ? weiToMatic(platformFeeWei) : null

    const insertQuery = `
      INSERT INTO bundles (
        bundle_id, buyer_address, listing_ids, token_ids,
        total_price_wei, total_price_matic, discount_bps,
        discount_amount_wei, discount_amount_matic,
        platform_fee_wei, transaction_hash, block_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `

    const result = await query(insertQuery, [
      bundleId,
      buyerAddress,
      listingIds,
      tokenIds,
      BigInt(totalPriceWei),
      totalPriceMaticValue,
      discountBps || 0,
      discountAmountWei ? BigInt(discountAmountWei) : null,
      discountAmountMaticValue,
      platformFeeWei ? BigInt(platformFeeWei) : null,
      transactionHash,
      blockNumber || null,
    ])

    // Update listing statuses
    for (const listingId of listingIds) {
      await query(
        `
        UPDATE listings
        SET status = 'sold', updated_at = NOW()
        WHERE listing_id = $1
      `,
        [listingId]
      )
    }

    // Create notifications for sellers
    for (let i = 0; i < tokenIds.length; i++) {
      const listingResult = await query(
        "SELECT seller_address FROM listings WHERE token_id = $1 AND listing_id = ANY($2::integer[])",
        [tokenIds[i], listingIds]
      )
      if (listingResult.rows.length > 0) {
        const sellerAddress = listingResult.rows[0].seller_address
        await createNotification(
          sellerAddress,
          "bundle_sale",
          "Your NFT was sold in a bundle!",
          `Your story #${tokenIds[i]} was purchased as part of a bundle`,
          { tokenId: tokenIds[i], bundleId, buyerAddress }
        )
      }
    }

    logger.info(`Bundle purchase recorded: ${bundleId}, buyer: ${buyerAddress}`)
    sendSuccess(res, { bundleId: result.rows[0].id }, 201)
})

/**
 * Get bundle by ID
 */
export const getBundleById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const result = await query(
      `
      SELECT * FROM bundles
      WHERE bundle_id = $1 OR id = $1
    `,
      [id]
    )

    if (result.rows.length === 0) {
      return sendNotFound(res, "Bundle")
    }

    const bundle = result.rows[0]
    sendSuccess(res, {
      id: bundle.id,
      bundleId: bundle.bundle_id,
      buyer: bundle.buyer_address,
      listingIds: bundle.listing_ids,
      tokenIds: bundle.token_ids,
      totalPriceWei: bundle.total_price_wei?.toString(),
      totalPriceMatic: bundle.total_price_matic,
      discountBps: bundle.discount_bps,
      discountAmountWei: bundle.discount_amount_wei?.toString(),
      discountAmountMatic: bundle.discount_amount_matic,
      platformFeeWei: bundle.platform_fee_wei?.toString(),
      transactionHash: bundle.transaction_hash,
      createdAt: bundle.created_at,
    })
})

/**
 * Get user's bundle purchases
 */
export const getUserBundles = asyncHandler(async (req, res) => {
    const { address } = req.params
    const { page = 1, limit = 20 } = req.query

    const offset = (parseInt(page) - 1) * parseInt(limit)

    const result = await query(
      `
      SELECT * FROM bundles
      WHERE buyer_address = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [address, parseInt(limit), offset]
    )

    const bundles = result.rows.map((row) => ({
      id: row.id,
      bundleId: row.bundle_id,
      buyer: row.buyer_address,
      listingIds: row.listing_ids,
      tokenIds: row.token_ids,
      totalPriceWei: row.total_price_wei?.toString(),
      totalPriceMatic: row.total_price_matic,
      discountBps: row.discount_bps,
      discountAmountMatic: row.discount_amount_matic,
      createdAt: row.created_at,
    }))

    sendSuccess(res, {
      bundles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: bundles.length,
      },
    })
})

