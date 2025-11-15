// Database seeding script
import { query } from "../config/database.js"
import logger from "../config/logger.js"

const sampleStories = [
  {
    token_id: 1,
    ipfs_hash: "QmSample1",
    author: "0x1234567890123456789012345678901234567890",
    tribe: "Yoruba",
    language: "en",
    title: "The Legend of Moremi",
    description: "A legendary tale of courage and sacrifice from Yoruba mythology.",
    metadata: {
      category: "Folklore",
      tags: ["mythology", "courage", "sacrifice"],
      chapters: [
        {
          title: "The Beginning",
          content: "Long ago in the ancient city of Ile-Ife..."
        }
      ]
    }
  },
  {
    token_id: 2,
    ipfs_hash: "QmSample2",
    author: "0x2345678901234567890123456789012345678901",
    tribe: "Zulu",
    language: "zu",
    title: "Shaka's Legacy",
    description: "The story of the great Zulu warrior king.",
    metadata: {
      category: "Historical",
      tags: ["history", "warrior", "leadership"],
      chapters: [
        {
          title: "Rise to Power",
          content: "Shaka was born into a world of conflict..."
        }
      ]
    }
  },
  {
    token_id: 3,
    ipfs_hash: "QmSample3",
    author: "0x3456789012345678901234567890123456789012",
    tribe: "Hausa",
    language: "ha",
    title: "Sarkin Kano",
    description: "A tale of leadership and wisdom from Northern Nigeria.",
    metadata: {
      category: "Cultural",
      tags: ["leadership", "wisdom", "tradition"],
      chapters: [
        {
          title: "The Coronation",
          content: "In the ancient city of Kano..."
        }
      ]
    }
  },
  {
    token_id: 4,
    ipfs_hash: "QmSample4",
    author: "0x4567890123456789012345678901234567890123",
    tribe: "Igbo",
    language: "ig",
    title: "The Spirit of Nri",
    description: "A contemporary story blending tradition with modern life.",
    metadata: {
      category: "Contemporary",
      tags: ["modern", "tradition", "identity"],
      chapters: [
        {
          title: "Homecoming",
          content: "Ada returned to her village after years abroad..."
        }
      ]
    }
  },
  {
    token_id: 5,
    ipfs_hash: "QmSample5",
    author: "0x5678901234567890123456789012345678901234",
    tribe: "Akan",
    language: "ak",
    title: "Ananse's Wisdom",
    description: "A collection of Ananse stories teaching life lessons.",
    metadata: {
      category: "Folklore",
      tags: ["folklore", "wisdom", "lessons"],
      chapters: [
        {
          title: "Ananse and the Pot of Wisdom",
          content: "Once upon a time, Ananse wanted all wisdom..."
        }
      ]
    }
  }
]

const sampleListings = [
  {
    listing_id: 1,
    token_id: 1,
    seller_address: "0x1234567890123456789012345678901234567890",
    price_wei: "1000000000000000000", // 1 MATIC
    price_matic: 1.0,
    listing_type: "fixed",
    status: "active"
  },
  {
    listing_id: 2,
    token_id: 2,
    seller_address: "0x2345678901234567890123456789012345678901",
    price_wei: "2000000000000000000", // 2 MATIC
    price_matic: 2.0,
    listing_type: "fixed",
    status: "active"
  },
  {
    listing_id: 3,
    token_id: 3,
    seller_address: "0x3456789012345678901234567890123456789012",
    price_wei: "1500000000000000000", // 1.5 MATIC
    price_matic: 1.5,
    listing_type: "auction",
    status: "active",
    start_time: new Date(),
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
]

const sampleNotifications = [
  {
    user_address: "0x1234567890123456789012345678901234567890",
    type: "sale",
    title: "Your NFT was sold!",
    message: "Your story #1 was purchased for 1.0 MATIC",
    data: { tokenId: 1, price: 1.0 },
    read: false
  },
  {
    user_address: "0x2345678901234567890123456789012345678901",
    type: "offer",
    title: "New offer received",
    message: "You received an offer of 1.8 MATIC for story #2",
    data: { tokenId: 2, price: 1.8 },
    read: false
  }
]

export async function seedDatabase() {
  try {
    logger.info("Starting database seeding...")

    // Seed stories
    logger.info("Seeding stories...")
    for (const story of sampleStories) {
      try {
        await query(
          `INSERT INTO stories (token_id, ipfs_hash, author, tribe, language, title, description, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (token_id) DO NOTHING`,
          [
            story.token_id,
            story.ipfs_hash,
            story.author,
            story.tribe,
            story.language,
            story.title,
            story.description,
            JSON.stringify(story.metadata)
          ]
        )
      } catch (error) {
        logger.warn(`Failed to seed story ${story.token_id}:`, error.message)
      }
    }

    // Seed listings
    logger.info("Seeding listings...")
    for (const listing of sampleListings) {
      try {
        await query(
          `INSERT INTO listings (listing_id, token_id, seller_address, price_wei, price_matic, listing_type, status, start_time, end_time)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (listing_id) DO NOTHING`,
          [
            listing.listing_id,
            listing.token_id,
            listing.seller_address,
            BigInt(listing.price_wei),
            listing.price_matic,
            listing.listing_type,
            listing.status,
            listing.start_time || null,
            listing.end_time || null
          ]
        )
      } catch (error) {
        logger.warn(`Failed to seed listing ${listing.listing_id}:`, error.message)
      }
    }

    // Seed notifications
    logger.info("Seeding notifications...")
    for (const notification of sampleNotifications) {
      try {
        await query(
          `INSERT INTO notifications (user_address, type, title, message, data, read)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [
            notification.user_address,
            notification.type,
            notification.title,
            notification.message,
            JSON.stringify(notification.data),
            notification.read
          ]
        )
      } catch (error) {
        logger.warn(`Failed to seed notification:`, error.message)
      }
    }

    logger.info("Database seeding completed successfully!")
    return { success: true, stories: sampleStories.length, listings: sampleListings.length, notifications: sampleNotifications.length }
  } catch (error) {
    logger.error("Error seeding database:", error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import("../config/database.js").then(({ initDatabase }) => {
    initDatabase()
    seedDatabase()
      .then((result) => {
        console.log("Seeding result:", result)
        process.exit(0)
      })
      .catch((error) => {
        console.error("Seeding failed:", error)
        process.exit(1)
      })
  })
}

