import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const unauthenticatedLinks = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
  ]

  const authenticatedLinks = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/upload", label: "Upload" },
    { href: "/my-stories", label: "My Stories" },
    { href: "/about", label: "About" },
  ]

  const links = isAuthenticated ? authenticatedLinks : unauthenticatedLinks

  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen((prev) => !prev)

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    navigate("/")
    closeMenu()
  }

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
    }

    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen])

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              className="order-1 md:hidden p-2.5 hover:bg-muted/80 rounded-xl transition-all duration-300 ease-out active:scale-95"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} className="transition-transform duration-300" /> : <Menu size={24} className="transition-transform duration-300" />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="order-2 md:order-1 ml-auto md:ml-0 flex items-center gap-3 group transition-all duration-300 ease-out"
            >
              <img
                src="/real-logo.png"
                alt="Afriverse logo"
                className="h-10 w-auto transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:rotate-1"
              />
              <span className="font-bold text-base sm:text-lg text-primary transition-all duration-300 ease-out group-hover:text-primary/90 group-hover:tracking-wide">
                Afriverse
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="order-4 md:order-2 hidden md:flex items-center gap-8 ml-auto">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-foreground hover:text-primary transition-all duration-300 ease-out text-sm font-medium relative group/link"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover/link:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="order-5 md:order-3 hidden md:flex items-center gap-3 md:ml-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="btn-lift flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/70 hover:bg-muted/80 transition-all duration-200"
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">{user?.name || "Profile"}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-lift flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/70 hover:bg-muted/80 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                  <Link
                    to="/upload"
                    className="btn-lift px-6 py-2.5 gradient-accent text-accent-foreground rounded-xl font-medium shadow-organic transition-all duration-200"
                  >
                    Mint Work
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn-lift px-4 py-2.5 rounded-xl border border-border/70 hover:bg-muted/80 transition-all duration-200 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-lift px-6 py-2.5 gradient-accent text-accent-foreground rounded-xl font-medium shadow-organic transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-out ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMenu} />
        <div
          id="mobile-navigation"
          className={`absolute inset-y-0 left-0 w-1/2 max-w-xs bg-background/98 backdrop-blur-md border-r border-border/60 shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
            isOpen ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-4 py-4 space-y-2 overflow-y-auto h-full">
            {links.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-xl text-foreground transition-all duration-300 ease-out hover:bg-muted/80 hover:translate-x-1 transform ${
                  isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-foreground transition-all duration-300 ease-out hover:bg-muted/80 hover:translate-x-1 transform ${
                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${links.length * 60}ms` }}
                  onClick={closeMenu}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-foreground transition-all duration-300 ease-out hover:bg-muted/80 hover:translate-x-1 transform ${
                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${(links.length + 1) * 60}ms` }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
                <Link
                  to="/upload"
                  className={`block px-4 py-3 bg-accent text-accent-foreground rounded-xl font-medium transition-all duration-300 ease-out hover:bg-accent/90 hover:shadow-lg hover:scale-[1.02] transform ${
                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${(links.length + 2) * 60}ms` }}
                  onClick={closeMenu}
                >
                  Mint Work
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-4 py-3 rounded-xl text-foreground transition-all duration-300 ease-out hover:bg-muted/80 hover:translate-x-1 transform ${
                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${links.length * 60}ms` }}
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block px-4 py-3 bg-accent text-accent-foreground rounded-xl font-medium transition-all duration-300 ease-out hover:bg-accent/90 hover:shadow-lg hover:scale-[1.02] transform ${
                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${(links.length + 1) * 60}ms` }}
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

