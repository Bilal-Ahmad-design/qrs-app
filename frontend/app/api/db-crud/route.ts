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

// Handle CREATE (POST), READ (GET), UPDATE (PUT), DELETE (DELETE)
export async function GET(request: Request) {
  const url = new URL(request.url)
  const collection = url.searchParams.get('collection')
  const id = url.searchParams.get('id')
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

      if (id) {
        const result = await client.query(
          `SELECT * FROM "${tableName}" WHERE id = $1`,
          [id]
        )
        return new Response(JSON.stringify(result.rows[0] || null), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

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
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } finally {
      client.release()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const collection = url.searchParams.get('collection')

  try {
    if (!collection) {
      return new Response(
        JSON.stringify({ error: 'Missing collection parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await request.json()
    const client = await getPool().connect()

    try {
      const tableName = collection.replace(/-/g, '_')
      const columns = Object.keys(data)
      const values = Object.values(data)
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
      const columnsList = columns.map(col => `"${col}"`).join(', ')

      const query = `
        INSERT INTO "${tableName}" (${columnsList})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      return new Response(JSON.stringify(result.rows[0]), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[DB CRUD] POST error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url)
  const collection = url.searchParams.get('collection')
  const id = url.searchParams.get('id')

  try {
    if (!collection || !id) {
      return new Response(
        JSON.stringify({ error: 'Missing collection or id parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await request.json()
    const client = await getPool().connect()

    try {
      const tableName = collection.replace(/-/g, '_')
      const columns = Object.keys(data).filter(col => col !== 'id')
      const values = columns.map(col => data[col])

      if (columns.length === 0) {
        return new Response(JSON.stringify({ error: 'No fields to update' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const setClause = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ')
      const query = `
        UPDATE "${tableName}"
        SET ${setClause}
        WHERE id = $${columns.length + 1}
        RETURNING *
      `

      const result = await client.query(query, [...values, id])

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Record not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[DB CRUD] PUT error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const collection = url.searchParams.get('collection')
  const id = url.searchParams.get('id')

  try {
    if (!collection || !id) {
      return new Response(
        JSON.stringify({ error: 'Missing collection or id parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const client = await getPool().connect()

    try {
      const tableName = collection.replace(/-/g, '_')
      const result = await client.query(
        `DELETE FROM "${tableName}" WHERE id = $1 RETURNING id`,
        [id]
      )

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Record not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ success: true, id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[DB CRUD] DELETE error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
