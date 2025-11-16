import { query } from "../config/database.js"

export async function createRequest(req, res, next) {
  try {
    const { requesterAddress, vertical, specs, bountyMatic } = req.body
    if (!requesterAddress || !vertical || !specs) return res.status(400).json({ error: "requesterAddress, vertical, specs required" })
    const result = await query(
      `INSERT INTO requests (requester_address, vertical, specs, bounty_matic) VALUES ($1, $2, $3, $4) RETURNING *`,
      [requesterAddress, vertical, specs, bountyMatic || null]
    )
    res.status(201).json({ success: true, request: result.rows[0] })
  } catch (error) {
    next(error)
  }
}

export async function listRequests(req, res, next) {
  try {
    const { vertical, status = "open" } = req.query
    let q = `SELECT * FROM requests WHERE status = $1`
    const params = [status]
    if (vertical) {
      q += ` AND vertical = $2`
      params.push(vertical)
    }
    q += ` ORDER BY created_at DESC`
    const result = await query(q, params)
    res.json({ requests: result.rows })
  } catch (error) {
    next(error)
  }
}

export async function updateRequestStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!["open", "closed", "cancelled"].includes(status)) return res.status(400).json({ error: "Invalid status" })
    const result = await query(`UPDATE requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, parseInt(id)])
    if (result.rows.length === 0) return res.status(404).json({ error: "Request not found" })
    res.json({ success: true, request: result.rows[0] })
  } catch (error) {
    next(error)
  }
}


