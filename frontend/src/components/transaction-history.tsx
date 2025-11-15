import { useState, useEffect } from "react"
import { ExternalLink, Loader2, ShoppingCart, ArrowRight } from "lucide-react"
import { fetchSales, type Sale } from "@/services/marketplaceApi"
import { useWeb3 } from "@/hooks/useWeb3"

interface TransactionHistoryProps {
  address?: string
  tokenId?: number
}

export default function TransactionHistory({ address, tokenId }: TransactionHistoryProps) {
  const { account } = useWeb3()
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [address, tokenId, account])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const params: any = {}
      if (address) params.seller = address
      if (tokenId) params.tokenId = tokenId
      if (!address && account) params.buyer = account

      const response = await fetchSales(params)
      setSales(response.sales || [])
    } catch (error) {
      console.warn("Failed to load transaction history:", error)
      setSales([]) // Fallback to empty array
    } finally {
      setIsLoading(false)
    }
  }

  const getBlockExplorerUrl = (txHash: string) => {
    const explorer = import.meta.env.VITE_BLOCK_EXPLORER_URL || "https://polygonscan.com/"
    return `${explorer}tx/${txHash}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin" size={24} />
      </div>
    )
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
        <p>No transaction history</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => (
        <div key={sale.id} className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <ShoppingCart size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold">Story #{sale.tokenId}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{sale.seller.slice(0, 6)}...{sale.seller.slice(-4)}</span>
                  <ArrowRight size={14} />
                  <span>{sale.buyer.slice(0, 6)}...{sale.buyer.slice(-4)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(sale.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{sale.priceMatic.toFixed(4)} MATIC</p>
              {sale.transactionHash && (
                <a
                  href={getBlockExplorerUrl(sale.transactionHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 justify-end mt-1"
                >
                  View <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

