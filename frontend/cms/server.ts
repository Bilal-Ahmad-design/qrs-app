import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config.js'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import { config as dotenvConfig } from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenvConfig({ path: path.resolve(__dirname, '../.env.local') })

const PORT = 3001

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set in environment')
  console.error('   Make sure .env.local exists with DATABASE_URL set')
  process.exit(1)
}
console.log(`📦 Database configured: ${process.env.DATABASE_URL.substring(0, 50)}...`)

async function start() {
  try {
    console.log('🔄 Initializing Payload CMS...')
    const payload = await getPayload({ config })
    console.log('✓ Payload initialized successfully')

    const server = http.createServer(async (req, res) => {
      try {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }

        // Parse JSON body
        let body = ''
        req.on('data', chunk => (body += chunk))
        req.on('end', async () => {
          try {
            // Create a mock request object for Payload
            const method = req.method?.toUpperCase() || 'GET'
            const url = new URL(`http://localhost:${PORT}${req.url}`)

            // Simple routing for collections API
            if (req.url?.startsWith('/api/collections/')) {
              const collection = req.url.split('/')[3]
              const id = req.url.split('/')[4]

              if (method === 'GET' && id) {
                const doc = await payload.findByID({ collection, id })
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(doc))
              } else if (method === 'GET') {
                const docs = await payload.find({ collection })
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(docs))
              } else if (method === 'POST') {
                const doc = await payload.create({ collection, data: JSON.parse(body) })
                res.writeHead(201, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(doc))
              } else if (method === 'PATCH' && id) {
                const doc = await payload.update({ collection, id, data: JSON.parse(body) })
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(doc))
              } else if (method === 'DELETE' && id) {
                await payload.delete({ collection, id })
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } else {
                res.writeHead(404)
                res.end('Not found')
              }
            } else {
              res.writeHead(404)
              res.end('Not found')
            }
          } catch (error: any) {
            console.error('Error handling request:', error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: error.message }))
          }
        })
      } catch (error: any) {
        console.error('Server error:', error)
        res.writeHead(500)
        res.end('Server error')
      }
    })

    server.listen(PORT, () => {
      console.log(`✓ Payload CMS server running on http://localhost:${PORT}`)
      console.log(`  Admin: http://localhost:${PORT}/admin`)
    })
  } catch (error) {
    console.error('❌ Failed to start Payload CMS:', error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }
}

start()
