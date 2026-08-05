import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import multer from 'multer'

dotenv.config({ path: '.env.local' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Media upload configuration
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
    cb(null, name)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`))
    }
  }
})

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

// File-based persistence for sections
const SECTIONS_FILE = path.join(__dirname, 'sections-data.json')

function loadSectionsFromFile(defaultData) {
  try {
    if (fs.existsSync(SECTIONS_FILE)) {
      const data = fs.readFileSync(SECTIONS_FILE, 'utf8')
      console.log('✓ Sections loaded from file')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading sections file:', error.message)
  }
  return defaultData
}

function saveSectionsToFile(data) {
  try {
    fs.writeFileSync(SECTIONS_FILE, JSON.stringify(data, null, 2), 'utf8')
    console.log('✓ Sections saved to file')
  } catch (error) {
    console.error('Error saving sections file:', error.message)
  }
}

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://192.168.18.38:3000'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname)))

// Serve uploaded files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(UPLOADS_DIR))

// Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const token = req.cookies.token

  console.log('[TOKEN DEBUG] Checking token...')
  console.log('[TOKEN DEBUG] Cookies received:', req.cookies)

  if (!token) {
    console.log('[TOKEN DEBUG] No token found in cookies')
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    console.log('[TOKEN DEBUG] Verifying token...')
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('[TOKEN DEBUG] Token verified for user ID:', decoded.id)
    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (error) {
    console.error('[TOKEN DEBUG] Token verification failed:', error.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Routes: Authentication

// Signup
app.post('/api/auth/signup', async (req, res) => {
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
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  console.log('[LOGIN DEBUG] Login attempt for email:', email)

  if (!email || !password) {
    console.log('[LOGIN DEBUG] Missing email or password')
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (result.rows.length === 0) {
      console.log('[LOGIN DEBUG] User not found:', email)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]
    console.log('[LOGIN DEBUG] User found:', user.email)

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      console.log('[LOGIN DEBUG] Password mismatch for user:', email)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    console.log('[LOGIN DEBUG] Token created, setting cookie')

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    console.log('[LOGIN DEBUG] Login successful for:', user.email)
    res.json({
      success: true,
      user: { id: user.id, email: user.email, fullname: user.fullname, role: user.role }
    })
  } catch (error) {
    console.error('[LOGIN DEBUG] Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ success: true })
})

// Get current user
app.get('/api/auth/me', verifyToken, async (req, res) => {
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

// Create user (admin endpoint)
app.post('/api/users', async (req, res) => {
  const { email, password, fullname, role, status } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (email, password, fullname, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, fullname, role, created_at',
      [email, hashedPassword, fullname || '', role || 'editor']
    )

    const user = result.rows[0]
    console.log('[USER CREATE] New user created:', email)
    res.status(201).json({
      docs: [user],
      total: 1,
      success: true
    })
  } catch (error) {
    console.error('[USER CREATE ERROR]', error.message)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: error.message })
  }
})

// Get all users (admin endpoint)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, fullname, role, created_at FROM users ORDER BY created_at DESC')
    res.json({
      docs: result.rows,
      total: result.rows.length
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, fullname, role, created_at FROM users WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user (admin endpoint)
app.patch('/api/users/:id', verifyToken, async (req, res) => {
  const { email, password, fullname, role, status } = req.body
  const userId = req.params.id

  try {
    let query = 'UPDATE users SET email=$1, fullname=$2, role=$3'
    let params = [email, fullname || '', role || 'editor']
    let paramCount = 4

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      query += `, password=$${paramCount}`
      params.push(hashedPassword)
      paramCount++
    }

    query += `, updated_at=NOW() WHERE id=$${paramCount} RETURNING id, email, fullname, role, created_at`
    params.push(userId)

    const result = await pool.query(query, params)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    console.log('[USER UPDATE] User updated:', email)
    res.json(result.rows[0])
  } catch (error) {
    console.error('[USER UPDATE ERROR]', error.message)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: error.message })
  }
})

// Delete user (admin endpoint)
app.delete('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, email', [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    console.log('[USER DELETE] User deleted:', result.rows[0].email)
    res.json({ success: true, message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Reset user password (admin endpoint)
app.post('/api/users/:id/reset-password', verifyToken, async (req, res) => {
  const { password } = req.body
  const userId = req.params.id

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, fullname, role',
      [hashedPassword, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    console.log('[PASSWORD RESET] Password reset for user:', result.rows[0].email)
    res.json({
      success: true,
      message: 'Password reset successfully',
      user: result.rows[0],
      tempPassword: password
    })
  } catch (error) {
    console.error('[PASSWORD RESET ERROR]', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
app.put('/api/auth/profile', verifyToken, async (req, res) => {
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

// Page Sections - Seed Data (exact frontend content, now dynamic via CMS)
let pageSectionsData = {
  home: [
    {
      id: 'hero',
      page: 'home',
      title: 'Hero Section',
      subtitle: 'Patent Pending: QRS-001-PROV',
      heading: 'Run catastrophe models in seconds. Release billions in trapped capital.',
      description: 'Every number cryptographically signed and independently verifiable.',
      sectionType: 'hero',
      backgroundStyle: 'dark',
      buttonText: 'Request Demo',
      buttonUrl: '/platform',
      secondaryButtonText: 'Request Validation Report',
      secondaryButtonUrl: 'https://ssrn.com',
      order: 0,
      published: true
    },
    {
      id: 'active-models',
      page: 'home',
      title: 'Active Models',
      heading: 'ACTIVE MODELS',
      sectionType: 'feature-grid',
      backgroundStyle: 'light',
      items: [
        { title: 'North Atlantic Hurricane', icon: '🌀' },
        { title: 'California Wildfire', icon: '🔥' },
        { title: 'European Wind', icon: '💨' },
        { title: 'Japan Typhoon', icon: '🌊' }
      ],
      order: 1,
      published: true
    },
    {
      id: 'verifiable-by-design',
      page: 'home',
      title: 'Verifiable by Design',
      heading: 'Verifiable by Design',
      description: 'Every calculation is cryptographically signed and independently verifiable. Built-in reproducibility, not an afterthought.',
      sectionType: 'text-image',
      backgroundStyle: 'white',
      order: 2,
      published: true
    },
    {
      id: 'ai-native',
      page: 'home',
      title: 'AI-Native Architecture',
      heading: 'AI-Native Architecture',
      description: 'Built from the ground up for institutional intelligence and scalability.',
      sectionType: 'feature-grid',
      backgroundStyle: 'dark',
      items: [
        {
          title: 'Copilot Interface',
          description: 'Natural language queries over your risk models. Ask questions about exposures, scenarios, and capital deployment strategies.'
        },
        {
          title: 'Institutional Ontology',
          description: 'Deep understanding of reinsurance contracts, portfolios, and catastrophic risk structures. Purpose-built for professionals.'
        },
        {
          title: 'MCP Server',
          description: 'Open protocol for tool integration. Connect external data sources, analytics platforms, and enterprise systems.'
        }
      ],
      order: 3,
      published: true
    },
    {
      id: 'crisis',
      page: 'home',
      title: 'The Crisis',
      heading: 'The Crisis',
      description: '7 of 12 top carriers withdrew from California',
      sectionType: 'stats',
      backgroundStyle: 'white',
      items: [
        {
          value: '$10B+',
          title: 'Insured Losses',
          description: '2023-2024 catastrophic events driving capital constraints'
        },
        {
          value: '$8-12B',
          title: 'Excess Capital Trapped',
          description: 'Reinsurance capital unable to deploy due to model uncertainty'
        },
        {
          value: '300%',
          title: 'FAIR Plan Surge',
          description: 'State insurance of last resort reaching capacity limits'
        },
        {
          value: '14x',
          title: 'Model Divergence',
          description: 'Vendor modeling outputs diverge by factor of 14 on same exposure'
        }
      ],
      order: 4,
      published: true
    },
    {
      id: 'how-it-works',
      page: 'home',
      title: 'How It Works',
      heading: 'How It Works',
      sectionType: 'feature-grid',
      backgroundStyle: 'light',
      items: [
        { value: '01', title: 'Upload Portfolio', description: 'Ingest exposure data in your native format' },
        { value: '02', title: 'Run Model', description: 'Quantum-optimized catastrophe modeling engine' },
        { value: '03', title: 'Verify Results', description: 'Cryptographic reproducibility certificate included' },
        { value: '04', title: 'Deploy Capital', description: 'Verified metrics ready for institutional deployment' }
      ],
      order: 5,
      published: true
    },
    {
      id: 'validation',
      page: 'home',
      title: 'Independently Validated',
      heading: 'Independently Validated',
      description: 'QRS models are independently verified by leading academic and industry experts',
      sectionType: 'feature-grid',
      backgroundStyle: 'white',
      items: [
        {
          title: 'SSRN Validation Study',
          description: 'Peer-reviewed quantitative validation of QRS portfolio analytics methodology',
          link: 'https://ssrn.com'
        },
        {
          title: 'Third-Party Audit',
          description: 'Independent verification of model assumptions, calculation integrity, and reproducibility',
          link: '/validation/'
        }
      ],
      order: 6,
      published: true
    },
    {
      id: 'cta',
      page: 'home',
      title: 'Ready to move institutional capital?',
      heading: 'Ready to move institutional capital?',
      description: 'Connect with our team to discuss how QRS can accelerate your risk deployment strategy.',
      sectionType: 'cta',
      backgroundStyle: 'dark',
      buttonText: 'Request Demo',
      buttonUrl: '/platform',
      order: 7,
      published: true
    }
  ],
  about: [
    {
      id: 'hero',
      page: 'about',
      title: 'About QRS',
      heading: 'About QRS',
      description: 'Building trust infrastructure for institutional risk management through cryptographic verification and auditable analytics.',
      sectionType: 'hero',
      backgroundStyle: 'dark',
      order: 0,
      published: true
    },
    {
      id: 'mission',
      page: 'about',
      title: 'Mission & Values',
      heading: 'Our Mission',
      description: 'QRS is building the trust infrastructure for institutional risk management. Every calculation is cryptographically signed and independently verifiable, enabling institutional investors to make confident decisions backed by auditable, reproducible analysis.',
      sectionType: 'text-image',
      backgroundStyle: 'light',
      order: 1,
      published: true
    },
    {
      id: 'why-verifiable',
      page: 'about',
      title: 'Why Verifiable Risk?',
      heading: 'Why Verifiable Risk?',
      description: 'Institutional risk management demands more than black-box analytics. Our platform gives institutional investors the ability to independently verify every calculation, audit the entire lineage of a risk analysis, and build confidence in the numbers driving their decisions.',
      sectionType: 'feature-grid',
      backgroundStyle: 'light',
      items: [
        { title: 'Transparent', description: 'Open-source verification tools. No hidden algorithms or proprietary black boxes.' },
        { title: 'Reproducible', description: 'Cryptographically signed calculations that third parties can independently verify.' },
        { title: 'Auditable', description: 'Complete lineage tracking for every metric, decision, and analysis.' }
      ],
      order: 2,
      published: true
    },
    {
      id: 'team',
      page: 'about',
      title: 'Built by Risk Experts',
      heading: 'Built by Risk Experts',
      description: 'The QRS team brings together leaders in quantitative finance, software architecture, and institutional risk management.',
      sectionType: 'text-image',
      backgroundStyle: 'white',
      order: 3,
      published: true
    }
  ],
  platform: [
    {
      id: 'hero',
      page: 'platform',
      title: 'Quantitative Risk Platform',
      heading: 'Quantitative Risk Platform',
      description: 'Enterprise-grade risk analytics built for institutional investors, asset managers, and reinsurance professionals.',
      sectionType: 'hero',
      backgroundStyle: 'dark',
      order: 0,
      published: true
    },
    {
      id: 'capabilities',
      page: 'platform',
      title: 'Core Capabilities',
      heading: 'Core Capabilities',
      sectionType: 'feature-grid',
      backgroundStyle: 'light',
      items: [
        { title: 'Portfolio Analytics', description: 'Real-time VaR, TVaR, and scenario analysis across multi-asset portfolios with instant recalculation.' },
        { title: 'Stress Testing', description: 'Historical and hypothetical scenarios with cryptographic reproducibility for audit compliance.' },
        { title: 'Risk Reporting', description: 'Auditable risk reports with verified calculations and complete lineage tracking for every metric.' }
      ],
      order: 1,
      published: true
    }
  ],
  trust: [
    {
      id: 'hero',
      page: 'trust',
      title: 'Built for Trust',
      heading: 'Built for Trust',
      description: 'Enterprise-grade security, cryptographic verification, and independent audit trails at every step — designed for institutional review and continuous assurance.',
      sectionType: 'hero',
      backgroundStyle: 'dark',
      order: 0,
      published: true
    },
    {
      id: 'security',
      page: 'trust',
      title: 'Security & Compliance',
      heading: 'Security & Compliance',
      sectionType: 'feature-grid',
      backgroundStyle: 'light',
      items: [
        {
          title: 'Cryptographic Reproducibility',
          description: 'Every calculation is cryptographically signed with our ECDSA seal. Independently verify any analysis using open-source verification tools.',
          icon: '🔐'
        },
        {
          title: 'Compliance Certifications',
          description: 'SOC 2 audit in progress via Vanta, supported by structured controls, deployment monitoring, and a growing evidence trail for customer diligence and audit readiness.',
          icon: '✓'
        }
      ],
      order: 1,
      published: true
    }
  ],
  validation: [
    {
      id: 'hero',
      page: 'validation',
      title: 'Independently Verified',
      heading: 'Independently Verified',
      description: 'QRS models have been independently validated by leading academic and industry experts to ensure calculation accuracy and methodological rigor.',
      sectionType: 'hero',
      backgroundStyle: 'dark',
      order: 0,
      published: true
    },
    {
      id: 'reports',
      page: 'validation',
      title: 'Validation Reports',
      heading: 'Validation Reports',
      sectionType: 'feature-grid',
      backgroundStyle: 'light',
      items: [
        {
          title: 'SSRN Validation Study',
          description: 'Peer-reviewed quantitative validation of QRS portfolio analytics methodology using institutional datasets.',
          link: 'https://ssrn.com'
        },
        {
          title: 'Third-Party Audit',
          description: 'Independent verification of model assumptions, calculation integrity, and reproducibility standards.',
          link: '/validation/'
        }
      ],
      order: 1,
      published: true
    },
    {
      id: 'methodology',
      page: 'validation',
      title: 'Validation Methodology',
      heading: 'Validation Methodology',
      sectionType: 'feature-grid',
      backgroundStyle: 'light',
      items: [
        { title: 'Backtesting', description: 'Historical performance validation against known catastrophic events' },
        { title: 'Sensitivity Analysis', description: 'Comprehensive testing of model response to parameter variations' },
        { title: 'Independent Reproducibility', description: 'Third-party verification that calculations match our published results' }
      ],
      order: 2,
      published: true
    }
  ]
}

// Initialize pageSectionsData from file or use defaults
{
  const defaultData = pageSectionsData
  pageSectionsData = loadSectionsFromFile(defaultData)
}

app.get('/api/page-sections', async (req, res) => {
  try {
    const page = req.query.page || 'home'
    let pageData = pageSectionsData[page] || []

    // Filter by published status if requested
    const published = req.query.published
    if (published) {
      const shouldBePublished = published === 'true' || published === true
      pageData = pageData.filter(s => s.published === shouldBePublished)
    }

    // Sort by order if requested
    if (req.query.sort) {
      const sortField = req.query.sort.replace(/^-/, '')
      const isDescending = req.query.sort.startsWith('-')
      pageData = [...pageData].sort((a, b) => {
        const aVal = a[sortField] ?? 0
        const bVal = b[sortField] ?? 0
        return isDescending ? bVal - aVal : aVal - bVal
      })
    }

    // Apply limit if requested
    const limit = parseInt(req.query.limit) || 100
    pageData = pageData.slice(0, limit)

    res.json({
      docs: pageData,
      total: pageData.length
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE section
app.put('/api/page-sections/:sectionId', verifyToken, async (req, res) => {
  try {
    const { sectionId } = req.params
    const { page, ...updatedData } = req.body

    if (!page || !pageSectionsData[page]) {
      return res.status(400).json({ error: 'Invalid page' })
    }

    const sectionIndex = pageSectionsData[page].findIndex(s => s.id === sectionId)
    if (sectionIndex === -1) {
      return res.status(404).json({ error: 'Section not found' })
    }

    // Update the section
    pageSectionsData[page][sectionIndex] = {
      ...pageSectionsData[page][sectionIndex],
      ...updatedData,
      id: sectionId,
      page: page
    }

    // Save to file
    saveSectionsToFile(pageSectionsData)

    res.json({
      success: true,
      section: pageSectionsData[page][sectionIndex]
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPLOAD media (images/videos)
app.post('/api/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const fileUrl = `/uploads/${req.file.filename}`
    const fileType = req.file.mimetype.split('/')[0] // 'image' or 'video'

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      type: fileType,
      mimetype: req.file.mimetype
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE media file
app.delete('/api/upload/:filename', verifyToken, async (req, res) => {
  try {
    const { filename } = req.params
    const filepath = path.join(UPLOADS_DIR, filename)

    // Security: only allow deleting from uploads directory
    if (!filepath.startsWith(UPLOADS_DIR)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      res.json({ success: true, message: 'File deleted' })
    } else {
      res.status(404).json({ error: 'File not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Placeholder routes for other collections (return empty for now)
app.get('/api/product-showcase', (req, res) => {
  res.json({ docs: [], total: 0 })
})

app.get('/api/solutions', (req, res) => {
  res.json({ docs: [], total: 0 })
})

app.get('/api/regulatory-compliance', (req, res) => {
  res.json({ docs: [], total: 0 })
})

app.get('/api/platform-capability', (req, res) => {
  res.json({ docs: [], total: 0 })
})

app.get('/api/documentation', (req, res) => {
  res.json({ docs: [], total: 0 })
})

app.get('/api/validation-reports', (req, res) => {
  res.json({ docs: [], total: 0 })
})

app.get('/api/peril-status', (req, res) => {
  res.json({ docs: [], total: 0 })
})

app.get('/api/redirects', (req, res) => {
  res.json({ docs: [], total: 0 })
})

app.get('/api/globals/trust-center', (req, res) => {
  res.json({
    id: 1,
    intro: '<p>Welcome to QRS Trust Center</p>',
    relatedValidationReports: [],
    ssrnReferences: []
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'QRS Content API' })
})

// Routes: Pages
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'))
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
