import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuroraBackground from "@/components/aurora-background"
import { toast } from "sonner"
import { User, Mail, Save, X } from "lucide-react"

export default function EditProfile() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [isLoading, setIsLoading] = useState(false)

  if (!user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      updateProfile({ name, bio })
      toast.success("Profile updated successfully!")
      navigate("/profile")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
              <button
                onClick={() => navigate("/profile")}
                className="p-2 rounded-xl hover:bg-muted/80 transition-all duration-300 ease-out"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-semibold mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-6 py-2.5 rounded-xl border border-border bg-background hover:bg-muted transition-all duration-300 ease-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

