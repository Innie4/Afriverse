import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Wallet } from "lucide-react"
import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import StoryCard from "@/components/story-card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { fetchStoriesByAuthor, type Story } from "@/services/api"
import { StoryCardSkeleton } from "@/components/skeleton"
import { useWeb3 } from "@/hooks/useWeb3"
import { toast } from "sonner"

export default function MyStories() {
  const { isConnected, account } = useWeb3()
  const [myStories, setMyStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMyStories = async () => {
      if (!isConnected || !account) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const stories = await fetchStoriesByAuthor(account)
        setMyStories(stories)
      } catch (err: any) {
        toast.error(err.message || "Failed to load your stories")
      } finally {
        setIsLoading(false)
      }
    }

    loadMyStories()
  }, [isConnected, account])

  const transformStory = (story: Story) => {
    const metadata = story.metadata || {}
    const gateway = import.meta.env.VITE_IPFS_GATEWAY || "https://ipfs.io/ipfs/"
    const cover = typeof metadata.image === "string" && metadata.image.startsWith("ipfs://") ? metadata.image.replace("ipfs://", gateway) : metadata.image || story.ipfsUrl || "/placeholder.svg"
    const chapters = Array.isArray(metadata.chapters) ? metadata.chapters : []
    const firstChapter = chapters[0]
    const summary = metadata.summary || firstChapter?.contentText || story.description || "A story about my journey"

    return {
      id: story.tokenId,
      title: story.title || metadata.name || "Untitled Story",
      author: "You",
      category: story.tribe || metadata.category || "Personal",
      image: cover,
      description: summary,
      views: 0,
      likes: 0,
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-12 relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-balance">My Stories</h1>
            <Link
              to="/upload"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Story
            </Link>
          </div>

          {!isConnected ? (
            <div className="text-center py-16">
              <Wallet size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mb-4">Connect your wallet to view your stories.</p>
              <Link
                to="/upload"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Connect Wallet
              </Link>
            </div>
          ) : isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <StoryCardSkeleton key={i} />
              ))}
            </div>
          ) : myStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myStories.map((story) => (
                <StoryCard key={story.tokenId} story={transformStory(story)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">You haven't created any stories yet.</p>
              <Link
                to="/upload"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Create Your First Story
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
