#!/usr/bin/env node
import { spawn } from 'child_process'
import { platform } from 'os'

console.log('🚀 Starting Next.js + Payload CMS (unified on port 3000)...\n')

const isWindows = platform() === 'win32'

// Start Payload CMS server (port 3001)
console.log('📦 Starting Payload CMS server...')
const payloadServer = spawn('npm', ['run', 'cms:server'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: isWindows,
})

// Wait a moment for Payload to start, then start Next.js
setTimeout(() => {
  console.log('\n🌐 Starting Next.js frontend...\n')

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
}, 3000)

// Handle Payload startup errors
payloadServer.on('error', (err) => {
  console.error('❌ Payload CMS error:', err.message)
  process.exit(1)
})
