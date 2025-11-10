import { useState, useEffect, useMemo } from "react"
import StoryCard from "@/components/story-card"
import { Search, Filter, X, Loader2 } from "lucide-react"
import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { fetchStories, type Story } from "@/services/api"
import { StoryCardSkeleton } from "@/components/skeleton"
import { toast } from "sonner"

const categories = ["All", "Folklore", "Contemporary", "Historical", "Educational", "Cultural", "Poetry", "Fiction"]

type SortOption = "newest" | "popular" | "trending"

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch stories from API
  useEffect(() => {
    const loadStories = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchStories({ limit: 100 })
        setStories(response.stories)
      } catch (err: any) {
        setError(err.message || "Failed to load stories")
        toast.error("Failed to load stories")
      } finally {
        setIsLoading(false)
      }
    }

    loadStories()
  }, [])

  const filteredAndSortedStories = useMemo(() => {
    let filtered = stories.filter((story) => {
      const matchesSearch =
        (story.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (story.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)

      // Map tribe to category for filtering (simplified)
      const storyCategory = story.tribe || "Contemporary"
      const matchesCategory = selectedCategory === "All" || storyCategory === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === "popular") {
      // For now, sort by creation date (can be enhanced with likes/views data)
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return filtered
  }, [stories, searchQuery, selectedCategory, sortBy])

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

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-primary/5 to-background relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground text-balance">Discover African Stories</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Explore a diverse collection of African narratives, from ancient folklore to contemporary tales.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stories, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-2"
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

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border hover:border-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Sort By</h4>
              <div className="flex gap-2">
                {(["popular", "trending", "newest"] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                      sortBy === option
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border hover:border-primary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
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
                <p className="text-muted-foreground">Loading stories...</p>
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <p className="text-muted-foreground">
                Found <span className="font-semibold text-foreground">{filteredAndSortedStories.length}</span> stories
              </p>
            )}
          </div>

          {/* Stories Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <StoryCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedStories.map((story) => (
                <StoryCard key={story.tokenId} story={transformStory(story)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No stories found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
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
