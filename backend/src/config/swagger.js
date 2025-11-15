// Swagger configuration for API documentation
import swaggerJsdoc from "swagger-jsdoc"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Afriverse Tales API",
      version: "1.0.0",
      description:
        "RESTful API for Afriverse Tales - A Web3 storytelling platform for preserving African narratives as NFTs on Polygon. This API enables story creation, minting, marketplace operations, and IPFS storage management.",
      contact: {
        name: "Afriverse Tales Support",
        email: "support@afriverse.com",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.afriverse.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Stories",
        description: "Story management endpoints",
      },
      {
        name: "Upload",
        description: "IPFS upload endpoints",
      },
      {
        name: "Marketplace",
        description: "NFT marketplace operations",
      },
      {
        name: "Bundles",
        description: "Bundle purchase operations",
      },
      {
        name: "Notifications",
        description: "User notification management",
      },
      {
        name: "Lazy Mints",
        description: "Lazy minting operations",
      },
    ],
    components: {
      schemas: {
        Story: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Database ID",
            },
            tokenId: {
              type: "integer",
              description: "NFT token ID",
            },
            ipfsHash: {
              type: "string",
              description: "IPFS content hash",
            },
            ipfsUrl: {
              type: "string",
              description: "IPFS gateway URL",
            },
            author: {
              type: "string",
              description: "Author wallet address",
            },
            tribe: {
              type: "string",
              description: "African tribe associated with story",
            },
            language: {
              type: "string",
              description: "Story language code",
            },
            title: {
              type: "string",
              description: "Story title",
            },
            description: {
              type: "string",
              description: "Story description",
            },
            metadata: {
              type: "object",
              description: "Story metadata (JSON)",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Listing: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            listingId: {
              type: "integer",
            },
            tokenId: {
              type: "integer",
            },
            seller: {
              type: "string",
            },
            priceWei: {
              type: "string",
            },
            priceMatic: {
              type: "number",
            },
            listingType: {
              type: "string",
              enum: ["fixed", "auction"],
            },
            status: {
              type: "string",
              enum: ["active", "sold", "cancelled"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            type: {
              type: "string",
              enum: ["sale", "offer", "price_change", "new_listing", "bundle_sale"],
            },
            title: {
              type: "string",
            },
            message: {
              type: "string",
            },
            data: {
              type: "object",
            },
            read: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        BadRequest: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../controllers/*.js"),
    path.join(__dirname, "../routes/swagger-docs.js"),
  ], // Paths to files containing OpenAPI definitions
}

export const swaggerSpec = swaggerJsdoc(options)

