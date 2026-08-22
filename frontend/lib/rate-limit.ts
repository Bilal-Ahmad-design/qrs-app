import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export function rateLimit(options: {
  maxRequests: number
  windowMs: number
}) {
  return (req: NextRequest) => {
    const ip = getClientIp(req)
    const now = Date.now()
    const key = `rate-limit:${ip}`

    if (!store[key]) {
      store[key] = { count: 0, resetTime: now + options.windowMs }
    }

    const record = store[key]

    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0
      record.resetTime = now + options.windowMs
    }

    // Increment counter
    record.count++

    // Check limit
    if (record.count > options.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    return null
  }
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    req.ip ||
    'unknown'
  )
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (now > store[key].resetTime + 60000) {
      delete store[key]
    }
  }
}, 60000)
