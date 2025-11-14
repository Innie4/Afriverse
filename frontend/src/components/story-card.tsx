import { Link } from "react-router-dom"
import { Heart, Eye } from "lucide-react"
import { useState, type MouseEvent } from "react"

interface Story {
  id: number
  title: string
  author: string
  category: string
  image: string
  description: string
  views: number
  likes: number
}

interface StoryCardProps {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(story.likes)

  const handleLike = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <Link to={`/story/${story.id}`}>
      <div className="group cursor-pointer h-full flex flex-col card-organic overflow-hidden hover:border-primary/50">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={story.image || "/placeholder.svg"}
            alt={story.title}
            className="w-full h-full object-cover rounded-none group-hover:scale-[1.05] transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Category Badge */}
          <div className="absolute top-4 right-4 px-4 py-1.5 bg-primary/98 backdrop-blur-md text-primary-foreground text-xs font-semibold rounded-full shadow-organic">
            {story.category}
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute bottom-4 right-4 p-3 rounded-full bg-background/95 backdrop-blur-md hover:bg-background transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-organic"
          >
            <Heart
              size={20}
              fill={isLiked ? "currentColor" : "none"}
              className={isLiked ? "text-destructive" : "text-foreground transition-colors duration-200"}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5 space-y-3">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-all duration-300 ease-out leading-snug">
            {story.title}
          </h3>
          <p className="text-sm text-muted-foreground">by {story.author}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">{story.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <Eye size={16} className="opacity-70" />
              <span>{story.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-destructive" : "opacity-70"} />
              <span>{likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

