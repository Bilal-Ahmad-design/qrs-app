import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

interface SessionUser {
  id: string
  email: string
  fullname: string
  role: 'super-admin' | 'admin' | 'editor' | 'reviewer' | 'read-only'
}

export interface Session {
  user: SessionUser
  iat: number
  exp: number
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV !== 'production') return 'development-only-session-secret'
  throw new Error('SESSION_SECRET must be configured in production')
}

function sign(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url')
}

export async function createSession(user: SessionUser): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify({ user, iat: now, exp: now + 7 * 24 * 60 * 60 })).toString('base64url')
  return `${header}.${body}.${sign(`${header}.${body}`)}`
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const [header, body, signature, ...extra] = token.split('.')
    if (!header || !body || !signature || extra.length) return null

    const expected = Buffer.from(sign(`${header}.${body}`))
    const received = Buffer.from(signature)
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as Session
    if (!payload.user || typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-session')?.value
  return token ? verifySession(token) : null
}
