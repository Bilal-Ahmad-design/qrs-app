import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findDevUserByEmail, verifyDevUserPassword } from '@/lib/auth/dev-users'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // In development: use fast dev users auth
    // Skip slow Payload queries
    const devUser = await findDevUserByEmail(email)

    if (!devUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const passwordMatch = await verifyDevUserPassword(devUser, password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Login successful - return minimal response
    return NextResponse.json({
      success: true,
      user: {
        id: devUser.id,
        email: devUser.email,
        fullname: devUser.fullname,
        role: devUser.role,
      },
    })
  } catch (error) {
    console.error('[Auth] Login error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
