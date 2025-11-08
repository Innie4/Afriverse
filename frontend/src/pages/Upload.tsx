import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import StoryUploadForm from "@/components/story-upload-form"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { BookOpen, Cloud, Lock, Shield } from "lucide-react"

export default function Upload() {
  const benefits = [
    {
      icon: BookOpen,
      title: "Chapter-by-Chapter Publishing",
      description: "Add chapters over time, format with rich tools, and keep crafting until you are ready to mint.",
    },
    {
      icon: Cloud,
      title: "Decentralized Storage",
      description: "Your stories are stored securely on IPFS and the blockchain.",
    },
    {
      icon: Lock,
      title: "Full Ownership",
      description: "Retain creative rights over stories, art, music, film scripts, and folklore curations.",
    },
    {
      icon: Shield,
      title: "Protect Your IP",
      description: "Claim your cultural intellectual property with blockchain proof.",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      {/* Header Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-primary/5 to-background relative">
        <TribalPatternOverlay />
        <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground text-balance">
            Mint Your African Expression Chapter by Chapter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Craft living archives for writers, artists, folklore curators, filmmakers, and musicians. Use the editor to
            build chapters at your pace, enrich them with cultural metadata, then mint on Polygon Mumbai to preserve authorship.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card/40 p-4">
              <p className="font-semibold text-foreground">Who can publish?</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Writers & poets</li>
                <li>Visual & digital artists</li>
                <li>Folklore & oral history curators</li>
                <li>Filmmakers & musicians</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card/40 p-4">
              <p className="font-semibold text-foreground">What can you include?</p>
              <p className="mt-2 leading-relaxed">
                Annotated scripts, lyric sheets, visual mood boards, lore transcripts, production notes, and audio/storyboard references—all stored chapter by chapter.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div
                key={idx}
                className="text-center p-6 rounded-lg bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <Icon size={32} className="text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Form Section */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-12 relative">
        <TribalPatternOverlay />
        <div className="max-w-2xl mx-auto relative z-10">
          <StoryUploadForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
