import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'

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
    (a: any, b: any) => (a.order || 0) - (b.order || 0)
  )

  return (
    <main>
      {sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  )
}
