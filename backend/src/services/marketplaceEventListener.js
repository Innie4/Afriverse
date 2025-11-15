// Marketplace event listener - listens for marketplace events and creates notifications
import { ethers } from "ethers"
import { query } from "../config/database.js"
import logger from "../config/logger.js"
import { createNotification } from "./notificationService.js"

let marketplaceContract = null
let provider = null
let isListening = false

const MARKETPLACE_ABI = [
  "event NFTPurchased(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, address buyer, uint256 price, uint256 platformFee, uint256 royaltyFee)",
  "event OfferCreated(uint256 indexed offerId, uint256 indexed tokenId, address indexed offerer, uint256 price)",
  "event BundlePurchased(address indexed buyer, uint256[] tokenIds, uint256 totalPrice, uint256 discountAmount, uint256 platformFee)",
]

/**
 * Initialize marketplace event listener
 */
export function initMarketplaceEventListener() {
  const rpcUrl = process.env.RPC_URL
  const marketplaceAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS

  if (!rpcUrl || !marketplaceAddress) {
    logger.warn("Marketplace event listener not configured (missing RPC_URL or MARKETPLACE_CONTRACT_ADDRESS)")
    return
  }

  try {
    provider = new ethers.JsonRpcProvider(rpcUrl)
    marketplaceContract = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, provider)
    logger.info("Marketplace event listener initialized")
  } catch (error) {
    logger.error("Failed to initialize marketplace event listener", error)
  }
}

/**
 * Start listening for marketplace events
 */
export async function startMarketplaceEventListener() {
  if (!marketplaceContract || isListening) {
    return
  }

  try {
    isListening = true
    logger.info("Starting marketplace event listener...")

    // Listen for NFT purchases
    marketplaceContract.on("NFTPurchased", async (listingId, tokenId, seller, buyer, price, platformFee, royaltyFee, event) => {
      try {
        const priceMatic = Number(price) / 1e18
        await createNotification(
          seller,
          "sale",
          "Your NFT was sold!",
          `Your story #${tokenId} was purchased for ${priceMatic.toFixed(4)} MATIC`,
          { tokenId: Number(tokenId), buyer, price: priceMatic, listingId: Number(listingId) }
        )
        logger.info(`Sale notification created for seller: ${seller}`)
      } catch (error) {
        logger.error("Error handling NFTPurchased event", error)
      }
    })

    // Listen for offers
    marketplaceContract.on("OfferCreated", async (offerId, tokenId, offerer, price, event) => {
      try {
        // Get NFT owner from stories table
        const result = await query("SELECT author FROM stories WHERE token_id = $1", [Number(tokenId)])
        if (result.rows.length > 0) {
          const owner = result.rows[0].author
          const priceMatic = Number(price) / 1e18
          await createNotification(
            owner,
            "offer",
            "New offer received",
            `You received an offer of ${priceMatic.toFixed(4)} MATIC for story #${tokenId}`,
            { tokenId: Number(tokenId), offerer, price: priceMatic, offerId: Number(offerId) }
          )
          logger.info(`Offer notification created for owner: ${owner}`)
        }
      } catch (error) {
        logger.error("Error handling OfferCreated event", error)
      }
    })

    // Listen for bundle purchases
    marketplaceContract.on("BundlePurchased", async (buyer, tokenIds, totalPrice, discountAmount, platformFee, event) => {
      try {
        // Notify all sellers in the bundle
        for (const tokenId of tokenIds) {
          const result = await query(
            "SELECT seller_address FROM listings WHERE token_id = $1 AND status = 'active'",
            [Number(tokenId)]
          )
          if (result.rows.length > 0) {
            const seller = result.rows[0].seller_address
            const totalPriceMatic = Number(totalPrice) / 1e18
            await createNotification(
              seller,
              "bundle_sale",
              "Your NFT was sold in a bundle!",
              `Your story #${tokenId} was purchased as part of a bundle for ${totalPriceMatic.toFixed(4)} MATIC`,
              { tokenId: Number(tokenId), buyer, bundlePrice: totalPriceMatic }
            )
          }
        }
        logger.info(`Bundle purchase notifications created`)
      } catch (error) {
        logger.error("Error handling BundlePurchased event", error)
      }
    })

    logger.info("Marketplace event listener started")
  } catch (error) {
    logger.error("Error starting marketplace event listener", error)
    isListening = false
  }
}

/**
 * Stop listening for marketplace events
 */
export function stopMarketplaceEventListener() {
  if (marketplaceContract && isListening) {
    marketplaceContract.removeAllListeners()
    isListening = false
    logger.info("Marketplace event listener stopped")
  }
}

