#!/usr/bin/env node
import { spawn } from 'child_process'
import { platform } from 'os'

console.log('🚀 Starting Next.js with Payload CMS (single port 3000)...\n')

const isWindows = platform() === 'win32'

// Start Next.js (Payload CMS is integrated via route handlers)
const nextjs = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: isWindows,
})

nextjs.on('exit', (code) => {
  console.log('\n✓ Dev server stopped')
  process.exit(code)
})

nextjs.on('error', (err) => {
  console.error('❌ Dev server error:', err.message)
  process.exit(1)
})

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Shutting down...')
  nextjs.kill()
  process.exit(0)
})
