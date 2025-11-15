import { useEffect, useState } from "react"
import { Clock, Check, X, Loader2 } from "lucide-react"
import { fetchOffers, updateOfferStatus, type Offer } from "@/services/marketplaceApi"
import { useMarketplace } from "@/hooks/useMarketplace"
import { useWeb3 } from "@/hooks/useWeb3"
import { toast } from "sonner"

interface OfferListProps {
  tokenId: number
  ownerAddress: string
}

export default function OfferList({ tokenId, ownerAddress }: OfferListProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { account, isConnected } = useWeb3()
  const { acceptOffer } = useMarketplace()

  useEffect(() => {
    loadOffers()
  }, [tokenId])

  const loadOffers = async () => {
    setIsLoading(true)
    try {
      const response = await fetchOffers(tokenId)
      setOffers(response.offers.filter((o) => o.status === "pending") || [])
    } catch (error) {
      console.warn("Failed to load offers:", error)
      setOffers([]) // Fallback to empty array
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (offerIndex: number) => {
    try {
      const result = await acceptOffer(tokenId, offerIndex)
      if (result.success) {
        toast.success("Offer accepted!")
        loadOffers() // Reload offers
      } else {
        toast.error(result.error || "Failed to accept offer")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to accept offer")
    }
  }

  const handleReject = async (offerId: number) => {
    try {
      await updateOfferStatus(offerId, "rejected")
      toast.success("Offer rejected")
      loadOffers() // Reload offers
    } catch (error: any) {
      toast.error(error.message || "Failed to reject offer")
    }
  }

  const isOwner = isConnected && account?.toLowerCase() === ownerAddress.toLowerCase()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin" size={24} />
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No pending offers</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {offers.map((offer, index) => {
        const isExpired = offer.expiresAt ? new Date(offer.expiresAt) < new Date() : false

        return (
          <div
            key={offer.id}
            className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{offer.priceMatic.toFixed(4)} MATIC</span>
                  {isExpired && (
                    <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded">
                      Expired
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-mono">
                    {offer.offerer.slice(0, 6)}...{offer.offerer.slice(-4)}
                  </span>
                  {offer.expiresAt && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Expires {new Date(offer.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {isOwner && !isExpired && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(index)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(offer.offerId)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

