# Quick Start Guide

## Step 1: Install Dependencies

```bash
cd contracts
npm install
```

## Step 2: Configure Environment

```bash
cp env.example .env
# Edit .env with your credentials
```

Required variables:
- `PRIVATE_KEY` - Your wallet private key (for deployment)
- `MUMBAI_RPC_URL` - Get from https://alchemy.com or https://infura.io
- `POLYGONSCAN_API_KEY` - Get from https://polygonscan.com/apikey

## Step 3: Compile Contracts

```bash
npm run compile
```

## Step 4: Run Tests

```bash
npm test
```

Expected output: All tests should pass ✅

## Step 5: Deploy to Mumbai Testnet

```bash
npm run deploy:mumbai
```

This will:
1. Deploy the contract
2. Show contract address
3. Provide verification command

## Step 6: Verify Contract

After deployment, copy the contract address and run:

```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS> "Afriverse Tales" "AFRT" "<ROYALTY_RECIPIENT>" 500
```

Replace:
- `<CONTRACT_ADDRESS>` - From deployment output
- `<ROYALTY_RECIPIENT>` - Address that receives royalties

## Step 7: Update Backend

Update your backend `.env` file:
```env
CONTRACT_ADDRESS=<deployed_contract_address>
RPC_URL=<your_mumbai_rpc_url>
```

## Testing the Contract

### Using Hardhat Console

```bash
npx hardhat console --network mumbai
```

Then:
```javascript
const AfriverseTales = await ethers.getContractAt("AfriverseTales", "0x...");
await AfriverseTales.mintStory("0x...", "QmTestHash", "Yoruba", "en");
```

### Using PolygonScan

1. Go to https://mumbai.polygonscan.com
2. Find your contract
3. Go to "Contract" tab
4. Use "Write Contract" to interact

## Troubleshooting

### "Insufficient funds"
- Get test MATIC from https://faucet.polygon.technology/

### "Contract verification failed"
- Ensure constructor arguments match exactly
- Wait a few minutes after deployment

### "Nonce too high"
- Reset MetaMask account or use a different account

## Next Steps

1. ✅ Deploy contract
2. ✅ Verify on PolygonScan
3. ✅ Update backend with contract address
4. ✅ Test minting via frontend
5. ✅ Monitor events in backend

