# Backend Setup Guide

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/windows/)

## Quick Setup

### 1. Install PostgreSQL (if not installed)

**Windows:**
- Download from [PostgreSQL Windows Installer](https://www.postgresql.org/download/windows/)
- During installation, remember the password you set for the `postgres` user
- Default port is `5432`

**Or use Docker:**
```bash
docker run --name postgres-afriverse -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=Afriverse -p 5432:5432 -d postgres:15
```

### 2. Start PostgreSQL Service

**Windows (Service):**
```powershell
# Find your PostgreSQL service name
Get-Service | Where-Object {$_.Name -like "*postgres*"}

# Start it (replace with actual service name)
net start postgresql-x64-15  # or your version number
```

**Or use pgAdmin:**
- Open pgAdmin
- Right-click on PostgreSQL server → Start

### 3. Configure Environment

```bash
cd backend
npm run create-env
```

This creates a `.env` file with default settings. Update it if needed:
- `DATABASE_URL` - Your PostgreSQL connection string
- `RPC_URL` - Your blockchain RPC endpoint
- `CONTRACT_ADDRESS` - Your smart contract address

### 4. Setup Database

```bash
# This will:
# 1. Create the 'Afriverse' database if it doesn't exist
# 2. Create all required tables
# 3. Seed with sample data
npm run setup
```

Or step by step:
```bash
npm run setup-db    # Create database and tables
npm run seed        # Seed sample data
```

### 5. Start the Server

```bash
npm run dev    # Development mode with auto-reload
# or
npm start     # Production mode
```

### 6. Verify Setup

- **Health Check:** http://localhost:3001/api/health
- **Swagger UI:** http://localhost:3001/api-docs
- **Stories API:** http://localhost:3001/api/stories
- **Listings API:** http://localhost:3001/api/marketplace/listings

## Troubleshooting

### PostgreSQL Connection Issues

**Error: `ECONNREFUSED`**
- PostgreSQL is not running
- Start the PostgreSQL service (see step 2 above)
- Verify port 5432 is not blocked by firewall

**Error: `28P01` (Authentication failed)**
- Check username/password in `DATABASE_URL`
- Default: `postgresql://postgres:postgres@localhost:5432/Afriverse`
- Update `.env` with correct credentials

**Error: Database doesn't exist**
- Run `npm run setup-db` to create it automatically
- Or manually: `CREATE DATABASE "Afriverse";`

### Port Already in Use

If port 3001 is already in use:
```bash
# Update PORT in .env file
PORT=3002
```

### Database Seeding Fails

- Ensure PostgreSQL is running
- Ensure database and tables are created (`npm run setup-db`)
- Check `.env` has correct `DATABASE_URL`

## Database Schema

The backend automatically creates these tables:
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

## API Documentation

Once the server is running, visit:
- **Swagger UI:** http://localhost:3001/api-docs

All endpoints are documented with request/response examples.

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration (database, swagger, logger)
│   ├── controllers/   # Request handlers (SOLID/DRY principles)
│   ├── services/      # Business logic
│   ├── routes/        # API routes
│   ├── scripts/       # Setup and seed scripts
│   └── utils/         # Utility functions
├── .env              # Environment variables (create with npm run create-env)
└── package.json      # Dependencies and scripts
```

### Key Scripts

- `npm run create-env` - Create .env file
- `npm run setup-db` - Create database and tables
- `npm run seed` - Seed sample data
- `npm run setup` - Full setup (env + db + seed)
- `npm run dev` - Start development server
- `npm start` - Start production server

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a production PostgreSQL database
3. Set secure `DATABASE_URL` with proper credentials
4. Configure proper `RPC_URL` for your blockchain network
5. Set `CONTRACT_ADDRESS` and `MARKETPLACE_CONTRACT_ADDRESS`
6. Configure Redis for caching (optional but recommended)
7. Set up proper logging and monitoring

## Support

For issues:
1. Check this guide
2. Check error logs in `logs/` directory
3. Verify PostgreSQL is running
4. Verify `.env` configuration
5. Check Swagger docs at `/api-docs` for API details

