// Redis cache configuration
import { createClient } from "redis"
import logger from "./logger.js"

let redisClient = null

export async function initRedis() {
  if (!process.env.REDIS_URL) {
    logger.warn("REDIS_URL not set, caching disabled")
    return null
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    })

    redisClient.on("error", (err) => logger.error("Redis Client Error", err))

    await redisClient.connect()
    logger.info("Redis connected successfully")
    return redisClient
  } catch (error) {
    logger.error("Failed to connect to Redis", error)
    return null
  }
}

export async function getCached(key) {
  if (!redisClient) return null
  try {
    const value = await redisClient.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    logger.error("Redis get error", error)
    return null
  }
}

export async function setCached(key, value, ttl = 3600) {
  if (!redisClient) return
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value))
  } catch (error) {
    logger.error("Redis set error", error)
  }
}

export async function deleteCached(pattern) {
  if (!redisClient) return
  try {
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(keys)
    }
  } catch (error) {
    logger.error("Redis delete error", error)
  }
}

export { redisClient }

