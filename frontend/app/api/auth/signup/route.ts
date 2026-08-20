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

// Signup validation schema
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullname: z.string().min(1, 'Fullname is required'),
  role: z.enum(['super-admin', 'admin', 'editor', 'reviewer', 'read-only']).optional(),
  adminToken: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first (5 requests/minute per IP)
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    const body = await request.json()

    // Validate input
    const result = signupSchema.safeParse(body)
    if (!result.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid input format', result.error.errors)
    }

    const { email, password, fullname, role, adminToken } = result.data

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return createErrorResponse('USER_EXISTS', 'Email already registered')
    }

    // Determine user role
    let userRole = 'read-only' // Default for public signup

    // If role is specified and admin token is provided, use the specified role
    if (role && adminToken) {
      // In real app, verify adminToken is valid admin JWT
      // For now, just accept it if provided
      userRole = role
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const insertResult = await pool.query(
      `INSERT INTO users (email, password, fullname, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, fullname, role`,
      [email, hashedPassword, fullname, userRole]
    )

    const user = insertResult.rows[0]

    // Create JWT token with role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    const response = createSuccessResponse(
      { user: { id: user.id, email: user.email, fullname: user.fullname, role: user.role } },
      'Signup successful',
      201
    ) as NextResponse

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return createErrorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Signup failed')
  }
}
