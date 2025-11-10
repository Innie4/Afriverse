import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Sparkles, Users, ArrowRight, Shield, Globe, BookOpen, Heart, Award } from "lucide-react"
import AuroraBackground from "@/components/aurora-background"
import TribalPatternOverlay from "@/components/tribal-pattern-overlay"
import ParallaxHero from "@/components/parallax-hero"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "Mint Your Stories",
      description: "Transform your African narratives into NFTs and preserve them on the blockchain forever.",
      delay: 0.1,
    },
    {
      icon: Users,
      title: "Connect & Share",
      description: "Build community with storytellers worldwide and celebrate cultural heritage together.",
      delay: 0.2,
    },
    {
      icon: Shield,
      title: "Protect Your IP",
      description: "Claim your cultural intellectual property with immutable blockchain proof of ownership.",
      delay: 0.3,
    },
  ]

  const stats = [
    { label: "Projected Stories Minted (Year 1)", value: "500+", icon: BookOpen },
    { label: "Creators on Our Waitlist", value: "1,200+", icon: Users },
    { label: "Heritage Collections in Planning", value: "25", icon: Heart },
  ]

  const stories = [
    {
      id: 1,
      title: "The Legend of Anansi",
      author: "Kwame Asante",
      category: "Folklore",
      image: "/african-spider-folklore-art.jpg",
    },
    {
      id: 2,
      title: "City Dreams",
      author: "Zara Okonkwo",
      category: "Contemporary",
      image: "/african-modern-city-art.jpg",
    },
    {
      id: 3,
      title: "Heritage Roots",
      author: "Kofi Mensah",
      category: "Historical",
      image: "/african-heritage-culture-art.jpg",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />
      <AuroraBackground />

      {/* Hero Section */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-gradient-to-b from-background via-background to-muted/30 relative">
        <TribalPatternOverlay />
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles size={16} className="text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">Welcome to Afriverse</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight text-balance"
          >
            Preserve Your <span className="text-primary">Stories</span> Forever
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Afriverse could become a home for African storytellers to{" "}
            <span className="font-semibold text-foreground">claim their cultural IP</span>. Mint your narratives as NFTs
            and join a global movement celebrating heritage, tradition, and futuristic vision through Web3.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-16 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-6"
          >
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl"
            >
              Start Minting <ArrowRight size={20} />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted px-8 py-4 font-semibold text-foreground transition-all hover:scale-[1.02] hover:bg-muted/80"
            >
              Explore Gallery
            </Link>
          </motion.div>

          {/* Parallax Hero Image */}
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ParallaxHero imageSrc="/african-storytelling-nft-web3-heritage.jpg" alt="Afriverse hero" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-primary/5 relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:shadow-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon size={32} className="text-primary" />
                    </div>
                  </div>
                  <motion.div
                    className="text-4xl font-bold text-primary mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/50 relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-4xl font-bold text-center mb-16 text-balance"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Afriverse?
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon size={24} className="text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Community Vision Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-muted/50 to-background relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Award size={16} className="text-accent" />
                <span className="text-sm font-medium text-accent">Cultural IP Protection</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 text-balance">
                A Home for African Storytellers to Claim Their Cultural IP
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Afriverse empowers African storytellers to protect their intellectual property through blockchain
                technology. Every story minted creates an immutable record of ownership, preserving cultural heritage for
                generations to come.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Shield size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Immutable Ownership</h3>
                    <p className="text-sm text-muted-foreground">
                      Your stories are permanently recorded on the blockchain, proving your ownership and authorship.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Globe size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Global Reach</h3>
                    <p className="text-sm text-muted-foreground">
                      Share your cultural narratives with a worldwide audience while maintaining full control.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Heart size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cultural Preservation</h3>
                    <p className="text-sm text-muted-foreground">
                      Contribute to a growing library of African stories, ensuring they're never lost to time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="rounded-xl overflow-hidden bg-muted h-96 sm:h-[500px] relative shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/african-heritage-culture-art.jpg"
                alt="African cultural heritage"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 relative">
        <TribalPatternOverlay />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-balance">Featured Stories</h2>
            <Link
              to="/gallery"
              className="text-primary font-semibold hover:gap-2 flex items-center gap-1 transition-all"
            >
              View All <ArrowRight size={20} />
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {stories.map((story) => (
              <motion.div
                key={story.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/story/${story.id}`} className="group cursor-pointer block">
                  <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-muted shadow-md">
                    <motion.img
                      src={story.image || "/placeholder.svg"}
                      alt={story.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{story.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">by {story.author}</p>
                    <span className="inline-block text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {story.category}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-primary text-primary-foreground relative">
        <TribalPatternOverlay />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-4xl font-bold mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Protect Your Cultural IP?
          </motion.h2>
          <motion.p
            className="text-lg mb-10 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of storytellers preserving African heritage through Web3. Mint your first story on Polygon
            Mumbai testnet today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/upload"
              className="inline-flex px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-all items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Mint Your First Story <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
