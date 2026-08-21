import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions by Role | QRS',
  description: 'Tailored risk management solutions for underwriters, portfolio managers, reinsurance buyers, ILS managers, and CROs.',
}

const solutions = [
  {
    role: 'Underwriters',
    description: 'Real-time risk assessment and premium optimization',
    features: [
      'Portfolio concentration analysis',
      'Geographic risk heatmaps',
      'Scenario stress testing',
      'Loss prediction models',
    ],
  },
  {
    role: 'Portfolio Managers',
    description: 'Multi-dimensional risk insight for capital deployment',
    features: [
      'Aggregate risk exposure views',
      'Correlation analysis across perils',
      'Performance attribution modeling',
      'Strategic rebalancing analysis',
    ],
  },
  {
    role: 'Reinsurance Buyers',
    description: 'Evidence-driven program design and negotiation',
    features: [
      'Optimal layer structuring',
      'Market rate benchmarking',
      'Coverage gap identification',
      'Vendor modeling comparison',
    ],
  },
  {
    role: 'ILS Managers',
    description: 'Transparent pricing and risk-adjusted returns',
    features: [
      'Catastrophe bond valuation',
      'Sidecar fund analytics',
      'Tail risk quantification',
      'Insurance-linked security pricing',
    ],
  },
  {
    role: 'Chief Risk Officers',
    description: 'Enterprise-wide governance and regulatory compliance',
    features: [
      'Solvency II SCR calculation',
      'NAIC RBC alignment',
      'Risk appetite monitoring',
      'Board-ready reporting',
    ],
  },
]

export default function SolutionsPage() {
  return (
    <main>
      <div className="bg-gradient-to-b from-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="px-6 py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Solutions by Role
          </h1>
          <p className="text-xl text-slate-300">
            Tailored quantitative risk management for every function in institutional insurance and investment
          </p>
        </section>

        {/* Solutions Grid */}
        <section className="px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((solution) => (
                <div
                  key={solution.role}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-teal-500/50 transition-colors"
                >
                  <h3 className="text-2xl font-bold text-white mb-2">{solution.role}</h3>
                  <p className="text-teal-400 mb-6">{solution.description}</p>
                  <div className="space-y-3">
                    {solution.features.map((feature) => (
                      <div key={feature} className="flex items-start">
                        <span className="text-teal-400 mr-3 mt-1">→</span>
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 bg-slate-800/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">See your solution in action</h2>
            <p className="text-lg text-slate-300 mb-8">
              Request a personalized demonstration tailored to your role and institutional requirements
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
            >
              Request Demo
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
