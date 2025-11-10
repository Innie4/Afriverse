import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-20 relative">
        <TribalPatternOverlay />
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-balance">About Afriverse</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              Afriverse is a Web3 platform dedicated to preserving and celebrating African stories through blockchain technology.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              We believe that stories are the soul of a culture. Our mission is to preserve African narratives for future generations
              while empowering storytellers through Web3 technology. By minting stories as NFTs, we create a permanent, immutable
              record of cultural heritage that can be owned, shared, and celebrated globally.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Storytellers upload their narratives with metadata</li>
              <li>Stories are stored on IPFS for decentralized access</li>
              <li>NFTs are minted on Polygon blockchain</li>
              <li>Stories are indexed and searchable in our gallery</li>
              <li>Authors retain full ownership and copyright</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Join Us</h2>
            <p className="text-muted-foreground">
              Whether you're a storyteller, collector, or cultural enthusiast, join us in preserving African heritage for generations to come.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

