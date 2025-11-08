import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Link } from "react-router-dom"

const blogPosts = [
  {
    title: "Archiving African Folklore on the Blockchain",
    excerpt:
      "How community curators are capturing oral histories, transcribing them with markdown chapters, and minting them for future generations.",
    link: "/upload",
    tag: "Folklore",
  },
  {
    title: "Visual Artists Bringing Afriverse Galleries to Life",
    excerpt:
      "From digital paintings to generative patterns inspired by Ankara textiles, discover how artists collaborate with collectors.",
    link: "/gallery",
    tag: "Art",
  },
  {
    title: "Soundscapes from Filmmakers & Musicians",
    excerpt:
      "Best practices for uploading scripts, storyboards, lyric sheets, and audio references in chapter form before the final mint.",
    link: "/documentation",
    tag: "Music & Film",
  },
]

export default function Blog() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-20 relative">
        <TribalPatternOverlay />
        <div className="max-w-5xl mx-auto relative z-10 space-y-12">
          <header className="space-y-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-balance">Afriverse Journal</h1>
            <p className="text-muted-foreground text-lg">
              Stories, production notes, and best practices from writers, artists, filmmakers, musicians, and folklore curators minting on Afriverse.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {blogPosts.map((post) => (
              <article key={post.title} className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm transition hover:border-primary">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {post.tag}
                </span>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">{post.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <Link to={post.link} className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:underline">
                  Continue reading →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

