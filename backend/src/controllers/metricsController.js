// Metrics controller - handles admin metrics operations (SOLID: Single Responsibility)
import { query } from "../config/database.js"
import { asyncHandler, sendSuccess } from "../utils/responseHandler.js"

export const getAdminMetrics = asyncHandler(async (req, res) => {
    const [supply, qcPass, devices, regions, demand, searches, quality, economics] = await Promise.all([
      query("SELECT COUNT(*)::int AS total FROM stories"),
      query("SELECT COUNT(*)::int AS with_prov FROM provenance"),
      query("SELECT COUNT(DISTINCT (metadata->>'device'))::int AS devices FROM stories"),
      query("SELECT COUNT(DISTINCT (releases.capture_region))::int AS regions FROM releases"),
      query("SELECT COUNT(*)::int AS purchases FROM purchases"),
      query("SELECT 0::int AS top_search_gaps"), // placeholder
      query("SELECT COUNT(*)::int AS defects FROM (SELECT 1 FROM processing_jobs WHERE status = 'failed') x"),
      query("SELECT COALESCE(SUM(price_matic),0) AS gm FROM sales"),
    ])

    sendSuccess(res, {
      supply: { stories: supply.rows[0].total, withProvenance: qcPass.rows[0].with_prov, devices: devices.rows[0].devices, regions: regions.rows[0].regions },
      demand: { purchases: demand.rows[0].purchases, topSearchGaps: searches.rows[0].top_search_gaps },
      quality: { defects: quality.rows[0].defects },
      economics: { grossMerchandiseMatic: economics.rows[0].gm },
    })
})


