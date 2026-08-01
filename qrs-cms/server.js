import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

dotenv.config({ path: '.env.local' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Initialize database tables
async function initDB() {
  try {
    // Users table
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

    // Pages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Database initialized')
  } catch (error) {
    console.error('DB init error:', error.message)
  }
}

initDB()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname)))

// Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Routes: Authentication

// Signup
app.post('/auth/signup', async (req, res) => {
  const { email, password, fullname } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (email, password, fullname, role) VALUES ($1, $2, $3, $4) RETURNING id, email, fullname, role',
      [email, hashedPassword, fullname || '', 'editor']
    )

    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.json({
      success: true,
      user: { id: user.id, email: user.email, fullname: user.fullname, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Logout
app.post('/auth/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ success: true })
})

// Get current user
app.get('/auth/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, fullname, role, created_at FROM users WHERE id = $1', [req.userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
app.put('/auth/profile', verifyToken, async (req, res) => {
  const { fullname, password } = req.body

  try {
    let query = 'UPDATE users SET fullname = $1'
    let params = [fullname || '']

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      query += ', password = $2'
      params.push(hashedPassword)
    }

    query += ' WHERE id = $' + (params.length + 1) + ' RETURNING id, email, fullname, role'
    params.push(req.userId)

    const result = await pool.query(query, params)
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Routes: Pages (protected)

// Get all pages
app.get('/api/pages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pages ORDER BY id DESC')
    res.json({ pages: result.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get page by ID or slug
app.get('/api/pages/:id', async (req, res) => {
  try {
    let result
    if (!isNaN(req.params.id)) {
      result = await pool.query('SELECT * FROM pages WHERE id = $1', [req.params.id])
    } else {
      result = await pool.query('SELECT * FROM pages WHERE slug = $1', [req.params.id])
    }
    res.json(result.rows[0] || { error: 'Not found' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create page (protected)
app.post('/api/pages', verifyToken, async (req, res) => {
  const { title, slug, content, description, seo_title, seo_description, status } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO pages (title, slug, content, description, seo_title, seo_description, status) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7) RETURNING *',
      [title, slug, content ? JSON.stringify({ text: content }) : null, description || null, seo_title || null, seo_description || null, status || 'published']
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update page (protected)
app.put('/api/pages/:id', verifyToken, async (req, res) => {
  const { title, slug, content, description, seo_title, seo_description, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE pages SET title=$1, slug=$2, content=$3::jsonb, description=$4, seo_title=$5, seo_description=$6, status=$7, updated_at=NOW() WHERE id=$8 RETURNING *',
      [title, slug, content ? JSON.stringify({ text: content }) : null, description || null, seo_title || null, seo_description || null, status || 'published', req.params.id]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete page (protected)
app.delete('/api/pages/:id', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM pages WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'QRS Content API' })
})

// Routes: Pages
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'))
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'))
})

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'))
})

app.listen(PORT, () => {
  console.log('\n✅ QRS Content API Running')
  console.log(`📍 Server: http://localhost:${PORT}`)
  console.log(`🔌 API: http://localhost:${PORT}/api/pages`)
  console.log(`📝 Admin: http://localhost:${PORT}/admin`)
  console.log(`🔐 Login: http://localhost:${PORT}/login\n`)
})
