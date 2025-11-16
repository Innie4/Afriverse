// Simple signed URL stub using a shared secret; replace with real gateway/cloud signer later
import crypto from "crypto"

const DEFAULT_EXPIRY_SECONDS = 60 * 10

export function generateSignedUrl(resourcePath, expiresInSeconds = DEFAULT_EXPIRY_SECONDS) {
  const secret = process.env.DOWNLOAD_SIGNING_SECRET || "dev-secret"
  const expiry = Math.floor(Date.now() / 1000) + expiresInSeconds
  const payload = `${resourcePath}:${expiry}`
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return { url: `${resourcePath}?e=${expiry}&sig=${signature}`, expiry }
}

export function verifySignedParams(resourcePath, e, sig) {
  const secret = process.env.DOWNLOAD_SIGNING_SECRET || "dev-secret"
  const payload = `${resourcePath}:${e}`
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  const now = Math.floor(Date.now() / 1000)
  return expected === sig && Number(e) > now
}


