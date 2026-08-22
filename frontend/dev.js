#!/usr/bin/env node
import { spawn } from 'child_process'
import { platform } from 'os'

console.log('🚀 Starting Next.js + Payload CMS (unified on port 3000)...\n')

const isWindows = platform() === 'win32'
let payloadReady = false

// Start Payload CMS server (port 3001)
console.log('📦 Starting Payload CMS server on port 3001...')
const payloadServer = spawn('npm', ['run', 'cms:server'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  cwd: process.cwd(),
  shell: isWindows,
})

// Listen for Payload startup completion
payloadServer.stdout?.on('data', (data) => {
  const output = data.toString()
  console.log('[Payload CMS]', output)

  // Check if Payload is ready
  if (output.includes('running on http://localhost:3001')) {
    payloadReady = true
    console.log('\n✓ Payload CMS ready!\n')
  }
})

payloadServer.stderr?.on('data', (data) => {
  const output = data.toString()
  console.error('[Payload CMS]', output)
})

// Wait for Payload to be ready, then start Next.js
const checkPayloadReady = setInterval(() => {
  if (payloadReady) {
    clearInterval(checkPayloadReady)
    startNextJS()
  }
}, 500)

// Timeout after 30 seconds
setTimeout(() => {
  if (!payloadReady) {
    console.warn('\n⚠️  Payload CMS taking longer to start, starting Next.js anyway...')
    clearInterval(checkPayloadReady)
    startNextJS()
  }
}, 30000)

function startNextJS() {
  console.log('🌐 Starting Next.js frontend on port 3000...\n')

  // Start Next.js (proxies to Payload CMS on port 3001)
  const nextjs = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: isWindows,
  })

  nextjs.on('exit', (code) => {
    console.log('\n✓ Next.js stopped')
    payloadServer.kill()
    process.exit(code)
  })

  nextjs.on('error', (err) => {
    console.error('❌ Next.js error:', err.message)
    payloadServer.kill()
    process.exit(1)
  })

  // Handle Ctrl+C - kill both processes
  process.on('SIGINT', () => {
    console.log('\n\n⏹️  Shutting down both services...')
    nextjs.kill()
    payloadServer.kill()
    setTimeout(() => process.exit(0), 1000)
  })
}

// Handle Payload startup errors
payloadServer.on('error', (err) => {
  console.error('❌ Payload CMS error:', err.message)
  process.exit(1)
})
