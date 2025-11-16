import { useState, useEffect, useMemo } from "react"
import { Link, useSearchParams, useLocation } from "react-router-dom"
import StoryCard from "@/components/story-card"
import { Search, Filter, X, Loader2, ShoppingCart, Clock, Tag, Package, Check, Grid3x3, Store } from "lucide-react"
import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { fetchStories, type Story } from "@/services/api"
import { fetchListings, type Listing } from "@/services/marketplaceApi"
import { StoryCardSkeleton } from "@/components/skeleton"
import { motion } from "framer-motion"
import BundlePurchaseModal from "@/components/bundle-purchase-modal"
import { useWeb3 } from "@/hooks/useWeb3"

const categories = ["All", "Folklore", "Contemporary", "Historical", "Educational", "Cultural", "Poetry", "Fiction"]

type SortOption = "newest" | "popular" | "trending"
type ViewMode = "all" | "gallery" | "marketplace"

export default function GalleryMarketplace() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const urlSearch = searchParams.get("search") || ""
  
  // Determine initial view mode based on route
  const getInitialViewMode = (pathname: string): ViewMode => {
    if (pathname === "/gallery") return "gallery"
    if (pathname === "/marketplace") return "marketplace"
    return "all"
  }
  
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>(() => getInitialViewMode(location.pathname))
  
  // Update view mode when route changes
  useEffect(() => {
    setViewMode(getInitialViewMode(location.pathname))
  }, [location.pathname])
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [selectedStatus, setSelectedStatus] = useState("active")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [vertical, setVertical] = useState("")
  const [licenseKey, setLicenseKey] = useState("")
  const [consentScope, setConsentScope] = useState("")
  const [hasReleases, setHasReleases] = useState<string>("")
  const [hasProvenance, setHasProvenance] = useState<string>("")
  
  // Data states
  const [stories, setStories] = useState<Story[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(true)
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Bundle purchase state
  const [selectedListings, setSelectedListings] = useState<Set<number>>(new Set())
  const [showBundleModal, setShowBundleModal] = useState(false)
  const { isConnected } = useWeb3()

  // Sync URL search param with state
  useEffect(() => {
    if (urlSearch && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch)
    }
  }, [urlSearch])

  // Fetch stories from API
  useEffect(() => {
    const loadStories = async () => {
      setIsLoadingStories(true)
      try {
        const response = await fetchStories({ limit: 1000 })
        setStories(response.stories)
      } catch (err: any) {
        console.error("Failed to load stories:", err)
        setError(null)
      } finally {
        setIsLoadingStories(false)
      }
    }

    if (viewMode === "all" || viewMode === "gallery") {
      loadStories()
    }
  }, [viewMode])

  // Fetch listings from API
  useEffect(() => {
    const loadListings = async () => {
      setIsLoadingListings(true)
      try {
        const response = await fetchListings({
          status: selectedStatus,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          vertical: vertical || undefined,
          licenseKey: licenseKey || undefined,
          consentScope: consentScope || undefined,
          hasReleases: hasReleases === "" ? undefined : hasReleases === "true",
          hasProvenance: hasProvenance === "" ? undefined : hasProvenance === "true",
          limit: 1000,
        })
        setListings(response.listings)
      } catch (err: any) {
        console.error("Failed to load listings:", err)
        setListings([])
      } finally {
        setIsLoadingListings(false)
      }
    }

    if (viewMode === "all" || viewMode === "marketplace") {
      loadListings()
    }
  }, [viewMode, selectedStatus, minPrice, maxPrice, vertical, licenseKey, consentScope, hasReleases, hasProvenance])

  // Filter and sort stories (Gallery view)
  const filteredAndSortedStories = useMemo(() => {
    let filtered = stories.filter((story) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        (story.title?.toLowerCase().includes(searchLower) || false) ||
        story.author.toLowerCase().includes(searchLower) ||
        (story.description?.toLowerCase().includes(searchLower) || false) ||
        (story.metadata?.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)) || false) ||
        (story.metadata?.attributes?.some((attr: any) => 
          typeof attr?.value === "string" && attr.value.toLowerCase().includes(searchLower)
        ) || false)

      const storyCategory = story.tribe || "Contemporary"
      const matchesCategory = selectedCategory === "All" || storyCategory === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return filtered
  }, [stories, searchQuery, selectedCategory, sortBy])

  // Filter listings (Marketplace view)
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        listing.story?.title?.toLowerCase().includes(query) ||
        listing.story?.description?.toLowerCase().includes(query) ||
        listing.story?.tribe?.toLowerCase().includes(query) ||
        listing.story?.language?.toLowerCase().includes(query)
      )
    })
  }, [listings, searchQuery])

  // Transform API story to StoryCard format
  const transformStory = (story: Story) => {
    const metadata = story.metadata || {}
    const gateway = import.meta.env.VITE_IPFS_GATEWAY || "https://ipfs.io/ipfs/"
    const rawImage = metadata.image || story.ipfsUrl
    const coverImage =
      typeof rawImage === "string" && rawImage.startsWith("ipfs://") ? rawImage.replace("ipfs://", gateway) : rawImage || "/placeholder.svg"
    const chapters = Array.isArray(metadata.chapters) ? metadata.chapters : []
    const firstChapter = chapters[0]
    const expressionAttr =
      metadata.expressionType ||
      metadata.attributes?.find((attr: any) => attr?.trait_type === "Expression Type")?.value ||
      metadata.category
    const summary = metadata.summary || firstChapter?.contentText || story.description || "A story from Afriverse"

    return {
      id: story.tokenId,
      title: story.title || metadata.name || "Untitled Story",
      author: story.author ? `${story.author.slice(0, 6)}...${story.author.slice(-4)}` : "Anonymous",
      category: expressionAttr || story.tribe || "Contemporary",
      image: coverImage,
      description: summary,
      views: 0,
      likes: 0,
    }
  }

  const toggleListingSelection = (listingId: number) => {
    setSelectedListings((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(listingId)) {
        newSet.delete(listingId)
      } else {
        newSet.add(listingId)
      }
      return newSet
    })
  }

  const handleBundlePurchase = () => {
    if (selectedListings.size >= 2) {
      setShowBundleModal(true)
    }
  }

  const formatPrice = (matic: number) => {
    return `${matic.toFixed(4)} MATIC`
  }

  const getIPFSImageUrl = (ipfsHash?: string) => {
    if (!ipfsHash) return "/placeholder.svg"
    const gateway = import.meta.env.VITE_IPFS_GATEWAY || "https://ipfs.io/ipfs/"
    return ipfsHash.startsWith("ipfs://") ? ipfsHash.replace("ipfs://", gateway) : `${gateway}${ipfsHash}`
  }

  const isLoading = isLoadingStories || isLoadingListings
  const showStories = viewMode === "all" || viewMode === "gallery"
  const showListings = viewMode === "all" || viewMode === "marketplace"
  const totalItems = (showStories ? filteredAndSortedStories.length : 0) + (showListings ? filteredListings.length : 0)
  
  // Type-safe view mode checks
  const shouldShowGalleryFilters = showStories
  const shouldShowMarketplaceFilters = showListings

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-primary/5 to-background relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground text-balance">
            {viewMode === "gallery" ? "Discover African Stories" : viewMode === "marketplace" ? "NFT Marketplace" : "Gallery & Marketplace"}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            {viewMode === "gallery"
              ? "Explore a diverse collection of African narratives, from ancient folklore to contemporary tales."
              : viewMode === "marketplace"
              ? "Discover and purchase unique African stories as NFTs. Support creators and own cultural heritage."
              : "Browse all stories and discover NFTs available for purchase. Explore, collect, and support African storytellers."}
          </p>

          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ease-out flex items-center gap-2 ${
                viewMode === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background/80 border-2 border-border/60 hover:border-primary/50"
              }`}
            >
              <Grid3x3 size={18} />
              All
            </button>
            <button
              onClick={() => setViewMode("gallery")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ease-out flex items-center gap-2 ${
                viewMode === "gallery"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background/80 border-2 border-border/60 hover:border-primary/50"
              }`}
            >
              <Grid3x3 size={18} />
              Gallery
            </button>
            <button
              onClick={() => setViewMode("marketplace")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ease-out flex items-center gap-2 ${
                viewMode === "marketplace"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background/80 border-2 border-border/60 hover:border-primary/50"
              }`}
            >
              <Store size={18} />
              Marketplace
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder={viewMode === "marketplace" ? "Search stories, tribes, languages..." : "Search stories, authors..."}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gallery Filters */}
              {shouldShowGalleryFilters && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ease-out ${
                            selectedCategory === cat
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-background/80 border border-border/60 hover:border-primary/50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Sort By</h4>
                    <div className="flex gap-2">
                      {(["popular", "trending", "newest"] as SortOption[]).map((option) => (
                        <button
                          key={option}
                          onClick={() => setSortBy(option)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ease-out capitalize ${
                            sortBy === option
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-background/80 border border-border/60 hover:border-primary/50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Marketplace Filters */}
              {shouldShowMarketplaceFilters && (
                <>
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

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Min Price</label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Max Price</label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="∞"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Vertical</label>
                    <select
                      value={vertical}
                      onChange={(e) => setVertical(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Any</option>
                      <option value="stereo_video">Robotics: Stereo Video</option>
                      <option value="xr_mocap">XR: Motion Capture</option>
                      <option value="medical_imaging">Medical Imaging (non‑PHI)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">License Key</label>
                      <input
                        type="text"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        placeholder="e.g., COMMERCIAL_NEXCLUSIVE"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Consent Scope</label>
                      <input
                        type="text"
                        value={consentScope}
                        onChange={(e) => setConsentScope(e.target.value)}
                        placeholder="e.g., model_release, non_sensitive"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Releases</label>
                      <select
                        value={hasReleases}
                        onChange={(e) => setHasReleases(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Any</option>
                        <option value="true">Has releases</option>
                        <option value="false">No releases</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Provenance</label>
                    <select
                      value={hasProvenance}
                      onChange={(e) => setHasProvenance(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Any</option>
                      <option value="true">Has provenance</option>
                      <option value="false">No provenance</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-12 relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Results Info & Bundle Actions */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : (
                <p className="text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{totalItems}</span>{" "}
                  {viewMode === "all" ? "items" : viewMode === "gallery" ? "stories" : "listings"}
                  {viewMode === "all" && (
                    <>
                      {" "}
                      ({filteredAndSortedStories.length} stories, {filteredListings.length} listings)
                    </>
                  )}
                </p>
              )}
            </div>
            {isConnected && showListings && selectedListings.size >= 2 && (
              <button
                onClick={handleBundlePurchase}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <Package size={18} />
                Purchase Bundle ({selectedListings.size})
              </button>
            )}
          </div>

          {/* Content Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <StoryCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {/* Gallery Stories */}
              {showStories && filteredAndSortedStories.length > 0 && (
                <div className={viewMode === "all" ? "mb-12" : ""}>
                  {viewMode === "all" && (
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Grid3x3 size={24} />
                      Stories ({filteredAndSortedStories.length})
                    </h2>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedStories.map((story) => (
                      <StoryCard key={story.tokenId} story={transformStory(story)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Marketplace Listings */}
              {showListings && filteredListings.length > 0 && (
                <div>
                  {viewMode === "all" && (
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Store size={24} />
                      Marketplace Listings ({filteredListings.length})
                    </h2>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredListings.map((listing) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative">
                          {isConnected && listing.listingType === "fixed" && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleListingSelection(listing.listingId)
                              }}
                              className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedListings.has(listing.listingId)
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-background/80 border-border hover:border-primary"
                              }`}
                            >
                              {selectedListings.has(listing.listingId) && <Check size={16} />}
                            </button>
                          )}
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
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {totalItems === 0 && (
                <div className="text-center py-16">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg mb-4">
                    No {viewMode === "all" ? "items" : viewMode === "gallery" ? "stories" : "listings"} found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All")
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
            </>
          )}
        </div>
      </section>

      <Footer />

      {/* Bundle Purchase Modal */}
      {showBundleModal && (
        <BundlePurchaseModal
          selectedListingIds={Array.from(selectedListings)}
          onClose={() => {
            setShowBundleModal(false)
            setSelectedListings(new Set())
          }}
          onSuccess={() => {
            setShowBundleModal(false)
            setSelectedListings(new Set())
            // Reload listings
            const loadListings = async () => {
              try {
                const response = await fetchListings({
                  status: selectedStatus,
                  minPrice: minPrice ? parseFloat(minPrice) : undefined,
                  maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                  limit: 1000,
                })
                setListings(response.listings)
              } catch (err) {
                console.error("Failed to reload listings:", err)
              }
            }
            loadListings()
          }}
        />
      )}
    </div>
  )
}

