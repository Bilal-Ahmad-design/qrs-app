'use client'

import {
  Lock,
  Shield,
  BookOpen,
  Database,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

interface SecurityFeature {
  title?: string
  description?: string
  icon?: string
}

interface SecurityFeaturesGridProps {
  items?: SecurityFeature[]
  title?: string
  description?: string
  backgroundStyle?: string
}

export function SecurityFeaturesGrid({
  items = [],
  title = 'Security Features',
  description = 'Built-in security controls at every layer',
  backgroundStyle = 'dark',
}: SecurityFeaturesGridProps) {
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

  const descriptionStyles: Record<string, string> = {
    dark: 'text-teal-200',
    light: 'text-ink-700',
    white: 'text-ink-700',
    'light-institutional': 'text-light-text-secondary',
    'deep-dark': 'text-teal-200',
  }

  const cardStyles: Record<string, string> = {
    dark: 'border-teal-700/40 bg-ink-800 hover:border-teal-600/60 hover:bg-ink-700 hover:shadow-lg hover:shadow-teal-500/10',
    light: 'border-teal-200/40 bg-teal-50/30 hover:border-teal-300/60 hover:bg-teal-50/50 hover:shadow-lg hover:shadow-teal-500/5',
    white: 'border-teal-200/40 bg-teal-50/30 hover:border-teal-300/60 hover:bg-teal-50/50 hover:shadow-lg hover:shadow-teal-500/5',
    'light-institutional': 'border-teal-200/40 bg-teal-50/30 hover:border-teal-300/60 hover:bg-teal-50/50 hover:shadow-lg hover:shadow-teal-500/5',
    'deep-dark': 'border-teal-700/40 bg-ink-800 hover:border-teal-600/60 hover:bg-ink-700 hover:shadow-lg hover:shadow-teal-500/10',
  }

  const cardTextStyles: Record<string, string> = {
    dark: 'text-white text-teal-100',
    light: 'text-ink-900 text-ink-700',
    white: 'text-ink-900 text-ink-700',
    'light-institutional': 'text-ink-900 text-ink-700',
    'deep-dark': 'text-white text-teal-100',
  }

  const iconMap: Record<string, any> = {
    'Data Encryption': Lock,
    'Access Control': Shield,
    'Audit Logging': BookOpen,
    'Infrastructure Isolation': Database,
    'DDoS Protection': AlertTriangle,
    'Compliance Monitoring': CheckCircle2,
  }

  // Use CMS data exclusively - no fallback defaults
  const displayItems = items && items.length > 0 ? items : []

  const bgClass = bgStyles[backgroundStyle] || bgStyles['dark']
  const textClass = textStyles[backgroundStyle] || textStyles['dark']
  const descClass = descriptionStyles[backgroundStyle] || descriptionStyles['dark']
  const cardClass = cardStyles[backgroundStyle] || cardStyles['dark']
  const cardTextClass = cardTextStyles[backgroundStyle] || cardTextStyles['dark']
  const [titleColor, descColor] = cardTextClass.split(' ')

  return (
    <section className={`py-28 lg:py-48 ${bgClass}`}>
      <div className="max-w-screen-xl mx-auto px-6">
        {(title || description) && (
          <div className="text-center mb-24">
            {title && (
              <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 ${textClass}`}>
                {title}
              </h2>
            )}
            {description && (
              <p className={`text-base sm:text-lg lg:text-xl ${descClass} max-w-2xl mx-auto`}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayItems.map((item, index) => {
            const IconComponent = item.title ? iconMap[item.title] : null
            return (
              <div
                key={index}
                className={`group p-8 rounded-xl border ${cardClass} transition-all duration-300`}
              >
                <div className="flex flex-col gap-4">
                  {IconComponent && (
                    <div className="flex-shrink-0">
                      <IconComponent
                        size={32}
                        className={`text-teal-500 group-hover:text-teal-400 transition-colors`}
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold ${titleColor} mb-2`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm ${descColor} leading-relaxed`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
