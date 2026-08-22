import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullname: z.string().min(2, 'Full name is required'),
})

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

    // Mock implementation (will be replaced with real Payload auth in Phase 2)
    const token = `payload-token-${Date.now()}`

    const response = NextResponse.json({
      success: true,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullname,
        role: 'read-only',
      },
    })

    // Set httpOnly secure cookie
    response.cookies.set({
      name: 'payload-session',
      value: token,
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
