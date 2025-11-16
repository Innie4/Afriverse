// Assemble a registration manifest that ties license, releases, provenance, and QC
export function buildRegistrationManifest({ tokenId, ipfsHash, license, releases, provenance, qcReport, versionMap }) {
  return {
    schemaVersion: "1.0.0",
    tokenId,
    ipfsHash,
    license: license
      ? { key: license.key, name: license.name, legalTextURI: license.legal_text_uri, machineTerms: license.machine_terms }
      : null,
    releases: releases
      ? {
          modelReleaseURI: releases.model_release_uri,
          locationReleaseURI: releases.location_release_uri,
          consentScope: releases.consent_scope,
          captureRegion: releases.capture_region,
          captureDate: releases.capture_date,
          deidentificationAttestation: releases.deid_attestation,
        }
      : null,
    provenance: provenance
      ? {
          deviceFingerprint: provenance.device_fingerprint,
          captureGPS: provenance.capture_gps,
          captureTime: provenance.capture_time,
          contentHash: provenance.content_hash,
        }
      : null,
    qc: qcReport ? { reportURI: qcReport } : null,
    versions: versionMap || null,
    createdAt: new Date().toISOString(),
  }
}


