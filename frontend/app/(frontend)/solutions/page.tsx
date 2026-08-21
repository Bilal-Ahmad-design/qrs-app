import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'

export const metadata = buildMetadata({
  title: 'Solutions by Role',
  description: 'Tailored risk management solutions for underwriters, portfolio managers, reinsurance buyers, ILS managers, and CROs.',
  path: '/solutions/',
})

export default async function SolutionsPage() {
  let sections = await getPageSections('solutions')
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('solutions')
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
