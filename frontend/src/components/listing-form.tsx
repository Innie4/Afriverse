import { useState } from "react"
import { X, Loader2, Tag, Clock } from "lucide-react"
import { useMarketplace } from "@/hooks/useMarketplace"
import { useWeb3 } from "@/hooks/useWeb3"
import { toast } from "sonner"

interface ListingFormProps {
  tokenId: number
  onClose: () => void
  onSuccess?: () => void
}

export default function ListingForm({ tokenId, onClose, onSuccess }: ListingFormProps) {
  const { createListing, createAuction, isLoading } = useMarketplace()
  const { isConnected, account } = useWeb3()
  const [listingType, setListingType] = useState<"fixed" | "auction">("fixed")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("7") // days
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isConnected || !account) {
      setError("Please connect your wallet first")
      return
    }

    if (!price || parseFloat(price) <= 0) {
      setError("Please enter a valid price")
      return
    }

    try {
      if (listingType === "fixed") {
        const result = await createListing(tokenId, parseFloat(price))
        if (result.success) {
          toast.success("Listing created successfully!")
          onSuccess?.()
          onClose()
        } else {
          setError(result.error || "Failed to create listing")
        }
      } else {
        const durationSeconds = parseInt(duration) * 24 * 60 * 60
        const result = await createAuction(tokenId, parseFloat(price), durationSeconds)
        if (result.success) {
          toast.success("Auction created successfully!")
          onSuccess?.()
          onClose()
        } else {
          setError(result.error || "Failed to create auction")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">List for Sale</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {!isConnected && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            Please connect your wallet to list this NFT
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Listing Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Listing Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setListingType("fixed")}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  listingType === "fixed"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted"
                }`}
              >
                <Tag size={16} className="mx-auto mb-1" />
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setListingType("auction")}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  listingType === "auction"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted"
                }`}
              >
                <Clock size={16} className="mx-auto mb-1" />
                Auction
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {listingType === "fixed" ? "Price" : "Starting Price"} (MATIC)
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Duration (for auctions) */}
          {listingType === "auction" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Duration (days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}

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
              type="submit"
              disabled={isLoading || !isConnected}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

