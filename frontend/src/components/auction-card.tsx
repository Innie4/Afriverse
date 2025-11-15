import { useState, useEffect } from "react"
import { Clock, Gavel, Loader2 } from "lucide-react"
import { useMarketplace } from "@/hooks/useMarketplace"
import { useWeb3 } from "@/hooks/useWeb3"
import { toast } from "sonner"
import type { Listing } from "@/services/marketplaceApi"

interface AuctionCardProps {
  listing: Listing
  auctionId?: number
  currentBid?: number
  currentBidder?: string
  endTime?: string
}

export default function AuctionCard({ listing, auctionId, currentBid, currentBidder, endTime }: AuctionCardProps) {
  const { placeBid, isLoading } = useMarketplace()
  const { account, isConnected } = useWeb3()
  const [bidAmount, setBidAmount] = useState("")
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  useEffect(() => {
    if (!endTime) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeRemaining("Ended")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else {
        setTimeRemaining(`${minutes}m`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [endTime])

  const handlePlaceBid = async () => {
    if (!isConnected || !account) {
      toast.error("Please connect your wallet")
      return
    }

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount")
      return
    }

    if (auctionId === undefined) {
      toast.error("Auction ID not available")
      return
    }

    const minBid = currentBid ? currentBid * 1.05 : listing.priceMatic
    if (parseFloat(bidAmount) < minBid) {
      toast.error(`Minimum bid: ${minBid.toFixed(4)} MATIC`)
      return
    }

    try {
      const result = await placeBid(auctionId, parseFloat(bidAmount))
      if (result.success) {
        toast.success("Bid placed successfully!")
        setBidAmount("")
      } else {
        toast.error(result.error || "Failed to place bid")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to place bid")
    }
  }

  const minBid = currentBid ? currentBid * 1.05 : listing.priceMatic

  return (
    <div className="card-standard p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gavel size={20} className="text-primary" />
          <span className="font-semibold">Auction</span>
        </div>
        {timeRemaining && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} />
            <span>{timeRemaining}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
          <p className="text-2xl font-bold">
            {currentBid ? `${currentBid.toFixed(4)} MATIC` : `Starting: ${listing.priceMatic.toFixed(4)} MATIC`}
          </p>
          {currentBidder && (
            <p className="text-xs text-muted-foreground mt-1">
              Leading bidder: {currentBidder.slice(0, 6)}...{currentBidder.slice(-4)}
            </p>
          )}
        </div>

        {isConnected && account?.toLowerCase() !== listing.seller.toLowerCase() && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-semibold mb-2">Your Bid (MATIC)</label>
              <input
                type="number"
                step="0.0001"
                min={minBid}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={minBid.toFixed(4)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum bid: {minBid.toFixed(4)} MATIC (5% increment)
              </p>
            </div>
            <button
              onClick={handlePlaceBid}
              disabled={isLoading || !bidAmount || parseFloat(bidAmount) < minBid}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Gavel size={16} />
                  Place Bid
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

