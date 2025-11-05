# Afriverse Labs - Monorepo Setup Guide

## ✅ What's Been Set Up

1. **Root `package.json`** - Configured with pnpm workspaces
2. **Root `.gitignore`** - Comprehensive ignore patterns
3. **Root `README.md`** - Monorepo documentation
4. **Workspace names** - Updated to use scoped names:
   - `@afriverse-labs/backend`
   - `@afriverse-labs/contracts`
   - `@afriverse-labs/frontend` (to be created)

## 📋 Next Steps

### 1. Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### 2. Create Frontend Directory Structure

The frontend Next.js app is currently at root level. You have two options:

**Option A: Keep frontend at root (recommended for Next.js)**
- Next.js works well at root level
- Update root `package.json` to treat root as frontend workspace
- Move other files to appropriate workspaces

**Option B: Move to frontend/ directory**
- Create `frontend/` directory
- Move Next.js files there
- Update paths accordingly

### 3. Move Contract Files

Move these files to `contracts/`:
- `hardhat.config.js` → `contracts/hardhat.config.js`
- `scripts/` → `contracts/scripts/`
- `test/` → `contracts/test/`

### 4. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install

# This will install dependencies for:
# - Root (if any)
# - frontend/
# - backend/
# - contracts/
```

### 5. Test Workspace Setup

```bash
# Test frontend
pnpm --filter frontend dev

# Test backend
pnpm --filter backend dev

# Test contracts
pnpm --filter contracts compile
```

## 🔧 Workspace Configuration

### Root Scripts

The root `package.json` includes convenient scripts:

```bash
pnpm dev              # Start frontend
pnpm dev:backend      # Start backend
pnpm build            # Build frontend
pnpm build:contracts # Compile contracts
pnpm test             # Test contracts
```

### Workspace-Specific Commands

```bash
# Run commands in specific workspace
pnpm --filter @afriverse-labs/backend <command>
pnpm --filter @afriverse-labs/contracts <command>
pnpm --filter @afriverse-labs/frontend <command>

# Or use short names
pnpm --filter backend <command>
pnpm --filter contracts <command>
pnpm --filter frontend <command>
```

## 📁 Recommended Structure

```
afriverse-labs/
├── package.json              # Root workspace config
├── README.md                 # Main documentation
├── .gitignore               # Root gitignore
│
├── frontend/                 # Next.js frontend
│   ├── package.json
│   ├── next.config.mjs
│   ├── app/
│   ├── components/
│   └── ...
│
├── backend/                  # Express backend
│   ├── package.json
│   ├── src/
│   └── ...
│
└── contracts/                # Solidity contracts
    ├── package.json
    ├── hardhat.config.js
    ├── contracts/
    ├── scripts/
    └── test/
```

## 🚀 Quick Commands

```bash
# Development
pnpm dev                    # Frontend
pnpm dev:backend           # Backend
pnpm --filter contracts node  # Hardhat node

# Building
pnpm build                 # Frontend
pnpm build:contracts       # Contracts

# Testing
pnpm test                  # Contracts
pnpm --filter backend test # Backend

# Deployment
pnpm deploy:contracts      # Deploy contracts
```

## 💡 Benefits of Monorepo

1. **Shared Dependencies** - Common packages installed once
2. **Easy Imports** - Import contracts ABIs into frontend
3. **Unified CI/CD** - Single repository for deployment
4. **Code Sharing** - Shared utilities and types
5. **Version Management** - Single version for all packages

## 🔗 Cross-Workspace Imports

### Frontend importing Contracts

```typescript
// In frontend code
import contractABI from '@afriverse-labs/contracts/artifacts/AfriverseTales.json'
```

### Backend importing Contracts

```javascript
// In backend code
import contractABI from '@afriverse-labs/contracts/artifacts/AfriverseTales.json'
```

## 📝 Notes

- Workspaces use pnpm by default (fastest and most efficient)
- Each workspace has its own `package.json`
- Environment variables are workspace-specific
- Root-level scripts provide convenient shortcuts

