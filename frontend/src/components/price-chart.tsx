import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { fetchPriceHistory, type PriceHistory } from "@/services/marketplaceApi"
import { Loader2 } from "lucide-react"

interface PriceChartProps {
  tokenId: number
}

export default function PriceChart({ tokenId }: PriceChartProps) {
  const [history, setHistory] = useState<PriceHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchPriceHistory(tokenId)
        setHistory(response.history || [])
      } catch (error) {
        console.warn("Failed to load price history:", error)
        setHistory([]) // Fallback to empty array
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [tokenId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={24} />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No price history available</p>
      </div>
    )
  }

  // Format data for chart
  const chartData = history
    .map((item) => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      price: parseFloat(item.priceMatic.toString()),
      event: item.eventType,
    }))
    .reverse() // Show oldest to newest

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "12px" }}
            label={{ value: "MATIC", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`${value.toFixed(4)} MATIC`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

