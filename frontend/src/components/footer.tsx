import { Link, useNavigate } from "react-router-dom"
import { Facebook, Twitter, Instagram } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

const socialLinks = [
  { href: "https://www.facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://twitter.com", label: "Twitter", icon: Twitter },
  { href: "https://www.instagram.com", label: "Instagram", icon: Instagram },
]

export default function Footer() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleProtectedLink = (path: string, e: React.MouseEvent) => {
    if (!isAuthenticated && (path === "/upload" || path === "/my-stories")) {
      e.preventDefault()
      navigate("/login")
    }
  }

  return (
    <footer className="bg-gradient-to-b from-muted/40 to-muted/60 border-t border-border/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/real-logo.png" alt="Afriverse" className="h-10 w-auto" />
              <span className="font-bold text-lg text-primary">Afriverse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Preserving Africa’s creative expressions on-chain—from stories and art to film, folklore, and music.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/gallery" className="hover:text-foreground transition-colors">Gallery</Link></li>
              <li>
                <Link 
                  to="/upload" 
                  onClick={(e) => handleProtectedLink("/upload", e)}
                  className="hover:text-foreground transition-colors"
                >
                  Submit Work
                </Link>
              </li>
              <li>
                <Link 
                  to="/my-stories" 
                  onClick={(e) => handleProtectedLink("/my-stories", e)}
                  className="hover:text-foreground transition-colors"
                >
                  My Creations
                </Link>
              </li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/documentation" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 ease-out hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-110 active:scale-95"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Afriverse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

