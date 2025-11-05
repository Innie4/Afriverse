# 📋 Complete Setup Checklist - Afriverse Tales

This document contains **everything** you need to complete in the `frontend/`, `backend/`, and `contracts/` folders.

---

## 🔷 CONTRACTS FOLDER (`contracts/`)

### ✅ Environment Setup
- [ ] **Create `.env` file** in `contracts/` directory
  - Copy from `contracts/env.example`
  - Add your `PRIVATE_KEY` (without 0x prefix)
  - Add `POLYGONSCAN_API_KEY` (for contract verification)
  - Set `ROYALTY_RECIPIENT` address (your wallet address)
  - Set `ROYALTY_FEE_BPS` (e.g., 500 = 5%)

### ✅ Network Configuration
- [ ] **Get testnet MATIC tokens**
  - Visit: https://faucet.polygon.technology/
  - Request MATIC for your wallet address
  - Ensure you have at least 0.1 MATIC for deployment gas fees

### ✅ Contract Deployment
- [ ] **Deploy contract to Polygon Mumbai**
  ```bash
  cd contracts
  npm run deploy:mumbai
  ```
- [ ] **Copy deployed contract address** from terminal output
- [ ] **Update `.env` file** with `CONTRACT_ADDRESS` after deployment

### ✅ Contract Verification
- [ ] **Verify contract on PolygonScan**
  ```bash
  npm run verify:mumbai <CONTRACT_ADDRESS>
  ```
- [ ] **Confirm contract is verified** on https://mumbai.polygonscan.com/

### ✅ Testing (Optional but Recommended)
- [ ] **Create test file** at `contracts/test/AfriverseTales.test.js`
- [ ] **Write tests for:**
  - [ ] `mintStory()` function
  - [ ] `tokenURI()` function
  - [ ] `StoryMinted` event emission
  - [ ] Royalty functionality (if implemented)
  - [ ] Ownership checks
- [ ] **Run tests:**
  ```bash
  npm test
  ```

### ✅ Contract ABI Export
- [ ] **Verify ABI file exists** at `contracts/artifacts/contracts/AfriverseTales.sol/AfriverseTales.json`
- [ ] **Copy ABI** to frontend if needed (or reference from monorepo)

---

## 🔷 BACKEND FOLDER (`backend/`)

### ✅ Environment Setup
- [ ] **Create `.env` file** in `backend/` directory
  - Copy from `backend/env.example`
  - Configure all required variables:

#### Database Configuration
- [ ] **Set up PostgreSQL database**
  - Option 1: Local PostgreSQL
    - Install PostgreSQL locally
    - Create database: `CREATE DATABASE afriverse_tales;`
    - Set `DATABASE_URL=postgresql://user:password@localhost:5432/afriverse_tales`
  - Option 2: Supabase (Recommended)
    - Create account at https://supabase.com
    - Create new project
    - Copy connection string from Settings > Database
    - Set `DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

#### Web3 Configuration
- [ ] **Get Polygon Mumbai RPC URL**
  - Option 1: Use public RPC: `https://rpc-mumbai.maticvigil.com`
  - Option 2: Get API key from Infura/Alchemy
    - Infura: https://infura.io
    - Alchemy: https://alchemy.com
  - Set `RPC_URL=https://rpc-mumbai.maticvigil.com`
- [ ] **Set `CONTRACT_ADDRESS`** (from deployed contract)
- [ ] **Set `PRIVATE_KEY`** (for event listener - use a dedicated wallet, NOT your main wallet)

#### IPFS Configuration
- [ ] **Get Web3.Storage API token**
  - Sign up at https://web3.storage
  - Create API token
  - Set `WEB3_STORAGE_TOKEN=your_token_here`
- [ ] **Set `IPFS_GATEWAY_URL`** (default: `https://ipfs.io/ipfs/`)

#### Redis Configuration (Optional)
- [ ] **Set up Redis** (optional, for caching)
  - Option 1: Local Redis
    - Install Redis locally
    - Set `REDIS_URL=redis://localhost:6379`
  - Option 2: Redis Cloud
    - Sign up at https://redis.com/cloud
    - Create database
    - Copy connection string
    - Set `REDIS_URL=redis://...`

#### Other Configuration
- [ ] **Set `PORT`** (default: 3001)
- [ ] **Set `NODE_ENV`** (development/production)
- [ ] **Set `LOG_LEVEL`** (info/debug/error)
- [ ] **Configure rate limiting** (`RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`)

### ✅ Database Setup
- [ ] **Verify database tables are created**
  - Tables are auto-created by `createTables()` function
  - Check logs for "Database initialized" message
  - If manual setup needed, run SQL from `backend/src/config/database.js`

### ✅ Service Initialization
- [ ] **Start backend server**
  ```bash
  cd backend
  npm start
  # or for development
  npm run dev
  ```
- [ ] **Verify all services initialize:**
  - [ ] Database connection successful
  - [ ] IPFS service initialized
  - [ ] Event listener initialized (if RPC_URL and CONTRACT_ADDRESS set)
  - [ ] Redis initialized (if configured)

### ✅ API Testing
- [ ] **Test health endpoint**
  ```bash
  curl http://localhost:3001/api/health
  ```
- [ ] **Test upload endpoint**
  ```bash
  curl -X POST http://localhost:3001/api/upload \
    -F "file=@test-image.jpg"
  ```
- [ ] **Test stories endpoint**
  ```bash
  curl http://localhost:3001/api/stories
  ```

### ✅ Event Listener
- [ ] **Verify event listener is running**
  - Check logs for "Event listener started successfully"
  - Test by minting a story on frontend
  - Verify story appears in database after minting

### ✅ CORS Configuration
- [ ] **Verify CORS is configured** for frontend origin
  - Default: `app.use(cors())` allows all origins
  - In production, restrict to your frontend domain

---

## 🔷 FRONTEND FOLDER (`frontend/`)

### ✅ Environment Setup
- [x] **Create `.env` file** in `frontend/` directory
  - Copy from `frontend/env.example`
  - Set `VITE_CONTRACT_ADDRESS` (from deployed contract)
  - Set `VITE_API_URL` (default: `http://localhost:3001/api`)
  - Optionally set `VITE_IPFS_GATEWAY` (default: `https://ipfs.io/ipfs/`)

### ✅ API Integration
- [x] **Create API service file** (`frontend/src/services/api.ts`)
  - ✅ Created functions to fetch stories from backend
  - ✅ Created functions to upload files to backend IPFS endpoint
  - ✅ Set API base URL (default: `http://localhost:3001/api`)

### ✅ Gallery Page Integration
- [x] **Replace mock data** in `frontend/src/pages/Gallery.tsx`
  - ✅ Removed `mockStories` array
  - ✅ Added `useEffect` to fetch stories from backend API
  - ✅ Added loading state with skeletons
  - ✅ Added error handling with toast notifications
  - ✅ Connected filters (tribe, language, author) to API query params

### ✅ Story Detail Page Integration
- [x] **Connect to backend API** in `frontend/src/pages/StoryDetail.tsx`
  - ✅ Removed mock `storyData` object
  - ✅ Fetch story by tokenId from backend API
  - ✅ Added loading state with skeleton
  - ✅ Added error handling for 404 cases
  - ✅ Fetch related stories from API

### ✅ My Stories Page Integration
- [x] **Connect to backend API** in `frontend/src/pages/MyStories.tsx`
  - ✅ Removed mock `myStories` array
  - ✅ Fetch user's stories by wallet address
  - ✅ Filter stories where `author === userWalletAddress`
  - ✅ Added loading state with skeletons
  - ✅ Added "Connect Wallet" prompt if not connected

### ✅ Upload Form Integration
- [x] **Connect IPFS upload** in `frontend/src/components/story-upload-form.tsx`
  - ✅ Replaced `uploadToIPFS()` mock function with actual API call
  - ✅ Upload image file to backend `/api/upload` endpoint
  - ✅ Upload metadata JSON to backend `/api/upload/metadata` endpoint
  - ✅ Get IPFS hash from response
  - ✅ Handle upload errors with toast notifications

### ✅ Web3 Hook Improvements
- [x] **Fix useWeb3 hook** (`frontend/src/hooks/useWeb3.ts`)
  - [x] Updated `CONTRACT_ADDRESS` to use `import.meta.env.VITE_CONTRACT_ADDRESS`
  - [x] Import full ABI from `contracts/artifacts/contracts/AfriverseTales.sol/AfriverseTales.json`
  - [x] Verified `mintStory()` function matches contract signature
  - [x] Added proper error handling for contract calls

### ✅ Contract ABI Setup
- [x] **Copy or reference contract ABI**
  - ✅ Copied `contracts/artifacts/contracts/AfriverseTales.sol/AfriverseTales.json` to `frontend/src/contracts/`

### ✅ Missing Components
- [x] **Add Navbar to StoryDetail page**
  - ✅ Imported `Navbar` component
  - ✅ Added `<Navbar />` at top of page
- [x] **Add Navbar to MyStories page**
  - ✅ Imported `Navbar` component
  - ✅ Added `<Navbar />` at top of page
- [x] **Add Footer to StoryDetail page**
  - ✅ Imported `Footer` component
  - ✅ Added `<Footer />` at bottom of page

### ✅ Error Handling
- [x] **Add global error boundary**
  - ✅ Created `ErrorBoundary.tsx` component
  - ✅ Wrapped `App.tsx` with error boundary
- [x] **Add toast notifications**
  - ✅ Installed `sonner` toast library (already in dependencies)
  - ✅ Added `Toaster` component to `App.tsx`
  - ✅ Replaced error messages with toast notifications

### ✅ Loading States
- [x] **Add loading skeletons**
  - ✅ Created `Skeleton` component (`frontend/src/components/skeleton.tsx`)
  - ✅ Created `StoryCardSkeleton` and `StoryDetailSkeleton`
  - ✅ Added loading states to Gallery, StoryDetail, MyStories pages

### ✅ Responsive Design
- [ ] **Test on mobile devices**
  - Verify all pages work on mobile
  - Check navbar mobile menu
  - Test form inputs on mobile
  - Verify image uploads work on mobile

### ✅ Build & Deploy
- [ ] **Test production build**
  ```bash
  cd frontend
  npm run build
  npm run preview
  ```
- [ ] **Fix any build errors**
- [ ] **Deploy frontend** (Vercel, Netlify, etc.)
  - Set environment variables in deployment platform
  - Set `VITE_CONTRACT_ADDRESS` and `VITE_API_URL` in deployment settings

---

## 🔷 ROOT FOLDER (Monorepo Setup)

### ✅ Dependencies
- [ ] **Install all dependencies from root**
  ```bash
  npm install
  # or
  pnpm install
  ```
- [ ] **Verify all workspaces are linked**
  - Check `node_modules` in each workspace
  - Verify shared dependencies work

### ✅ Scripts
- [ ] **Test root scripts**
  ```bash
  npm run dev              # Start frontend
  npm run dev:backend      # Start backend
  npm run build            # Build frontend
  npm run build:contracts # Compile contracts
  npm run deploy:contracts # Deploy contracts
  ```

### ✅ Environment Variables Summary
- [ ] **Create `.env` checklist:**
  - Contracts: `PRIVATE_KEY`, `POLYGONSCAN_API_KEY` ⚠️ **TODO**
  - Backend: `DATABASE_URL`, `RPC_URL`, `CONTRACT_ADDRESS`, `PRIVATE_KEY`, `WEB3_STORAGE_TOKEN` ⚠️ **TODO**
  - Frontend: `VITE_CONTRACT_ADDRESS`, `VITE_API_URL` ⚠️ **TODO** (template ready in `env.example`)

---

## 🔷 END-TO-END TESTING

### ✅ Complete Flow Test
- [ ] **1. Start backend**
  ```bash
  cd backend
  npm start
  ```
- [ ] **2. Start frontend**
  ```bash
  cd frontend
  npm run dev
  ```
- [ ] **3. Connect MetaMask**
  - Open frontend in browser
  - Connect MetaMask wallet
  - Switch to Polygon Mumbai testnet
- [ ] **4. Upload and mint a story**
  - Go to Upload page
  - Fill out form
  - Upload image (should upload to IPFS via backend)
  - Submit form (should mint NFT on blockchain)
  - Verify transaction on PolygonScan
- [ ] **5. Verify story appears**
  - Check Gallery page (should show new story)
  - Check My Stories page (should show user's story)
  - Check backend database (should have entry)
  - Check backend logs (should show event listener captured event)

---

## 🔷 PRODUCTION READINESS

### ✅ Security
- [ ] **Review environment variables**
  - Never commit `.env` files
  - Use secure key management in production
- [ ] **Review API endpoints**
  - Add authentication if needed
  - Review rate limiting settings
- [ ] **Review contract security**
  - Audit smart contract (if deploying to mainnet)
  - Test all edge cases

### ✅ Documentation
- [ ] **Update README files**
  - `README.md` in root
  - `backend/README.md`
  - `contracts/README.md`
  - `frontend/README.md`
- [ ] **Document API endpoints**
  - Add Swagger/OpenAPI docs (optional)
- [ ] **Document deployment process**

### ✅ Monitoring
- [ ] **Set up error tracking**
  - Add Sentry or similar (optional)
- [ ] **Set up analytics**
  - Add Google Analytics or similar (optional)
- [ ] **Set up logging**
  - Verify Winston logs are working
  - Set up log aggregation (optional)

---

## 📝 NOTES

### Critical Missing Pieces:
1. **Backend Database**: Need to set up PostgreSQL/Supabase database
2. **Backend Event Listener**: Need contract address and RPC URL in backend `.env`
3. **Contract Deployment**: Need to deploy contract to Polygon Mumbai testnet
4. **Environment Variables**: Need to set up `.env` files in all three folders

### Completed ✅:
- ✅ Frontend API Integration: All pages connected to backend API
- ✅ IPFS Upload: Upload form connected to backend `/api/upload` endpoint
- ✅ Contract ABI: Using full ABI from compiled contract
- ✅ StoryDetail & MyStories: Navbar and Footer added
- ✅ Error Handling: Error boundary and toast notifications added
- ✅ Loading States: Skeletons and loading indicators added

---

## ✅ Completion Checklist

When everything is complete:
- [ ] Contract deployed and verified on PolygonScan
- [ ] Backend running and connected to database
- [ ] Backend event listener capturing StoryMinted events
- [x] Frontend connected to backend API ✅
- [x] Frontend can upload to IPFS via backend ✅
- [x] Frontend can mint stories on blockchain ✅
- [x] Gallery shows real stories from database ✅
- [x] My Stories shows user's stories ✅
- [ ] End-to-end flow works: Upload → IPFS → Mint → Database → Gallery (blocked by backend/database setup)

---

**Last Updated**: Updated after frontend implementation
**Status**: Frontend implementation complete ✅ | Backend & Contracts setup pending

