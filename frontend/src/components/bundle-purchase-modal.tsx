import { useState, useEffect } from "react"
import { X, Loader2, Package, Tag, AlertCircle } from "lucide-react"
import { useMarketplace } from "@/hooks/useMarketplace"
import { useWeb3 } from "@/hooks/useWeb3"
import { toast } from "sonner"
import { fetchListings, type Listing, recordBundle } from "@/services/marketplaceApi"
import { ethers } from "ethers"

interface BundlePurchaseModalProps {
  selectedListingIds: number[]
  onClose: () => void
  onSuccess?: () => void
}

export default function BundlePurchaseModal({ selectedListingIds, onClose, onSuccess }: BundlePurchaseModalProps) {
  const { purchaseBundle, isLoading } = useMarketplace()
  const { isConnected, account } = useWeb3()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [discountBps, setDiscountBps] = useState(1000) // 10% default
  const [error, setError] = useState("")

  useEffect(() => {
    loadListings()
  }, [selectedListingIds])

  const loadListings = async () => {
    setIsLoadingListings(true)
    try {
      const allListings: Listing[] = []
      // Fetch all active listings and filter by selected IDs
      const response = await fetchListings({ status: "active", limit: 1000 })
      for (const listingId of selectedListingIds) {
        const listing = response.listings.find((l) => l.listingId === listingId)
        if (listing) allListings.push(listing)
      }
      setListings(allListings)
    } catch (err) {
      setError("Failed to load listings")
      console.error("Error loading listings:", err)
    } finally {
      setIsLoadingListings(false)
    }
  }

  const totalPrice = listings.reduce((sum, listing) => sum + listing.priceMatic, 0)
  const discountAmount = (totalPrice * discountBps) / 10000
  const bundlePrice = totalPrice - discountAmount
  const platformFee = bundlePrice * 0.025
  const finalPrice = bundlePrice + platformFee

  const handlePurchase = async () => {
    setError("")

    if (!isConnected || !account) {
      setError("Please connect your wallet first")
      return
    }

    if (listings.length < 2) {
      setError("Bundle must contain at least 2 NFTs")
      return
    }

    try {
      const bundlePriceWei = ethers.parseEther(bundlePrice.toString())
      const result = await purchaseBundle(selectedListingIds, discountBps, bundlePriceWei)

      if (result.success && result.txHash) {
        // Record bundle in backend
        try {
          await recordBundle({
            bundleId: result.txHash,
            buyerAddress: account,
            listingIds: selectedListingIds,
            tokenIds: listings.map((l) => l.tokenId),
            totalPriceWei: bundlePriceWei.toString(),
            totalPriceMatic: bundlePrice,
            discountBps,
            discountAmountMatic: discountAmount,
            platformFeeWei: ethers.parseEther(platformFee.toString()).toString(),
            transactionHash: result.txHash,
          })
        } catch (apiError) {
          console.warn("Failed to record bundle in backend:", apiError)
        }

        toast.success("Bundle purchased successfully!")
        onSuccess?.()
        onClose()
      } else {
        setError(result.error || "Failed to purchase bundle")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl p-4 sm:p-6 max-w-2xl w-full mx-auto shadow-xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package size={24} />
            Purchase Bundle
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {!isConnected && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            Please connect your wallet to purchase
          </div>
        )}

        {isLoadingListings ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bundle Items */}
            <div>
              <h3 className="font-semibold mb-3">Bundle Items ({listings.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {listings.map((listing) => (
                  <div key={listing.id} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">{listing.story?.title || `Story #${listing.tokenId}`}</p>
                      <p className="text-sm text-muted-foreground">{listing.priceMatic.toFixed(4)} MATIC</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold mb-2">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={(discountBps / 100).toFixed(0)}
                onChange={(e) => setDiscountBps(Math.min(5000, Math.max(0, parseInt(e.target.value) * 100)))}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">Maximum 50% discount</p>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{totalPrice.toFixed(4)} MATIC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount ({discountBps / 100}%)</span>
                <span className="text-primary">-{discountAmount.toFixed(4)} MATIC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                <span className="font-semibold">{platformFee.toFixed(4)} MATIC</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{finalPrice.toFixed(4)} MATIC</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={isLoading || !isConnected || listings.length < 2}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Tag size={16} />
                    Purchase Bundle
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

