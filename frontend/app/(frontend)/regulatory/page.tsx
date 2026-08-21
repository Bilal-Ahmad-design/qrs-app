import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'

export const metadata = buildMetadata({
  title: 'Regulatory & Compliance',
  description: 'Regulatory-ready risk management supporting Solvency II, NAIC RBC, ORSA, and Lloyd\'s/BMA requirements.',
  path: '/regulatory/',
})

export default async function RegulatoryPage() {
  let sections = await getPageSections('regulatory')
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('regulatory')
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
