import { useState, useCallback } from "react"
import { Contract, ethers } from "ethers"
import { useWeb3 } from "./useWeb3"
import {
  createListing as createListingApi,
  recordSale as recordSaleApi,
  updateListingStatus as updateListingStatusApi,
} from "@/services/marketplaceApi"
import { toast } from "sonner"

// Marketplace contract ABI (placeholder - replace with actual ABI after compilation)
const MARKETPLACE_ABI = [
  "function createListing(uint256 tokenId, uint256 price) external",
  "function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) external",
  "function purchaseListing(uint256 listingId) external payable",
  "function placeBid(uint256 auctionId) external payable",
  "function endAuction(uint256 auctionId) external",
  "function cancelListing(uint256 listingId) external",
  "function createOffer(uint256 tokenId, uint256 duration) external payable",
  "function acceptOffer(uint256 tokenId, uint256 offerIndex) external",
  "function rejectOffer(uint256 tokenId, uint256 offerIndex) external",
  "function purchaseBundle(uint256[] calldata listingIds, uint256 discountBps) external payable",
  "function getListingByToken(uint256 tokenId) external view returns (tuple(uint256 listingId, uint256 tokenId, address seller, uint256 price, uint8 listingType, uint8 status, uint256 startTime, uint256 endTime, uint256 createdAt))",
  "function getAuctionByToken(uint256 tokenId) external view returns (tuple(uint256 auctionId, uint256 tokenId, address seller, uint256 startingPrice, uint256 currentBid, address currentBidder, uint256 endTime, bool ended))",
  "function getTokenOffers(uint256 tokenId) external view returns (tuple(uint256 offerId, uint256 tokenId, address offerer, uint256 price, uint8 status, uint256 expiresAt, uint256 createdAt)[])",
  "event ListingCreated(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 price, uint8 listingType)",
  "event NFTPurchased(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, address buyer, uint256 price, uint256 platformFee, uint256 royaltyFee)",
  "event OfferCreated(uint256 indexed offerId, uint256 indexed tokenId, address indexed offerer, uint256 price)",
  "event OfferAccepted(uint256 indexed offerId, uint256 indexed tokenId, address indexed seller, address buyer, uint256 price)",
  "event BundlePurchased(address indexed buyer, uint256[] tokenIds, uint256 totalPrice, uint256 discountAmount, uint256 platformFee)",
]

const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS || ""

export function useMarketplace() {
  const { account, provider, signer, isConnected } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get marketplace contract instance
  const getMarketplaceContract = useCallback((): Contract | null => {
    if (!signer || !MARKETPLACE_ADDRESS) {
      return null
    }
    try {
      return new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer)
    } catch (err) {
      console.error("Failed to create marketplace contract:", err)
      return null
    }
  }, [signer])

  /**
   * Create a fixed price listing
   */
  const createListing = useCallback(
    async (tokenId: number, priceMatic: number): Promise<{ success: boolean; listingId?: number; txHash?: string; error?: string }> => {
      if (!isConnected || !account) {
        return { success: false, error: "Wallet not connected" }
      }

      if (!MARKETPLACE_ADDRESS) {
        return { success: false, error: "Marketplace contract not configured" }
      }

      setIsLoading(true)
      setError(null)

      try {
        const contract = getMarketplaceContract()
        if (!contract) {
          throw new Error("Failed to connect to marketplace contract")
        }

        // Convert MATIC to wei
        const priceWei = ethers.parseEther(priceMatic.toString())

        // Call smart contract
        const tx = await contract.createListing(tokenId, priceWei)
        const receipt = await tx.wait()

        // Find ListingCreated event
        const event = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed?.name === "ListingCreated"
          } catch {
            return false
          }
        })

        let listingId: number | undefined
        if (event && contract) {
          try {
            const decoded = contract.interface.parseLog(event)
            listingId = Number(decoded?.args.listingId)
          } catch (err) {
            console.error("Error parsing event:", err)
          }
        }

        // Record listing in backend (fallback if event parsing fails)
        if (!listingId) {
          listingId = Date.now() // Placeholder ID
        }

        try {
          await createListingApi({
            listingId,
            tokenId,
            sellerAddress: account,
            priceWei: priceWei.toString(),
            priceMatic,
            listingType: "fixed",
          })
        } catch (apiError) {
          console.warn("Failed to record listing in backend:", apiError)
          // Continue even if backend fails
        }

        toast.success("Listing created successfully!")
        return {
          success: true,
          listingId,
          txHash: receipt.hash,
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to create listing"
        setError(errorMessage)
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, getMarketplaceContract]
  )

  /**
   * Create an auction listing
   */
  const createAuction = useCallback(
    async (
      tokenId: number,
      startingPriceMatic: number,
      durationSeconds: number
    ): Promise<{ success: boolean; auctionId?: number; txHash?: string; error?: string }> => {
      if (!isConnected || !account) {
        return { success: false, error: "Wallet not connected" }
      }

      if (!MARKETPLACE_ADDRESS) {
        return { success: false, error: "Marketplace contract not configured" }
      }

      setIsLoading(true)
      setError(null)

      try {
        const contract = getMarketplaceContract()
        if (!contract) {
          throw new Error("Failed to connect to marketplace contract")
        }

        const startingPriceWei = ethers.parseEther(startingPriceMatic.toString())

        const tx = await contract.createAuction(tokenId, startingPriceWei, durationSeconds)
        const receipt = await tx.wait()

        // Find AuctionCreated event
        const event = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed?.name === "AuctionCreated"
          } catch {
            return false
          }
        })

        let auctionId: number | undefined
        if (event && contract) {
          try {
            const decoded = contract.interface.parseLog(event)
            auctionId = Number(decoded?.args.auctionId)
          } catch (err) {
            console.error("Error parsing event:", err)
          }
        }

        toast.success("Auction created successfully!")
        return {
          success: true,
          auctionId,
          txHash: receipt.hash,
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to create auction"
        setError(errorMessage)
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, getMarketplaceContract]
  )

  /**
   * Purchase a fixed price listing
   */
  const purchaseListing = useCallback(
    async (listingId: number, priceMatic: number): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !account) {
        return { success: false, error: "Wallet not connected" }
      }

      if (!MARKETPLACE_ADDRESS) {
        return { success: false, error: "Marketplace contract not configured" }
      }

      setIsLoading(true)
      setError(null)

      try {
        const contract = getMarketplaceContract()
        if (!contract) {
          throw new Error("Failed to connect to marketplace contract")
        }

        const priceWei = ethers.parseEther(priceMatic.toString())

        const tx = await contract.purchaseListing(listingId, { value: priceWei })
        const receipt = await tx.wait()

        // Find NFTPurchased event
        const event = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed?.name === "NFTPurchased"
          } catch {
            return false
          }
        })

        // Extract sale data from event
        let saleData: any = {}
        if (event && contract) {
          try {
            const decoded = contract.interface.parseLog(event)
            saleData = {
              tokenId: Number(decoded?.args.tokenId),
              listingId: Number(decoded?.args.listingId),
              seller: decoded?.args.seller,
              buyer: decoded?.args.buyer,
              price: decoded?.args.price.toString(),
              platformFee: decoded?.args.platformFee?.toString(),
              royaltyFee: decoded?.args.royaltyFee?.toString(),
            }
          } catch (err) {
            console.error("Error parsing event:", err)
          }
        }

        // Record sale in backend
        try {
          await recordSaleApi({
            tokenId: saleData.tokenId || 0,
            listingId: saleData.listingId || listingId,
            sellerAddress: saleData.seller || account,
            buyerAddress: account,
            priceWei: saleData.price || priceWei.toString(),
            priceMatic,
            platformFeeWei: saleData.platformFee,
            royaltyWei: saleData.royaltyFee,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
          })
        } catch (apiError) {
          console.warn("Failed to record sale in backend:", apiError)
        }

        toast.success("Purchase successful!")
        return {
          success: true,
          txHash: receipt.hash,
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to purchase NFT"
        setError(errorMessage)
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, getMarketplaceContract]
  )

  /**
   * Place a bid on an auction
   */
  const placeBid = useCallback(
    async (auctionId: number, bidAmountMatic: number): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !account) {
        return { success: false, error: "Wallet not connected" }
      }

      setIsLoading(true)
      setError(null)

      try {
        const contract = getMarketplaceContract()
        if (!contract) {
          throw new Error("Failed to connect to marketplace contract")
        }

        const bidAmountWei = ethers.parseEther(bidAmountMatic.toString())

        const tx = await contract.placeBid(auctionId, { value: bidAmountWei })
        const receipt = await tx.wait()

        toast.success("Bid placed successfully!")
        return {
          success: true,
          txHash: receipt.hash,
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to place bid"
        setError(errorMessage)
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, getMarketplaceContract]
  )

  /**
   * Cancel a listing
   */
  const cancelListing = useCallback(
    async (listingId: number): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !account) {
        return { success: false, error: "Wallet not connected" }
      }

      setIsLoading(true)
      setError(null)

      try {
        const contract = getMarketplaceContract()
        if (!contract) {
          throw new Error("Failed to connect to marketplace contract")
        }

        const tx = await contract.cancelListing(listingId)
        const receipt = await tx.wait()

        // Update listing status in backend
        try {
          await updateListingStatusApi(listingId, "cancelled")
        } catch (apiError) {
          console.warn("Failed to update listing status in backend:", apiError)
        }

        toast.success("Listing cancelled successfully!")
        return {
          success: true,
          txHash: receipt.hash,
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to cancel listing"
        setError(errorMessage)
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, getMarketplaceContract]
  )

  /**
   * Create an offer for an unlisted NFT
   */
  const createOffer = useCallback(
    async (tokenId: number, priceMatic: number, durationSeconds: number = 7 * 24 * 60 * 60): Promise<{ success: boolean; offerId?: number; txHash?: string; error?: string }> => {
      if (!isConnected || !account) {
        return { success: false, error: "Wallet not connected" }
      }

      setIsLoading(true)
      setError(null)

      try {
        const contract = getMarketplaceContract()
        if (!contract) {
          throw new Error("Failed to connect to marketplace contract")
        }

        const priceWei = ethers.parseEther(priceMatic.toString())

        const tx = await contract.createOffer(tokenId, durationSeconds, { value: priceWei })
        const receipt = await tx.wait()

        // Find OfferCreated event
        const event = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed?.name === "OfferCreated"
          } catch {
            return false
          }
        })

        let offerId: number | undefined
        if (event && contract) {
          try {
            const decoded = contract.interface.parseLog(event)
            offerId = Number(decoded?.args.offerId)
          } catch (err) {
            console.error("Error parsing event:", err)
          }
        }

        toast.success("Offer created successfully!")
        return {
          success: true,
          offerId,
          txHash: receipt.hash,
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to create offer"
        setError(errorMessage)
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, getMarketplaceContract]
  )

  /**
   * Accept an offer
   */
  const acceptOffer = useCallback(
    async (tokenId: number, offerIndex: number): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !account) {
        return { success: false, error: "Wallet not connected" }
      }

      setIsLoading(true)
      setError(null)

      try {
        const contract = getMarketplaceContract()
        if (!contract) {
          throw new Error("Failed to connect to marketplace contract")
        }

        const tx = await contract.acceptOffer(tokenId, offerIndex)
        const receipt = await tx.wait()

        toast.success("Offer accepted!")
        return {
          success: true,
          txHash: receipt.hash,
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to accept offer"
        setError(errorMessage)
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, getMarketplaceContract]
  )

  /**
   * Get listing by token ID (view function)
   */
  const getListingByToken = useCallback(
    async (tokenId: number): Promise<any> => {
      if (!MARKETPLACE_ADDRESS || !provider) {
        return null
      }

      try {
        const contract = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
        const listing = await contract.getListingByToken(tokenId)
        return listing
      } catch (err) {
        console.error("Failed to get listing:", err)
        return null
      }
    },
    [provider]
  )

  /**
   * Purchase a bundle of NFTs
   */
  const purchaseBundle = useCallback(
    async (
      listingIds: number[],
      discountBps: number = 1000,
      totalPriceWei?: bigint
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !account) {
        return { success: false, error: "Wallet not connected" }
      }

      if (!MARKETPLACE_ADDRESS) {
        return { success: false, error: "Marketplace contract not configured" }
      }

      setIsLoading(true)
      setError(null)

      try {
        const contract = getMarketplaceContract()
        if (!contract) {
          throw new Error("Failed to connect to marketplace contract")
        }

        // If total price not provided, estimate (contract will validate)
        const value = totalPriceWei || ethers.parseEther("0")

        const tx = await contract.purchaseBundle(listingIds, discountBps, { value })
        const receipt = await tx.wait()

        // Find BundlePurchased event (for future use)
        receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed?.name === "BundlePurchased"
          } catch {
            return false
          }
        })

        toast.success("Bundle purchased successfully!")
        return {
          success: true,
          txHash: receipt.hash,
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to purchase bundle"
        setError(errorMessage)
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, account, getMarketplaceContract]
  )

  return {
    isLoading,
    error,
    createListing,
    createAuction,
    purchaseListing,
    placeBid,
    cancelListing,
    createOffer,
    acceptOffer,
    getListingByToken,
    purchaseBundle,
  }
}

