import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 5,
})

export const dynamic = 'force-dynamic'

export async function GET() {
  const client = await pool.connect()

  try {
    console.log('[DB-TEST] Starting direct PostgreSQL queries...')

    // Query Pages table
    const pagesResult = await client.query(
      'SELECT id, title, slug, published, "createdAt" FROM pages ORDER BY "createdAt" DESC LIMIT 20'
    )
    console.log('[DB-TEST] Pages query completed:', pagesResult.rowCount, 'rows')

    // Query Page Sections table
    const sectionsResult = await client.query(
      'SELECT id, title, "componentType", page, "createdAt" FROM page_sections ORDER BY "createdAt" DESC LIMIT 20'
    )
    console.log('[DB-TEST] Sections query completed:', sectionsResult.rowCount, 'rows')

    // Query Users table
    const usersResult = await client.query(
      'SELECT id, email, role, "createdAt" FROM users ORDER BY "createdAt" DESC LIMIT 20'
    )
    console.log('[DB-TEST] Users query completed:', usersResult.rowCount, 'rows')

    // Query Blog table
    const blogResult = await client.query(
      'SELECT id, title, published, "createdAt" FROM blog ORDER BY "createdAt" DESC LIMIT 20'
    )
    console.log('[DB-TEST] Blog query completed:', blogResult.rowCount, 'rows')

    return Response.json(
      {
        pages: {
          count: pagesResult.rowCount || 0,
          data: pagesResult.rows || [],
        },
        sections: {
          count: sectionsResult.rowCount || 0,
          data: sectionsResult.rows || [],
        },
        users: {
          count: usersResult.rowCount || 0,
          data: usersResult.rows || [],
        },
        blog: {
          count: blogResult.rowCount || 0,
          data: blogResult.rows || [],
        },
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('[DB-TEST] Database error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown database error'

    return Response.json(
      {
        error: 'Database query failed',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
