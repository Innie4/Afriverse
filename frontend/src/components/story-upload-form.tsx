import { useEffect, useMemo, useRef, useState } from "react"
import {
  Upload,
  Loader2,
  Wallet,
  ExternalLink,
  CheckCircle2,
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  Quote,
  Save,
  Undo,
  Redo,
  BookOpen,
} from "lucide-react"
import { SuccessAnimation, TransactionAnimation } from "@/components/lottie-animations"
import { useWeb3 } from "@/hooks/useWeb3"
import { motion, AnimatePresence } from "framer-motion"
import { uploadFileToIPFS, uploadMetadataToIPFS, createStoryOffchain } from "@/services/api"
import { toast } from "sonner"
import { AFRICAN_TRIBES } from "@/data/tribes"
import { AFRICAN_LANGUAGES } from "@/data/languages"
import { AFRICAN_GENRES } from "@/data/genres"
import type { SelectOption } from "@/data/select-options"
import { SearchableSelect } from "@/components/searchable-select"
import { SearchableMultiSelect } from "@/components/searchable-multi-select"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { cn } from "@/lib/utils"

type ExpressionType = "writer" | "artist" | "folklore" | "filmmaker"

interface StoryFormState {
  title: string
  author: string
  category: string
  description: string
  image?: File
  tags: string
  tribe: string
  language: string
  expressionType: ExpressionType
}

interface Chapter {
  id: string
  title: string
  content: string
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

const DRAFT_STORAGE_KEY = "afriverse-tales-story-draft"

const expressionOptions: Array<{ value: ExpressionType; label: string; description: string }> = [
  {
    value: "writer",
    label: "Writers & Poets",
    description: "Draft prose, poetry, essays, or narrative anthologies.",
  },
  {
    value: "artist",
    label: "Visual Artists",
    description: "Document visual concepts, mood boards, and creative process notes.",
  },
  {
    value: "folklore",
    label: "Folklore Curators",
    description: "Transcribe oral histories, myths, and cultural rituals.",
  },
  {
    value: "filmmaker",
    label: "Filmmakers & Musicians",
    description: "Share storyboards, scripts, lyric sheets, or track listings.",
  },
]

const expressionDetails: Record<
  ExpressionType,
  {
    sectionHeading: string
    sectionName: string
    chapterPlaceholder: string
    toolbarHint: string
  }
> = {
  writer: {
    sectionHeading: "Chapters for writers & poets",
    sectionName: "Chapter",
    chapterPlaceholder: "Write narrative passages, dialogue, poetry, or essays using markdown formatting.",
    toolbarHint: "Use bold for emphasis, italics for tone, bullet lists for motifs, and quotes for oral recitations.",
  },
  artist: {
    sectionHeading: "Visual concept notes & canvases",
    sectionName: "Canvas Note",
    chapterPlaceholder: "Describe each artwork’s medium, palette, cultural influence, or showcase concept sketches.",
    toolbarHint: "List materials, embed references, and quote collaborator notes to track your creative process.",
  },
  folklore: {
    sectionHeading: "Oral histories & folklore transcriptions",
    sectionName: "Story Section",
    chapterPlaceholder: "Transcribe oral traditions, storyteller notes, context, and cultural significance.",
    toolbarHint: "Capture narrator names, locations, and ritual details using headings, lists, and blockquotes.",
  },
  filmmaker: {
    sectionHeading: "Scenes, scripts, and soundscapes",
    sectionName: "Scene",
    chapterPlaceholder: "Break down scenes, storyboards, lyric sheets, tracklists, and production notes.",
    toolbarHint: "Use headings for scenes, bullet lists for beats, and blockquotes for dialogue or lyric snippets.",
  },
}

const createChapter = (index: number): Chapter => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `chapter-${Date.now()}-${index}`,
  title: `Chapter ${index + 1}`,
  content: "",
})

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()

export default function StoryUploadForm() {
  const { isConnected, account, connectWallet, mintStory, error: web3Error, checkMetaMask } = useWeb3()

  const [formData, setFormData] = useState<StoryFormState>({
    title: "",
    author: "",
    category: "",
    description: "",
    tags: "",
    tribe: "",
    language: "",
    expressionType: "writer",
  })
  const [chapters, setChapters] = useState<Chapter[]>([createChapter(0)])
  const textAreaRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map())
  const undoStack = useRef<Record<string, string[]>>({})
  const redoStack = useRef<Record<string, string[]>>({})
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [showTransaction, setShowTransaction] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [tokenId, setTokenId] = useState<string | null>(null)
  const [step, setStep] = useState<"form" | "uploading" | "minting" | "success">("form")

  const expressionConfig = expressionDetails[formData.expressionType]
  const activeExpression = expressionOptions.find((option) => option.value === formData.expressionType)
  const tribeOptions = useMemo<SelectOption[]>(() => AFRICAN_TRIBES, [])
  const languageOptions = useMemo<SelectOption[]>(() => AFRICAN_LANGUAGES, [])
  const genreOptions = useMemo<SelectOption[]>(() => AFRICAN_GENRES, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!storedDraft) return
    try {
      const parsed = JSON.parse(storedDraft) as {
        formData: StoryFormState
        chapters: Chapter[]
        imagePreview?: string
        selectedGenres?: string[]
      }
      if (parsed.formData) {
        setFormData({ ...parsed.formData, image: undefined })
      }
      if (Array.isArray(parsed.chapters) && parsed.chapters.length > 0) {
        setChapters(
          parsed.chapters.map((chapter, index) => ({
            id: chapter.id ?? createChapter(index).id,
            title: chapter.title ?? `Chapter ${index + 1}`,
            content: chapter.content ?? "",
          }))
        )
      }
      if (parsed.imagePreview) {
        setImagePreview(parsed.imagePreview)
      }
      const draftGenres = Array.isArray(parsed.selectedGenres) ? parsed.selectedGenres : []
      if (draftGenres.length > 0) {
        setSelectedGenres(draftGenres)
        setFormData((previous) => ({ ...previous, tags: draftGenres.join(", ") }))
      }
      toast.info("Draft restored from your previous session.")
    } catch (draftError) {
      console.warn("Unable to parse draft storage", draftError)
    }
  }, [])

  const persistDraft = () => {
    if (typeof window === "undefined") return
    const payload = {
      formData: { ...formData, image: undefined },
      chapters,
      imagePreview,
      selectedGenres,
    }
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload))
    toast.success("Draft saved locally.")
  }

  const clearDraft = (silent = false) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY)
    }
    undoStack.current = {}
    redoStack.current = {}
    setSelectedGenres([])
    if (!silent) {
      toast.success("Draft cleared.")
    }
  }

  useEffect(() => {
    setChapters((previous) =>
      previous.map((chapter, index) => {
        const defaultTitles = Object.values(expressionDetails).map((detail) => `${detail.sectionName} ${index + 1}`)
        if (defaultTitles.includes(chapter.title) || chapter.title.trim().length === 0) {
          return { ...chapter, title: `${expressionDetails[formData.expressionType].sectionName} ${index + 1}` }
        }
        return chapter
      })
    )
  }, [formData.expressionType])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
    setError("")
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validate image size (1200x800)
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      if (img.width !== 1200 || img.height !== 800) {
        setFieldErrors((prev) => ({
          ...prev,
          image: `Image must be exactly 1200x800 pixels. Current size: ${img.width}x${img.height}px`
        }))
        setImagePreview(null)
        event.target.value = ""
        return
      }
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next.image
        return next
      })
      setFormData((previous) => ({
        ...previous,
        image: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      setFieldErrors((prev) => ({
        ...prev,
        image: "Invalid image file"
      }))
      event.target.value = ""
    }
    img.src = objectUrl
  }

  const setTextAreaRef = (id: string) => (node: HTMLTextAreaElement | null) => {
    if (!node) {
      textAreaRefs.current.delete(id)
      return
    }
    textAreaRefs.current.set(id, node)
  }

  const updateChapterContent = (id: string, updater: (content: string) => string) => {
    setChapters((previous) =>
      previous.map((chapter) => {
        if (chapter.id !== id) return chapter
        const priorContent = chapter.content
        const nextContent = updater(priorContent)
        if (!undoStack.current[id]) undoStack.current[id] = []
        undoStack.current[id].push(priorContent)
        redoStack.current[id] = []
        return { ...chapter, content: nextContent }
      })
    )
  }

  const handleChapterTitleChange = (id: string, value: string) => {
    setChapters((previous) => previous.map((chapter) => (chapter.id === id ? { ...chapter, title: value } : chapter)))
    setError("")
  }

  const handleChapterContentChange = (id: string, value: string) => {
    updateChapterContent(id, () => value)
    setError("")
  }

  const applyWrapFormatting = (id: string, prefix: string, suffix = prefix) => {
    const textarea = textAreaRefs.current.get(id)
    if (!textarea) return
    const { selectionStart, selectionEnd, value } = textarea
    const selectedText = value.substring(selectionStart, selectionEnd)
    const nextValue = `${value.substring(0, selectionStart)}${prefix}${selectedText}${suffix}${value.substring(selectionEnd)}`
    updateChapterContent(id, () => nextValue)
    requestAnimationFrame(() => {
      const cursor = selectionStart + prefix.length + selectedText.length + suffix.length
      textarea.focus()
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  const applyLineFormatting = (id: string, marker: string) => {
    const textarea = textAreaRefs.current.get(id)
    if (!textarea) return
    const { selectionStart, selectionEnd, value } = textarea
    const selectedValue = value.substring(selectionStart, selectionEnd) || value
    const formatted = selectedValue
      .split(/\n/)
      .map((line) => {
        const trimmed = line.trim()
        if (!trimmed) return marker
        if (trimmed.startsWith(marker.trim())) return line
        return `${marker}${trimmed}`
      })
      .join("\n")
    const nextValue = selectionStart === 0 && selectionEnd === value.length ? formatted : `${value.substring(0, selectionStart)}${formatted}${value.substring(selectionEnd)}`
    updateChapterContent(id, () => nextValue)
    requestAnimationFrame(() => {
      const cursor = selectionStart + formatted.length
      textarea.focus()
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  const handleUndo = (id: string) => {
    const history = undoStack.current[id]
    if (!history || history.length === 0) return
    const textarea = textAreaRefs.current.get(id)
    setChapters((previous) =>
      previous.map((chapter) => {
        if (chapter.id !== id) return chapter
        const previousContent = history.pop() as string
        if (!redoStack.current[id]) redoStack.current[id] = []
        redoStack.current[id].push(chapter.content)
        return { ...chapter, content: previousContent }
      })
    )
    requestAnimationFrame(() => textarea?.focus())
  }

  const handleRedo = (id: string) => {
    const history = redoStack.current[id]
    if (!history || history.length === 0) return
    const textarea = textAreaRefs.current.get(id)
    setChapters((previous) =>
      previous.map((chapter) => {
        if (chapter.id !== id) return chapter
        const nextContent = history.pop() as string
        if (!undoStack.current[id]) undoStack.current[id] = []
        undoStack.current[id].push(chapter.content)
        return { ...chapter, content: nextContent }
      })
    )
    requestAnimationFrame(() => textarea?.focus())
  }

  const handleAddChapter = () => {
    const lastChapter = chapters[chapters.length - 1]
    if (lastChapter && lastChapter.content.trim().length === 0) {
      toast.error(`Finish the current ${expressionConfig.sectionName.toLowerCase()} before adding a new one.`)
      return
    }
    setChapters((previous) => {
      const nextChapter = {
        ...createChapter(previous.length),
        title: `${expressionConfig.sectionName} ${previous.length + 1}`,
      }
      undoStack.current[nextChapter.id] = []
      redoStack.current[nextChapter.id] = []
      const next = [...previous, nextChapter]
      requestAnimationFrame(() => {
        textAreaRefs.current.get(nextChapter.id)?.focus()
      })
      return next
    })
  }

  const handleRemoveChapter = (id: string) => {
    if (chapters.length === 1) {
      toast.error(`Your work needs at least one ${expressionConfig.sectionName.toLowerCase()}.`)
      return
    }
    setChapters((previous) => previous.filter((chapter) => chapter.id !== id))
    textAreaRefs.current.delete(id)
    delete undoStack.current[id]
    delete redoStack.current[id]
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    let isValid = true

    if (!formData.title.trim()) {
      errors.title = "Story title is required"
      isValid = false
    }
    if (!formData.author.trim()) {
      errors.author = "Author name is required"
      isValid = false
    }
    if (!formData.category) {
      errors.category = "Please select a category"
      isValid = false
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required"
      isValid = false
    }
    const hasContent = chapters.some((chapter) => chapter.content.trim().length > 0)
    if (!hasContent) {
      errors.chapters = "Please add content to at least one chapter"
      isValid = false
    }
    if (!formData.tribe.trim()) {
      errors.tribe = "Tribe/cultural group is required"
      isValid = false
    }
    if (!formData.language.trim()) {
      errors.language = "Language is required"
      isValid = false
    }
    if (fieldErrors.image) {
      isValid = false
    }
    if (!isConnected) {
      errors.wallet = "Please connect your wallet first"
      isValid = false
    }

    setFieldErrors(errors)
    if (!isValid) {
      setError("Please fix the errors below")
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"], #${firstErrorField}`)
        element?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
    return isValid
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    setStep("uploading")

    try {
      const normalizedChapters = chapters
        .map((chapter, index) => {
          const markdown = chapter.content.trim()
          if (!markdown) return null
          const title = chapter.title.trim() || `Chapter ${index + 1}`
      const html = DOMPurify.sanitize((marked.parse(markdown) as string) ?? "")
          const text = stripHtml(html)
          return {
            order: index + 1,
            id: chapter.id,
            title,
            contentMarkdown: markdown,
            contentHtml: html,
            contentText: text,
          }
        })
        .filter(Boolean)

      if (!normalizedChapters.length) {
        throw new Error("Chapter content missing. Please add text to your creative work.")
      }

      let imageHash = ""
      if (formData.image) {
        const imageResult = await uploadFileToIPFS(formData.image)
        imageHash = imageResult.cid
        toast.success("Image uploaded to IPFS")
      }

      const combinedContent = normalizedChapters
        .map((chapter) => `${chapter!.title}\n\n${chapter!.contentText}`)
        .join("\n\n")

      const metadata = {
        name: formData.title,
        description: formData.description,
        image: imageHash ? `ipfs://${imageHash}` : "",
        version: "1.1.0",
        format: "markdown",
        attributes: [
          { trait_type: "Category", value: formData.category },
          { trait_type: "Tribe", value: formData.tribe },
          { trait_type: "Language", value: formData.language },
          { trait_type: "Author", value: formData.author },
          { trait_type: "Expression Type", value: activeExpression?.label ?? formData.expressionType },
          { trait_type: "Chapters", value: normalizedChapters.length.toString() },
          ...(selectedGenres.length ? [{ trait_type: "Tags", value: selectedGenres.join(", ") }] : []),
        ],
        summary: combinedContent.slice(0, 500),
        tags: selectedGenres,
        chapters: normalizedChapters,
        content: combinedContent,
        expressionType: formData.expressionType,
      }

      let metadataCid: string | null = null
      try {
        const metadataResult = await uploadMetadataToIPFS(metadata)
        metadataCid = metadataResult.cid
        toast.success("Metadata uploaded to IPFS")
      } catch (ipfsError: any) {
        const msg = ipfsError?.message || "IPFS upload failed"
        toast.warning(`${msg}. Saving off-chain without IPFS.`)
      }

      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || ""
      const contractConfigured = /^0x[a-fA-F0-9]{40}$/.test(contractAddress)

      if (contractConfigured && isConnected && metadataCid) {
        setStep("minting")
        setShowTransaction(true)

        const result = await mintStory(metadataCid, formData.tribe, formData.language)

        if (result.success && result.txHash) {
          setTxHash(result.txHash)
          setTokenId(result.tokenId != null ? String(result.tokenId) : null)
          setStep("success")
          setShowTransaction(false)
          setSuccess(true)
          toast.success("Creative work minted successfully!")
        } else {
          const errorMessage = result.error || "Failed to mint creative work"
          setError(errorMessage)
          toast.error(errorMessage)
          setStep("form")
          setShowTransaction(false)
        }
      } else {
        // Bypass smart contract: store story off-chain
        const offchain = await createStoryOffchain({
          ipfsHash: metadataCid || `PENDING_IPFS_${Date.now()}`,
          author: formData.author,
          tribe: formData.tribe,
          language: formData.language,
          title: formData.title,
          description: formData.description,
          metadata,
        })

        setTokenId(String(offchain.story.tokenId))
        setStep("success")
        setShowTransaction(false)
        setSuccess(true)
        toast.success("Creative work saved off-chain")
      }
      
        setFormData({
          title: "",
          author: "",
          category: "",
          description: "",
          tags: "",
          tribe: "",
          language: "",
          expressionType: formData.expressionType,
        })
        setChapters([createChapter(0)])
        setImagePreview(null)
        setSelectedGenres([])
        clearDraft(true)

        setTimeout(() => {
          setSuccess(false)
          setStep("form")
        }, 5000)
    } catch (submissionError: any) {
      const message = submissionError.message || "Failed to upload your creative work. Please try again."
      setError(message)
      toast.error(message)
      setStep("form")
      setShowTransaction(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getPolygonScanUrl = (hash: string) => `https://mumbai.polygonscan.com/tx/${hash}`

  const chapterCount = useMemo(() => chapters.length, [chapters])

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-6">
        {fieldErrors.wallet && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3">
              <Wallet size={24} className="text-destructive" />
              <div>
                <p className="font-semibold text-sm text-destructive">{fieldErrors.wallet}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={connectWallet}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors text-sm"
            >
              {checkMetaMask() ? "Connect Wallet" : "Install MetaMask"}
            </button>
          </motion.div>
        )}
        {!isConnected && !fieldErrors.wallet && (
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
                  {checkMetaMask() ? "Connect your MetaMask wallet to continue" : "Install MetaMask to mint your work"}
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
                <p className="font-semibold text-lg">Minting Your Creative Work...</p>
                <p className="text-sm text-muted-foreground text-center">
                  {step === "uploading" && "Uploading to IPFS..."}
                  {step === "minting" && "Transaction in progress. Please confirm in MetaMask."}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <p className="font-semibold mb-2">Creative Work Minted Successfully! 🎉</p>
                  <p className="text-sm mb-4">Your creative expression has been permanently recorded on the blockchain.</p>
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

        <div>
          <p className="text-sm font-semibold mb-2">What are you uploading?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Select the creative expression that best describes this submission. We tailor tips and metadata for your choice.
          </p>
          <div className="flex flex-wrap gap-3">
            {expressionOptions.map((option) => {
              const isActive = formData.expressionType === option.value
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setFormData((previous) => ({ ...previous, expressionType: option.value }))}
                  className={cn(
                    "flex-1 min-w-[200px] rounded-xl border border-border bg-card/60 p-4 text-left transition hover:border-primary/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary",
                    isActive && "border-primary bg-primary/10 shadow-md"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">{option.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Story Cover Image *</label>
          <div className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer bg-muted/30",
            fieldErrors.image ? "border-destructive" : "border-border hover:border-primary/50"
          )}>
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            {imagePreview ? (
              <div className="space-y-3">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                <p className="text-sm text-muted-foreground">Click to change image</p>
                <p className="text-xs text-primary">✓ Image size: 1200x800px</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload size={32} className="text-muted-foreground mx-auto" />
                <p className="font-medium">Drag and drop your image here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
                <p className="text-xs text-muted-foreground">Required: 1200x800 pixels</p>
              </div>
            )}
          </div>
          {fieldErrors.image && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.image}</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Work Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter the title of your work"
            className={cn(
              "w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2",
              fieldErrors.title ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"
            )}
          />
          {fieldErrors.title && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-semibold mb-2">
            Creator Name *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="Your name, collective, or pen name"
            className={cn(
              "w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2",
              fieldErrors.author ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"
            )}
          />
          {fieldErrors.author && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.author}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Tribe/Cultural Group *</label>
          <SearchableSelect
            name="tribe"
            value={formData.tribe}
            onChange={(nextValue) => {
              setFormData((previous) => ({ ...previous, tribe: nextValue }))
              setError("")
              setFieldErrors((prev) => {
                const next = { ...prev }
                delete next.tribe
                return next
              })
            }}
            options={tribeOptions}
            placeholder="Search and select a tribe or cultural group"
            helperText="We curated a wide list across Africa. Start typing to search."
          />
          {fieldErrors.tribe && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.tribe}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Language *</label>
          <SearchableSelect
            name="language"
            value={formData.language}
            onChange={(nextValue) => {
              setFormData((previous) => ({ ...previous, language: nextValue }))
              setError("")
              setFieldErrors((prev) => {
                const next = { ...prev }
                delete next.language
                return next
              })
            }}
            options={languageOptions}
            placeholder="Search languages spoken across Africa"
            helperText="Select the primary language of this work."
          />
          {fieldErrors.language && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.language}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={cn(
              "w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2",
              fieldErrors.category ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"
            )}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {fieldErrors.category && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief summary of your work (max 200 characters)"
            maxLength={200}
            rows={3}
            className={cn(
              "w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 resize-none",
              fieldErrors.description ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"
            )}
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">{formData.description.length}/200</p>
            {fieldErrors.description && (
              <p className="text-xs text-destructive">{fieldErrors.description}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                {expressionConfig.sectionHeading} ({chapterCount})
              </p>
              <p className="text-xs text-muted-foreground">
                {activeExpression?.description || "Structure each section, save drafts, and return any time before minting."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={persistDraft}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary"
              >
                <Save size={14} /> Save Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  clearDraft()
                  setFormData({
                    title: "",
                    author: "",
                    category: "",
                    description: "",
                    tags: "",
                    tribe: "",
                    language: "",
                    expressionType: "writer",
                  })
                  setChapters([createChapter(0)])
                  setImagePreview(null)
                  setSelectedGenres([])
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-destructive/50"
              >
                <Trash2 size={14} /> Clear Draft
              </button>
            </div>
          </div>

          {fieldErrors.chapters && (
            <p className="text-xs text-destructive mb-2">{fieldErrors.chapters}</p>
          )}
          <div className="space-y-6">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="rounded-lg border border-border bg-card/40 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    <span className="text-sm font-semibold">
                      {expressionConfig.sectionName} {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUndo(chapter.id)}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      <Undo size={12} /> Undo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRedo(chapter.id)}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      <Redo size={12} /> Redo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(chapter.id)}
                      className="inline-flex items-center gap-1 rounded border border-destructive/50 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(event) => handleChapterTitleChange(chapter.id, event.target.value)}
                    placeholder={`${expressionConfig.sectionName} title`}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyWrapFormatting(chapter.id, "**")}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:border-primary"
                    >
                      <Bold size={12} /> Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => applyWrapFormatting(chapter.id, "*")}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:border-primary"
                    >
                      <Italic size={12} /> Italic
                    </button>
                    <button
                      type="button"
                      onClick={() => applyWrapFormatting(chapter.id, "<u>", "</u>")}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:border-primary"
                    >
                      <Underline size={12} /> Underline
                    </button>
                    <button
                      type="button"
                      onClick={() => applyLineFormatting(chapter.id, "- ")}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:border-primary"
                    >
                      <List size={12} /> Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => applyLineFormatting(chapter.id, "> ")}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:border-primary"
                    >
                      <Quote size={12} /> Quote
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <textarea
                        ref={setTextAreaRef(chapter.id)}
                        value={chapter.content}
                        onChange={(event) => {
                          handleChapterContentChange(chapter.id, event.target.value)
                          // Auto-update preview
                          requestAnimationFrame(() => {
                            const preview = document.getElementById(`preview-${chapter.id}`)
                            if (preview) {
                              const markdown = event.target.value
                              const html = DOMPurify.sanitize((marked.parse(markdown) as string) || "")
                              preview.innerHTML = html || "<p class='text-muted-foreground text-sm italic'>Preview will appear here...</p>"
                            }
                          })
                        }}
                        rows={8}
                        placeholder={expressionConfig.chapterPlaceholder}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div
                        id={`preview-${chapter.id}`}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed prose prose-sm max-w-none overflow-auto"
                        style={{ minHeight: "200px", maxHeight: "200px" }}
                        dangerouslySetInnerHTML={{
                          __html: chapter.content
                            ? DOMPurify.sanitize((marked.parse(chapter.content) as string) || "")
                            : "<p class='text-muted-foreground text-sm italic'>Preview will appear here...</p>"
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{expressionConfig.toolbarHint}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddChapter}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
          <Plus size={16} /> Add Another {expressionConfig.sectionName}
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Genre Tags</label>
          <SearchableMultiSelect
            name="tags"
            values={selectedGenres}
            onChange={(nextValues) => {
              setSelectedGenres(nextValues)
              setFormData((previous) => ({ ...previous, tags: nextValues.join(", ") }))
              setError("")
            }}
          options={genreOptions}
          placeholder="Select relevant genres"
          helperText="Choose one or multiple genres to help the community discover your work."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !isConnected}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {step === "uploading" && "Uploading to IPFS..."}
              {step === "minting" && "Minting Your Creative Work..."}
            </>
          ) : (
            <>
              <Upload size={20} /> Mint Creative Work
            </>
          )}
        </button>

        <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Before you mint:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Ensure your work and sections are original and copyright-free.</li>
            <li>Cover image should be at least 1200x800px.</li>
            <li>You retain full ownership of your work.</li>
            <li>Your creative expressions will be permanently stored on the blockchain.</li>
            <li>Connect your MetaMask wallet to the Polygon Mumbai testnet.</li>
          </ul>
        </div>
      </form>
    </div>
  )
}
