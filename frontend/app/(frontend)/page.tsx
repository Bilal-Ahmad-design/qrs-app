import { buildMetadata } from '@/lib/metadata'
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'
import { DeviceFrame } from '@/components/marketing/DeviceFrame'
import { env } from '@/lib/env'

// Render on-demand since CMS may not be available during build
export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'QRS',
  description: 'Run catastrophe models in seconds. Release billions in trapped capital.',
  path: '/',
})

export default async function HomePage() {
  const cmsUrl = env.NEXT_PUBLIC_CMS_URL

  // Helper to get image URL - strip localhost and use relative paths
  const getImageUrl = (url?: string) => {
    if (!url) return undefined
    if (url.includes('localhost:3001')) {
      return url.replace('http://localhost:3001', '')
    }
    if (url.startsWith('/')) return url
    if (url.startsWith('http')) return url
    return cmsUrl ? `${cmsUrl}${url}` : `/${url}`
  }

  // Helper to get video URL - strip localhost and use relative paths
  const getVideoUrl = (url?: string) => {
    if (!url) return undefined
    if (url.includes('localhost:3001')) {
      return url.replace('http://localhost:3001', '')
    }
    if (url.startsWith('/')) return url
    if (url.startsWith('http')) return url
    return cmsUrl ? `${cmsUrl}${url}` : `/${url}`
  }

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
          {/* Hero section gets DeviceFrame with video or image */}
          {section.sectionType === 'hero' && (
            <DeviceFrame
              videoSrc={getVideoUrl(section.videoUrl)}
              imageSrc={getImageUrl(section.imageUrl)}
              imageAlt={section.title}
            />
          )}
        </SectionRenderer>
      ))}
    </main>
  )
}
