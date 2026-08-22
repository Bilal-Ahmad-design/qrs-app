import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'

// Render on-demand since CMS may not be available during build
export const dynamic = 'force-dynamic'

interface PageSection {
  id: string
  title: string
  sectionType: string
  order?: number
  [key: string]: unknown
}

export const metadata = buildMetadata({
  title: 'Platform',
  description: 'Enterprise-grade quantitative risk analysis platform for institutional investors.',
  path: '/platform/',
})

export default async function PlatformPage() {
  let sections = await getPageSections('platform')
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('platform')
  }

  sections = sections.sort(
    (a: PageSection, b: PageSection) => (a.order || 0) - (b.order || 0)
  )

  return (
    <main>
      {sections.map((section: PageSection) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  )
}
