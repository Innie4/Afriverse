// Marketplace API service
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

export interface Listing {
  id: number
  listingId: number
  tokenId: number
  seller: string
  priceWei: string
  priceMatic: number
  currency: string
  listingType: "fixed" | "auction"
  status: "active" | "sold" | "cancelled" | "ended"
  startTime: string
  endTime?: string
  createdAt: string
  story?: {
    title?: string
    description?: string
    tribe?: string
    language?: string
    ipfsHash?: string
    metadata?: any
    author?: string
  }
}

export interface Sale {
  id: number
  tokenId: number
  listingId?: number
  seller: string
  buyer: string
  priceWei: string
  priceMatic: number
  platformFeeWei?: string
  royaltyWei?: string
  transactionHash: string
  blockNumber?: number
  createdAt: string
}

export interface Offer {
  id: number
  offerId: number
  tokenId: number
  offerer: string
  priceWei: string
  priceMatic: number
  status: "pending" | "accepted" | "rejected" | "expired"
  expiresAt?: string
  createdAt: string
}

export interface PriceHistory {
  id: number
  tokenId: number
  priceWei: string
  priceMatic: number
  transactionHash?: string
  eventType: string
  createdAt: string
}

export interface ListingsResponse {
  listings: Listing[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

/**
 * Fetch all listings
 */
export async function fetchListings(params?: {
  status?: string
  page?: number
  limit?: number
  minPrice?: number
  maxPrice?: number
  tribe?: string
  language?: string
  tokenId?: string
}): Promise<ListingsResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append("status", params.status)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.minPrice) queryParams.append("minPrice", params.minPrice.toString())
    if (params?.maxPrice) queryParams.append("maxPrice", params.maxPrice.toString())
    if (params?.tribe) queryParams.append("tribe", params.tribe)
    if (params?.language) queryParams.append("language", params.language)
    if (params?.tokenId) queryParams.append("tokenId", params.tokenId)

    const url = `${API_BASE_URL}/marketplace/listings${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed, using placeholder data:", error)
    // Return empty listings as fallback
    return {
      listings: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
      },
    }
  }
}

/**
 * Fetch listing by ID
 */
export async function fetchListingById(id: number): Promise<Listing> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/listings/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Listing not found")
      }
      throw new Error(`Failed to fetch listing: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed:", error)
    throw error
  }
}

/**
 * Fetch listing by token ID (for story detail page)
 */
export async function fetchListingByToken(tokenId: number): Promise<Listing | null> {
  try {
    // Try to find active listing for this token
    const response = await fetchListings({ tokenId: tokenId.toString(), status: "active", limit: 1 })
    if (response.listings.length > 0) {
      return response.listings[0]
    }
    return null
  } catch (error) {
    console.warn("Failed to fetch listing by token:", error)
    return null
  }
}

/**
 * Create a listing (off-chain record)
 */
export async function createListing(payload: {
  listingId: number
  tokenId: number
  sellerAddress: string
  priceWei: string
  priceMatic?: number
  listingType?: "fixed" | "auction"
  endTime?: string
}): Promise<{ success: boolean; listing: Listing }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/listings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `Failed to create listing: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to create listing:", error)
    throw error
  }
}

/**
 * Update listing status
 */
export async function updateListingStatus(
  id: number,
  status: "active" | "sold" | "cancelled" | "ended"
): Promise<{ success: boolean; listing: Listing }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/listings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `Failed to update listing: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to update listing:", error)
    throw error
  }
}

/**
 * Record a sale
 */
export async function recordSale(payload: {
  tokenId: number
  listingId?: number
  sellerAddress: string
  buyerAddress: string
  priceWei: string
  priceMatic?: number
  platformFeeWei?: string
  royaltyWei?: string
  transactionHash: string
  blockNumber?: number
}): Promise<{ success: boolean; saleId: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `Failed to record sale: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to record sale:", error)
    throw error
  }
}

/**
 * Fetch sales history
 */
export async function fetchSales(params?: {
  tokenId?: number
  seller?: string
  buyer?: string
  page?: number
  limit?: number
}): Promise<{ sales: Sale[]; pagination: { page: number; limit: number; total: number } }> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.tokenId) queryParams.append("tokenId", params.tokenId.toString())
    if (params?.seller) queryParams.append("seller", params.seller)
    if (params?.buyer) queryParams.append("buyer", params.buyer)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const url = `${API_BASE_URL}/marketplace/sales${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch sales: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed, using placeholder data:", error)
    return {
      sales: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
      },
    }
  }
}

/**
 * Fetch offers for a token
 */
export async function fetchOffers(tokenId: number): Promise<{ offers: Offer[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/offers/${tokenId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch offers: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed:", error)
    return { offers: [] }
  }
}

/**
 * Create an offer
 */
export async function createOffer(payload: {
  offerId: number
  tokenId: number
  offererAddress: string
  priceWei: string
  priceMatic?: number
  expiresAt?: string
}): Promise<{ success: boolean; offer: Offer }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `Failed to create offer: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to create offer:", error)
    throw error
  }
}

/**
 * Update offer status
 */
export async function updateOfferStatus(
  id: number,
  status: "pending" | "accepted" | "rejected" | "expired"
): Promise<{ success: boolean; offer: Offer }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/offers/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `Failed to update offer: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to update offer:", error)
    throw error
  }
}

/**
 * Fetch price history for a token
 */
export async function fetchPriceHistory(tokenId: number): Promise<{ history: PriceHistory[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/price-history/${tokenId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch price history: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed:", error)
    return { history: [] }
  }
}

/**
 * Fetch user's NFTs
 */
export async function fetchUserNFTs(
  address: string,
  type: "all" | "owned" | "created" | "listed" = "all"
): Promise<{ owned: any[]; created: any[]; listed: any[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/users/${address}/nfts?type=${type}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch user NFTs: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed:", error)
    return { owned: [], created: [], listed: [] }
  }
}

/**
 * Record a bundle purchase
 */
export async function recordBundle(payload: {
  bundleId: string
  buyerAddress: string
  listingIds: number[]
  tokenIds: number[]
  totalPriceWei: string
  totalPriceMatic?: number
  discountBps?: number
  discountAmountWei?: string
  discountAmountMatic?: number
  platformFeeWei?: string
  transactionHash: string
  blockNumber?: number
}): Promise<{ success: boolean; bundleId: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/bundles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `Failed to record bundle: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to record bundle:", error)
    throw error
  }
}

/**
 * Fetch notifications for a user
 */
export async function fetchNotifications(
  address: string,
  options?: { limit?: number; unreadOnly?: boolean }
): Promise<{ notifications: Notification[] }> {
  try {
    const params = new URLSearchParams()
    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.unreadOnly) params.append("unreadOnly", "true")

    const response = await fetch(`${API_BASE_URL}/notifications/${address}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed:", error)
    return { notifications: [] }
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(
  id: number,
  address: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    })

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    throw error
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(address: string): Promise<{ success: boolean; count: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${address}/read-all`, {
      method: "PATCH",
    })

    if (!response.ok) {
      throw new Error(`Failed to mark all notifications as read: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error)
    throw error
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(address: string): Promise<{ count: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${address}/unread-count`)

    if (!response.ok) {
      throw new Error(`Failed to get unread count: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed:", error)
    return { count: 0 }
  }
}

/**
 * Create a lazy mint
 */
export async function createLazyMint(payload: {
  ipfsHash: string
  authorAddress: string
  tribe?: string
  language?: string
  metadata?: any
}): Promise<{ success: boolean; lazyMint: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/lazy-mints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || `Failed to create lazy mint: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to create lazy mint:", error)
    throw error
  }
}

/**
 * Get lazy mint by IPFS hash
 */
export async function getLazyMint(ipfsHash: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/lazy-mints/${ipfsHash}`)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch lazy mint: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API fetch failed:", error)
    return null
  }
}

export interface Notification {
  id: number
  type: string
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
}

