// Notification service - handles creating and managing notifications
import { query } from "../config/database.js"
import logger from "../config/logger.js"

/**
 * Create a notification
 */
export async function createNotification(userAddress, type, title, message, data = {}) {
  try {
    const result = await query(
      `
      INSERT INTO notifications (user_address, type, title, message, data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
      [userAddress, type, title, message, JSON.stringify(data)]
    )

    logger.info(`Notification created: ${type} for ${userAddress}`)
    return result.rows[0].id
  } catch (error) {
    logger.error("Error creating notification", error)
    throw error
  }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userAddress, limit = 50, unreadOnly = false) {
  try {
    let queryText = `
      SELECT * FROM notifications
      WHERE user_address = $1
    `
    const params = [userAddress]

    if (unreadOnly) {
      queryText += " AND read = FALSE"
    }

    queryText += " ORDER BY created_at DESC LIMIT $2"
    params.push(limit)

    const result = await query(queryText, params)

    return result.rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      data: row.data,
      read: row.read,
      createdAt: row.created_at,
    }))
  } catch (error) {
    logger.error("Error fetching notifications", error)
    throw error
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId, userAddress) {
  try {
    const result = await query(
      `
      UPDATE notifications
      SET read = TRUE
      WHERE id = $1 AND user_address = $2
      RETURNING *
    `,
      [notificationId, userAddress]
    )

    return result.rows[0]
  } catch (error) {
    logger.error("Error marking notification as read", error)
    throw error
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userAddress) {
  try {
    const result = await query(
      `
      UPDATE notifications
      SET read = TRUE
      WHERE user_address = $1 AND read = FALSE
      RETURNING COUNT(*)
    `,
      [userAddress]
    )

    return result.rowCount
  } catch (error) {
    logger.error("Error marking all notifications as read", error)
    throw error
  }
}

/**
 * Get unread count for a user
 */
export async function getUnreadCount(userAddress) {
  try {
    const result = await query(
      `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_address = $1 AND read = FALSE
    `,
      [userAddress]
    )

    return parseInt(result.rows[0].count)
  } catch (error) {
    logger.error("Error getting unread count", error)
    return 0
  }
}

/**
 * Create notification for sale
 */
export async function notifySale(sellerAddress, buyerAddress, tokenId, price) {
  await createNotification(
    sellerAddress,
    "sale",
    "Your NFT was sold!",
    `Your story #${tokenId} was purchased for ${price} MATIC`,
    { tokenId, buyerAddress, price }
  )
}

/**
 * Create notification for offer
 */
export async function notifyOffer(ownerAddress, offererAddress, tokenId, price) {
  await createNotification(
    ownerAddress,
    "offer",
    "New offer received",
    `You received an offer of ${price} MATIC for story #${tokenId}`,
    { tokenId, offererAddress, price }
  )
}

/**
 * Create notification for price change
 */
export async function notifyPriceChange(userAddress, tokenId, oldPrice, newPrice) {
  await createNotification(
    userAddress,
    "price_change",
    "Price changed",
    `Story #${tokenId} price changed from ${oldPrice} to ${newPrice} MATIC`,
    { tokenId, oldPrice, newPrice }
  )
}

/**
 * Create notification for new listing
 */
export async function notifyNewListing(userAddress, tokenId, price) {
  await createNotification(
    userAddress,
    "new_listing",
    "New listing available",
    `A new story #${tokenId} is listed for ${price} MATIC`,
    { tokenId, price }
  )
}

