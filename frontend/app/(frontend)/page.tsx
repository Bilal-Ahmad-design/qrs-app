import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'
import { DeviceFrame } from '@/components/marketing/DeviceFrame'
import { env } from '@/lib/env'

export const metadata = buildMetadata({
  title: 'QRS',
  description: 'Run catastrophe models in seconds. Release billions in trapped capital.',
  path: '/',
})

export default async function HomePage() {
  const cmsUrl = env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

  // Fetch sections from CMS, fall back to defaults
  let sections = await getPageSections('home')
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('home')
  }

  // Sort by order
  sections = sections.sort(
    (a: any, b: any) => (a.order || 0) - (b.order || 0)
  )

  return (
    <main className="bg-light-bg-primary">
      {sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section}>
          {/* Hero section gets DeviceFrame with uploaded image */}
          {section.sectionType === 'hero' && (
            <DeviceFrame
              imageSrc={section.imageUrl ? `${cmsUrl}${section.imageUrl}` : undefined}
              imageAlt={section.title}
            />
          )}
        </SectionRenderer>
      ))}
    </main>
  )
}
