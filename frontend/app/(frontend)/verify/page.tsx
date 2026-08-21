import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'

export const metadata = buildMetadata({
  title: 'Built to be Verified',
  description: 'Cryptographically signed results with independent verification capabilities. Every calculation includes reproducibility certificates.',
  path: '/verify/',
})

export default async function VerifyPage() {
  let sections = await getPageSections('verify')
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('verify')
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
