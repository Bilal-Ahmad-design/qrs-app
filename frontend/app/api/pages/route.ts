import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'
import jwt from 'jsonwebtoken'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

function getToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch {
    return null
  }
}

// GET all pages or GET page by ID/slug
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')

    if (id) {
      const result = await pool.query('SELECT * FROM pages WHERE id = $1', [id])
      return NextResponse.json(result.rows[0] || { error: 'Not found' })
    }

    if (slug) {
      const result = await pool.query('SELECT * FROM pages WHERE slug = $1', [slug])
      return NextResponse.json(result.rows[0] || { error: 'Not found' })
    }

    const result = await pool.query('SELECT * FROM pages ORDER BY id DESC')
    return NextResponse.json({ pages: result.rows })
  } catch (error) {
    console.error('Get pages error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get pages' },
      { status: 500 }
    )
  }
}

// POST create page (requires auth)
export async function POST(request: NextRequest) {
  try {
    const user = getToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, slug, content, description, seo_title, seo_description, status } = await request.json()

    const result = await pool.query(
      'INSERT INTO pages (title, slug, content, description, seo_title, seo_description, status) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7) RETURNING *',
      [title, slug, content ? JSON.stringify({ text: content }) : null, description || null, seo_title || null, seo_description || null, status || 'published']
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Create page error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create page' },
      { status: 500 }
    )
  }
}

// PUT update page (requires auth)
export async function PUT(request: NextRequest) {
  try {
    const user = getToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const { title, slug, content, description, seo_title, seo_description, status } = await request.json()

    const result = await pool.query(
      'UPDATE pages SET title=$1, slug=$2, content=$3::jsonb, description=$4, seo_title=$5, seo_description=$6, status=$7, updated_at=NOW() WHERE id=$8 RETURNING *',
      [title, slug, content ? JSON.stringify({ text: content }) : null, description || null, seo_title || null, seo_description || null, status || 'published', id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Update page error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE page (requires auth)
export async function DELETE(request: NextRequest) {
  try {
    const user = getToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await pool.query('DELETE FROM pages WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete page error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete page' },
      { status: 500 }
    )
  }
}
