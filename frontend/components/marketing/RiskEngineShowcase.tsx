import { ReactNode } from 'react'

interface FeatureBlock {
  icon: string
  title: string
  description: string
}

const features: FeatureBlock[] = [
  {
    icon: '⚙️',
    title: 'Real-Time Calculation',
    description: 'Dynamic risk computations with microsecond latency',
  },
  {
    icon: '📊',
    title: 'Multi-Dimensional',
    description: 'Portfolio-level, peril-level, and contract analytics simultaneously',
  },
  {
    icon: '🔗',
    title: 'Composable Architecture',
    description: 'Mix and match models — use our built-ins or integrate yours',
  },
  {
    icon: '✓',
    title: 'Verifiable',
    description: 'Every calculation cryptographically signed and independently verifiable',
  },
]

interface RiskEngineShowcaseProps {
  title?: string
  description?: string
  children?: ReactNode
}

export function RiskEngineShowcase({
  title = 'The Risk Engine',
  description = 'Purpose-built for institutional risk quantification',
  children,
}: RiskEngineShowcaseProps) {
  return (
    <div className="space-y-12">
      {title && (
        <div className="text-center space-y-3">
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="space-y-3 p-6 rounded-lg border border-light-accent-light bg-white hover:shadow-md transition-shadow"
          >
            <div className="text-4xl">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-ink-900">
              {feature.title}
            </h3>
            <p className="text-text-muted">{feature.description}</p>
          </div>
        ))}
      </div>

      {children && <div>{children}</div>}
    </div>
  )
}
