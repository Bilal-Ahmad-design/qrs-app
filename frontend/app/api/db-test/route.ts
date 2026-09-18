import { Pool, QueryResult } from 'pg'

export const dynamic = 'force-dynamic'

interface TableResult {
  count: number
  data: Record<string, unknown>[]
  columns?: string[]
  error?: string
}

interface DbTestResults {
  [key: string]: TableResult
}

interface DbField {
  name: string
}

export async function GET() {
  let client
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 5000,
    })

    client = await pool.connect()

    const tables = ['users', 'pages', 'blog', 'page_sections']
    const results: DbTestResults = {}

    for (const table of tables) {
      try {
        const countResult: QueryResult<{ count: string }> = await client.query(
          `SELECT COUNT(*) as count FROM ${table}`
        )
        const dataResult: QueryResult<Record<string, unknown>> = await client.query(
          `SELECT * FROM ${table} LIMIT 5`
        )

        const count = parseInt(countResult.rows[0]?.count || '0', 10)
        results[table] = {
          count,
          data: dataResult.rows,
          columns: dataResult.fields.map((f: DbField) => f.name),
        }
        console.error(`[DB-TEST] ${table}: ${count} records`)
      } catch (err) {
        console.error(`[DB-TEST] Error querying ${table}:`, (err as Error).message)
        results[table] = {
          count: 0,
          data: [],
          error: (err as Error).message,
        }
      }
    }

    client.release()
    await pool.end()

    return Response.json(results, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })
  } catch (error) {
    console.error('[DB-TEST] Fatal error:', error)
    if (client) client.release()

    return Response.json(
      {
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
