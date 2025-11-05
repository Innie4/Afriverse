# Contract Deployment Guide

## Prerequisites

1. Get testnet MATIC from [Polygon Faucet](https://faucet.polygon.technology/)
2. Create a `.env` file in the `contracts/` directory with:
   ```
   PRIVATE_KEY=your_private_key_here
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   POLYGONSCAN_API_KEY=your_polygonscan_api_key (optional, for verification)
   ```

## Deploy to Polygon Mumbai Testnet

```bash
cd contracts
npm run deploy:mumbai
```

After deployment, copy the contract address and add it to `frontend/.env`:
```
VITE_CONTRACT_ADDRESS=0x...your_deployed_address
```

## Verify Contract (Optional)

```bash
npm run verify:mumbai <contract_address> "Afriverse Tales" "AFRT" <royalty_recipient> 500
```

## Testing the Mint

1. Start the frontend: `cd frontend && npm run dev`
2. Connect MetaMask wallet (switch to Polygon Mumbai testnet)
3. Fill out the story form
4. Click "Mint Story as NFT"
5. Confirm transaction in MetaMask
6. View on [PolygonScan Mumbai](https://mumbai.polygonscan.com/)

