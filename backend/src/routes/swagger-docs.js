/**
 * @swagger
 * components:
 *   schemas:
 *     Story:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Database ID
 *         tokenId:
 *           type: integer
 *           description: NFT token ID
 *         ipfsHash:
 *           type: string
 *           description: IPFS content hash
 *         ipfsUrl:
 *           type: string
 *           description: IPFS gateway URL
 *         author:
 *           type: string
 *           description: Author wallet address
 *         tribe:
 *           type: string
 *           description: African tribe associated with story
 *         language:
 *           type: string
 *           description: Story language code
 *         title:
 *           type: string
 *           description: Story title
 *         description:
 *           type: string
 *           description: Story description
 *         metadata:
 *           type: object
 *           description: Story metadata (JSON)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Listing:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         listingId:
 *           type: integer
 *         tokenId:
 *           type: integer
 *         seller:
 *           type: string
 *         priceWei:
 *           type: string
 *         priceMatic:
 *           type: number
 *         listingType:
 *           type: string
 *           enum: [fixed, auction]
 *         status:
 *           type: string
 *           enum: [active, sold, cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [sale, offer, price_change, new_listing, bundle_sale]
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         read:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 */

/**
 * @swagger
 * /api/stories:
 *   get:
 *     summary: Get all stories with optional filters
 *     tags: [Stories]
 *     parameters:
 *       - in: query
 *         name: tribe
 *         schema:
 *           type: string
 *         description: Filter by tribe
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author address
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of stories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */

/**
 * @swagger
 * /api/stories/stats:
 *   get:
 *     summary: Get story statistics
 *     tags: [Stories]
 *     responses:
 *       200:
 *         description: Story statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 byTribe:
 *                   type: object
 *                 byLanguage:
 *                   type: object
 */

/**
 * @swagger
 * /api/stories/{id}:
 *   get:
 *     summary: Get story by token ID
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Story token ID
 *     responses:
 *       200:
 *         description: Story details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       404:
 *         description: Story not found
 */

/**
 * @swagger
 * /api/stories:
 *   post:
 *     summary: Create a new story (off-chain)
 *     tags: [Stories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ipfsHash
 *               - author
 *             properties:
 *               ipfsHash:
 *                 type: string
 *               author:
 *                 type: string
 *               tribe:
 *                 type: string
 *               language:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Story created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload file to IPFS
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cid:
 *                   type: string
 *                 ipfsUrl:
 *                   type: string
 *                 filename:
 *                   type: string
 *       400:
 *         description: No file provided
 */

/**
 * @swagger
 * /api/upload/metadata:
 *   post:
 *     summary: Upload JSON metadata to IPFS
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Metadata uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cid:
 *                   type: string
 *                 ipfsUrl:
 *                   type: string
 */

/**
 * @swagger
 * /api/marketplace/listings:
 *   get:
 *     summary: Get all marketplace listings
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, sold, cancelled, all]
 *         description: Filter by listing status
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price in MATIC
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price in MATIC
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of listings to return
 *     responses:
 *       200:
 *         description: List of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 listings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Listing'
 */

/**
 * @swagger
 * /api/marketplace/listings/{id}:
 *   get:
 *     summary: Get listing by ID
 *     tags: [Marketplace]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       404:
 *         description: Listing not found
 */

/**
 * @swagger
 * /api/marketplace/listings:
 *   post:
 *     summary: Create a new listing
 *     tags: [Marketplace]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenId
 *               - sellerAddress
 *               - priceWei
 *             properties:
 *               tokenId:
 *                 type: integer
 *               sellerAddress:
 *                 type: string
 *               priceWei:
 *                 type: string
 *               priceMatic:
 *                 type: number
 *               listingType:
 *                 type: string
 *                 enum: [fixed, auction]
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/marketplace/listings/{id}/status:
 *   patch:
 *     summary: Update listing status
 *     tags: [Marketplace]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, sold, cancelled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */

/**
 * @swagger
 * /api/marketplace/sales:
 *   post:
 *     summary: Record a sale
 *     tags: [Marketplace]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenId
 *               - sellerAddress
 *               - buyerAddress
 *               - priceWei
 *               - transactionHash
 *             properties:
 *               tokenId:
 *                 type: integer
 *               sellerAddress:
 *                 type: string
 *               buyerAddress:
 *                 type: string
 *               priceWei:
 *                 type: string
 *               priceMatic:
 *                 type: number
 *               platformFeeWei:
 *                 type: string
 *               royaltyWei:
 *                 type: string
 *               transactionHash:
 *                 type: string
 *               blockNumber:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sale recorded successfully
 */

/**
 * @swagger
 * /api/marketplace/sales:
 *   get:
 *     summary: Get sales history
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: tokenId
 *         schema:
 *           type: integer
 *         description: Filter by token ID
 *       - in: query
 *         name: seller
 *         schema:
 *           type: string
 *         description: Filter by seller address
 *       - in: query
 *         name: buyer
 *         schema:
 *           type: string
 *         description: Filter by buyer address
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of sales to return
 *     responses:
 *       200:
 *         description: List of sales
 */

/**
 * @swagger
 * /api/marketplace/offers/{tokenId}:
 *   get:
 *     summary: Get offers for a token
 *     tags: [Marketplace]
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Token ID
 *     responses:
 *       200:
 *         description: List of offers
 */

/**
 * @swagger
 * /api/marketplace/offers:
 *   post:
 *     summary: Create an offer
 *     tags: [Marketplace]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenId
 *               - offererAddress
 *               - priceWei
 *             properties:
 *               tokenId:
 *                 type: integer
 *               offererAddress:
 *                 type: string
 *               priceWei:
 *                 type: string
 *               priceMatic:
 *                 type: number
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Offer created successfully
 */

/**
 * @swagger
 * /api/marketplace/offers/{id}/status:
 *   patch:
 *     summary: Update offer status
 *     tags: [Marketplace]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, expired]
 *     responses:
 *       200:
 *         description: Offer status updated
 */

/**
 * @swagger
 * /api/marketplace/price-history/{tokenId}:
 *   get:
 *     summary: Get price history for a token
 *     tags: [Marketplace]
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Token ID
 *     responses:
 *       200:
 *         description: Price history
 */

/**
 * @swagger
 * /api/marketplace/users/{address}/nfts:
 *   get:
 *     summary: Get user's NFTs
 *     tags: [Marketplace]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User wallet address
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, owned, created, listed]
 *           default: all
 *         description: Filter by NFT type
 *     responses:
 *       200:
 *         description: User's NFTs
 */

/**
 * @swagger
 * /api/marketplace/bundles:
 *   post:
 *     summary: Record a bundle purchase
 *     tags: [Bundles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bundleId
 *               - buyerAddress
 *               - listingIds
 *               - tokenIds
 *               - totalPriceWei
 *               - transactionHash
 *             properties:
 *               bundleId:
 *                 type: string
 *               buyerAddress:
 *                 type: string
 *               listingIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               tokenIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               totalPriceWei:
 *                 type: string
 *               totalPriceMatic:
 *                 type: number
 *               discountBps:
 *                 type: integer
 *               discountAmountWei:
 *                 type: string
 *               discountAmountMatic:
 *                 type: number
 *               platformFeeWei:
 *                 type: string
 *               transactionHash:
 *                 type: string
 *               blockNumber:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Bundle recorded successfully
 */

/**
 * @swagger
 * /api/marketplace/bundles/{id}:
 *   get:
 *     summary: Get bundle by ID
 *     tags: [Bundles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bundle ID
 *     responses:
 *       200:
 *         description: Bundle details
 *       404:
 *         description: Bundle not found
 */

/**
 * @swagger
 * /api/marketplace/users/{address}/bundles:
 *   get:
 *     summary: Get user's bundle purchases
 *     tags: [Bundles]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User wallet address
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: User's bundles
 */

/**
 * @swagger
 * /api/notifications/{address}:
 *   get:
 *     summary: Get notifications for a user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User wallet address
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of notifications
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Return only unread notifications
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *                 description: User wallet address
 *     responses:
 *       200:
 *         description: Notification marked as read
 */

/**
 * @swagger
 * /api/notifications/{address}/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User wallet address
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */

/**
 * @swagger
 * /api/notifications/{address}/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User wallet address
 *     responses:
 *       200:
 *         description: Unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/lazy-mints:
 *   post:
 *     summary: Create a lazy mint
 *     tags: [Lazy Mints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ipfsHash
 *               - authorAddress
 *             properties:
 *               ipfsHash:
 *                 type: string
 *               authorAddress:
 *                 type: string
 *               tribe:
 *                 type: string
 *               language:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Lazy mint created successfully
 */

/**
 * @swagger
 * /api/lazy-mints/{ipfsHash}:
 *   get:
 *     summary: Get lazy mint by IPFS hash
 *     tags: [Lazy Mints]
 *     parameters:
 *       - in: path
 *         name: ipfsHash
 *         required: true
 *         schema:
 *           type: string
 *         description: IPFS hash
 *     responses:
 *       200:
 *         description: Lazy mint details
 *       404:
 *         description: Lazy mint not found
 */

/**
 * @swagger
 * /api/lazy-mints/{ipfsHash}/minted:
 *   patch:
 *     summary: Mark lazy mint as minted
 *     tags: [Lazy Mints]
 *     parameters:
 *       - in: path
 *         name: ipfsHash
 *         required: true
 *         schema:
 *           type: string
 *         description: IPFS hash
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenId
 *             properties:
 *               tokenId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lazy mint marked as minted
 */

/**
 * @swagger
 * /api/lazy-mints/users/{address}:
 *   get:
 *     summary: Get user's lazy mints
 *     tags: [Lazy Mints]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User wallet address
 *       - in: query
 *         name: minted
 *         schema:
 *           type: string
 *           enum: [all, true, false]
 *           default: all
 *         description: Filter by minted status
 *     responses:
 *       200:
 *         description: User's lazy mints
 */

