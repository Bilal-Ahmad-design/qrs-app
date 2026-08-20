import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regulatory & Compliance | QRS',
  description: 'Regulatory-ready risk management supporting Solvency II, NAIC RBC, ORSA, and Lloyd\'s/BMA requirements.',
}

const frameworks = [
  {
    name: 'Solvency II',
    region: 'European Union',
    description: 'European insurance regulation with SCR (Solvency Capital Requirement) and MCR requirements',
    capabilities: [
      'SCR calculation and reporting',
      'Standard formula and internal model support',
      'Quarterly/annual reporting alignment',
      'Own funds and capital adequacy monitoring',
    ],
  },
  {
    name: 'NAIC RBC',
    region: 'United States',
    description: 'Risk-Based Capital requirements for US insurers and reinsurers',
    capabilities: [
      'RBC ratio calculation',
      'Asset risk and underwriting risk components',
      'Reserve adequacy assessment',
      'Regulatory filing preparation',
    ],
  },
  {
    name: 'ORSA',
    region: 'Multi-Region',
    description: 'Own Risk and Solvency Assessment framework for risk management governance',
    capabilities: [
      'Risk identification and mapping',
      'Stress testing and scenario analysis',
      'Board-level risk reporting',
      '3-year solvency projection modeling',
    ],
  },
  {
    name: 'Lloyd\'s / BMA',
    region: 'Bermuda & Lloyd\'s London',
    description: 'Bermuda Monetary Authority and Lloyd\'s of London regulatory requirements',
    capabilities: [
      'Bermuda insurance regulations compliance',
      'Lloyd\'s capital requirements',
      'Syndicate performance monitoring',
      'Regulatory returns and filing support',
    ],
  },
]

export default function RegulatoryPage() {
  return (
    <main>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="px-6 py-20 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Regulatory & Compliance
          </h1>
          <p className="text-xl text-slate-300">
            Built from the ground up to support major regulatory frameworks and governance requirements
          </p>
        </section>

        {/* Regulatory Frameworks */}
        <section className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {frameworks.map((framework) => (
                <div
                  key={framework.name}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-8"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white">{framework.name}</h3>
                    <p className="text-sm text-teal-400">{framework.region}</p>
                  </div>
                  <p className="text-slate-300 mb-6">{framework.description}</p>
                  <div className="space-y-2">
                    {framework.capabilities.map((capability) => (
                      <div key={capability} className="flex items-start">
                        <span className="text-teal-400 mr-3 mt-0.5">✓</span>
                        <span className="text-slate-300 text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Positioning */}
        <section className="px-6 py-16 bg-slate-800/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Compliance Approach</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Governance Framework</h3>
                <p className="text-slate-300">
                  QRS is built with regulatory governance in mind. Every calculation includes audit trails,
                  cryptographic reproducibility, and complete lineage tracking to support regulatory reviews.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Evidence Workflow</h3>
                <p className="text-slate-300">
                  Automated evidence collection for regulatory compliance. Maintain audit-ready documentation
                  for SOC 2, ISO 27001, and industry-specific frameworks through built-in controls and monitoring.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Risk Quantification</h3>
                <p className="text-slate-300">
                  Precise risk measurement for capital adequacy, reserve validation, and solvency reporting.
                  Support for both standard formula and internal model approaches where applicable.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Auditor Integration</h3>
                <p className="text-slate-300">
                  Streamlined audit workflows with cryptographic verification capabilities. External auditors
                  and regulators can independently verify calculations without requiring QRS system access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Governance Messaging */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Governance & Control</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Risk Management</h3>
                <p className="text-slate-300">
                  Enterprise-grade risk infrastructure with role-based access, decision audit trails,
                  and governance-ready reporting for board and committee oversight.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Compliance Automation</h3>
                <p className="text-slate-300">
                  Reduce manual compliance work with automated evidence tracking, regulatory calculations,
                  and audit-ready reporting built into every workflow.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Third-Party Integration</h3>
                <p className="text-slate-300">
                  Seamless integration with external audit platforms, regulatory submission tools,
                  and governance systems to reduce operational complexity.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Transparency</h3>
                <p className="text-slate-300">
                  Complete methodology transparency supports regulatory review. Share model documentation,
                  assumptions, and validation results with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 bg-slate-800/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready for regulatory confidence?</h2>
            <p className="text-lg text-slate-300 mb-8">
              Discuss how QRS supports your regulatory requirements and governance framework
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
