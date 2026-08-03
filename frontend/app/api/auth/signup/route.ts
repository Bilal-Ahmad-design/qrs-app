import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullname, role, adminToken } = await request.json()

    // Validation
    if (!email || !password || !fullname) {
      return NextResponse.json(
        { error: 'Email, password, and fullname are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Determine user role
    let userRole = 'read-only' // Default for public signup

    // If role is specified and admin token is provided, use the specified role
    if (role && adminToken) {
      const validRoles = ['super-admin', 'admin', 'editor', 'reviewer', 'read-only']
      if (validRoles.includes(role)) {
        // In real app, verify adminToken is valid admin JWT
        // For now, just accept it if provided
        userRole = role
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password, fullname, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, fullname, role`,
      [email, hashedPassword, fullname, userRole]
    )

    const user = result.rows[0]

    // Create JWT token with role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role
      }
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    )
  }
}
