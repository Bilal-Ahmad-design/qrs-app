import { Pool } from 'pg'

let pool: Pool | null = null

export async function checkDatabaseHealth(): Promise<{ ok: boolean; message: string; time: number }> {
  const start = Date.now()

  try {
    if (!process.env.DATABASE_URL) {
      return { ok: false, message: 'DATABASE_URL not set', time: Date.now() - start }
    }

    if (!pool) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      })
    }

    const client = await Promise.race([
      pool.connect(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 5s')), 5000)
      ),
    ])

    await client.query('SELECT NOW()')
    client.release()

    const time = Date.now() - start
    return { ok: true, message: 'Database connected', time }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { ok: false, message: `Database error: ${message}`, time: Date.now() - start }
  }
}

export async function closeDatabasePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
