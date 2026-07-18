import { Button } from '@/components/ui/Button';
import { StatusIndicator } from '@/components/marketing/StatusIndicator';
import { DataCard } from '@/components/marketing/DataCard';
import { DeviceFrame } from '@/components/marketing/DeviceFrame';
import { TrustBadgeCluster } from '@/components/marketing/TrustBadgeCluster';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'QRS',
  description: 'Run catastrophe models in seconds. Release billions in trapped capital.',
  path: '/',
});

export default function HomePage() {
  return (
    <main>
      {/* Section 1: Hero */}
      <section className="bg-ink-800 py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="mb-6 inline-block px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/50">
              <span className="text-sm font-semibold text-teal-300">
                Patent Pending: QRS-001-PROV
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Run catastrophe models in seconds. Release billions in trapped capital.
            </h1>
            <p className="text-lg lg:text-xl text-cream-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Every number cryptographically signed and independently verifiable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                className="px-8 py-4 text-lg"
              >
                Request Demo
              </Button>
              <Button
                variant="secondary"
                className="px-8 py-4 text-lg"
              >
                Request Validation Report
              </Button>
            </div>
          </div>

          {/* Device Frame */}
          <DeviceFrame variant="macbook" />
        </div>
      </section>

      {/* Section 2: Active Models */}
      <section className="bg-cream-50 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-16 text-center">
            ACTIVE MODELS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatusIndicator status="production" label="North Atlantic Hurricane" />
            <StatusIndicator status="validation" label="California Wildfire" />
            <StatusIndicator status="validation" label="European Wind" />
            <StatusIndicator status="validation" label="Japan Typhoon" />
          </div>
        </div>
      </section>

      {/* Section 2b: Verifiable by Design */}
      <section className="bg-white py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-ink-900 mb-6">
              Verifiable by Design
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Every calculation is cryptographically signed and independently verifiable. Built-in reproducibility, not an afterthought.
            </p>
          </div>
          <div className="flex justify-center px-4">
            <div className="w-full">
              <TrustBadgeCluster />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2c: AI-Native Architecture */}
      <section className="bg-ink-800 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              AI-Native Architecture
            </h2>
            <p className="text-lg text-cream-100 max-w-2xl mx-auto">
              Built from the ground up for institutional intelligence and scalability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Copilot Interface',
                description: 'Natural language queries over your risk models. Ask questions about exposures, scenarios, and capital deployment strategies.'
              },
              {
                title: 'Institutional Ontology',
                description: 'Deep understanding of reinsurance contracts, portfolios, and catastrophic risk structures. Purpose-built for professionals.'
              },
              {
                title: 'MCP Server',
                description: 'Open protocol for tool integration. Connect external data sources, analytics platforms, and enterprise systems.'
              }
            ].map((feature) => (
              <div key={feature.title} className="text-white">
                <h3 className="text-xl font-semibold mb-3 text-teal-400">{feature.title}</h3>
                <p className="text-cream-100 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Crisis */}
      <section className="bg-white py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-4">
              The Crisis
            </h2>
            <p className="text-lg text-text-muted">
              7 of 12 top carriers withdrew from California
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 py-12 mb-16">
            <DataCard variant="light" className="h-full block">
              <div className="mb-3">
                <div className="text-3xl font-bold text-teal-600">$10B+</div>
              </div>
              <p className="text-sm text-text-muted">Insured Losses</p>
              <p className="text-xs text-text-muted mt-2">2023-2024 catastrophic events driving capital constraints</p>
            </DataCard>

            <DataCard variant="light">
              <div className="mb-3">
                <div className="text-3xl font-bold text-teal-600">$8-12B</div>
              </div>
              <p className="text-sm text-text-muted">Excess Capital Trapped</p>
              <p className="text-xs text-text-muted mt-2">Reinsurance capital unable to deploy due to model uncertainty</p>
            </DataCard>

            <DataCard variant="light">
              <div className="mb-3">
                <div className="text-3xl font-bold text-teal-600">300%</div>
              </div>
              <p className="text-sm text-text-muted">FAIR Plan Surge</p>
              <p className="text-xs text-text-muted mt-2">State insurance of last resort reaching capacity limits</p>
            </DataCard>

            <DataCard variant="light">
              <div className="mb-3">
                <div className="text-3xl font-bold text-teal-600">14x</div>
              </div>
              <p className="text-sm text-text-muted">Model Divergence</p>
              <p className="text-xs text-text-muted mt-2">Vendor modeling outputs diverge by factor of 14 on same exposure</p>
            </DataCard>
          </div>

          <p className="text-base text-text-muted max-w-2xl">
            Institutional capital remains on the sidelines. Every model shows different results. No two institutions agree on pricing. QRS eliminates model uncertainty through cryptographically verified calculations and independent reproducibility.
          </p>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="bg-cream-50 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-16 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Portfolio',
                description: 'Ingest exposure data in your native format'
              },
              {
                step: '02',
                title: 'Run Model',
                description: 'Quantum-optimized catastrophe modeling engine'
              },
              {
                step: '03',
                title: 'Verify Results',
                description: 'Cryptographic reproducibility certificate included'
              },
              {
                step: '04',
                title: 'Deploy Capital',
                description: 'Verified metrics ready for institutional deployment'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold text-teal-500 mb-3">{item.step}</div>
                <h3 className="text-lg font-semibold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Validation */}
      <section className="bg-white py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-4 text-center">
            Independently Validated
          </h2>
          <p className="text-lg text-text-muted text-center mb-20 max-w-2xl mx-auto">
            QRS models are independently verified by leading academic and industry experts
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto px-8 py-12">
            <a
              href="https://ssrn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <DataCard variant="light" className="h-full p-8">
                <h3 className="text-lg font-semibold text-ink-900 mb-4 group-hover:text-teal-600 transition-colors">
                  SSRN Validation Study
                </h3>
                <p className="text-sm text-text-muted mb-6 leading-relaxed">
                  Peer-reviewed quantitative validation of QRS portfolio analytics methodology
                </p>
                <span className="text-teal-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Learn more →
                </span>
              </DataCard>
            </a>

            <a href="/validation/" className="group block">
              <DataCard variant="light" className="h-full p-8">
                <h3 className="text-lg font-semibold text-ink-900 mb-4 group-hover:text-teal-600 transition-colors">
                  Third-Party Audit
                </h3>
                <p className="text-sm text-text-muted mb-6 leading-relaxed">
                  Independent verification of model assumptions, calculation integrity, and reproducibility
                </p>
                <span className="text-teal-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Learn more →
                </span>
              </DataCard>
            </a>
          </div>
        </div>
      </section>

      {/* Section 6: Enterprise CTA */}
      <section className="bg-ink-800 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to move institutional capital?
          </h2>
          <p className="text-lg text-cream-100 mb-10">
            Connect with our team to discuss how QRS can accelerate your risk deployment strategy.
          </p>
          <Button variant="primary" className="px-8 py-4 text-lg">
            Request Demo
          </Button>
        </div>
      </section>
    </main>
  );
}
