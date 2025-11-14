import { Link } from "react-router-dom"
import { Book, BookOpen, X } from "lucide-react"
import { useState } from "react"

interface Chapter {
  id: string
  title: string
}

interface ChapterSidebarProps {
  chapters: Chapter[]
  summary: string
  storyId: string
  currentChapter?: string | null
}

export default function ChapterSidebar({ chapters, storyId, currentChapter }: ChapterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const allItems = [
    { id: "intro", title: "Introduction", href: `/story/${storyId}/intro` },
    ...chapters.map((chapter, index) => ({
      id: chapter.id,
      title: chapter.title || `Chapter ${index + 1}`,
      href: `/story/${storyId}/chapter/${chapter.id}`
    }))
  ]

  const currentPath = currentChapter === "intro" 
    ? `/story/${storyId}/intro`
    : currentChapter 
    ? `/story/${storyId}/chapter/${currentChapter}`
    : `/story/${storyId}/intro`

  return (
    <>
      {/* Mobile Book Button - Fixed */}
      <div className="md:hidden fixed top-20 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/90 backdrop-blur-md border border-primary/60 shadow-lg hover:bg-primary transition-all duration-300 ease-out hover:scale-110 active:scale-95"
          aria-label="Toggle chapters"
        >
          {isOpen ? <BookOpen size={24} className="text-primary-foreground" /> : <Book size={24} className="text-primary-foreground" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div
            className="absolute inset-y-0 left-0 w-3/4 max-w-xs bg-background/98 backdrop-blur-md border-r border-border/60 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Table of Contents</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted/80 rounded-xl transition-all duration-300 ease-out"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1">
                {allItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
                      currentPath === item.href
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
          <nav className="space-y-1">
            {allItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`block px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
                  currentPath === item.href
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-foreground hover:bg-muted/80"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

