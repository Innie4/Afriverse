import { useState, useEffect } from "react"
import { BrowserProvider, Contract, ethers } from "ethers"
import AfriverseTalesABI from "@/contracts/AfriverseTales.json"

// Polygon Mumbai testnet configuration
const MUMBAI_CHAIN_ID = 80001
const MUMBAI_RPC = "https://rpc-mumbai.maticvigil.com"

// Contract address from environment variable
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ""

export interface Web3State {
  account: string | null
  provider: BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  isConnected: boolean
  chainId: number | null
  contract: Contract | null
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    account: null,
    provider: null,
    signer: null,
    isConnected: false,
    chainId: null,
    contract: null,
  })

  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if MetaMask is installed
  const checkMetaMask = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      return true
    }
    return false
  }

  // Connect wallet
  const connectWallet = async () => {
    if (!checkMetaMask()) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return false
    }

    setIsConnecting(true)
    setError(null)

    try {
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)

      // Check if on Mumbai testnet
      if (chainId !== MUMBAI_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${MUMBAI_CHAIN_ID.toString(16)}` }],
          })
        } catch (switchError: any) {
          // Chain doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${MUMBAI_CHAIN_ID.toString(16)}`,
                  chainName: "Polygon Mumbai",
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  rpcUrls: [MUMBAI_RPC],
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            })
          }
        }
      }

      const contract = CONTRACT_ADDRESS
        ? new Contract(CONTRACT_ADDRESS, AfriverseTalesABI.abi, signer)
        : null

      setState({
        account: accounts[0],
        provider,
        signer,
        isConnected: true,
        chainId,
        contract,
      })

      return true
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setState({
      account: null,
      provider: null,
      signer: null,
      isConnected: false,
      chainId: null,
      contract: null,
    })
    setError(null)
  }

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setState((prev) => ({ ...prev, account: accounts[0] }))
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  // Mint story function
  const mintStory = async (
    ipfsHash: string,
    tribe: string,
    language: string
  ): Promise<{ success: boolean; tokenId?: string; txHash?: string; error?: string }> => {
    if (!state.contract || !state.account) {
      return { success: false, error: "Wallet not connected" }
    }

    if (!CONTRACT_ADDRESS) {
      return {
        success: false,
        error: "Contract address not configured. Please deploy the contract first.",
      }
    }

    try {
      const tx = await state.contract.mintStory(state.account, ipfsHash, tribe, language)
      const receipt = await tx.wait()

      // Find the StoryMinted event
      const event = receipt.logs.find(
        (log: any) => {
          try {
            const parsed = state.contract!.interface.parseLog(log)
            return parsed?.name === "StoryMinted"
          } catch {
            return false
          }
        }
      )

      let tokenId: string | undefined
      if (event && state.contract) {
        try {
          const decoded = state.contract.interface.parseLog(event)
          tokenId = decoded?.args.tokenId?.toString()
        } catch (err) {
          console.error("Error parsing event:", err)
        }
      }

      return {
        success: true,
        tokenId,
        txHash: receipt.hash,
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to mint story",
      }
    }
  }

  return {
    ...state,
    error,
    isConnecting,
    connectWallet,
    disconnectWallet,
    mintStory,
    checkMetaMask,
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}

