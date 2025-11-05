import { Link } from "react-router-dom"
import { Heart, Eye } from "lucide-react"
import { useState } from "react"

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

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <Link to={`/story/${story.id}`}>
      <div className="group cursor-pointer h-full flex flex-col rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={story.image || "/placeholder.svg"}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full">
            {story.category}
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
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
          <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
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

