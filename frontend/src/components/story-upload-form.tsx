import { useState } from "react"
import { Upload, Loader2, Wallet, ExternalLink, CheckCircle2 } from "lucide-react"
import { SuccessAnimation, TransactionAnimation } from "@/components/lottie-animations"
import { useWeb3 } from "@/hooks/useWeb3"
import { motion, AnimatePresence } from "framer-motion"
import { uploadFileToIPFS, uploadMetadataToIPFS } from "@/services/api"
import { toast } from "sonner"

interface FormData {
  title: string
  author: string
  category: string
  description: string
  content: string
  image?: File
  tags: string
  tribe: string
  language: string
}

const categories = [
  "Folklore",
  "Contemporary",
  "Historical",
  "Educational",
  "Cultural",
  "Personal",
  "Fiction",
  "Poetry",
]

// Upload story to IPFS via backend
async function uploadToIPFS(formData: FormData): Promise<string> {
  try {
    // Step 1: Upload image if provided
    let imageHash = ""
    if (formData.image) {
      const imageResult = await uploadFileToIPFS(formData.image)
      imageHash = imageResult.cid
      toast.success("Image uploaded to IPFS")
    }

    // Step 2: Create metadata JSON
    const metadata = {
      name: formData.title,
      description: formData.description,
      image: imageHash ? `ipfs://${imageHash}` : "",
      attributes: [
        { trait_type: "Category", value: formData.category },
        { trait_type: "Tribe", value: formData.tribe },
        { trait_type: "Language", value: formData.language },
        { trait_type: "Author", value: formData.author },
        ...(formData.tags ? [{ trait_type: "Tags", value: formData.tags }] : []),
      ],
      content: formData.content,
    }

    // Step 3: Upload metadata to IPFS
    const metadataResult = await uploadMetadataToIPFS(metadata)
    toast.success("Metadata uploaded to IPFS")
    
    return metadataResult.cid
  } catch (error: any) {
    toast.error(error.message || "Failed to upload to IPFS")
    throw error
  }
}

export default function StoryUploadForm() {
  const { isConnected, account, connectWallet, mintStory, error: web3Error, checkMetaMask } = useWeb3()
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    category: "",
    description: "",
    content: "",
    tags: "",
    tribe: "",
    language: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showTransaction, setShowTransaction] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [tokenId, setTokenId] = useState<string | null>(null)
  const [step, setStep] = useState<"form" | "uploading" | "minting" | "success">("form")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Story title is required")
      return false
    }
    if (!formData.author.trim()) {
      setError("Author name is required")
      return false
    }
    if (!formData.category) {
      setError("Please select a category")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
      return false
    }
    if (!formData.content.trim()) {
      setError("Story content is required")
      return false
    }
    if (!formData.tribe.trim()) {
      setError("Tribe/cultural group is required")
      return false
    }
    if (!formData.language.trim()) {
      setError("Language is required")
      return false
    }
    if (!isConnected) {
      setError("Please connect your wallet first")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    setStep("uploading")

    try {
      // Step 1: Upload to IPFS
      const ipfsHash = await uploadToIPFS(formData)
      
      setStep("minting")
      setShowTransaction(true)

      // Step 2: Mint NFT on blockchain
      const result = await mintStory(ipfsHash, formData.tribe, formData.language)

      if (result.success && result.txHash) {
        setTxHash(result.txHash)
        setTokenId(result.tokenId || null)
        setStep("success")
        setShowTransaction(false)
        setSuccess(true)
        toast.success("Story minted successfully!")
        
        // Reset form
        setFormData({
          title: "",
          author: "",
          category: "",
          description: "",
          content: "",
          tags: "",
          tribe: "",
          language: "",
        })
        setImagePreview(null)
        
        setTimeout(() => {
          setSuccess(false)
          setStep("form")
        }, 5000)
      } else {
        const errorMsg = result.error || "Failed to mint story"
        setError(errorMsg)
        toast.error(errorMsg)
        setStep("form")
        setShowTransaction(false)
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to upload story. Please try again."
      setError(errorMsg)
      toast.error(errorMsg)
      setStep("form")
      setShowTransaction(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getPolygonScanUrl = (hash: string) => {
    return `https://mumbai.polygonscan.com/tx/${hash}`
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wallet Connection Banner */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3">
              <Wallet size={24} className="text-accent" />
              <div>
                <p className="font-semibold text-sm">Connect Wallet to Mint</p>
                <p className="text-xs text-muted-foreground">
                  {checkMetaMask() ? "Connect your MetaMask wallet to continue" : "Install MetaMask to mint your story"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={connectWallet}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm"
            >
              {checkMetaMask() ? "Connect Wallet" : "Install MetaMask"}
            </button>
          </motion.div>
        )}

        {/* Connected Wallet Info */}
        {isConnected && account && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-primary" />
              <div>
                <p className="font-semibold text-sm">Wallet Connected</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">Polygon Mumbai</span>
          </motion.div>
        )}

        {/* Transaction Confirmation Animation */}
        <AnimatePresence>
          {showTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-xl p-8 shadow-xl flex flex-col items-center gap-4 max-w-md mx-4"
              >
                <div className="w-32 h-32">
                  <TransactionAnimation className="w-full h-full" />
                </div>
                <p className="font-semibold text-lg">Minting Your Story...</p>
                <p className="text-sm text-muted-foreground text-center">
                  {step === "uploading" && "Uploading to IPFS..."}
                  {step === "minting" && "Transaction in progress. Please confirm in MetaMask."}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-lg bg-primary/10 border border-primary text-primary"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <SuccessAnimation className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-2">Story Minted Successfully! 🎉</p>
                  <p className="text-sm mb-4">Your story has been permanently recorded on the blockchain.</p>
                  {txHash && (
                    <div className="space-y-2">
                      {tokenId && (
                        <p className="text-sm">
                          <span className="font-medium">Token ID:</span> #{tokenId}
                        </p>
                      )}
                      <a
                        href={getPolygonScanUrl(txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        View on PolygonScan <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {(error || web3Error) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive"
            >
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error || web3Error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">Story Cover Image</label>
          <div className="relative border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                />
                <p className="text-sm text-muted-foreground">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload size={32} className="text-muted-foreground mx-auto" />
                <p className="font-medium">Drag and drop your image here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Story Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your story title"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-semibold mb-2">
            Author Name *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="Your name or pen name"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tribe */}
        <div>
          <label htmlFor="tribe" className="block text-sm font-semibold mb-2">
            Tribe/Cultural Group *
          </label>
          <input
            type="text"
            id="tribe"
            name="tribe"
            value={formData.tribe}
            onChange={handleInputChange}
            placeholder="e.g., Yoruba, Zulu, Akan, etc."
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-semibold mb-2">
            Language *
          </label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            placeholder="e.g., English, Swahili, Yoruba, etc."
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief summary of your story (max 200 characters)"
            maxLength={200}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/200</p>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-semibold mb-2">
            Story Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your complete story here..."
            rows={10}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.content.length} characters</p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-semibold mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., folklore, mythology, cultural, separated by commas"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isConnected}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {step === "uploading" && "Uploading to IPFS..."}
              {step === "minting" && "Minting Your Story..."}
            </>
          ) : (
            <>
              <Upload size={20} />
              Mint Story as NFT
            </>
          )}
        </button>

        {/* Info */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Before you mint:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Ensure your story is original and copyright-free</li>
            <li>Cover image should be at least 1200x800px</li>
            <li>You retain full ownership of your story</li>
            <li>Your story will be permanently stored on Polygon Mumbai testnet</li>
            <li>Connect your MetaMask wallet to Polygon Mumbai network</li>
          </ul>
        </div>
      </form>
    </div>
  )
}
