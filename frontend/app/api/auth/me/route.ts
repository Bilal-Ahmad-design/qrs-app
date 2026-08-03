import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'
import jwt, { JwtPayload } from 'jsonwebtoken'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

interface DecodedToken extends JwtPayload {
  id: number
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as DecodedToken
    const result = await pool.query(
      'SELECT id, email, fullname, role, created_at FROM users WHERE id = $1',
      [decoded.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
