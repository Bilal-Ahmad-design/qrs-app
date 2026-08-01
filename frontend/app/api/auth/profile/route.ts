import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    const { fullname, password } = await request.json()

    let query = 'UPDATE users SET fullname = $1'
    let params: any[] = [fullname || '']

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      query += ', password = $2'
      params.push(hashedPassword)
    }

    query += ` WHERE id = $${params.length + 1} RETURNING id, email, fullname, role`
    params.push(decoded.id)

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    )
  }
}
