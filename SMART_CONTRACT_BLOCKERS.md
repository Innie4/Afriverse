# Smart Contract Blockers & Solutions

This document details all smart contract integration blockers and how to fix them.

---

## 🔴 Critical Blockers

### 1. **Contract Not Deployed / Missing Contract Address**

**Problem:**
- `VITE_CONTRACT_ADDRESS` environment variable is empty or not set
- Frontend falls back to off-chain storage instead of minting NFTs
- Users cannot mint stories on-chain

**Error Messages:**
- "Contract address not configured. Please deploy the contract first."
- "Contract address not configured" in console

**How to Fix:**

1. **Deploy the contract:**
   ```bash
   cd contracts
   npm install
   cp env.example .env
   # Edit .env with your PRIVATE_KEY and MUMBAI_RPC_URL
   npm run deploy:mumbai
   ```

2. **Copy the deployed contract address** from the deployment output

3. **Update frontend `.env` file:**
   ```env
   VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
   VITE_CHAIN_ID=80001  # For Mumbai testnet
   VITE_RPC_URL=https://rpc-mumbai.maticvigil.com
   VITE_CHAIN_NAME=Polygon Mumbai
   VITE_BLOCK_EXPLORER_URL=https://mumbai.polygonscan.com/
   ```

4. **Restart the frontend dev server** to load new environment variables

**Verification:**
- Check browser console for contract address
- Verify contract exists on PolygonScan
- Test minting a story

---

### 2. **Wrong Network Configuration**

**Problem:**
- Frontend defaults to Polygon mainnet (chainId: 137) but contract is on Mumbai testnet (80001)
- Wallet connection fails or switches to wrong network
- Transaction fails with "wrong network" errors

**Error Messages:**
- "User rejected the request" (when switching networks)
- "Network mismatch" errors
- Transaction reverts

**How to Fix:**

1. **For Mumbai Testnet (Recommended for development):**
   ```env
   # frontend/.env
   VITE_CHAIN_ID=80001
   VITE_RPC_URL=https://rpc-mumbai.maticvigil.com
   VITE_CHAIN_NAME=Polygon Mumbai
   VITE_BLOCK_EXPLORER_URL=https://mumbai.polygonscan.com/
   ```

2. **For Polygon Mainnet (Production):**
   ```env
   # frontend/.env
   VITE_CHAIN_ID=137
   VITE_RPC_URL=https://polygon-rpc.com
   VITE_CHAIN_NAME=Polygon
   VITE_BLOCK_EXPLORER_URL=https://polygonscan.com/
   ```

3. **Update `useWeb3.ts` if needed:**
   - The hook automatically switches networks, but ensure RPC URL is correct
   - Test network switching in MetaMask

**Verification:**
- Connect wallet and verify correct network is selected
- Check network ID matches in MetaMask
- Test a transaction

---

### 3. **Missing or Invalid Contract ABI**

**Problem:**
- `AfriverseTales.json` ABI file is missing or outdated
- Contract methods cannot be called
- TypeScript errors about missing ABI

**Error Messages:**
- "Cannot read property 'abi' of undefined"
- "Contract method not found"
- TypeScript compilation errors

**How to Fix:**

1. **Compile the contract:**
   ```bash
   cd contracts
   npm run compile
   ```

2. **Copy the ABI to frontend:**
   ```bash
   # The ABI should be in contracts/artifacts/contracts/AfriverseTales.sol/AfriverseTales.json
   # Copy it to frontend/src/contracts/AfriverseTales.json
   cp contracts/artifacts/contracts/AfriverseTales.sol/AfriverseTales.json frontend/src/contracts/AfriverseTales.json
   ```

3. **Verify ABI structure:**
   - Should have `abi` property with array of function definitions
   - Should include `mintStory` function
   - Should include `StoryMinted` event

**Verification:**
- Check `frontend/src/contracts/AfriverseTales.json` exists
- Verify it has `abi` property
- Check TypeScript compilation passes

---

### 4. **Insufficient Gas / MATIC Balance**

**Problem:**
- User wallet has no MATIC tokens
- Transaction fails due to insufficient funds
- Gas estimation fails

**Error Messages:**
- "insufficient funds for gas"
- "execution reverted"
- "gas required exceeds allowance"

**How to Fix:**

1. **For Mumbai Testnet:**
   - Get free test MATIC from faucets:
     - https://faucet.polygon.technology/
     - https://mumbaifaucet.com/
     - https://faucets.chain.link/mumbai

2. **For Polygon Mainnet:**
   - Purchase MATIC from exchanges
   - Transfer to your wallet
   - Ensure sufficient balance (recommended: 0.1+ MATIC)

3. **Add better error handling:**
   ```typescript
   // In useWeb3.ts mintStory function
   try {
     // Check balance before minting
     const balance = await provider.getBalance(account)
     const gasPrice = await provider.getFeeData()
     const estimatedGas = await contract.mintStory.estimateGas(...)
     const requiredBalance = gasPrice.gasPrice * estimatedGas
     
     if (balance < requiredBalance) {
       return { 
         success: false, 
         error: `Insufficient MATIC. Required: ${ethers.formatEther(requiredBalance)} MATIC` 
       }
     }
   } catch (err) {
     // Handle error
   }
   ```

**Verification:**
- Check wallet balance in MetaMask
- Test transaction with sufficient funds

---

## 🟡 Medium Priority Blockers

### 5. **IPFS Hash Format Issues**

**Problem:**
- IPFS hash passed to contract is in wrong format
- Contract expects plain hash (e.g., "Qm...") but receives "ipfs://Qm..."
- Transaction fails validation

**Error Messages:**
- "IPFS hash cannot be empty" (even when hash exists)
- Transaction reverts silently

**How to Fix:**

1. **In `story-upload-form.tsx`:**
   ```typescript
   // Current code passes metadataCid directly
   const result = await mintStory(metadataCid, formData.tribe, formData.language)
   
   // Ensure IPFS hash is clean (remove ipfs:// prefix if present)
   const cleanHash = metadataCid.replace(/^ipfs:\/\//, '')
   const result = await mintStory(cleanHash, formData.tribe, formData.language)
   ```

2. **Verify IPFS hash format:**
   - Should be plain hash: `QmXxxx...` or `bafybei...`
   - Should NOT include `ipfs://` prefix
   - Should be valid CID format

**Verification:**
- Check IPFS hash format before calling contract
- Verify hash is valid CID
- Test minting with valid hash

---

### 6. **Event Parsing Failures**

**Problem:**
- `StoryMinted` event not found in transaction receipt
- Token ID cannot be extracted from events
- Event parsing throws errors

**Error Messages:**
- "Error parsing event" in console
- Token ID is undefined after minting
- Event not found in logs

**How to Fix:**

1. **Improve event parsing in `useWeb3.ts`:**
   ```typescript
   // Find the StoryMinted event more reliably
   const event = receipt.logs.find((log: any) => {
     try {
       if (!state.contract) return false
       const parsed = state.contract.interface.parseLog(log)
       return parsed?.name === "StoryMinted"
     } catch {
       return false
     }
   })
   
   // Alternative: Use contract's queryFilter
   const filter = state.contract.filters.StoryMinted()
   const events = await state.contract.queryFilter(filter, receipt.blockNumber, receipt.blockNumber)
   if (events.length > 0) {
     tokenId = events[0].args.tokenId.toString()
   }
   ```

2. **Add fallback to get token ID:**
   ```typescript
   // If event parsing fails, try to get token ID from contract
   if (!tokenId) {
     try {
       const totalSupply = await state.contract.totalSupply()
       tokenId = (totalSupply - 1n).toString()
     } catch (err) {
       console.error("Could not get token ID", err)
     }
   }
   ```

**Verification:**
- Check transaction receipt on PolygonScan
- Verify event is emitted
- Test token ID extraction

---

### 7. **Network Switching Issues**

**Problem:**
- MetaMask doesn't automatically switch to correct network
- Network addition fails
- User rejects network switch

**Error Messages:**
- "User rejected the request"
- "Chain ID not found"
- Network switch fails silently

**How to Fix:**

1. **Improve network switching in `useWeb3.ts`:**
   ```typescript
   // Better error handling for network switching
   if (chainId !== CHAIN_ID) {
     try {
       await window.ethereum.request({
         method: "wallet_switchEthereumChain",
         params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
       })
     } catch (switchError: any) {
       if (switchError.code === 4902) {
         // Chain doesn't exist, add it
         try {
           await window.ethereum.request({
             method: "wallet_addEthereumChain",
             params: [{
               chainId: `0x${CHAIN_ID.toString(16)}`,
               chainName: CHAIN_NAME,
               nativeCurrency: {
                 name: "MATIC",
                 symbol: "MATIC",
                 decimals: 18,
               },
               rpcUrls: [RPC_URL],
               blockExplorerUrls: [BLOCK_EXPLORER_URL],
             }],
           })
           // Retry switch after adding
           await window.ethereum.request({
             method: "wallet_switchEthereumChain",
             params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
           })
         } catch (addError) {
           setError(`Failed to add network: ${addError.message}`)
           return false
         }
       } else if (switchError.code === 4001) {
         // User rejected
         setError("Please switch to the correct network to continue")
         return false
       } else {
         setError(`Failed to switch network: ${switchError.message}`)
         return false
       }
     }
   }
   ```

2. **Add user-friendly error messages:**
   - Show clear instructions when network switch is needed
   - Provide manual network addition instructions
   - Add retry button

**Verification:**
- Test network switching with different wallets
- Verify network is added correctly
- Test with user rejection scenario

---

## 🟢 Low Priority / Enhancement Blockers

### 8. **Missing Contract Verification**

**Problem:**
- Contract not verified on PolygonScan
- Users cannot view contract source code
- Contract interaction is less transparent

**How to Fix:**

1. **Verify contract after deployment:**
   ```bash
   cd contracts
   npx hardhat verify --network mumbai <CONTRACT_ADDRESS> "Afriverse Tales" "AFRT" "<ROYALTY_RECIPIENT>" 500
   ```

2. **Or use verification script:**
   ```bash
   CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network mumbai
   ```

**Verification:**
- Check contract on PolygonScan
- Verify source code is visible
- Test contract read functions

---

### 9. **Backend Event Listener Not Running**

**Problem:**
- Backend event listener not started
- Stories minted on-chain not synced to database
- API doesn't return on-chain stories

**Error Messages:**
- "Event listener not initialized"
- Stories missing from API responses

**How to Fix:**

1. **Start event listener in backend:**
   ```bash
   cd backend
   # Ensure .env has correct CONTRACT_ADDRESS and RPC_URL
   npm start
   # Event listener should start automatically if ENABLE_EVENT_LISTENER=true
   ```

2. **Verify event listener configuration:**
   ```env
   # backend/.env
   ENABLE_EVENT_LISTENER=true
   CONTRACT_ADDRESS=0xYourContractAddress
   RPC_URL=https://rpc-mumbai.maticvigil.com
   PRIVATE_KEY=your_private_key_for_listener
   ```

3. **Check event listener logs:**
   - Should see "Event listener started" message
   - Should see "Listening for StoryMinted events"
   - Check for any connection errors

**Verification:**
- Check backend logs for event listener status
- Mint a story and verify it appears in database
- Check API returns on-chain stories

---

### 10. **Gas Estimation Failures**

**Problem:**
- Gas estimation fails before transaction
- User cannot see estimated gas cost
- Transaction fails due to gas issues

**How to Fix:**

1. **Add gas estimation:**
   ```typescript
   // In useWeb3.ts mintStory function
   try {
     // Estimate gas first
     const estimatedGas = await state.contract.mintStory.estimateGas(
       state.account,
       ipfsHash,
       tribe,
       language
     )
     
     // Add 20% buffer
     const gasLimit = estimatedGas + (estimatedGas * 20n / 100n)
     
     // Execute with estimated gas
     const tx = await state.contract.mintStory(
       state.account,
       ipfsHash,
       tribe,
       language,
       { gasLimit }
     )
   } catch (err) {
     // Handle estimation errors
   }
   ```

2. **Show gas estimate to user:**
   - Display estimated gas cost before transaction
   - Show in MATIC equivalent
   - Allow user to adjust gas limit

**Verification:**
- Test gas estimation for different scenarios
- Verify gas costs are reasonable
- Test with low gas scenarios

---

## 📋 Quick Checklist

Before deploying to production, ensure:

- [ ] Contract is deployed to target network
- [ ] `VITE_CONTRACT_ADDRESS` is set in frontend `.env`
- [ ] Network configuration matches deployment network
- [ ] Contract ABI is up-to-date in frontend
- [ ] Contract is verified on PolygonScan
- [ ] Backend event listener is configured and running
- [ ] IPFS hash format is correct (no `ipfs://` prefix)
- [ ] Gas estimation and error handling is improved
- [ ] Network switching works correctly
- [ ] User has sufficient MATIC balance
- [ ] Event parsing works reliably
- [ ] Error messages are user-friendly

---

## 🔧 Testing Steps

1. **Test Contract Deployment:**
   ```bash
   cd contracts
   npm run deploy:mumbai
   ```

2. **Test Frontend Integration:**
   - Set environment variables
   - Connect wallet
   - Verify network switching
   - Test minting a story

3. **Test Event Listener:**
   - Start backend
   - Mint a story from frontend
   - Verify story appears in database
   - Check API returns the story

4. **Test Error Scenarios:**
   - Test with no contract address
   - Test with wrong network
   - Test with insufficient funds
   - Test with invalid IPFS hash

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Polygon Mumbai Faucet](https://faucet.polygon.technology/)
- [PolygonScan](https://polygonscan.com/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

---

## 🆘 Common Error Solutions

### "Contract address not configured"
→ Deploy contract and set `VITE_CONTRACT_ADDRESS`

### "User rejected the request"
→ User needs to approve network switch or transaction

### "Insufficient funds"
→ Get MATIC from faucet (testnet) or purchase (mainnet)

### "Network mismatch"
→ Update `VITE_CHAIN_ID` to match deployment network

### "IPFS hash cannot be empty"
→ Ensure IPFS upload succeeds and hash is passed correctly

### "Event not found"
→ Improve event parsing or use contract query methods

---

**Last Updated:** 2025-01-27

