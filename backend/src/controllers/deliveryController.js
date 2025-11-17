// Delivery controller - handles purchase delivery operations (SOLID: Single Responsibility)
import { query } from "../config/database.js"
import { generateSignedUrl, verifySignedParams } from "../services/signedUrls.js"
import { asyncHandler, sendSuccess, sendBadRequest, sendNotFound } from "../utils/responseHandler.js"

export const listPurchases = asyncHandler(async (req, res) => {
    const { address } = req.params
    const result = await query(`SELECT * FROM purchases WHERE buyer_address = $1 ORDER BY created_at DESC`, [address])
    sendSuccess(res, { purchases: result.rows })
})

export const getDownloadLink = asyncHandler(async (req, res) => {
    const { address, tokenId } = req.params
    const purchase = await query(`SELECT * FROM purchases WHERE buyer_address = $1 AND token_id = $2 ORDER BY created_at DESC LIMIT 1`, [
      address,
      parseInt(tokenId),
    ])
    if (purchase.rows.length === 0) return sendNotFound(res, "Purchase entitlement")
    // For MVP, assume IPFS gateway path is derived from story ipfs_hash
    const story = await query(`SELECT ipfs_hash FROM stories WHERE token_id = $1`, [parseInt(tokenId)])
    if (story.rows.length === 0) return sendNotFound(res, "Story")
    const resourcePath = `/ipfs/${story.rows[0].ipfs_hash}`
    const { url, expiry } = generateSignedUrl(resourcePath)
    sendSuccess(res, { url, expiry })
})

export const verifyDownload = asyncHandler(async (req, res) => {
    const { path, e, sig } = req.query
    if (!path || !e || !sig) return sendBadRequest(res, "Missing required parameters: path, e, sig")
    const ok = verifySignedParams(path, e, sig)
    sendSuccess(res, { ok })
})


