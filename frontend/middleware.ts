import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * Global middleware to extract JWT from cookie and set auth headers
 * Runs on all API routes and protected pages
 * Sets x-user-id, x-user-role, x-user-email headers for route handlers
 */
export function middleware(request: NextRequest) {
  // Extract JWT from httpOnly cookie
  let token = request.cookies.get('token')?.value

  // Also check Authorization header (Bearer token)
  if (!token) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
        id: string
        email: string
        role: string
        iat: number
        exp: number
      }

      // Create new request headers with auth data
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', String(decoded.id))
      requestHeaders.set('x-user-role', decoded.role)
      requestHeaders.set('x-user-email', decoded.email)

      return NextResponse.next({
        request: { headers: requestHeaders },
      })
    } catch (error) {
      // Invalid/expired token - log and pass through
      // Route handlers will return 401 if auth is required
      console.debug('Invalid JWT token:', error instanceof Error ? error.message : String(error))
    }
  }

  return NextResponse.next()
}

// Match API routes and protected pages
export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/dashboard/:path*'],
}
