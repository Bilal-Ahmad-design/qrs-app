import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'

export const metadata = buildMetadata({
  title: 'Trust & Security',
  description: 'Enterprise-grade security, compliance, and cryptographic verification.',
  path: '/trust/',
})

export default async function TrustPage() {
  let sections = await getPageSections('trust')
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('trust')
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
