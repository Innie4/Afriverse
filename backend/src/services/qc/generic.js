// Minimal QC stub that returns a simple score; replace with vertical-specific checks later
export async function runGenericQC({ cid, vertical }) {
  return {
    cid,
    vertical: vertical || "generic",
    score: 0.8,
    checks: [
      { name: "integrity", passed: true },
      { name: "readability", passed: true },
    ],
    createdAt: new Date().toISOString(),
  }
}


