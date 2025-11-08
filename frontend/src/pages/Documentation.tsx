import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Link } from "react-router-dom"

const sections = [
  {
    title: "Getting Started",
    steps: [
      "Connect your wallet and choose the creative expression you’re submitting.",
      "Use the chapter-based editor to draft, format, and save your work-in-progress.",
      "Upload high-quality cover imagery and supporting assets through IPFS.",
    ],
  },
  {
    title: "Minting Workflow",
    steps: [
      "Review metadata previews to confirm tags, chapters, and summary details.",
      "Confirm gas prompts inside MetaMask to mint on Polygon Mumbai testnet.",
      "Share your new on-chain artifact through the gallery, blog, or external channels.",
    ],
  },
  {
    title: "Metadata Standards",
    steps: [
      "Afriverse stores markdown, HTML, and plain text for every chapter.",
      "Tags leverage curated African genre taxonomies for search and discovery.",
      "Assets resolve through your configured IPFS gateway for long-term access.",
    ],
  },
]

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-20 relative">
        <TribalPatternOverlay />
        <div className="max-w-4xl mx-auto relative z-10 space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-balance">Afriverse Documentation</h1>
            <p className="text-muted-foreground text-lg">
              Learn how writers, artists, folklore curators, filmmakers, and musicians collaborate, mint, and preserve their work on-chain.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link to="/upload" className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
                Start Creating →
              </Link>
              <Link to="/faq" className="rounded-lg border border-border px-4 py-2 font-medium hover:border-primary">
                Visit FAQ
              </Link>
            </div>
          </header>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-foreground mb-4">{section.title}</h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  {section.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section className="rounded-xl border border-border bg-primary/10 p-6 text-sm text-primary">
            <h2 className="text-lg font-semibold mb-2">Need more?</h2>
            <p>
              Join the Afriverse community to collaborate with mentors, access code snippets, and workshop your project before minting.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </div>
  )
}

