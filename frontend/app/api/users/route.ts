import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

interface DecodedToken {
  id: number
  email: string
  role: string
  iat: number
  exp: number
}

/**
 * Verify JWT token and return decoded data
 */
function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    return decoded as DecodedToken
  } catch {
    return null
  }
}

/**
 * Get auth token from request
 */
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  // Also check cookies
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split('; ')
    const tokenCookie = cookies.find(c => c.startsWith('token='))
    if (tokenCookie) {
      return tokenCookie.slice(6)
    }
  }

  return null
}

/**
 * GET /api/users - List all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !['admin', 'super-admin'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await pool.query(
      'SELECT id, email, fullname, role, created_at FROM users ORDER BY created_at DESC'
    )

    return NextResponse.json({
      success: true,
      users: result.rows
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/users - Create new user (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !['admin', 'super-admin'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { email, password, fullname, role } = await request.json()

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

    // Validate role
    const validRoles = ['super-admin', 'admin', 'editor', 'reviewer', 'read-only']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Super-admin can create any role, admin can create up to editor
    if (decoded.role === 'admin' && ['super-admin', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create this role' },
        { status: 403 }
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password, fullname, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, fullname, role, created_at`,
      [email, hashedPassword, fullname, role]
    )

    const user = result.rows[0]

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/users/:id - Update user (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !['admin', 'super-admin'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, fullname, role, status } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Build update query
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (fullname !== undefined) {
      updates.push(`fullname = $${paramCount}`)
      values.push(fullname)
      paramCount++
    }

    if (role !== undefined) {
      // Super-admin can set any role, admin cannot set super-admin
      if (decoded.role === 'admin' && role === 'super-admin') {
        return NextResponse.json(
          { error: 'Cannot promote to super-admin' },
          { status: 403 }
        )
      }

      updates.push(`role = $${paramCount}`)
      values.push(role)
      paramCount++
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    values.push(id)

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, fullname, role, created_at
    `

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/users/:id - Delete user (super-admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (decoded?.role !== 'super-admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Prevent deleting own account
    if (id === decoded.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
