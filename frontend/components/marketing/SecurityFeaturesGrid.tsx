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
}

export function SecurityFeaturesGrid({
  items = [],
  title = 'Security Features',
  description = 'Built-in security controls at every layer',
}: SecurityFeaturesGridProps) {
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

  return (
    <section className="py-28 lg:py-48 bg-ink-900">
      <div className="max-w-screen-xl mx-auto px-6">
        {(title || description) && (
          <div className="text-center mb-24">
            {title && (
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base sm:text-lg lg:text-xl text-teal-200 max-w-2xl mx-auto">
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
                className="group p-8 rounded-xl border border-teal-700/40 bg-ink-800 hover:border-teal-600/60 hover:bg-ink-700 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300"
              >
                <div className="flex flex-col gap-4">
                  {IconComponent && (
                    <div className="flex-shrink-0">
                      <IconComponent
                        size={32}
                        className="text-teal-500 group-hover:text-teal-400 transition-colors"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-teal-100 leading-relaxed">
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
