import { useState } from "react"
import { X, Loader2, Tag } from "lucide-react"
import { useMarketplace } from "@/hooks/useMarketplace"
import { useWeb3 } from "@/hooks/useWeb3"
import { toast } from "sonner"

interface MakeOfferModalProps {
  tokenId: number
  onClose: () => void
  onSuccess?: () => void
}

export default function MakeOfferModal({ tokenId, onClose, onSuccess }: MakeOfferModalProps) {
  const { createOffer, isLoading } = useMarketplace()
  const { isConnected, account } = useWeb3()
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
      setError("Please enter a valid offer amount")
      return
    }

    try {
      const durationSeconds = parseInt(duration) * 24 * 60 * 60
      const result = await createOffer(tokenId, parseFloat(price), durationSeconds)
      if (result.success) {
        toast.success("Offer created successfully!")
        onSuccess?.()
        onClose()
      } else {
        setError(result.error || "Failed to create offer")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Make an Offer</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {!isConnected && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            Please connect your wallet to make an offer
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Offer Amount (MATIC)</label>
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
            <p className="text-xs text-muted-foreground mt-1">
              Your offer will be locked until accepted or expired
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Offer Expires In (days)</label>
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
                <>
                  <Tag size={16} />
                  Make Offer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

