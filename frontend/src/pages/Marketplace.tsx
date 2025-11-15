import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, X, Loader2, ShoppingCart, Clock, Tag } from "lucide-react"
import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { fetchListings, type Listing } from "@/services/marketplaceApi"
import { motion } from "framer-motion"

export default function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("active")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadListings()
  }, [selectedStatus, minPrice, maxPrice])

  const loadListings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchListings({
        status: selectedStatus,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        limit: 100,
      })
      setListings(response.listings)
    } catch (err: any) {
      setError(err.message || "Failed to load listings")
      // Fallback to empty listings
      setListings([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredListings = listings.filter((listing) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      listing.story?.title?.toLowerCase().includes(query) ||
      listing.story?.description?.toLowerCase().includes(query) ||
      listing.story?.tribe?.toLowerCase().includes(query) ||
      listing.story?.language?.toLowerCase().includes(query)
    )
  })

  const formatPrice = (matic: number) => {
    return `${matic.toFixed(4)} MATIC`
  }

  const getIPFSImageUrl = (ipfsHash?: string) => {
    if (!ipfsHash) return "/placeholder.svg"
    const gateway = import.meta.env.VITE_IPFS_GATEWAY || "https://ipfs.io/ipfs/"
    return ipfsHash.startsWith("ipfs://") ? ipfsHash.replace("ipfs://", gateway) : `${gateway}${ipfsHash}`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-primary/5 to-background relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground text-balance">NFT Marketplace</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Discover and purchase unique African stories as NFTs. Support creators and own cultural heritage.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stories, tribes, languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border/60 bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 ease-out"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 rounded-xl border-2 border-border/60 hover:bg-muted/80 transition-all duration-300 ease-out flex items-center gap-2 hover:shadow-md hover:scale-105 active:scale-95"
            >
              <Filter size={20} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      {showFilters && (
        <section className="px-4 sm:px-6 lg:px-8 py-6 bg-muted/30 border-b border-border relative">
          <TribalPatternOverlay />
          <div className="max-w-6xl mx-auto space-y-4 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-muted rounded">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="all">All</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Min Price (MATIC)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Max Price (MATIC)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="∞"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-12 relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Results Info */}
          <div className="mb-8">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                <p className="text-muted-foreground">Loading listings...</p>
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <p className="text-muted-foreground">
                Found <span className="font-semibold text-foreground">{filteredListings.length}</span> listings
              </p>
            )}
          </div>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse h-96 bg-muted" />
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={`/story/${listing.tokenId}`} className="group cursor-pointer block">
                    <div className="card-standard overflow-hidden">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden bg-muted">
                        <img
                          src={
                            listing.story?.metadata?.image
                              ? getIPFSImageUrl(listing.story.metadata.image.replace("ipfs://", ""))
                              : "/placeholder.svg"
                          }
                          alt={listing.story?.title || "Story"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold">
                            {formatPrice(listing.priceMatic)}
                          </span>
                        </div>
                        {listing.listingType === "auction" && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-sm font-semibold flex items-center gap-1">
                              <Clock size={14} />
                              Auction
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {listing.story?.title || `Story #${listing.tokenId}`}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {listing.story?.description || "No description available"}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Tag size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {listing.story?.tribe || "Unknown"} • {listing.story?.language || "Unknown"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Seller</span>
                            <span className="text-xs font-mono text-foreground">
                              {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingCart size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mb-4">No listings found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setMinPrice("")
                  setMaxPrice("")
                  setSelectedStatus("active")
                }}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

