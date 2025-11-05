# Afriverse Labs - Monorepo

> Web3 storytelling platform for preserving African narratives as NFTs

## 📁 Project Structure

```
afriverse-labs/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js API + IPFS + blockchain utils
└── contracts/         # Solidity smart contracts (Hardhat)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL (or Supabase)
- Redis (optional, for caching)

### Installation

```bash
# Install all dependencies
pnpm install

# Or install individually
pnpm --filter frontend install
pnpm --filter backend install
pnpm --filter contracts install
```

### Development

```bash
# Start frontend (Next.js)
pnpm dev

# Start backend (Express)
pnpm dev:backend

# Compile contracts
pnpm build:contracts

# Run tests
pnpm test
```

## 📦 Workspaces

This monorepo uses [pnpm workspaces](https://pnpm.io/workspaces) to manage multiple packages:

- **frontend** - Next.js React application
- **backend** - Node.js Express API server
- **contracts** - Solidity smart contracts with Hardhat

### Workspace Commands

```bash
# Run command in specific workspace
pnpm --filter frontend <command>
pnpm --filter backend <command>
pnpm --filter contracts <command>

# Run command in all workspaces
pnpm -r <command>
```

## 🏗️ Architecture

### Frontend (`frontend/`)
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion, Lottie
- **Features**:
  - Story gallery and browsing
  - Story upload and minting
  - Wallet integration (Web3)
  - Responsive design

### Backend (`backend/`)
- **Framework**: Express.js
- **Database**: PostgreSQL/Supabase
- **IPFS**: web3.storage
- **Blockchain**: Ethers.js event listener
- **Caching**: Redis (optional)
- **Features**:
  - REST API for stories
  - IPFS upload service
  - Smart contract event indexing
  - Rate limiting and logging

### Contracts (`contracts/`)
- **Framework**: Hardhat
- **Standard**: ERC721 (OpenZeppelin)
- **Network**: Polygon Mumbai / Polygon Mainnet
- **Features**:
  - Story minting
  - IPFS metadata storage
  - Royalty mechanism (ERC2981)
  - Admin controls (Ownable)

## 🔧 Configuration

### Environment Variables

Each workspace has its own `.env` file:

- `frontend/.env.local` - Frontend environment variables
- `backend/.env` - Backend configuration
- `contracts/.env` - Contract deployment keys

See individual README files for detailed configuration.

## 📚 Documentation

- [Frontend README](./frontend/README.md) - Frontend setup and usage
- [Backend README](./backend/README.md) - API documentation
- [Contracts README](./contracts/README.md) - Smart contract documentation

## 🧪 Testing

```bash
# Test contracts
pnpm test

# Test backend
pnpm test:backend

# Test frontend
pnpm --filter frontend test
```

## 🚢 Deployment

### Frontend
Deploy to Vercel, Netlify, or any Next.js hosting platform.

### Backend
Deploy to Railway, Render, or any Node.js hosting platform.

### Contracts
Deploy to Polygon Mumbai or Polygon Mainnet using Hardhat.

See individual README files for deployment instructions.

## 📝 Scripts

### Root Level Scripts

```bash
pnpm dev              # Start frontend dev server
pnpm dev:backend      # Start backend server
pnpm build            # Build frontend
pnpm build:contracts # Compile contracts
pnpm test             # Test contracts
pnpm lint             # Lint frontend
```

### Workspace-Specific Scripts

```bash
# Frontend
pnpm --filter frontend dev
pnpm --filter frontend build

# Backend
pnpm --filter backend start
pnpm --filter backend test

# Contracts
pnpm --filter contracts compile
pnpm --filter contracts test
pnpm --filter contracts deploy:mumbai
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Submit a pull request

## 📄 License

MIT

## 🔗 Links

- [Frontend Documentation](./frontend/README.md)
- [Backend API Documentation](./backend/README.md)
- [Smart Contract Documentation](./contracts/README.md)

