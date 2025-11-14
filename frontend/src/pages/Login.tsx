import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuroraBackground from "@/components/aurora-background"
import { toast } from "sonner"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8 || password.length > 12) {
      newErrors.password = "Password must be between 8 and 12 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        toast.success("Login successful!")
        navigate("/")
      } else {
        toast.error("Invalid email or password")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      <AuroraBackground />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mb-6">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    placeholder="your.email@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 ${
                      errors.email ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-3 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: undefined })
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-2.5 rounded-xl border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 ${
                      errors.password ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                <p className="mt-1 text-xs text-muted-foreground">Password must be 8-12 characters</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

