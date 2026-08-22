import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin']

// Routes that are public (no auth required)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/setup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

export function middleware(request: NextRequest) {
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

  // If no session and trying to access protected route, redirect to login
  if (!hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Session exists, allow request to proceed
  // Detailed verification happens in API routes where we have Node.js crypto access
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.webp).*)',
  ],
}
