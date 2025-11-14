import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  email: string
  name?: string
  bio?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("afriverse_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("afriverse_user")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return false
    }

    // Validate password length (8-12 characters)
    if (password.length < 8 || password.length > 12) {
      return false
    }

    // For demo: any valid email/password combination works
    const userData: User = {
      email,
      name: email.split("@")[0],
    }
    
    setUser(userData)
    localStorage.setItem("afriverse_user", JSON.stringify(userData))
    return true
  }

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return false
    }

    // Validate password length (8-12 characters)
    if (password.length < 8 || password.length > 12) {
      return false
    }

    // For demo: register and auto-login
    const userData: User = {
      email,
      name: name || email.split("@")[0],
    }
    
    setUser(userData)
    localStorage.setItem("afriverse_user", JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("afriverse_user")
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("afriverse_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

