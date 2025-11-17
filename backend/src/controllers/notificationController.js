// Notification controller - handles notification operations (SOLID: Single Responsibility)
import { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../services/notificationService.js"
import { asyncHandler, sendSuccess, sendBadRequest, sendNotFound } from "../utils/responseHandler.js"

/**
 * Get notifications for a user
 */
export const getNotifications = asyncHandler(async (req, res) => {
    const { address } = req.params
    const { limit = 50, unreadOnly = false } = req.query

    const notifications = await getUserNotifications(
      address,
      parseInt(limit),
      unreadOnly === "true"
    )

    sendSuccess(res, { notifications })
})

/**
 * Mark notification as read
 */
export const markNotificationRead = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { address } = req.body

    if (!address) {
      return sendBadRequest(res, "User address required")
    }

    const notification = await markAsRead(parseInt(id), address)

    if (!notification) {
      return sendNotFound(res, "Notification")
    }

    sendSuccess(res, { notification })
})

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
    const { address } = req.params

    const count = await markAllAsRead(address)

    sendSuccess(res, { count })
})

/**
 * Get unread count
 */
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
    const { address } = req.params

    const count = await getUnreadCount(address)

    sendSuccess(res, { count })
})

