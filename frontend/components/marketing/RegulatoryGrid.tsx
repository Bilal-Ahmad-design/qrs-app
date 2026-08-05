'use client'

interface RegulatoryItem {
  title?: string
  description?: string
  icon?: string
  [key: string]: any
}

interface RegulatoryGridProps {
  items?: RegulatoryItem[]
  title?: string
  description?: string
}

export function RegulatoryGrid({ items, title, description }: RegulatoryGridProps) {
  return (
    <section className="py-24 lg:py-40 bg-light-bg-primary">
      <div className="max-w-screen-xl mx-auto px-6">
        {(title || description) && (
          <div className="text-center mb-20">
            {title && (
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 text-light-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base sm:text-lg lg:text-xl text-light-text-secondary max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Regulatory Framework Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {(items || []).map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-lg border-2 border-light-accent-light/20 bg-white hover:border-light-accent-primary/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                {item.icon && (
                  <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-light-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-light-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-20 text-center p-8 rounded-lg bg-light-accent-light/5 border border-light-accent-light/20">
          <div className="text-sm font-semibold text-light-accent-primary uppercase tracking-wider mb-3">
            ✓ Compliance Ready
          </div>
          <p className="text-lg text-light-text-primary font-medium">
            Model governance, audit trails, and regulatory evidence automatically generated
          </p>
        </div>
      </div>
    </section>
  )
}
