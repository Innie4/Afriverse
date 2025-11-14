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
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="card-organic p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User size={32} className="sm:w-10 sm:h-10 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{user.name || "User"}</h1>
                  <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-2 mt-1 truncate">
                    <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <Edit size={18} />
                <span>Edit Profile</span>
              </Link>
            </div>

            {user.bio && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="card-organic p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Stories</p>
                </div>
              </div>
            </div>

            <div className="card-organic p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Heart size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Likes</p>
                </div>
              </div>
            </div>

            <div className="card-organic p-5 sm:p-6 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Eye size={24} className="text-primary" />
                </div>
                <div className="min-w-0">
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

