interface VerificationStep {
  title: string
  description: string
  icon: string
}

const verificationSteps: VerificationStep[] = [
  {
    title: 'Input Data',
    description: 'Portfolio data and model inputs',
    icon: '📊',
  },
  {
    title: 'Cryptographic Signing',
    description: 'Mathematical proof of calculation',
    icon: '🔐',
  },
  {
    title: 'Reproducible Results',
    description: 'Independent verification possible',
    icon: '✓',
  },
  {
    title: 'Audit Trail',
    description: 'Complete lineage documented',
    icon: '📋',
  },
]

interface VerificationFlowProps {
  title?: string
  description?: string
}

export function VerificationFlow({
  title = 'How Verification Works',
  description,
}: VerificationFlowProps) {
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

      {/* Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {verificationSteps.map((step, index) => (
          <div key={step.title} className="relative">
            {/* Step Card */}
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-light-accent-light flex items-center justify-center text-3xl mb-4 shadow-lg">
                  {step.icon}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-ink-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow to next step (except last) */}
            {index < verificationSteps.length - 1 && (
              <div className="hidden md:flex absolute top-8 -right-4 transform translate-x-full items-center">
                <svg
                  className="w-8 h-8 text-light-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-light-accent-light">
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-ink-900">
            Bit-Perfect Reproducibility
          </h4>
          <p className="text-text-muted">
            Run the same model on any system and get identical results, byte-for-byte. No hidden randomness, no platform dependencies.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-ink-900">
            Cryptographic Proof
          </h4>
          <p className="text-text-muted">
            Every calculation is cryptographically signed, providing mathematical proof that results haven't been altered or tampered with.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-ink-900">
            Complete Lineage
          </h4>
          <p className="text-text-muted">
            Trace every number back to its source. See exactly which inputs produced which outputs at each step of the calculation.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-ink-900">
            Independent Verification
          </h4>
          <p className="text-text-muted">
            Third parties can independently verify results without accessing proprietary code. Trust is verifiable, not assumed.
          </p>
        </div>
      </div>
    </div>
  )
}
