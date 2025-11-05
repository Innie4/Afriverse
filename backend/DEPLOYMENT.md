# Afriverse Tales Backend API

Complete Node.js backend for Afriverse Tales - Web3 story indexer and IPFS manager.

## 🚀 Quick Start

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your credentials
npm run check-config
npm start
```

## 📋 Features

- ✅ Express.js REST API
- ✅ IPFS uploads via web3.storage
- ✅ Web3 event listener (Ethers.js)
- ✅ PostgreSQL/Supabase database
- ✅ Redis caching (optional)
- ✅ Winston logging
- ✅ Rate limiting
- ✅ Error handling middleware

## 📁 Project Structure

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
├── scripts/
│   └── check-config.js      # Configuration checker
├── logs/                    # Log files
├── env.example              # Environment template
├── package.json
└── README.md
```

## 🔧 Configuration

See `DEPLOYMENT.md` for detailed setup instructions.

## 📚 API Documentation

See `README.md` for complete API documentation.

## 🚢 Deployment

See `DEPLOYMENT.md` for Railway, Render, and other deployment options.

