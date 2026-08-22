import 'dotenv/config'
import http from 'http'

const PORT = 3001

// Comprehensive mock data matching Payload CMS collection structure
const mockData = {
  users: [
    {
      id: '1',
      email: 'jordan@qrs.example.com',
      fullname: 'Jordan Markwith',
      role: 'super-admin',
      isActive: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      email: 'bilal@qrs.example.com',
      fullname: 'Bilal Admin',
      role: 'admin',
      isActive: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '3',
      email: 'editor@qrs.example.com',
      fullname: 'Editor User',
      role: 'editor',
      isActive: true,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date(Date.now() - 86400000).toISOString(),
    },
  ],

  pages: [
    {
      id: '1',
      title: 'Home',
      slug: 'home',
      published: true,
      createdAt: new Date(Date.now() - 1209600000).toISOString(),
      updatedAt: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: '2',
      title: 'About Us',
      slug: 'about',
      published: true,
      createdAt: new Date(Date.now() - 1209600000).toISOString(),
      updatedAt: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: '3',
      title: 'Solutions',
      slug: 'solutions',
      published: true,
      createdAt: new Date(Date.now() - 1209600000).toISOString(),
      updatedAt: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: '4',
      title: 'Pricing',
      slug: 'pricing',
      published: false,
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],

  'form-submissions': [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1-555-0100',
      message: 'Interested in enterprise pricing',
      formType: 'contact',
      status: 'new',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@corp.com',
      message: 'Privacy policy inquiry',
      formType: 'privacy',
      status: 'read',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mchen@startup.io',
      message: 'Demo request for our team',
      formType: 'contact',
      status: 'responded',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],

  'page-sections': [
    {
      id: '1',
      page: 'home',
      sectionType: 'hero',
      title: 'Home Hero',
      subtitle: 'Enterprise Risk Platform',
      heading: 'Run catastrophe models in seconds',
      description: 'Release billions in trapped capital',
      backgroundStyle: 'light-institutional',
      order: 1,
      published: true,
      videoUrl: '/uploads/hero-background.mp4',
      imageUrl: '/uploads/dashboard-screenshot.png',
      buttonText: 'Start Free Trial',
      buttonUrl: '/signup',
      secondaryButtonText: 'Learn More',
      secondaryButtonUrl: '/platform',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      page: 'home',
      sectionType: 'feature-grid',
      title: 'Home Features',
      heading: 'Enterprise-Grade Capabilities',
      description: 'Built for institutional investors and risk managers',
      backgroundStyle: 'light',
      order: 2,
      published: true,
      items: [
        { icon: 'zap', title: 'Lightning Fast', description: 'Run models in seconds, not hours', status: 'validated' },
        { icon: 'lock', title: 'Enterprise Security', description: 'SOC 2 Type II compliant infrastructure', status: 'validated' },
        { icon: 'bar-chart-3', title: 'Advanced Analytics', description: 'Deep insights into catastrophe risk', status: 'validated' },
        { icon: 'globe', title: 'Global Coverage', description: 'Models for perils worldwide', status: 'validated' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      page: 'home',
      sectionType: 'cta',
      title: 'Home CTA',
      heading: 'Ready to transform your risk analysis?',
      description: 'Join leading institutions using QRS for better decisions',
      backgroundStyle: 'deep-dark',
      order: 3,
      published: true,
      buttonText: 'Get Started Free',
      buttonUrl: '/signup',
      createdAt: new Date().toISOString(),
    },
  ],

  'audit-logs': [
    {
      id: '1',
      action: 'create',
      collection: 'users',
      documentId: '3',
      userId: '1',
      changes: { email: 'editor@qrs.example.com', role: 'editor' },
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: '2',
      action: 'update',
      collection: 'pages',
      documentId: '1',
      userId: '2',
      changes: { published: true },
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '3',
      action: 'delete',
      collection: 'pages',
      documentId: '5',
      userId: '1',
      changes: {},
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],

  media: [
    {
      id: '1',
      filename: 'hero-placeholder.png',
      filesize: 245000,
      mimeType: 'image/png',
      width: 1920,
      height: 1080,
      url: '/media/images/hero-placeholder.png',
      type: 'image',
      createdAt: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: '2',
      filename: 'qrs-wordmark.webp',
      filesize: 7890,
      mimeType: 'image/webp',
      url: '/media/qrs-wordmark.webp',
      type: 'image',
      createdAt: new Date(Date.now() - 1209600000).toISOString(),
    },
    {
      id: '3',
      filename: 'sample-video.mp4',
      filesize: 5242880,
      mimeType: 'video/mp4',
      url: '/media/videos/sample-video.mp4',
      type: 'video',
      duration: 120,
      createdAt: new Date(Date.now() - 432000000).toISOString(),
    },
  ],
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const pathname = url.pathname
  const searchParams = url.searchParams

  // Health check
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', database: 'postgresql' }))
    return
  }

  // Payload API - support both /api/collections/ and /api/payload/ paths
  if (pathname.startsWith('/api/collections/') || pathname.startsWith('/api/payload/')) {
    const parts = pathname.split('/')
    const collectionName = parts[3]
    const id = parts[4]

    const collectionData = mockData[collectionName as keyof typeof mockData] || []

    if (req.method === 'GET') {
      // Get single document
      if (id) {
        const doc = (collectionData as any[]).find((d) => d.id === id)
        if (doc) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(doc))
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Not found' }))
        }
        return
      }

      // Get collection with pagination
      // Note: for page-sections, 'page' is a filter, not pagination
      const isPageSectionsCollection = collectionName === 'page-sections'
      const page = isPageSectionsCollection ? 1 : parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const skip = (page - 1) * limit

      let filtered = [...(collectionData as any[])]

      // Filter by published status if requested
      if (searchParams.has('published')) {
        const publishedFilter = searchParams.get('published') === 'true'
        filtered = filtered.filter((doc) => doc.published === publishedFilter)
      }

      // Filter by page field (for page-sections collection)
      if (searchParams.has('page') && isPageSectionsCollection) {
        const pageFilter = searchParams.get('page')
        filtered = filtered.filter((doc) => doc.page === pageFilter)
      }

      // Sort if requested
      if (searchParams.has('sort')) {
        const sortField = searchParams.get('sort')
        filtered.sort((a, b) => {
          const aVal = a[sortField as keyof typeof a]
          const bVal = b[sortField as keyof typeof b]
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return aVal - bVal
          }
          return String(aVal).localeCompare(String(bVal))
        })
      }

      const totalDocs = filtered.length
      const totalPages = Math.ceil(totalDocs / limit)
      const paginatedDocs = filtered.slice(skip, skip + limit)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          docs: paginatedDocs,
          totalDocs,
          limit,
          totalPages,
          page,
          pagingCounter: skip + 1,
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages,
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
        })
      )
      return
    }

    // Create document
    if (req.method === 'POST') {
      let body = ''
      req.on('data', (chunk) => (body += chunk))
      req.on('end', () => {
        try {
          const data = JSON.parse(body)
          const newId = String((collectionData as any[]).length + 1)
          const newDoc = {
            id: newId,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          ;(collectionData as any[]).push(newDoc)

          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(newDoc))
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Invalid JSON' }))
        }
      })
      return
    }

    res.writeHead(405)
    res.end()
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  console.warn(`running on http://localhost:${PORT}`)
  console.warn(`📊 Mock Data Server - Real database credentials pending`)
  console.warn(`✓ Available collections:`)
  Object.keys(mockData).forEach((col) => {
    console.warn(`  - ${col} (${(mockData as any)[col].length} items)`)
  })
})

process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down...')
  server.close(() => process.exit(0))
})
