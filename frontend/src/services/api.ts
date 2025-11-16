// API service for backend integration
import { placeholderStories, placeholderToStory } from "@/data/placeholderStories"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

export interface Story {
  id: number
  tokenId: number
  ipfsHash: string
  ipfsUrl: string
  author: string
  tribe: string
  language: string
  vertical?: string
  title: string | null
  description: string | null
  metadata: any
  createdAt: string
  updatedAt: string
}

export interface StoriesResponse {
  stories: Story[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface UploadResponse {
  success: boolean
  cid: string
  ipfsUrl: string
  filename: string
}

export interface MetadataUploadResponse {
  success: boolean
  cid: string
  ipfsUrl: string
}

/**
 * Fetch all stories with optional filters
 */
export async function fetchStories(params?: {
  tribe?: string
  language?: string
  author?: string
  vertical?: string
  page?: number
  limit?: number
}): Promise<StoriesResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.tribe) queryParams.append("tribe", params.tribe)
    if (params?.language) queryParams.append("language", params.language)
    if (params?.author) queryParams.append("author", params.author)
    if (params?.vertical) queryParams.append("vertical", params.vertical)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const url = `${API_BASE_URL}/stories${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    // Fallback to placeholder data on API failure
    console.warn("API fetch failed, using placeholder data:", error)
    let filtered = placeholderStories.map(placeholderToStory)
    
    // Apply filters if provided
    if (params?.tribe) {
      filtered = filtered.filter(s => s.tribe === params.tribe)
    }
    if (params?.language) {
      filtered = filtered.filter(s => s.language === params.language)
    }
    if (params?.author) {
      filtered = filtered.filter(s => s.author.toLowerCase().includes(params.author!.toLowerCase()))
    }
    
    const limit = params?.limit || 100
    const page = params?.page || 1
    const start = (page - 1) * limit
    const paginated = filtered.slice(start, start + limit)
    
    return {
      stories: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length
      }
    }
  }
}

/**
 * Fetch a single story by token ID
 */
export async function fetchStoryById(tokenId: number): Promise<Story> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${tokenId}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Story not found")
      }
      throw new Error(`Failed to fetch story: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    // Fallback to placeholder data on API failure
    console.warn("API fetch failed, using placeholder data:", error)
    const placeholder = placeholderStories.find(p => p.tokenId === tokenId)
    if (placeholder) {
      return placeholderToStory(placeholder)
    }
    throw new Error("Story not found")
  }
}

/**
 * Fetch stories by author address
 */
export async function fetchStoriesByAuthor(authorAddress: string): Promise<Story[]> {
  const response = await fetchStories({ author: authorAddress, limit: 100 })
  return response.stories
}

/**
 * Upload file to IPFS via backend
 */
export async function uploadFileToIPFS(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || `Failed to upload file: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Upload JSON metadata to IPFS via backend
 */
export async function uploadMetadataToIPFS(metadata: Record<string, any>): Promise<MetadataUploadResponse> {
  const response = await fetch(`${API_BASE_URL}/upload/metadata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metadata }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || `Failed to upload metadata: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Create a story off-chain (bypass smart contract)
 */
export async function createStoryOffchain(payload: {
  ipfsHash: string
  author: string
  tribe?: string
  language?: string
  vertical?: string
  title?: string
  description?: string
  metadata?: Record<string, any>
}): Promise<{ success: boolean; story: Story }> {
  const response = await fetch(`${API_BASE_URL}/stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || `Failed to create story: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/health`)
  if (!response.ok) {
    throw new Error("Backend health check failed")
  }
  return response.json()
}

