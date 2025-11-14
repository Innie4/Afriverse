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
      <div className="group cursor-pointer h-full flex flex-col rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-primary/40 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.01]">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={story.image || "/placeholder.svg"}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-3 right-3 px-3.5 py-1.5 bg-primary/95 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-full shadow-lg">
            {story.category}
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-background/90 backdrop-blur-md hover:bg-background transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
          >
            <Heart
              size={20}
              fill={isLiked ? "currentColor" : "none"}
              className={isLiked ? "text-destructive" : "text-foreground"}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-bold text-lg mb-1.5 line-clamp-2 group-hover:text-primary transition-all duration-300 ease-out group-hover:tracking-wide">
            {story.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">by {story.author}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">{story.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{story.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-destructive" : ""} />
              <span>{likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

