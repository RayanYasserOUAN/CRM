// ─── In-memory rate limiter ─────────────────────────────────────────────
//
// Simple token-bucket per key (IP, username, etc.).
// Resets automatically after the window expires.
// NOT shared across serverless instances — sufficient for a single-server
// deployment or low-traffic CRM. For distributed rate limiting across
// Vercel edge functions, replace with Upstash Redis or similar.
//

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if an action is within the rate limit for the given key.
 *
 * @param key      Unique identifier (e.g. IP address, username)
 * @param maxAttempts  Maximum attempts within the window (default: 5)
 * @param windowMs     Window duration in milliseconds (default: 60_000 = 1 min)
 */
export function rateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  // First attempt or window expired — reset
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxAttempts - 1, resetAt: now + windowMs }
  }

  // Within window — increment
  entry.count++

  if (entry.count > maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: maxAttempts - entry.count, resetAt: entry.resetAt }
}

/**
 * Periodic cleanup to prevent memory leaks.
 * Call this from a cron job or on app startup in dev.
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}
