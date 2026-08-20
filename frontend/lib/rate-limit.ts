/**
 * Sliding-window rate limiter for API endpoints
 * Tracks requests per IP + endpoint combination
 */

interface RateLimitEntry {
  timestamps: number[]
}

const limitStore = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5

/**
 * Get client IP from request
 * Supports x-forwarded-for header (from proxies like Vercel)
 */
function getClientIP(request: Request): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Fallback to other common headers
  return request.headers.get('cf-connecting-ip') || null
}

/**
 * Create a unique key for rate limiting (IP + endpoint)
 */
function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`
}

/**
 * Extract endpoint from request URL
 */
function getEndpoint(request: Request): string {
  try {
    const url = new URL(request.url)
    // Get the path up to first query param
    return url.pathname.split('?')[0]
  } catch {
    return 'unknown'
  }
}

/**
 * Check if request exceeds rate limit
 * Returns true if under limit, false if exceeded
 * Limits are per-endpoint per-IP
 */
export function checkRateLimit(request: Request, identifier?: string): boolean {
  const ip = identifier || getClientIP(request)

  // If we can't get an IP, reject the request (security first)
  if (!ip) {
    console.warn('Rate limit: could not determine client IP')
    return false
  }

  const endpoint = getEndpoint(request)
  const key = getRateLimitKey(ip, endpoint)
  const now = Date.now()
  const entry = limitStore.get(key) || { timestamps: [] }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(ts => now - ts < WINDOW_MS)

  // Check if limit exceeded
  if (entry.timestamps.length >= MAX_REQUESTS) {
    console.warn(`Rate limit exceeded for ${key}: ${entry.timestamps.length} requests in ${WINDOW_MS}ms`)
    return false
  }

  // Add current request
  entry.timestamps.push(now)
  limitStore.set(key, entry)

  return true
}

/**
 * Get remaining requests for an IP on an endpoint
 */
export function getRemainingRequests(request: Request, identifier?: string): number {
  const ip = identifier || getClientIP(request)
  if (!ip) return 0

  const endpoint = getEndpoint(request)
  const key = getRateLimitKey(ip, endpoint)
  const now = Date.now()
  const entry = limitStore.get(key)
  if (!entry) return MAX_REQUESTS

  const activeRequests = entry.timestamps.filter(ts => now - ts < WINDOW_MS).length
  return Math.max(0, MAX_REQUESTS - activeRequests)
}

/**
 * Clean up old entries from store (call periodically to prevent memory leak)
 */
export function cleanupOldEntries(): void {
  const now = Date.now()
  let cleaned = 0

  for (const [key, entry] of limitStore.entries()) {
    const activeCount = entry.timestamps.filter(ts => now - ts < WINDOW_MS).length
    if (activeCount === 0) {
      limitStore.delete(key)
      cleaned++
    }
  }

  if (cleaned > 0) {
    console.debug(`Rate limiter: cleaned up ${cleaned} expired entries`)
  }
}

// Periodically clean up old entries (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldEntries, 5 * 60 * 1000)
}
