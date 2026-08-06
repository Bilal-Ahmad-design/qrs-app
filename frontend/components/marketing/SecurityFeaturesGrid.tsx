'use client'

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
  const defaultItems: SecurityFeature[] = [
    {
      title: 'Data Encryption',
      description: 'AES-256 encryption for data at rest and in transit',
      icon: '🔐',
    },
    {
      title: 'Access Control',
      description: 'Role-based access control (RBAC) with fine-grained permissions',
      icon: '🔑',
    },
    {
      title: 'Audit Logging',
      description: 'Comprehensive audit trails for all actions and API calls',
      icon: '📋',
    },
    {
      title: 'Infrastructure Isolation',
      description: 'Multi-tenant infrastructure with complete data isolation',
      icon: '🔒',
    },
    {
      title: 'DDoS Protection',
      description: 'Enterprise-grade DDoS mitigation and rate limiting',
      icon: '⚔️',
    },
    {
      title: 'Compliance Monitoring',
      description: 'Continuous monitoring for regulatory compliance requirements',
      icon: '✓',
    },
  ]

  const displayItems = items && items.length > 0 ? items : defaultItems

  return (
    <section className="py-28 lg:py-48 bg-deep-dark">
      <div className="max-w-screen-xl mx-auto px-6">
        {(title || description) && (
          <div className="text-center mb-24">
            {title && (
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base sm:text-lg lg:text-xl text-cream-100 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-lg border-2 border-teal-700/30 bg-ink-800 hover:border-teal-600/60 hover:bg-ink-700 transition-all"
            >
              <div className="flex items-start gap-4">
                {item.icon && (
                  <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-cream-100 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
