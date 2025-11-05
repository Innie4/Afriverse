# Afriverse Tales Backend

Node.js backend API for Afriverse Tales - Web3 story indexer and IPFS manager.

## Features

- 🚀 **Express.js REST API** with clean architecture
- 📦 **IPFS Integration** via web3.storage for decentralized file storage
- ⛓️ **Web3 Event Listener** using Ethers.js to listen for StoryMinted events
- 🗄️ **PostgreSQL/Supabase** database for story metadata
- 💾 **Redis Caching** (optional) for faster API responses
- 📝 **Winston Logging** for production-ready logging
- 🛡️ **Rate Limiting** for upload endpoints
- 🔒 **Error Handling** middleware for robust error management

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase)
- Redis (optional, for caching)
- Web3.storage API token
- Ethereum RPC URL (Infura, Alchemy, etc.)
- Smart contract address

## Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration:
- `DATABASE_URL` - PostgreSQL connection string
- `RPC_URL` - Ethereum RPC endpoint
- `CONTRACT_ADDRESS` - Your smart contract address
- `PRIVATE_KEY` - Private key for event listener (optional)
- `WEB3_STORAGE_TOKEN` - Web3.storage API token
- `REDIS_URL` - Redis connection string (optional)

3. **Start the server:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET `/api/stories`
Get all stories with optional filters.

**Query Parameters:**
- `tribe` - Filter by tribe
- `language` - Filter by language  
- `author` - Filter by author address
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Example:**
```bash
GET /api/stories?tribe=Yoruba&language=en&page=1&limit=10
```

**Response:**
```json
{
  "stories": [
    {
      "id": 1,
      "tokenId": 123,
      "ipfsHash": "Qm...",
      "ipfsUrl": "https://ipfs.io/ipfs/Qm...",
      "author": "0x...",
      "tribe": "Yoruba",
      "language": "en",
      "title": "Story Title",
      "description": "Story description",
      "metadata": {...},
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

### GET `/api/stories/:id`
Get story by token ID.

**Example:**
```bash
GET /api/stories/123
```

### GET `/api/stories/stats`
Get story statistics.

**Response:**
```json
{
  "total": 100,
  "byTribe": [
    {"tribe": "Yoruba", "count": 45},
    {"tribe": "Igbo", "count": 30}
  ],
  "byLanguage": [
    {"language": "en", "count": 60},
    {"language": "sw", "count": 40}
  ]
}
```

### POST `/api/upload`
Upload file to IPFS.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (file upload)

**Example:**
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@story.jpg"
```

**Response:**
```json
{
  "success": true,
  "cid": "Qm...",
  "ipfsUrl": "https://ipfs.io/ipfs/Qm...",
  "filename": "story.jpg"
}
```

### POST `/api/upload/metadata`
Upload JSON metadata to IPFS.

**Request:**
```json
{
  "metadata": {
    "name": "Story Title",
    "description": "Story description",
    "image": "ipfs://Qm...",
    "attributes": [...]
  }
}
```

### GET `/api/health`
Health check endpoint.

## Database Schema

The backend automatically creates the following table:

```sql
CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  token_id INTEGER UNIQUE NOT NULL,
  ipfs_hash VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  tribe VARCHAR(100),
  language VARCHAR(50),
  title VARCHAR(500),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

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

When an event is detected:
1. Event data is extracted
2. Metadata is fetched from IPFS (if available)
3. Story is stored in PostgreSQL
4. Cache is invalidated

## Caching

If Redis is configured, the following endpoints are cached:
- `GET /api/stories` - Cached for 5 minutes
- `GET /api/stories/:id` - Cached for 10 minutes
- `GET /api/stories/stats` - Cached for 10 minutes

## Rate Limiting

Upload endpoints are rate-limited:
- **Window:** 15 minutes (configurable)
- **Max Requests:** 10 per window (configurable)

## Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console output (with colors in development)

## Deployment

### Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy!

### Render

1. Create a new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

### Environment Variables for Production

Make sure to set:
- `NODE_ENV=production`
- `DATABASE_URL` - Production database
- `RPC_URL` - Production RPC endpoint
- `CONTRACT_ADDRESS` - Deployed contract address
- `WEB3_STORAGE_TOKEN` - Your API token
- `REDIS_URL` - Production Redis (if using)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # PostgreSQL connection
│   │   ├── logger.js         # Winston logger
│   │   └── cache.js          # Redis cache
│   ├── services/
│   │   ├── ipfs.js          # IPFS upload service
│   │   └── eventListener.js  # Ethers.js event listener
│   ├── controllers/
│   │   ├── storyController.js
│   │   └── uploadController.js
│   ├── routes/
│   │   └── index.js         # Express routes
│   └── index.js             # Main application
├── logs/                    # Log files (auto-created)
├── .env.example
├── package.json
└── README.md
```

## License

ISC

