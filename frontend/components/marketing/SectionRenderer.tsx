import { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { DataCard } from '@/components/marketing/DataCard'
import { WorkflowSteps } from '@/components/marketing/WorkflowSteps'
import { ProductEvidence } from '@/components/marketing/ProductEvidence'
import { RegulatoryGrid } from '@/components/marketing/RegulatoryGrid'

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
  content?: Record<string, any>
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
  const bgClass = bgStyles[section.backgroundStyle || 'light']
  const textClass = textStyles[section.backgroundStyle || 'light']

  switch (section.sectionType) {
    case 'hero':
      return (
        <section className={`relative overflow-hidden py-20 lg:py-32 bg-light-bg-primary`}>
          {/* Background Video (muted, looping, no controls) */}
          {section.videoUrl && (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={`http://localhost:3001${section.videoUrl}`} type="video/mp4" />
            </video>
          )}

          {/* Background Image (fallback if no video or behind video) */}
          {section.imageUrl && !section.videoUrl && (
            <img
              src={`http://localhost:3001${section.imageUrl}`}
              alt={section.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Strong overlay for text readability on media backgrounds */}
          {(section.videoUrl || section.imageUrl) && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/35"></div>
          )}

          {/* Content overlay */}
          <div className="relative z-10">
            <div className="max-w-screen-xl mx-auto px-6">
              <div className="text-center mb-16">
                {section.subtitle && (
                  <div className="mb-6 inline-block px-4 py-2 rounded-full bg-light-accent-light/20 border border-light-accent-primary/40">
                    <span className="text-sm font-semibold text-light-accent-light">
                      {section.subtitle}
                    </span>
                  </div>
                )}
                <h1
                  className="text-3xl sm:text-4xl lg:text-7xl font-bold mb-6 leading-tight text-white/70"
                  dangerouslySetInnerHTML={{ __html: section.heading || section.title }}
                />
                {section.description && (
                  <p
                    className="text-base sm:text-lg lg:text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-white"
                    dangerouslySetInnerHTML={{
                      __html: section.description,
                    }}
                  />
                )}
                {(section.buttonText || section.secondaryButtonText) && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {section.buttonText && (
                      <Button
                        href={section.buttonUrl || '#'}
                        variant="primary"
                        className="px-8 py-4 text-lg"
                      >
                        {section.buttonText}
                      </Button>
                    )}
                    {section.secondaryButtonText && (
                      <Button
                        href={section.secondaryButtonUrl || '#'}
                        variant="secondary"
                        className="px-8 py-4 text-lg text-white/70 border-l-light-accent-primary/40"
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

    case 'feature-grid':
      return (
        <section className={`${bgClass} py-24 lg:py-40`}>
          <div className="max-w-screen-xl mx-auto px-6">
            {section.title && (
              <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-bold mb-20 text-center ${textClass}`}>
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {section.items?.map((item) => (
                <DataCard
                  key={item.title}
                  variant={
                    section.backgroundStyle === 'dark' ||
                    section.backgroundStyle === 'deep-dark'
                      ? 'dark'
                      : 'light'
                  }
                  status={item.status}
                >
                  {item.icon && <div className="text-4xl mb-4">{item.icon}</div>}
                  {item.title && (
                    <h3 className="text-lg font-semibold mb-3">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-sm">{item.description}</p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      className="text-teal-600 font-semibold inline-flex items-center mt-4 group hover:translate-x-1 transition-transform"
                    >
                      Learn more →
                    </a>
                  )}
                </DataCard>
              ))}
            </div>
          </div>
        </section>
      )

    case 'text-image':
      return (
        <section className={`${bgClass} py-24 lg:py-40`}>
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
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
                    src={section.imageUrl}
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
        <section className={`${bgClass} py-32 lg:py-48`}>
          <div className="max-w-4xl mx-auto px-6 text-center">
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
        <section className={`${bgClass} py-24 lg:py-40`}>
          <div className="max-w-screen-xl mx-auto px-6">
            {section.title && (
              <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-bold mb-20 text-center ${textClass}`}>
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
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

    default:
      return (
        <section className={`${bgClass} py-24 lg:py-40`}>
          <div className="max-w-screen-xl mx-auto px-6">
            {section.heading && (
              <h2 className={`text-3xl lg:text-4xl font-semibold mb-6 ${textClass}`}>
                {section.heading}
              </h2>
            )}
            {section.description && (
              <div
                className={`text-lg leading-relaxed ${
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
