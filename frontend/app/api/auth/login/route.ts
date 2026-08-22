import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { createSession, setSessionCookie } from '@/lib/auth/session'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

async function queryPayloadUsers(email: string) {
  try {
    const url = new URL('/api/payload/api/users', process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000')
    url.searchParams.set('where[email][equals]', email)

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error querying Payload users:', error)
    return null
  }
}

async function logLoginAttempt(email: string, success: boolean, userId?: string) {
  try {
    const url = new URL('/api/payload/api/audit-logs', process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000')

    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actor: userId || 'anonymous',
        action: success ? 'login' : 'login-failed',
        collection: 'users',
        email: email,
        description: success ? `User ${email} logged in` : `Failed login attempt for ${email}`,
      }),
    })
  } catch (error) {
    console.error('Error logging login attempt:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error?.issues || [] },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Query Payload for user
    const payloadUser = await queryPayloadUsers(email)

    if (!payloadUser) {
      await logLoginAttempt(email, false)
      return NextResponse.json(
        { error: 'Email or password is incorrect' },
        { status: 401 }
      )
    }

    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, payloadUser.password || '')

    if (!passwordMatch) {
      await logLoginAttempt(email, false, payloadUser.id)
      return NextResponse.json(
        { error: 'Email or password is incorrect' },
        { status: 401 }
      )
    }

    // Create session
    const sessionToken = await createSession({
      id: payloadUser.id,
      email: payloadUser.email,
      fullname: payloadUser.fullname || payloadUser.email,
      role: payloadUser.role || 'read-only',
    })

    // Log successful login
    await logLoginAttempt(email, true, payloadUser.id)

    // Create response and set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: payloadUser.id,
        email: payloadUser.email,
        fullname: payloadUser.fullname || payloadUser.email,
        role: payloadUser.role || 'read-only',
      },
    })

    // Set httpOnly secure cookie via response
    response.cookies.set({
      name: 'payload-session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
