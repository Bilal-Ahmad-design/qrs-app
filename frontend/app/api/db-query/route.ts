import { Pool } from 'pg'

export const runtime = 'nodejs'

let pool: Pool | null = null

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }
  return pool
}

export async function GET(request: Request) {
  const start = Date.now()
  const url = new URL(request.url)
  const collection = url.searchParams.get('collection')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 1000)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))

  try {
    if (!collection) {
      return new Response(
        JSON.stringify({ error: 'Missing collection parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const client = await getPool().connect()

    try {
      const tableName = collection.replace(/-/g, '_')
      const offset = (page - 1) * limit

      const result = await client.query(
        `SELECT * FROM "${tableName}" ORDER BY id DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      )

      const countResult = await client.query(`SELECT COUNT(*) FROM "${tableName}"`)
      const totalDocs = parseInt(countResult.rows[0].count)

      return new Response(
        JSON.stringify({
          docs: result.rows,
          totalDocs,
          limit,
          page,
          totalPages: Math.ceil(totalDocs / limit),
          hasNextPage: page < Math.ceil(totalDocs / limit),
          hasPrevPage: page > 1,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } finally {
      client.release()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[DB Query] Error:', message)

    return new Response(
      JSON.stringify({
        error: 'Database query failed',
        message,
        elapsedMs: Date.now() - start,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
