import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuroraBackground from "@/components/aurora-background"
import { User, Mail, Edit, BookOpen, Heart, Eye } from "lucide-react"

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-8 shadow-xl mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={40} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{user.name || "User"}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail size={16} />
                    {user.email}
                  </p>
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <Edit size={18} />
                Edit Profile
              </Link>
            </div>

            {user.bio && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Stories</p>
                </div>
              </div>
            </div>

            <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Heart size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Likes</p>
                </div>
              </div>
            </div>

            <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Eye size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Views</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

