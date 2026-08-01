import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config({ path: '.env.local' })

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema...')

    // Drop existing users table
    await pool.query('DROP TABLE IF EXISTS users CASCADE')
    console.log('✓ Dropped existing users table')

    // Create users table with correct schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullname VARCHAR(255),
        role VARCHAR(50) DEFAULT 'editor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Created users table with password column')

    // Verify pages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content JSONB,
        description VARCHAR(255),
        seo_title VARCHAR(255),
        seo_description VARCHAR(255),
        status VARCHAR(50) DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Verified pages table')

    console.log('\n✅ Database schema fixed successfully!')
    pool.end()
  } catch (error) {
    console.error('❌ Error:', error.message)
    pool.end()
  }
}

fixDatabase()
