import { query } from "../config/database.js"
import { buildRegistrationManifest } from "../services/manifest.js"
import { uploadMetadataToIPFS } from "../services/ipfs.js"
import logger from "../config/logger.js"

export async function addReleases(req, res, next) {
  try {
    const { tokenId } = req.params
    const { modelReleaseURI, locationReleaseURI, consentScope, captureRegion, captureDate, deidAttestation } = req.body
    const result = await query(
      `INSERT INTO releases (token_id, model_release_uri, location_release_uri, consent_scope, capture_region, capture_date, deid_attestation)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        parseInt(tokenId),
        modelReleaseURI || null,
        locationReleaseURI || null,
        consentScope || null,
        captureRegion || null,
        captureDate ? new Date(captureDate) : null,
        deidAttestation === true,
      ]
    )
    res.status(201).json({ success: true, release: result.rows[0] })
  } catch (error) {
    next(error)
  }
}

export async function getCompliance(req, res, next) {
  try {
    const { tokenId } = req.params
    const license = await query(
      `SELECT l.* FROM story_licenses sl JOIN licenses l ON sl.license_id = l.id WHERE sl.token_id = $1`,
      [parseInt(tokenId)]
    )
    const releases = await query(`SELECT * FROM releases WHERE token_id = $1 ORDER BY created_at DESC LIMIT 1`, [parseInt(tokenId)])
    const provenance = await query(`SELECT * FROM provenance WHERE token_id = $1`, [parseInt(tokenId)])
    res.json({
      license: license.rows[0] || null,
      releases: releases.rows[0] || null,
      provenance: provenance.rows[0] || null,
    })
  } catch (error) {
    next(error)
  }
}

export async function registerManifest(req, res, next) {
  try {
    const { tokenId } = req.params
    const story = await query(`SELECT token_id, ipfs_hash FROM stories WHERE token_id = $1`, [parseInt(tokenId)])
    if (story.rows.length === 0) return res.status(404).json({ error: "Story not found" })

    const licenseRes = await query(
      `SELECT l.* FROM story_licenses sl JOIN licenses l ON sl.license_id = l.id WHERE sl.token_id = $1`,
      [parseInt(tokenId)]
    )
    const releaseRes = await query(`SELECT * FROM releases WHERE token_id = $1 ORDER BY created_at DESC LIMIT 1`, [parseInt(tokenId)])
    const provRes = await query(`SELECT * FROM provenance WHERE token_id = $1`, [parseInt(tokenId)])

    const manifest = buildRegistrationManifest({
      tokenId: parseInt(tokenId),
      ipfsHash: story.rows[0].ipfs_hash,
      license: licenseRes.rows[0] || null,
      releases: releaseRes.rows[0] || null,
      provenance: provRes.rows[0] || null,
      qcReport: provRes.rows[0]?.qc_report_uri || null,
      versionMap: provRes.rows[0]?.version_map || null,
    })

    const cid = await uploadMetadataToIPFS(manifest)
    const manifestUri = `ipfs://${cid}`

    await query(`
      INSERT INTO provenance (token_id, manifest_uri)
      VALUES ($1, $2)
      ON CONFLICT (token_id) DO UPDATE SET manifest_uri = EXCLUDED.manifest_uri
    `, [parseInt(tokenId), manifestUri])

    res.status(201).json({ success: true, manifestUri, cid })
  } catch (error) {
    logger.error("Error registering manifest", error)
    next(error)
  }
}


