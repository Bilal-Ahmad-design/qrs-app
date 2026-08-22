import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../cms/payload.config'

const SEED_DATA = {
  users: [
    {
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      role: 'super-admin',
      name: 'Admin User',
      status: 'active',
    },
    {
      email: 'editor@example.com',
      password: 'EditorPassword123!',
      role: 'editor',
      name: 'Editor User',
      status: 'active',
    },
    {
      email: 'reviewer@example.com',
      password: 'ReviewerPassword123!',
      role: 'reviewer',
      name: 'Reviewer User',
      status: 'active',
    },
    {
      email: 'readonly@example.com',
      password: 'ReadOnlyPassword123!',
      role: 'read-only',
      name: 'Read Only User',
      status: 'active',
    },
  ],
  pages: [
    {
      title: 'Home',
      slug: 'home',
      status: 'published',
      description: 'Homepage',
      content: { root: { type: 'root', children: [] } },
    },
    {
      title: 'About Us',
      slug: 'about',
      status: 'published',
      description: 'About page',
      content: { root: { type: 'root', children: [] } },
    },
    {
      title: 'Contact',
      slug: 'contact',
      status: 'published',
      description: 'Contact page',
      content: { root: { type: 'root', children: [] } },
    },
  ],
  blog: [
    {
      title: 'Getting Started with QRS',
      slug: 'getting-started',
      status: 'published',
      author: 'admin@example.com',
      publishedDate: new Date().toISOString(),
      content: { root: { type: 'root', children: [] } },
    },
    {
      title: 'Security Best Practices',
      slug: 'security-practices',
      status: 'published',
      author: 'admin@example.com',
      publishedDate: new Date().toISOString(),
      content: { root: { type: 'root', children: [] } },
    },
  ],
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding database...')

  try {
    // Seed users
    console.log('→ Seeding users...')
    for (const user of SEED_DATA.users) {
      try {
        await payload.create({
          collection: 'users',
          data: user as any,
        })
        console.log(`  ✓ Created user: ${user.email}`)
      } catch (err: any) {
        if (!err.message?.includes('Duplicate')) {
          throw err
        }
        console.log(`  ℹ User already exists: ${user.email}`)
      }
    }

    // Seed pages
    console.log('→ Seeding pages...')
    for (const page of SEED_DATA.pages) {
      try {
        await payload.create({
          collection: 'pages',
          data: page as any,
        })
        console.log(`  ✓ Created page: ${page.slug}`)
      } catch (err: any) {
        if (!err.message?.includes('Duplicate')) {
          throw err
        }
        console.log(`  ℹ Page already exists: ${page.slug}`)
      }
    }

    // Seed blog posts
    console.log('→ Seeding blog posts...')
    for (const post of SEED_DATA.blog) {
      try {
        await payload.create({
          collection: 'blog',
          data: post as any,
        })
        console.log(`  ✓ Created blog post: ${post.slug}`)
      } catch (err: any) {
        if (!err.message?.includes('Duplicate')) {
          throw err
        }
        console.log(`  ℹ Blog post already exists: ${post.slug}`)
      }
    }

    console.log('✅ Seeding complete!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
