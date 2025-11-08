import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Link } from "react-router-dom"

const faqs = [
  {
    question: "What creative work can I publish on Afriverse?",
    answer:
      "Afriverse supports chapter-based submissions for writers, visual artists, folklore curators, filmmakers, and musicians. You can structure narratives, visual concepts, scripts, and lyric sheets using the markdown editor.",
  },
  {
    question: "Do I need to finish my entire piece before minting?",
    answer:
      "No. Use the chapter editor to save drafts locally, mint initial chapters, and add future updates. Every minted chapter remains accessible on-chain with its own timestamp.",
  },
  {
    question: "How are media files stored?",
    answer:
      "Cover imagery and supporting assets are uploaded through IPFS using web3.storage. The metadata links to your preferred gateway, ensuring decentralized access.",
  },
  {
    question: "Can I collaborate with other creatives?",
    answer:
      "Absolutely. Afriverse is built for interdisciplinary collaboration—pair a writer with a musician, a filmmaker with a folklore curator, or commission artwork for your narrative before minting.",
  },
]

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />

      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-20 relative">
        <TribalPatternOverlay />
        <div className="max-w-3xl mx-auto relative z-10 space-y-10">
          <header className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-balance">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Everything you need to know before minting your African creative expression on-chain.
            </p>
          </header>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <details
                key={item.question}
                className="overflow-hidden rounded-xl border border-border bg-card/60 shadow-sm transition hover:border-primary/60"
              >
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-foreground hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {item.question}
                </summary>
                <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-sm text-primary">
            <p className="font-semibold">Still need support?</p>
            <p className="mt-2">
              Visit our <Link to="/documentation" className="underline">documentation</Link>, read the{" "}
              <Link to="/blog" className="underline">Afriverse Journal</Link>, or open a community ticket via Discord.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

