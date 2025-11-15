import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useWeb3 } from "@/hooks/useWeb3"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuroraBackground from "@/components/aurora-background"
import { User, Mail, Edit, BookOpen, Package, Tag, ShoppingBag, Loader2 } from "lucide-react"
import { fetchUserNFTs, fetchSales, type Listing, type Sale } from "@/services/marketplaceApi"
import { fetchStoriesByAuthor, type Story } from "@/services/api"
import StoryCard from "@/components/story-card"

export default function Profile() {
  const { user } = useAuth()
  const { account } = useWeb3()
  const [activeTab, setActiveTab] = useState<"created" | "owned" | "listed" | "sales">("created")
  const [createdStories, setCreatedStories] = useState<Story[]>([])
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([])
  const [listedNFTs, setListedNFTs] = useState<Listing[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (account || user?.email) {
      loadUserData()
    }
  }, [account, user])

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      const address = account || ""
      if (!address) {
        setIsLoading(false)
        return
      }

      // Load created stories
      try {
        const created = await fetchStoriesByAuthor(address)
        setCreatedStories(created)
      } catch (err) {
        console.warn("Failed to load created stories:", err)
        setCreatedStories([])
      }

      // Load user NFTs (owned, listed, sales)
      try {
        const nfts = await fetchUserNFTs(address, "all")
        setOwnedNFTs(nfts.owned || [])
        setListedNFTs(nfts.listed || [])
      } catch (err) {
        console.warn("Failed to load user NFTs:", err)
        setOwnedNFTs([])
        setListedNFTs([])
      }

      // Load sales history
      try {
        const salesData = await fetchSales({ seller: address, limit: 50 })
        setSales(salesData.sales || [])
      } catch (err) {
        console.warn("Failed to load sales:", err)
        setSales([])
      }
    } catch (err) {
      console.error("Error loading user data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="card-organic p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User size={32} className="sm:w-10 sm:h-10 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{user.name || "User"}</h1>
                  <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-2 mt-1 truncate">
                    <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <Edit size={18} />
                <span>Edit Profile</span>
              </Link>
            </div>

            {user.bio && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="card-organic p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{createdStories.length}</p>
                  <p className="text-sm text-muted-foreground">Created</p>
                </div>
              </div>
            </div>

            <div className="card-organic p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Package size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{ownedNFTs.length}</p>
                  <p className="text-sm text-muted-foreground">Owned</p>
                </div>
              </div>
            </div>

            <div className="card-organic p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Tag size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{listedNFTs.length}</p>
                  <p className="text-sm text-muted-foreground">Listed</p>
                </div>
              </div>
            </div>

            <div className="card-organic p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">{sales.length}</p>
                  <p className="text-sm text-muted-foreground">Sales</p>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Tabs */}
          <div className="card-organic p-6 sm:p-8 mt-6 sm:mt-8">
            <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
              <button
                onClick={() => setActiveTab("created")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "created"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted text-foreground"
                }`}
              >
                Created ({createdStories.length})
              </button>
              <button
                onClick={() => setActiveTab("owned")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "owned"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted text-foreground"
                }`}
              >
                Owned ({ownedNFTs.length})
              </button>
              <button
                onClick={() => setActiveTab("listed")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "listed"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted text-foreground"
                }`}
              >
                Listed ({listedNFTs.length})
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "sales"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted text-foreground"
                }`}
              >
                Sales ({sales.length})
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              <div>
                {activeTab === "created" && (
                  <div>
                    {createdStories.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {createdStories.map((story) => (
                          <StoryCard
                            key={story.tokenId}
                            story={{
                              id: story.tokenId,
                              title: story.title || "Untitled",
                              author: story.author.slice(0, 6) + "..." + story.author.slice(-4),
                              category: story.tribe || "Story",
                              image: story.metadata?.image || story.ipfsUrl || "/placeholder.svg",
                              description: story.description || "",
                              views: 0,
                              likes: 0,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No stories created yet</p>
                        <Link to="/upload" className="text-primary hover:underline mt-2 inline-block">
                          Create your first story
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "owned" && (
                  <div>
                    {ownedNFTs.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder - would display owned NFTs */}
                        <p className="text-muted-foreground col-span-full">
                          Owned NFTs: {ownedNFTs.length} (Blockchain query needed to display)
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No NFTs owned yet</p>
                        <Link to="/marketplace" className="text-primary hover:underline mt-2 inline-block">
                          Browse marketplace
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "listed" && (
                  <div>
                    {listedNFTs.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listedNFTs.map((listing) => (
                          <Link
                            key={listing.id}
                            to={`/story/${listing.tokenId}`}
                            className="card-standard overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="relative h-48 bg-muted">
                              <img
                                src={
                                  listing.story?.metadata?.image
                                    ? listing.story.metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
                                    : "/placeholder.svg"
                                }
                                alt={listing.story?.title || "Story"}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 px-2 py-1 bg-accent text-accent-foreground rounded text-sm font-semibold">
                                {listing.priceMatic.toFixed(4)} MATIC
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold mb-2 line-clamp-2">
                                {listing.story?.title || `Story #${listing.tokenId}`}
                              </h3>
                              <p className="text-sm text-muted-foreground">Listed for sale</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Tag size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No active listings</p>
                        <p className="text-sm mt-2">List your stories to start selling</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "sales" && (
                  <div>
                    {sales.length > 0 ? (
                      <div className="space-y-4">
                        {sales.map((sale) => (
                          <div key={sale.id} className="p-4 border border-border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">Story #{sale.tokenId}</p>
                                <p className="text-sm text-muted-foreground">
                                  Sold to {sale.buyer.slice(0, 6)}...{sale.buyer.slice(-4)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(sale.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{sale.priceMatic.toFixed(4)} MATIC</p>
                                {sale.platformFeeWei && (
                                  <p className="text-xs text-muted-foreground">
                                    Fee: {(parseFloat(sale.platformFeeWei) / 1e18).toFixed(4)} MATIC
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No sales yet</p>
                        <p className="text-sm mt-2">Your sales history will appear here</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

