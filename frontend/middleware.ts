import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PROTECTED_ROUTES = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('payload-session')?.value
  const secret = process.env.SESSION_SECRET || (process.env.NODE_ENV !== 'production' ? 'development-only-session-secret' : '')

  if (token && secret) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] })
      if (payload.user) return NextResponse.next()
    } catch {
      // Redirect below for expired or forged sessions.
    }
  }

  const url = request.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('redirect', pathname)
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/admin/:path*'] }
