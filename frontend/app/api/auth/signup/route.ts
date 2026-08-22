import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSession } from '@/lib/auth/session'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullname: z.string().min(2, 'Full name is required'),
})

async function createPayloadUser(email: string, password: string, fullname: string) {
  try {
    const url = new URL('/api/payload/users', process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000')

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        fullname,
        role: 'read-only',
        isActive: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Failed to create Payload user:', error)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Payload user:', error)
    return null
  }
}

async function logSignup(email: string, success: boolean, userId?: string) {
  try {
    const url = new URL('/api/payload/audit-logs', process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000')

    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actor: userId || 'anonymous',
        action: success ? 'signup' : 'signup-failed',
        collection: 'users',
        email: email,
        description: success ? `New user ${email} signed up` : `Failed signup attempt for ${email}`,
      }),
    })
  } catch (error) {
    console.error('Error logging signup:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error?.issues || [] },
        { status: 400 }
      )
    }

    const { email, password, fullname } = validation.data

    // Create user in Payload
    const payloadUser = await createPayloadUser(email, password, fullname)

    if (!payloadUser) {
      await logSignup(email, false)
      return NextResponse.json(
        { error: 'Failed to create account. Email may already be in use.' },
        { status: 400 }
      )
    }

    // Create session
    const sessionToken = await createSession({
      id: payloadUser.id,
      email: payloadUser.email,
      fullname: payloadUser.fullname || payloadUser.email,
      role: payloadUser.role || 'read-only',
    })

    // Log successful signup
    await logSignup(email, true, payloadUser.id)

    // Create response and set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: payloadUser.id,
        email: payloadUser.email,
        fullname: payloadUser.fullname,
        role: payloadUser.role || 'read-only',
      },
    })

    // Set httpOnly secure cookie
    response.cookies.set({
      name: 'payload-session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    )
  }
}
