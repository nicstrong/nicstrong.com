import { kv } from '@vercel/kv'

interface RateLimitData {
  lastFetch: number
  requestCount: number
  windowStart: number
}

const WINDOW_SIZE = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 1 // Only 1 GitHub API call per 15 minutes
const RATE_LIMIT_KEY = 'rate-limit:github-api'

async function readRateLimit(): Promise<RateLimitData | null> {
  try {
    const data = await kv.get<RateLimitData>(RATE_LIMIT_KEY)
    return data
  } catch (error) {
    console.error('Error reading rate limit:', error)
    return null
  }
}

async function writeRateLimit(data: RateLimitData): Promise<void> {
  try {
    // Set with expiry to auto-cleanup old data
    await kv.setex(RATE_LIMIT_KEY, Math.ceil(WINDOW_SIZE / 1000), data)
  } catch (error) {
    console.error('Error writing rate limit:', error)
  }
}

export async function checkRateLimit(): Promise<{
  allowed: boolean
  reason?: string
  timeRemaining?: number
}> {
  const now = Date.now()
  const rateLimit = await readRateLimit()

  console.log('[CheckRateLimit]: rateLimit', rateLimit, WINDOW_SIZE)

  // If no rate limit data exists, allow the request
  if (!rateLimit) {
    return { allowed: true }
  }

  // Check if we're in a new time window
  if (now - rateLimit.windowStart > WINDOW_SIZE) {
    // Reset for new window
    const newRateLimit: RateLimitData = {
      lastFetch: 0,
      requestCount: 0,
      windowStart: now,
    }
    await writeRateLimit(newRateLimit)
    return { allowed: true }
  }

  // Check if we've exceeded the limit in current window
  if (rateLimit.requestCount >= MAX_REQUESTS) {
    const timeRemaining = WINDOW_SIZE - (now - rateLimit.windowStart)
    return {
      allowed: false,
      reason: `Rate limit exceeded. Try again in ${Math.ceil(timeRemaining / 60000)} minutes.`,
      timeRemaining,
    }
  }

  return { allowed: true }
}

export async function updateRateLimit(): Promise<void> {
  const now = Date.now()
  const rateLimit = await readRateLimit()

  if (rateLimit) {
    // Update existing rate limit
    rateLimit.lastFetch = now
    rateLimit.requestCount += 1
    await writeRateLimit(rateLimit)
  } else {
    // Create new rate limit
    const newRateLimit: RateLimitData = {
      lastFetch: now,
      requestCount: 1,
      windowStart: now,
    }
    await writeRateLimit(newRateLimit)
  }
}

// Helper function to get time remaining until rate limit resets
export async function getRateLimitStatus(): Promise<{
  timeRemaining: number
  requestCount: number
  maxRequests: number
  windowSize: number
} | null> {
  const rateLimit = await readRateLimit()
  if (!rateLimit) {
    return null
  }

  const now = Date.now()
  const timeRemaining = Math.max(0, WINDOW_SIZE - (now - rateLimit.windowStart))

  return {
    timeRemaining,
    requestCount: rateLimit.requestCount,
    maxRequests: MAX_REQUESTS,
    windowSize: WINDOW_SIZE,
  }
}
