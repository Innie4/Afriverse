import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import StoryCard from "@/components/story-card"
import { Heart, Share2, Bookmark, Eye, Calendar, User } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { fetchStoryById, fetchStories, type Story } from "@/services/api"
import { StoryDetailSkeleton } from "@/components/skeleton"
import { toast } from "sonner"

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [story, setStory] = useState<Story | null>(null)
  const [relatedStories, setRelatedStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    const loadStory = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const tokenId = parseInt(id)
        const storyData = await fetchStoryById(tokenId)
        setStory(storyData)
        
        // Load related stories (same tribe or language)
        const related = await fetchStories({ 
          tribe: storyData.tribe,
          limit: 4 
        })
        setRelatedStories(related.stories.filter(s => s.tokenId !== tokenId).slice(0, 3))
      } catch (err: any) {
        toast.error(err.message || "Failed to load story")
        navigate("/gallery")
      } finally {
        setIsLoading(false)
      }
    }

    loadStory()
  }, [id, navigate])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    if (platform === "copy") {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    }
    setShowShareMenu(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <StoryDetailSkeleton />
        <Footer />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Story not found</h1>
            <p className="text-muted-foreground mb-4">This story doesn't exist or has been removed.</p>
            <Link
              to="/gallery"
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Back to Gallery
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const metadata = story.metadata || {}
  const content = (metadata.content as string | undefined) ?? story.description ?? ""
  const rawAttributes = Array.isArray(metadata.attributes) ? metadata.attributes : []
  const tags = rawAttributes
    .map((attr: { value?: unknown }) => (typeof attr?.value === "string" ? attr.value : null))
    .filter((tag: string | null): tag is string => typeof tag === "string" && tag.trim().length > 0)
  const paragraphs = content
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Image */}
      <div className="relative w-full h-96 sm:h-[500px] bg-muted">
        <img 
          src={metadata.image || story.ipfsUrl || "/placeholder.svg"} 
          alt={story.title || "Story"} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Main Content */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-12 -mt-32 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header Card */}
          <div className="bg-card border border-border rounded-xl p-8 mb-8 shadow-lg">
            {/* Category Badge */}
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              {story.tribe || "Story"}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground text-balance">
              {story.title || "Untitled Story"}
            </h1>

            {/* Author Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{story.author.slice(0, 6)}...{story.author.slice(-4)}</p>
                  <p className="text-sm text-muted-foreground">Storyteller</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye size={16} />
                <span>{story.tokenId}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked ? "bg-destructive/10 text-destructive" : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked ? "bg-primary/10 text-primary" : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                <span>{isBookmarked ? "Saved" : "Save"}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  <Share2 size={20} />
                  <span>Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-lg shadow-lg p-3 z-20 min-w-48">
                    <button 
                      onClick={() => handleShare("twitter")}
                      className="block w-full text-left px-3 py-2 hover:bg-muted rounded transition-colors text-sm"
                    >
                      Share on Twitter
                    </button>
                    <button 
                      onClick={() => handleShare("facebook")}
                      className="block w-full text-left px-3 py-2 hover:bg-muted rounded transition-colors text-sm"
                    >
                      Share on Facebook
                    </button>
                    <button 
                      onClick={() => handleShare("copy")}
                      className="block w-full text-left px-3 py-2 hover:bg-muted rounded transition-colors text-sm"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-muted-foreground mb-8 italic">
              {story.description || "A story from Afriverse Tales"}
            </p>

            <div className="space-y-6 text-foreground leading-relaxed">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-12 pb-12 border-b border-border">
              <h3 className="font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <Link
                    key={tag + index}
                    to={`/gallery?search=${tag}`}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">More Stories You'll Love</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedStories.map((relatedStory) => (
                <StoryCard 
                  key={relatedStory.tokenId} 
                  story={{
                    id: relatedStory.tokenId,
                    title: relatedStory.title || "Untitled",
                    author: relatedStory.author.slice(0, 6) + "..." + relatedStory.author.slice(-4),
                    category: relatedStory.tribe || "Story",
                    image: relatedStory.metadata?.image || relatedStory.ipfsUrl || "/placeholder.svg",
                    description: relatedStory.description || "",
                    views: 0,
                    likes: 0,
                  }} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
