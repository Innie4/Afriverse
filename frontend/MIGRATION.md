# React Migration Guide

## Files to Copy & Convert

### 1. Components (already converted)
- ✅ `components/navbar.tsx` → `frontend/src/components/navbar.tsx` (React Router Link)
- Need to copy: `components/footer.tsx`, `components/aurora-background.tsx`, `components/tribal-pattern-overlay.tsx`, `components/parallax-hero.tsx`, `components/story-card.tsx`, `components/story-upload-form.tsx`, `components/theme-provider.tsx`, `components/lottie-animations.tsx`, and all UI components

### 2. Pages (need conversion)
- `app/page.tsx` → `frontend/src/pages/Home.tsx` (Remove Navbar/Footer, change Link to React Router Link, Image to img)
- `app/gallery/page.tsx` → `frontend/src/pages/Gallery.tsx`
- `app/upload/page.tsx` → `frontend/src/pages/Upload.tsx`
- `app/story/[id]/page.tsx` → `frontend/src/pages/StoryDetail.tsx` (use useParams)
- `app/my-stories/page.tsx` → `frontend/src/pages/MyStories.tsx`
- `app/about/page.tsx` → `frontend/src/pages/About.tsx`

### 3. Configuration Files
- ✅ `frontend/vite.config.ts` - Created
- ✅ `frontend/tsconfig.json` - Created
- ✅ `frontend/index.html` - Created
- Need: `frontend/postcss.config.mjs`, `frontend/tailwind.config.js`

### 4. Public Assets
- Copy `public/` directory to `frontend/public/`

### 5. Key Changes
- `next/link` → `react-router-dom` Link
- `next/image` → Regular `<img>` or create Image component
- `usePathname()` → `useLocation()` from react-router-dom
- Remove `"use client"` directives
- Update imports to use `@/` alias

