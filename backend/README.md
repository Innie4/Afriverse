# Afriverse Tales Backend

Node.js backend API for Afriverse Tales - Web3 story indexer and IPFS manager.

## Features

- 🚀 **Express.js REST API** with clean architecture
- 📦 **IPFS Integration** via web3.storage for decentralized file storage
- ⛓️ **Web3 Event Listener** using Ethers.js to listen for StoryMinted events
- 🗄️ **Supabase Database** - Managed PostgreSQL (no local installation needed!)
- 💾 **Redis Caching** (optional) for faster API responses
- 📝 **Winston Logging** for production-ready logging
- 🛡️ **Rate Limiting** for upload endpoints
- 🔒 **Error Handling** middleware for robust error management
- 📚 **Swagger UI** for API documentation

## Prerequisites

- Node.js 18+
- Supabase account (free tier available)
- Web3.storage API token (optional)
- Ethereum RPC URL (Infura, Alchemy, etc.)
- Smart contract address

## Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Get your connection string from: **Settings → Database → Connection string (URI)**

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
npm run create-env
```

Then edit `.env` and add your Supabase connection string:
```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:YOUR_PASSWORD@aws-0-[REGION].pooler.supabase.com:6543/postgres
USE_SUPABASE=true
```

### 4. Setup Database

```bash
npm run setup-db    # Creates all tables
npm run seed        # Seeds sample data
```

Or run both:
```bash
npm run setup
```

### 5. Start Server

```bash
npm run dev    # Development mode with auto-reload
# or
npm start     # Production mode
```

## Documentation

- **Quick Start:** See `QUICKSTART.md`
- **Supabase Setup:** See `SUPABASE_SETUP.md` (detailed guide)
- **Full Setup:** See `SETUP.md`
- **API Docs:** http://localhost:3001/api-docs (when server is running)

## Available Scripts

```bash
npm run create-env      # Create .env file
npm run setup-db        # Create database tables
npm run seed            # Seed sample data
npm run setup           # Full setup (env + db + seed)
npm run dev             # Start development server
npm start               # Start production server
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Stories
```
GET    /api/stories              # Get all stories
GET    /api/stories/:id          # Get story by token ID
GET    /api/stories/stats        # Get story statistics
POST   /api/stories              # Create story (off-chain)
```

### Marketplace
```
GET    /api/marketplace/listings              # Get all listings
GET    /api/marketplace/listings/:id          # Get listing by ID
POST   /api/marketplace/listings              # Create listing
PATCH  /api/marketplace/listings/:id/status   # Update listing status
POST   /api/marketplace/sales                 # Record sale
GET    /api/marketplace/sales                 # Get sales history
GET    /api/marketplace/offers/:tokenId       # Get offers
POST   /api/marketplace/offers                # Create offer
GET    /api/marketplace/price-history/:tokenId # Get price history
GET    /api/marketplace/users/:address/nfts   # Get user's NFTs
```

### Upload
```
POST   /api/upload              # Upload file to IPFS
POST   /api/upload/metadata     # Upload JSON metadata to IPFS
```

### Notifications
```
GET    /api/notifications/:address           # Get notifications
PATCH  /api/notifications/:id/read           # Mark as read
PATCH  /api/notifications/:address/read-all  # Mark all as read
GET    /api/notifications/:address/unread-count # Get unread count
```

See Swagger UI at `/api-docs` for complete API documentation.

## Database Schema

The backend automatically creates these tables in Supabase:
- `stories` - Story/NFT metadata
- `listings` - Marketplace listings
- `sales` - Sales history
- `offers` - Offers on NFTs
- `bundles` - Bundle purchases
- `notifications` - User notifications
- `licenses` - License presets
- `releases` - Compliance releases
- `provenance` - Content provenance
- `lazy_mints` - Lazy minting records
- And more...

## Event Listener

The backend automatically listens for `StoryMinted` events from your smart contract and stores them in the database.

**Event Signature:**
```solidity
event StoryMinted(
  uint256 indexed tokenId,
  string ipfsHash,
  address indexed author,
  string tribe,
  uint256 timestamp
);
```

Configure in `.env`:
```env
RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0xYourContractAddress
ENABLE_EVENT_LISTENER=true
```

## Architecture

### SOLID Principles Applied

- **Single Responsibility:** Each controller handles one resource
- **Open/Closed:** Easy to extend with new modules
- **Liskov Substitution:** Consistent response handlers
- **Interface Segregation:** Focused service interfaces
- **Dependency Inversion:** Database abstraction layer

### DRY (Don't Repeat Yourself)

- Centralized response handlers (`sendSuccess`, `sendError`, etc.)
- `asyncHandler` wrapper for error handling
- Reusable database query functions
- Shared utility functions

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (database, swagger, logger)
│   ├── controllers/      # Request handlers (SOLID/DRY principles)
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── scripts/          # Setup and seed scripts
│   └── utils/            # Utility functions
├── scripts/              # Setup scripts
├── .env                  # Environment variables
└── package.json          # Dependencies and scripts
```

## Troubleshooting

### Supabase Connection Issues

**Error: `ENOTFOUND` or `ETIMEDOUT`**
- Check your internet connection
- Verify connection string is correct
- Check if Supabase project is paused (restore in dashboard)

**Error: `28P01` (Authentication failed)**
- Verify password in connection string
- Reset password in Supabase Dashboard if needed

**Error: SSL required**
- Ensure `USE_SUPABASE=true` is in `.env`
- Code automatically handles SSL for Supabase

### Port Already in Use

Change port in `.env`:
```
PORT=3002
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use production Supabase project
3. Set secure `DATABASE_URL` with proper credentials
4. Configure proper `RPC_URL` for your blockchain network
5. Set `CONTRACT_ADDRESS` and `MARKETPLACE_CONTRACT_ADDRESS`
6. Configure Redis for caching (optional but recommended)
7. Set up proper logging and monitoring

## Support

For issues:
1. Check `QUICKSTART.md` for quick setup
2. Check `SUPABASE_SETUP.md` for database setup
3. Check error logs in `logs/` directory
4. Verify `.env` configuration
5. Check Swagger docs at `/api-docs` for API details

## License

ISC
