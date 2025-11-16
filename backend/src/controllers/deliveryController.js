import { query } from "../config/database.js"
import { generateSignedUrl, verifySignedParams } from "../services/signedUrls.js"

export async function listPurchases(req, res, next) {
  try {
    const { address } = req.params
    const result = await query(`SELECT * FROM purchases WHERE buyer_address = $1 ORDER BY created_at DESC`, [address])
    res.json({ purchases: result.rows })
  } catch (error) {
    next(error)
  }
}

export async function getDownloadLink(req, res, next) {
  try {
    const { address, tokenId } = req.params
    const purchase = await query(`SELECT * FROM purchases WHERE buyer_address = $1 AND token_id = $2 ORDER BY created_at DESC LIMIT 1`, [
      address,
      parseInt(tokenId),
    ])
    if (purchase.rows.length === 0) return res.status(404).json({ error: "No entitlement found" })
    // For MVP, assume IPFS gateway path is derived from story ipfs_hash
    const story = await query(`SELECT ipfs_hash FROM stories WHERE token_id = $1`, [parseInt(tokenId)])
    if (story.rows.length === 0) return res.status(404).json({ error: "Story not found" })
    const resourcePath = `/ipfs/${story.rows[0].ipfs_hash}`
    const { url, expiry } = generateSignedUrl(resourcePath)
    res.json({ url, expiry })
  } catch (error) {
    next(error)
  }
}

export async function verifyDownload(req, res, next) {
  try {
    const { path } = req.query
    const { e, sig } = req.query
    if (!path || !e || !sig) return res.status(400).json({ ok: false })
    const ok = verifySignedParams(path, e, sig)
    res.json({ ok })
  } catch (error) {
    next(error)
  }
}


