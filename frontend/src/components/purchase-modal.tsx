import { useState } from "react"
import { X, Loader2, ShoppingCart, AlertCircle } from "lucide-react"
import { useMarketplace } from "@/hooks/useMarketplace"
import { useWeb3 } from "@/hooks/useWeb3"
import { toast } from "sonner"
import type { Listing } from "@/services/marketplaceApi"

interface PurchaseModalProps {
  listing: Listing
  onClose: () => void
  onSuccess?: () => void
}

export default function PurchaseModal({ listing, onClose, onSuccess }: PurchaseModalProps) {
  const { purchaseListing, isLoading } = useMarketplace()
  const { isConnected, account } = useWeb3()
  const [error, setError] = useState("")

  const handlePurchase = async () => {
    setError("")

    if (!isConnected || !account) {
      setError("Please connect your wallet first")
      return
    }

    if (account.toLowerCase() === listing.seller.toLowerCase()) {
      setError("You cannot purchase your own listing")
      return
    }

    try {
      const result = await purchaseListing(listing.listingId, listing.priceMatic)
      if (result.success) {
        toast.success("Purchase successful!")
        onSuccess?.()
        onClose()
      } else {
        setError(result.error || "Failed to purchase NFT")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  const platformFee = listing.priceMatic * 0.025 // 2.5%
  const totalPrice = listing.priceMatic + platformFee

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Purchase NFT</h2>
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

        <div className="space-y-4">
          {/* Listing Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">{listing.story?.title || `Story #${listing.tokenId}`}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.story?.description || "No description available"}
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold">{listing.priceMatic.toFixed(4)} MATIC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform Fee (2.5%)</span>
              <span className="font-semibold">{platformFee.toFixed(4)} MATIC</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between font-bold">
              <span>Total</span>
              <span>{totalPrice.toFixed(4)} MATIC</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={isLoading || !isConnected || account?.toLowerCase() === listing.seller.toLowerCase()}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Purchase
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

