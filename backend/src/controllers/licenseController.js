// License controller - handles license operations (SOLID: Single Responsibility)
import { query } from "../config/database.js"
import logger from "../config/logger.js"
import { uploadMetadataToIPFS } from "../services/ipfs.js"
import { asyncHandler, sendSuccess, sendBadRequest, sendNotFound } from "../utils/responseHandler.js"

export const createLicensePreset = asyncHandler(async (req, res) => {
    const { key, name, legalText, machineTerms } = req.body
    if (!key || !name) {
      return sendBadRequest(res, "key and name are required")
    }
    let legal_text_uri = null
    if (legalText) {
      const cid = await uploadMetadataToIPFS({ type: "license", key, name, legalText, machineTerms })
      legal_text_uri = `ipfs://${cid}`
    }
    const result = await query(
      `INSERT INTO licenses (key, name, legal_text_uri, machine_terms) VALUES ($1, $2, $3, $4) ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name, legal_text_uri = EXCLUDED.legal_text_uri, machine_terms = EXCLUDED.machine_terms RETURNING *`,
      [key, name, legal_text_uri, machineTerms || null]
    )
    sendSuccess(res, { license: result.rows[0] }, 201)
})

export const listLicensePresets = asyncHandler(async (req, res) => {
    const result = await query(`SELECT * FROM licenses ORDER BY created_at DESC`)
    sendSuccess(res, { licenses: result.rows })
})

export const attachLicenseToStory = asyncHandler(async (req, res) => {
    const { tokenId } = req.params
    const { licenseKey } = req.body
    if (!licenseKey) return sendBadRequest(res, "licenseKey is required")

    const lic = await query(`SELECT id FROM licenses WHERE key = $1`, [licenseKey])
    if (lic.rows.length === 0) return sendNotFound(res, "License")

    const result = await query(
      `INSERT INTO story_licenses (token_id, license_id) VALUES ($1, $2) ON CONFLICT (token_id) DO UPDATE SET license_id = EXCLUDED.license_id, attached_at = NOW() RETURNING *`,
      [parseInt(tokenId), lic.rows[0].id]
    )
    sendSuccess(res, { storyLicense: result.rows[0] })
})


