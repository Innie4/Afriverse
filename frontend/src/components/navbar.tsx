import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/upload", label: "Upload" },
    { href: "/my-stories", label: "My Stories" },
    { href: "/about", label: "About" },
  ]

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

  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen((prev) => !prev)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/afriverse-logo.png"
              alt="Afriverse logo"
              className="h-10 w-auto transition-transform group-hover:scale-[1.03]"
            />
            <span className="font-bold text-lg hidden sm:inline text-primary transition-colors group-hover:text-primary/80">
              Afriverse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/upload"
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Mint Work
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-out ${
            isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/40" onClick={closeMenu} />
          <div
            id="mobile-navigation"
            className={`absolute inset-y-0 left-0 w-1/2 max-w-xs bg-background border-r border-border shadow-xl overflow-hidden transition-all duration-300 ease-out ${
              isOpen ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-4 py-4 space-y-2 overflow-y-auto h-full">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2 rounded-lg text-foreground transition-all duration-300 ease-out hover:bg-muted transform ${
                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/upload"
                className={`block px-3 py-3 bg-accent text-accent-foreground rounded-lg font-medium transition-all duration-300 ease-out hover:bg-accent/90 hover:shadow-md transform ${
                  isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
                style={{ transitionDelay: `${links.length * 60}ms` }}
                onClick={closeMenu}
              >
                Mint Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

