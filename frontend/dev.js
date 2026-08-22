#!/usr/bin/env node
import { spawn } from 'child_process'
import { platform } from 'os'

console.log('🚀 Starting Next.js + Payload CMS (unified on port 3000)...\n')

const isWindows = platform() === 'win32'
let payloadReady = false

// Start Payload CMS server directly without npm wrapper
console.log('📦 Starting Payload CMS server on port 3001...')
const payloadServer = spawn('node', ['--import', 'tsx', 'cms/server.ts'], {
  stdio: 'pipe',
  cwd: process.cwd(),
  shell: isWindows,
})

let payloadOutput = ''

// Capture all Payload output
payloadServer.stdout?.on('data', (data) => {
  const output = data.toString()
  payloadOutput += output
  console.log('[Payload CMS]', output.trim())

  // Check if Payload is ready
  if (output.includes('running on http://localhost:3001')) {
    payloadReady = true
    console.log('\n✓ Payload CMS ready!\n')
    startNextJS()
  }
})

payloadServer.stderr?.on('data', (data) => {
  const output = data.toString()
  payloadOutput += output
  console.error('[Payload CMS ERROR]', output.trim())
})

// Timeout after 15 seconds
const timeoutId = setTimeout(() => {
  if (!payloadReady) {
    console.warn('\n⚠️  Payload CMS not responding after 15 seconds')
    console.warn('   Last output:', payloadOutput.slice(-500) || '(no output)')
    console.warn('   Starting Next.js anyway - login will fail until Payload starts\n')
    startNextJS()
  }
}, 15000)

function startNextJS() {
  clearTimeout(timeoutId)

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

payloadServer.on('exit', (code) => {
  if (!payloadReady && code !== 0) {
    console.error(`\n❌ Payload CMS exited with code ${code}`)
    console.error('   Last output:', payloadOutput.slice(-500) || '(no output)')
  }
})
