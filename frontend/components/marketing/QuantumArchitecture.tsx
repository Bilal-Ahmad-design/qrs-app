interface Layer {
  name: string
  description: string
  items: string[]
}

const layers: Layer[] = [
  {
    name: 'Data Ingestion Layer',
    description: 'Standardized formats, compliance validation, real-time streaming',
    items: ['EDM XML', 'Custom CSVs', 'API feeds', 'Data Quality Checks'],
  },
  {
    name: 'Computation Layer',
    description: 'Distributed execution, model composition, lineage tracking',
    items: ['CAT models', 'Pricing', 'Valuation', 'Sensitivity Analysis'],
  },
  {
    name: 'Verification Layer',
    description: 'Cryptographic signing, bit-for-bit reproducibility, audit trails',
    items: ['ECDSA signatures', 'Reproducible hashing', 'Merkle chains', 'Audit logs'],
  },
  {
    name: 'Output Layer',
    description: 'Multi-format delivery, stakeholder-specific views, API access',
    items: ['PDF reports', 'REST APIs', 'Real-time dashboards', 'Webhooks'],
  },
]

interface QuantumArchitectureProps {
  title?: string
  description?: string
}

export function QuantumArchitecture({
  title = 'Quantum-Grade Architecture',
  description = 'Built for precision, auditability, and scale',
}: QuantumArchitectureProps) {
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

      {/* Layered Architecture Visualization */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {layers.map((layer, index) => (
          <div
            key={layer.name}
            className={`rounded-lg border p-6 transition-all hover:shadow-md ${
              index % 2 === 0
                ? 'bg-light-bg-primary border-light-accent-light'
                : 'bg-white border-teal-200'
            }`}
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-ink-900">
                  {layer.name}
                </h3>
                <p className="text-sm text-text-muted mt-1">
                  {layer.description}
                </p>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-light-accent-light">
                {layer.items.map((item) => (
                  <div
                    key={item}
                    className="text-sm font-medium text-light-accent-primary flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-light-accent-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow to next layer */}
            {index < layers.length - 1 && (
              <div className="flex justify-center mt-4">
                <svg
                  className="w-6 h-6 text-light-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Principle */}
      <div className="bg-light-bg-dark text-light-text-light rounded-lg p-8 text-center space-y-3">
        <p className="text-lg font-semibold">
          Each layer is independently auditable. Every result is cryptographically verifiable.
        </p>
        <p className="text-sm text-light-text-light/80">
          No black boxes. No assumptions. Complete transparency from data in to results out.
        </p>
      </div>
    </div>
  )
}
