import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/rate-limit'
import { createSuccessResponse, createErrorResponse } from '@/lib/validation/responses'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first (5 requests/minute per IP)
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    const body = await request.json()

    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid input format', result.error.errors)
    }

    const { email, password } = result.data

    const queryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    // Generic error message prevents user enumeration
    if (queryResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Email or password incorrect' }, { status: 401 })
    }

    const user = queryResult.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      // Same generic message
      return NextResponse.json({ success: false, error: 'Email or password incorrect' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, fullname: user.fullname, role: user.role }
      }
    }, { status: 200 })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return createErrorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Login failed')
  }
}
