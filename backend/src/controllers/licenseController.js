import { query } from "../config/database.js"
import logger from "../config/logger.js"
import { uploadMetadataToIPFS } from "../services/ipfs.js"

export async function createLicensePreset(req, res, next) {
  try {
    const { key, name, legalText, machineTerms } = req.body
    if (!key || !name) {
      return res.status(400).json({ error: "key and name are required" })
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
    res.status(201).json({ success: true, license: result.rows[0] })
  } catch (error) {
    logger.error("Error creating license preset", error)
    next(error)
  }
}

export async function listLicensePresets(req, res, next) {
  try {
    const result = await query(`SELECT * FROM licenses ORDER BY created_at DESC`)
    res.json({ licenses: result.rows })
  } catch (error) {
    next(error)
  }
}

export async function attachLicenseToStory(req, res, next) {
  try {
    const { tokenId } = req.params
    const { licenseKey } = req.body
    if (!licenseKey) return res.status(400).json({ error: "licenseKey is required" })

    const lic = await query(`SELECT id FROM licenses WHERE key = $1`, [licenseKey])
    if (lic.rows.length === 0) return res.status(404).json({ error: "License not found" })

    const result = await query(
      `INSERT INTO story_licenses (token_id, license_id) VALUES ($1, $2) ON CONFLICT (token_id) DO UPDATE SET license_id = EXCLUDED.license_id, attached_at = NOW() RETURNING *`,
      [parseInt(tokenId), lic.rows[0].id]
    )
    res.json({ success: true, storyLicense: result.rows[0] })
  } catch (error) {
    next(error)
  }
}


