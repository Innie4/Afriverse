// Minimal anonymization stub; in production apply face/license-plate blurs, DICOM de-ID, etc.
export async function anonymizeIfRequired({ cid, vertical, consentScope }) {
  return { cid, vertical, anonymized: consentScope ? true : false, notes: consentScope ? "Applied basic anonymization" : "No anonymization required" }
}


