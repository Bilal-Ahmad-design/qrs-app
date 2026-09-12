import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function checkSchema() {
  try {
    const client = await pool.connect()

    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name='page_sections'
      ORDER BY ordinal_position
    `)

    console.log('page_sections table columns:')
    console.log(result.rows)

    client.release()
    await pool.end()
  } catch (error) {
    console.error('Error:', error)
    await pool.end()
  }
}

checkSchema()
