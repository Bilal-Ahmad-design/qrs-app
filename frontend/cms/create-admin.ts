import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config.js'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function createAdmin() {
  try {
    console.log('\n🔐 Payload CMS Admin User Setup\n')

    // Validate database connection
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable not set')
      process.exit(1)
    }

    console.log('Connecting to database...')
    const payload = await getPayload({ config })
    console.log('✓ Connected to Payload CMS\n')

    // Prompt for user details
    const email = await prompt('📧 Admin email: ')
    const password = await prompt('🔑 Admin password: ')
    const fullname = await prompt('👤 Full name: ')

    // Validate inputs
    if (!email || !password || !fullname) {
      console.error('❌ All fields are required')
      rl.close()
      process.exit(1)
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters')
      rl.close()
      process.exit(1)
    }

    if (!email.includes('@')) {
      console.error('❌ Invalid email address')
      rl.close()
      process.exit(1)
    }

    rl.close()

    // Hash password
    console.log('\n🔒 Creating admin user...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    try {
      const user = await payload.create({
        collection: 'users',
        data: {
          email,
          password: hashedPassword,
          fullname,
          role: 'super-admin',
          isActive: true,
        },
      })

      console.log(`\n✅ Admin user created successfully!\n`)
      console.log('Login Details:')
      console.log(`  Email:    ${email}`)
      console.log(`  Password: ${password}`)
      console.log(`  Role:     super-admin`)
      console.log(`\n📝 CMS URL: ${process.env.NEXT_PUBLIC_CMS_URL || 'https://your-domain.com/cms/login'}\n`)
    } catch (error: any) {
      if (error?.message?.includes('duplicate')) {
        console.error(`❌ User already exists: ${email}`)
      } else {
        console.error(`❌ Error creating admin user:`, error?.message || error)
      }
      process.exit(1)
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Setup failed:', error instanceof Error ? error.message : error)
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }
}

createAdmin()
