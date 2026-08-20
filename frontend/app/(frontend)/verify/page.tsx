import { Metadata } from 'next'
import { SiteChrome } from '@/components/layout/SiteChrome'

export const metadata: Metadata = {
  title: 'Built to be Verified | QRS',
  description: 'Cryptographically signed results with independent verification capabilities. Every calculation includes reproducibility certificates.',
}

export default function VerifyPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="px-6 py-20 text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Built to be Verified
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Every calculation is cryptographically signed. Every result can be independently verified.
              No trust required—only cryptography and open standards.
            </p>
          </div>
        </section>

        {/* Verification Seal */}
        <section className="px-6 py-16 bg-slate-800/50">
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-teal-500/30 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Lineage Verified Seal</h2>
              <p className="text-slate-300 mb-4">
                Every QRS result includes a cryptographic seal that proves:
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-teal-400 mr-3">✓</span>
                  <span>The exact methodology and parameters used in the calculation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-3">✓</span>
                  <span>Cryptographic hash of all input data and model assumptions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-3">✓</span>
                  <span>ECDSA digital signature guaranteeing calculation integrity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-3">✓</span>
                  <span>Timestamp and audit trail for reproducibility</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Verification Workflow */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Verification Workflow</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="text-4xl font-bold text-teal-400 mb-4">1</div>
                <h3 className="text-xl font-semibold text-white mb-3">Run Analysis</h3>
                <p className="text-slate-400">
                  Execute your catastrophe model or risk analysis on QRS platform
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="text-4xl font-bold text-teal-400 mb-4">2</div>
                <h3 className="text-xl font-semibold text-white mb-3">Receive Seal</h3>
                <p className="text-slate-400">
                  Automatically receive cryptographic Lineage Verified seal with results
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="text-4xl font-bold text-teal-400 mb-4">3</div>
                <h3 className="text-xl font-semibold text-white mb-3">Independent Verify</h3>
                <p className="text-slate-400">
                  Share seal with auditors or stakeholders for independent verification
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Messaging */}
        <section className="px-6 py-16 bg-slate-800/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Why Verification Matters</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Institutional Confidence</h3>
                <p className="text-slate-300">
                  Institutional investors and regulators can independently verify every number
                  driving capital deployment decisions. No black boxes. No opaque models.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Regulatory Audit Trail</h3>
                <p className="text-slate-300">
                  Complete lineage tracking and reproducibility certificates provide evidence
                  for regulatory compliance, audits, and solvency assessments.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Competitive Advantage</h3>
                <p className="text-slate-300">
                  Demonstrate rigor and transparency to stakeholders, regulators, and capital markets.
                  Built-in credibility for institutional deployment.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Future-Proof Architecture</h3>
                <p className="text-slate-300">
                  Verification capabilities are built into the platform architecture, not an afterthought.
                  Scales with your institution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to verify risk?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Request a demonstration of QRS verification capabilities and see how cryptographic
              confidence can transform your risk management.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
            >
              Request Demo
            </a>
          </div>
        </section>
      </main>
    </SiteChrome>
  )
}
