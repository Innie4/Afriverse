import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/error-boundary'
import Home from '@/pages/Home'
import Gallery from '@/pages/Gallery'
import Upload from '@/pages/Upload'
import StoryDetail from '@/pages/StoryDetail'
import MyStories from '@/pages/MyStories'
import About from '@/pages/About'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-background flex flex-col">
          <Toaster position="top-right" richColors />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/story/:id" element={<StoryDetail />} />
              <Route path="/my-stories" element={<MyStories />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App

