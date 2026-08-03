import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'

export const metadata = buildMetadata({
  title: 'Validation & Verification',
  description: 'Independent validation and verification of QRS quantitative models.',
  path: '/validation/',
})

export default async function ValidationPage() {
  let sections = await getPageSections('validation')
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('validation')
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
