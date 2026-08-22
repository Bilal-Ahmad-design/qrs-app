import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config.js'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    console.log('🔄 Connecting to database...')
    const payload = await getPayload({ config })
    console.log('✓ Connected to Payload')

    // Create test users
    const testUsers = [
      {
        email: 'jordan@qrs.example.com',
        password: 'Password123!',
        fullname: 'Jordan Markwith',
        role: 'super-admin',
        isActive: true,
      },
      {
        email: 'bilal@qrs.example.com',
        password: 'Password123!',
        fullname: 'Bilal Admin',
        role: 'admin',
        isActive: true,
      },
      {
        email: 'editor@qrs.example.com',
        password: 'Password123!',
        fullname: 'Editor User',
        role: 'editor',
        isActive: true,
      },
    ]

    console.log('🌱 Seeding test users...')

    for (const user of testUsers) {
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        await payload.create({
          collection: 'users',
          data: {
            email: user.email,
            password: hashedPassword,
            fullname: user.fullname,
            role: user.role,
            isActive: user.isActive,
          },
        })
        console.log(`✓ Created user: ${user.email}`)
      } catch (error: any) {
        if (error?.message?.includes('duplicate')) {
          console.log(`⊘ User already exists: ${user.email}`)
        } else {
          console.error(`✗ Error creating ${user.email}:`, error?.message || error)
        }
      }
    }

    console.log('✅ Seed complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }
}

seed()
