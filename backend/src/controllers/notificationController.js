// Notification controller - handles notification operations
import { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../services/notificationService.js"
import logger from "../config/logger.js"

/**
 * Get notifications for a user
 */
export async function getNotifications(req, res, next) {
  try {
    const { address } = req.params
    const { limit = 50, unreadOnly = false } = req.query

    const notifications = await getUserNotifications(
      address,
      parseInt(limit),
      unreadOnly === "true"
    )

    res.json({ notifications })
  } catch (error) {
    logger.error("Error fetching notifications", error)
    next(error)
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(req, res, next) {
  try {
    const { id } = req.params
    const { address } = req.body

    if (!address) {
      return res.status(400).json({ error: "User address required" })
    }

    const notification = await markAsRead(parseInt(id), address)

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }

    res.json({ success: true, notification })
  } catch (error) {
    logger.error("Error marking notification as read", error)
    next(error)
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(req, res, next) {
  try {
    const { address } = req.params

    const count = await markAllAsRead(address)

    res.json({ success: true, count })
  } catch (error) {
    logger.error("Error marking all notifications as read", error)
    next(error)
  }
}

/**
 * Get unread count
 */
export async function getUnreadNotificationCount(req, res, next) {
  try {
    const { address } = req.params

    const count = await getUnreadCount(address)

    res.json({ count })
  } catch (error) {
    logger.error("Error getting unread count", error)
    next(error)
  }
}

