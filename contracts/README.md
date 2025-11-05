# Afriverse Tales Smart Contracts

## Overview

Solidity smart contracts for Afriverse Tales NFT collection using OpenZeppelin's ERC721 standard.

## Features

- ✅ ERC721 NFT standard
- ✅ IPFS metadata storage
- ✅ Story minting functionality
- ✅ Royalty mechanism (ERC2981)
- ✅ Admin controls (Ownable)
- ✅ Event emissions for indexing
- ✅ Comprehensive unit tests

## Prerequisites

- Node.js 18+
- npm or yarn
- Hardhat
- MetaMask or wallet with test MATIC

## Installation

```bash
cd contracts
npm install
```

## Configuration

1. Copy environment template:
```bash
cp .env.example .env
```

2. Fill in your `.env` file:
   - `PRIVATE_KEY` - Your wallet private key (for deployment)
   - `MUMBAI_RPC_URL` - Polygon Mumbai RPC endpoint
   - `POLYGONSCAN_API_KEY` - Get from https://polygonscan.com/apikey

## Compilation

```bash
npm run compile
```

## Testing

```bash
npm test
```

## Deployment

### Deploy to Mumbai Testnet

```bash
npm run deploy:mumbai
```

This will:
1. Deploy the contract
2. Display deployment information
3. Provide verification command

### Deploy to Polygon Mainnet

Update `hardhat.config.js` to use Polygon network, then:
```bash
npx hardhat run scripts/deploy.js --network polygon
```

## Verification

After deployment, verify the contract on PolygonScan:

```bash
CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network mumbai "Afriverse Tales" "AFRT" "0xRoyaltyRecipient" 500
```

Or use Hardhat verify plugin directly:
```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS> "Afriverse Tales" "AFRT" "0xRoyaltyRecipient" 500
```

## Contract Addresses

After deployment, save your contract addresses here:

- **Mumbai Testnet**: `0x...`
- **Polygon Mainnet**: `0x...`

## Usage

### Minting a Story

```solidity
// Public mint function
mintStory(
    address to,           // Recipient address
    string ipfsHash,      // IPFS hash of metadata
    string tribe,         // Tribe name (e.g., "Yoruba")
    string language       // Language code (e.g., "en")
)
```

### Retrieving Metadata

```solidity
// Get story metadata
getStoryMetadata(uint256 tokenId) returns (StoryMetadata memory)

// Get IPFS hash
getIPFSHash(uint256 tokenId) returns (string memory)

// Get token URI
tokenURI(uint256 tokenId) returns (string memory)
```

## Events

### StoryMinted

Emitted when a new story is minted:

```solidity
event StoryMinted(
    uint256 indexed tokenId,
    string ipfsHash,
    address indexed author,
    string tribe,
    uint256 timestamp
);
```

This event is compatible with the backend event listener.

## Security Considerations

- ✅ Uses OpenZeppelin's audited contracts
- ✅ Access control via Ownable
- ✅ Input validation
- ✅ Royalty limits (max 100%)
- ✅ Zero address checks

## License

MIT

