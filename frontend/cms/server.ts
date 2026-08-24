#!/usr/bin/env node

/**
 * Payload CMS Proxy Server
 * This script starts a simple HTTP server that proxies to Payload's built-in server
 * avoiding the tsx/module loading issues with getPayload()
 */

import 'dotenv/config'
import http from 'http'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3001
const PAYLOAD_DEV_PORT = 3002

console.warn(`Starting Payload CMS via CLI on port ${PAYLOAD_DEV_PORT}...`)

// Start Payload dev server via CLI from frontend directory (where payload.config.ts is)
const payloadProc = spawn('npx', ['payload', 'dev'], {
  stdio: 'inherit',
  cwd: __dirname.replace(/\\cms$/, ''), // Go up from cms/ to frontend/
  shell: true,
})

// Wait for Payload to start, then start our proxy
setTimeout(() => {
  console.warn(`Starting proxy server on port ${PORT}...`)

  const proxyServer = http.createServer(async (req, res) => {
    try {
      // Proxy all requests to Payload's dev server
      const options = {
        hostname: 'localhost',
        port: PAYLOAD_DEV_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers,
      }

      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
        proxyRes.pipe(res)
      })

      proxyReq.on('error', (error) => {
        console.warn('⚠️  Proxy error:', error.message)
        res.writeHead(503)
        res.end('Payload server not responding')
      })

      req.pipe(proxyReq)
    } catch (error) {
      console.warn('Server error:', error instanceof Error ? error.message : error)
      res.writeHead(500)
      res.end()
    }
  })

  proxyServer.listen(PORT, () => {
    console.warn(`running on http://localhost:${PORT}`)
  })

  process.on('SIGINT', () => {
    console.log('\n⏹️  Shutting down...')
    proxyServer.close()
    payloadProc.kill()
    process.exit(0)
  })
}, 2000)

payloadProc.on('error', (error) => {
  console.warn('❌ Payload process error:', error.message)
  process.exit(1)
})

payloadProc.on('exit', (code) => {
  console.warn(`\n❌ Payload process exited with code ${code}`)
  process.exit(code || 1)
})
