import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin']

// Routes that are public (no auth required)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

async function verifySession(token: string): Promise<boolean> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false

    const [header, body, signature] = parts
    const { createHmac } = await import('crypto')
    const hmac = createHmac('sha256', process.env.SESSION_SECRET || 'fallback-secret-key')
    hmac.update(`${header}.${body}`)
    const expectedSignature = hmac.digest('base64url')

    if (signature !== expectedSignature) return false

    const payload = JSON.parse(Buffer.from(body, 'base64').toString())
    const now = Math.floor(Date.now() / 1000)

    // Check if token is expired
    if (payload.exp < now) return false

    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const requiresAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  if (!requiresAuth) {
    return NextResponse.next()
  }

  // Get the session cookie
  const cookie = request.cookies.get('payload-session')
  const hasSession = !!cookie?.value

  // If no session and trying to access protected route
  if (!hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Verify session token is valid
  const isValid = await verifySession(cookie.value)

  if (!isValid) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.webp).*)',
  ],
}
