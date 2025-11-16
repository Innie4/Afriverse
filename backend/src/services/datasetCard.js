import { uploadMetadataToIPFS } from "./ipfs.js"

export async function buildAndStoreDatasetCard({ tokenId, ipfsHash, vertical, metadata }) {
  const base = typeof metadata === "object" && metadata ? metadata : {}
  const card = {
    cardVersion: "1.0.0",
    tokenId,
    ipfsHash,
    vertical: vertical || "generic",
    summary: base.summary || "",
    attributes: base.attributes || [],
    chapters: base.chapters?.length || 0,
    createdAt: new Date().toISOString(),
  }
  const cid = await uploadMetadataToIPFS(card)
  return `ipfs://${cid}`
}


