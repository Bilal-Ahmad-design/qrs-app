/**
 * Seed test users for development
 * Run with: npx tsx scripts/seed-users.ts
 */

interface User {
  email: string
  password: string
  fullname: string
  role: 'super-admin' | 'admin' | 'editor' | 'reviewer' | 'read-only'
}

const testUsers: User[] = [
  {
    email: 'jordan@qrs.example.com',
    password: 'SuperAdmin123!',
    fullname: 'Jordan Markwith',
    role: 'super-admin',
  },
  {
    email: 'bilal@qrs.example.com',
    password: 'Admin123!',
    fullname: 'Bilal Ahmad',
    role: 'admin',
  },
  {
    email: 'editor@qrs.example.com',
    password: 'Editor123!',
    fullname: 'Content Editor',
    role: 'editor',
  },
  {
    email: 'reviewer@qrs.example.com',
    password: 'Reviewer123!',
    fullname: 'Content Reviewer',
    role: 'reviewer',
  },
  {
    email: 'readonly@qrs.example.com',
    password: 'ReadOnly123!',
    fullname: 'Read-Only User',
    role: 'read-only',
  },
]

async function seedUsers() {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

  console.log(`🌱 Seeding ${testUsers.length} test users...`)
  console.log(`Using CMS URL: ${cmsUrl}\n`)

  for (const user of testUsers) {
    try {
      const response = await fetch(`${cmsUrl}/api/payload/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (response.ok) {
        const created = await response.json()
        console.log(`Created: ${user.email} (${user.role})`)
      } else {
        const error = await response.json()
        if (error.message?.includes('unique')) {
          console.log(`⏭️  Already exists: ${user.email}`)
        } else {
          console.error(`❌ Failed to create ${user.email}:`, error.message || error)
        }
      }
    } catch (error) {
      console.error(`❌ Error creating ${user.email}:`, error)
    }
  }

  console.log('\nSeed complete!')
  console.log('\n📝 Test Credentials:')
  console.log('────────────────────────────────────────')
  testUsers.forEach(user => {
    console.log(`Email:    ${user.email}`)
    console.log(`Password: ${user.password}`)
    console.log(`Role:     ${user.role}`)
    console.log('────────────────────────────────────────')
  })
}

seedUsers().catch(error => {
  console.error('Seed failed:', error)
  process.exit(1)
})
