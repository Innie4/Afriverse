import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/error-boundary'
import ScrollToTop from '@/components/scroll-to-top'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import GalleryMarketplace from '@/pages/GalleryMarketplace'
import Upload from '@/pages/Upload'
import StoryDetail from '@/pages/StoryDetail'
import MyStories from '@/pages/MyStories'
import About from '@/pages/About'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import EditProfile from '@/pages/EditProfile'
import Documentation from '@/pages/Documentation'
import Blog from '@/pages/Blog'
import FAQ from '@/pages/FAQ'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-background flex flex-col">
          <Toaster position="top-right" richColors />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<GalleryMarketplace />} />
              <Route path="/marketplace" element={<GalleryMarketplace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/story/:id" element={<StoryDetail />} />
              <Route path="/story/:id/intro" element={<StoryDetail />} />
              <Route path="/story/:id/chapter/:chapterId" element={<StoryDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faq" element={<FAQ />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-stories"
                element={
                  <ProtectedRoute>
                    <MyStories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App

