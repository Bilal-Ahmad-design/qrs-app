import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const sections = [
  {
    page: 'home',
    sectionType: 'hero',
    title: 'Hero Section',
    subtitle: 'Patent Pending: QRS-001-PROV',
    heading: 'Run catastrophe models in seconds. Release billions in trapped capital.',
    description: 'Every number cryptographically signed and independently verifiable.',
    backgroundStyle: 'light-institutional',
    order: 0,
    published: true,
  },
  {
    page: 'home',
    sectionType: 'feature-grid',
    title: 'Features',
    heading: 'Enterprise-Grade Capabilities',
    description: 'Built for institutional investors and risk managers',
    backgroundStyle: 'light',
    order: 0.5,
    published: true,
  },
  {
    page: 'platform',
    sectionType: 'hero',
    title: 'Platform Hero',
    subtitle: 'Advanced Platform',
    heading: 'Powerful Risk Modeling Platform',
    description: 'Integrated tools for catastrophe risk analysis',
    backgroundStyle: 'light-institutional',
    order: 1,
    published: true,
  },
]

async function seed() {
  try {
    const client = await pool.connect()

    console.log('[Seed] Using existing page_sections table...')

    console.log(`[Seed] Inserting ${sections.length} sections...`)
    for (const section of sections) {
      try {
        await client.query(
          `INSERT INTO page_sections (page, section_type, title, subtitle, heading, description, background_style, "order", published)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            section.page,
            section.sectionType,
            section.title,
            section.subtitle,
            JSON.stringify(section.heading),
            JSON.stringify(section.description),
            section.backgroundStyle,
            section.order,
            section.published,
          ]
        )
        console.log(`✓ Created: ${section.page} - ${section.title}`)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.log(`✗ Failed to create ${section.title}: ${message}`)
      }
    }

    console.log('[Seed] Seeding complete!')
    client.release()
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('[Seed] ❌ Error:', error)
    process.exit(1)
  }
}

seed()
