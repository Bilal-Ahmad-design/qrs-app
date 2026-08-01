import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

;(async () => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pages'
      ORDER BY ordinal_position
    `)
    console.log('Pages Table Schema:')
    console.log('==================')
    result.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
  } catch (error) {
    console.error('Error:', error.message)
  }
  pool.end()
})()
