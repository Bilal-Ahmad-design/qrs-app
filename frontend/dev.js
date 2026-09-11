#!/usr/bin/env node
import { spawn } from 'child_process'
import { platform } from 'os'

console.log('🚀 Starting Next.js with Embedded Payload CMS on port 3000...\n')

const isWindows = platform() === 'win32'

// Start Next.js (Payload CMS embedded, no separate server needed)
console.log('🌐 Starting Next.js frontend on port 3000...\n')

const nextjs = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: isWindows,
})

nextjs.on('exit', (code) => {
  console.log('\n✓ Next.js stopped')
  process.exit(code)
})

nextjs.on('error', (err) => {
  console.error('❌ Next.js error:', err.message)
  process.exit(1)
})

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Shutting down...')
  nextjs.kill()
  setTimeout(() => process.exit(0), 1000)
})
