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
      description: "You retain complete control and copyright of your stories.",
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
            Mint Your Story Chapter by Chapter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Craft your narrative over time with searchable cultural data and rich editing tools. When you are ready,
            mint on Polygon Mumbai to create an immutable record of authorship and heritage.
          </p>
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
