import { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { FeatureGridCards } from '@/components/marketing/FeatureGridCards'
import { WorkflowSteps } from '@/components/marketing/WorkflowSteps'
import { ProductEvidence } from '@/components/marketing/ProductEvidence'
import { RegulatoryGrid } from '@/components/marketing/RegulatoryGrid'
import { SecurityComplianceSection } from '@/components/marketing/SecurityComplianceSection'
import { SecurityFeaturesGrid } from '@/components/marketing/SecurityFeaturesGrid'
import { env } from '@/lib/env'

interface SectionItem {
  title?: string
  description?: string
  icon?: string
  value?: string
  link?: string
  status?: 'validated' | 'illustrative' | 'roadmap'
}

interface PageSection {
  id: string
  title: string
  subtitle?: string
  heading?: string
  description?: string
  sectionType: string
  backgroundStyle?: string
  items?: SectionItem[]
  imageUrl?: string
  videoUrl?: string
  buttonText?: string
  buttonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
  content?: Record<string, unknown>
  leftTitle?: string
  leftDescription?: string
  rightTitle?: string
  rightDescription?: string
}

interface SectionRendererProps {
  section: PageSection
  children?: ReactNode
}

const bgStyles: Record<string, string> = {
  dark: 'bg-ink-800',
  light: 'bg-cream-50',
  white: 'bg-white',
  'light-institutional': 'bg-light-bg-primary',
  'deep-dark': 'bg-ink-900',
}

const textStyles: Record<string, string> = {
  dark: 'text-white',
  light: 'text-ink-900',
  white: 'text-ink-900',
  'light-institutional': 'text-light-text-primary',
  'deep-dark': 'text-white',
}

export function SectionRenderer({
  section,
  children,
}: SectionRendererProps) {
  const cmsUrl = env.NEXT_PUBLIC_CMS_URL
  const bgClass = bgStyles[section.backgroundStyle || 'light']
  const textClass = textStyles[section.backgroundStyle || 'light']

  // Helper to get image URLs - strip localhost URLs and use relative paths for production
  const getImageUrl = (url?: string) => {
    if (!url) return undefined
    // Strip localhost:3001 prefix for production
    if (url.includes('localhost:3001')) {
      return url.replace('http://localhost:3001', '')
    }
    if (url.startsWith('/media/')) return url // Local media files
    if (url.startsWith('/')) return url // Already relative path
    if (url.startsWith('http')) return url // External URL (e.g., CDN)
    return cmsUrl ? `${cmsUrl}${url}` : `/${url}` // CMS uploads or relative
  }


  switch (section.sectionType) {
    case 'hero': {
      return (
        <section
          className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28 min-h-[500px] lg:min-h-[600px] flex items-center justify-center"
          style={{
            background: 'rgba(157, 183, 181, 0.13)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Content */}
          <div className="relative z-10 w-full">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
              <div className="text-center">
                {section.subtitle && (
                  <div className="mb-4 sm:mb-6 inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-50 border border-white/70 backdrop-blur-md">
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">
                      {section.subtitle}
                    </span>
                  </div>
                )}
                <h1
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-slate-900"
                  dangerouslySetInnerHTML={{ __html: section.heading || section.title }}
                />
                {section.description && (
                  <p
                    className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{
                      __html: section.description,
                    }}
                  />
                )}
                {(section.buttonText || section.secondaryButtonText) && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    {section.buttonText && (
                      <Button
                        href={section.buttonUrl || '#'}
                        variant="primary"
                        className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg"
                      >
                        {section.buttonText}
                      </Button>
                    )}
                    {section.secondaryButtonText && (
                      <Button
                        href={section.secondaryButtonUrl || '#'}
                        variant="secondary"
                        className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg"
                      >
                        {section.secondaryButtonText}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {children}
            </div>
          </div>
        </section>
      )
    }

    case 'feature-grid':
      return (
        <section className={`${bgClass} py-12 sm:py-16 md:py-20 lg:py-28`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
            {section.title && (
              <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 lg:mb-24 text-center ${textClass}`}>
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              <FeatureGridCards items={section.items || []} backgroundStyle={section.backgroundStyle} />
            </div>
          </div>
        </section>
      )

    case 'text-image':
      return (
        <section className={`${bgClass} py-12 sm:py-16 md:py-20 lg:py-28`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-28 items-center">
              <div>
                {section.heading && (
                  <h2
                    className={`text-2xl sm:text-3xl lg:text-5xl font-bold mb-8 ${textClass}`}
                    dangerouslySetInnerHTML={{
                      __html: section.heading,
                    }}
                  />
                )}
                {section.description && (
                  <div
                    className={`text-base sm:text-lg lg:text-xl leading-relaxed mb-10 ${
                      section.backgroundStyle === 'dark' ||
                      section.backgroundStyle === 'deep-dark'
                        ? 'text-cream-100'
                        : 'text-light-text-secondary'
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: section.description,
                    }}
                  />
                )}
                {section.buttonText && (
                  <Button
                    href={section.buttonUrl || '#'}
                    variant="primary"
                  >
                    {section.buttonText}
                  </Button>
                )}
              </div>
              {section.imageUrl && (
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={getImageUrl(section.imageUrl)}
                    alt={section.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )

    case 'cta':
      return (
        <section className={`${bgClass} py-12 sm:py-16 md:py-20 lg:py-28`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 text-center">
            {section.heading && (
              <h2
                className={`text-3xl sm:text-4xl lg:text-6xl font-bold mb-8 ${textClass}`}
                dangerouslySetInnerHTML={{
                  __html: section.heading,
                }}
              />
            )}
            {section.description && (
              <p
                className={`text-base sm:text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
                  section.backgroundStyle === 'dark' ||
                  section.backgroundStyle === 'deep-dark'
                    ? 'text-cream-100'
                    : 'text-light-text-secondary'
                }`}
                dangerouslySetInnerHTML={{
                  __html: section.description,
                }}
              />
            )}
            {section.buttonText && (
              <Button
                href={section.buttonUrl || '#'}
                variant="primary"
                className="px-10 py-5 text-lg"
              >
                {section.buttonText}
              </Button>
            )}
          </div>
        </section>
      )

    case 'stats':
      return (
        <section className={`${bgClass} py-12 sm:py-16 md:py-20 lg:py-28`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
            {section.title && (
              <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 md:mb-16 lg:mb-24 text-center ${textClass}`}>
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
              {section.items?.map((item) => (
                <div key={item.title} className="text-center">
                  {item.value && (
                    <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-light-accent-primary mb-4 font-mono">
                      {item.value}
                    </div>
                  )}
                  <h3 className={`text-base sm:text-lg lg:text-xl font-semibold mb-3 ${textClass}`}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className={`text-sm sm:text-sm lg:text-base leading-relaxed ${
                        section.backgroundStyle === 'dark' ||
                        section.backgroundStyle === 'deep-dark'
                          ? 'text-cream-100'
                          : 'text-light-text-secondary'
                      }`}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'workflow-steps':
      return (
        <WorkflowSteps
          items={section.items || []}
          title={section.heading || section.title}
          description={section.description}
        />
      )

    case 'product-evidence':
      return (
        <ProductEvidence
          items={section.items || []}
          title={section.heading || section.title}
          description={section.description}
        />
      )

    case 'regulatory-grid':
      return (
        <RegulatoryGrid
          items={section.items || []}
          title={section.heading || section.title}
          description={section.description}
        />
      )

    case 'security-compliance':
      return (
        <SecurityComplianceSection
          title={section.heading || section.title}
          description={section.description}
          leftTitle={section.leftTitle}
          leftDescription={section.leftDescription}
          rightTitle={section.rightTitle}
          rightDescription={section.rightDescription}
          items={section.items}
        />
      )

    case 'security-features-grid':
      return (
        <SecurityFeaturesGrid
          items={section.items || []}
          title={section.heading || section.title}
          description={section.description}
          backgroundStyle={section.backgroundStyle}
        />
      )

    default:
      return (
        <section className={`${bgClass} py-12 sm:py-16 md:py-20 lg:py-28`}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
            {section.heading && (
              <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 ${textClass}`}>
                {section.heading}
              </h2>
            )}
            {section.description && (
              <div
                className={`text-sm sm:text-base md:text-lg leading-relaxed ${
                  section.backgroundStyle === 'dark' ||
                  section.backgroundStyle === 'deep-dark'
                    ? 'text-cream-100'
                    : 'text-text-muted'
                }`}
                dangerouslySetInnerHTML={{
                  __html: section.description,
                }}
              />
            )}
            {children}
          </div>
        </section>
      )
  }
}
