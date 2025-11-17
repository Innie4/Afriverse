// Request controller - handles data request operations (SOLID: Single Responsibility)
import { query } from "../config/database.js"
import { asyncHandler, sendSuccess, sendBadRequest, sendNotFound } from "../utils/responseHandler.js"

export const createRequest = asyncHandler(async (req, res) => {
    const { requesterAddress, vertical, specs, bountyMatic } = req.body
    if (!requesterAddress || !vertical || !specs) return sendBadRequest(res, "requesterAddress, vertical, specs required")
    const result = await query(
      `INSERT INTO requests (requester_address, vertical, specs, bounty_matic) VALUES ($1, $2, $3, $4) RETURNING *`,
      [requesterAddress, vertical, specs, bountyMatic || null]
    )
    sendSuccess(res, { request: result.rows[0] }, 201)
})

export const listRequests = asyncHandler(async (req, res) => {
    const { vertical, status = "open" } = req.query
    let q = `SELECT * FROM requests WHERE status = $1`
    const params = [status]
    if (vertical) {
      q += ` AND vertical = $2`
      params.push(vertical)
    }
    q += ` ORDER BY created_at DESC`
    const result = await query(q, params)
    sendSuccess(res, { requests: result.rows })
})

export const updateRequestStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    if (!["open", "closed", "cancelled"].includes(status)) return sendBadRequest(res, "Invalid status. Must be one of: open, closed, cancelled")
    const result = await query(`UPDATE requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, parseInt(id)])
    if (result.rows.length === 0) return sendNotFound(res, "Request")
    sendSuccess(res, { request: result.rows[0] })
})


