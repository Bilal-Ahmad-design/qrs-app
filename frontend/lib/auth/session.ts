import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

interface SessionUser {
  id: string
  email: string
  fullname: string
  role: 'super-admin' | 'admin' | 'editor' | 'reviewer' | 'read-only'
}

interface Session {
  user: SessionUser
  iat: number
  exp: number
}

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'fallback-secret-key')

export async function createSession(user: SessionUser): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    user,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  }

  const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'fallback-secret-key')

  // Use built-in crypto for JWT signing
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))

  // Simple HMAC-SHA256 signing using Node's crypto
  const { createHmac } = await import('crypto')
  const hmac = createHmac('sha256', process.env.SESSION_SECRET || 'fallback-secret-key')
  hmac.update(`${header}.${body}`)
  const signature = hmac.digest('base64url')

  return `${header}.${body}.${signature}`
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { createHmac } = await import('crypto')
    const parts = token.split('.')

    if (parts.length !== 3) return null

    const [header, body, signature] = parts
    const hmac = createHmac('sha256', process.env.SESSION_SECRET || 'fallback-secret-key')
    hmac.update(`${header}.${body}`)
    const expectedSignature = hmac.digest('base64url')

    if (signature !== expectedSignature) return null

    const payload = JSON.parse(Buffer.from(body, 'base64').toString())
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp < now) return null

    return payload
  } catch {
    return null
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-session')?.value

  if (!token) return null

  return verifySession(token)
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('payload-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('payload-session')
}
