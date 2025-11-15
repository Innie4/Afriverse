// Response handler utility (DRY: Don't Repeat Yourself)
import logger from "../config/logger.js"

/**
 * Success response handler
 */
export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  })
}

/**
 * Error response handler
 */
export function sendError(res, error, statusCode = 500) {
  const message = error?.message || "Internal server error"
  const status = error?.status || statusCode

  logger.error("API Error:", { message, status, stack: error?.stack })

  return res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error?.stack }),
  })
}

/**
 * Not found response handler
 */
export function sendNotFound(res, resource = "Resource") {
  return res.status(404).json({
    success: false,
    error: `${resource} not found`,
  })
}

/**
 * Bad request response handler
 */
export function sendBadRequest(res, message = "Bad request") {
  return res.status(400).json({
    success: false,
    error: message,
  })
}

/**
 * Async handler wrapper (DRY: Error handling)
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

