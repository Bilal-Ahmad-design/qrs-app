import { DataCard } from '@/components/marketing/DataCard';
import { buildMetadata } from '@/lib/metadata';
import { getPageBySlug } from '@/lib/payload-fetch';

export const metadata = buildMetadata({
  title: 'Platform',
  description: 'Enterprise-grade quantitative risk analysis platform for institutional investors.',
  path: '/platform/',
});

export default async function PlatformPage() {
  let platformContent = null;
  try {
    platformContent = await getPageBySlug('platform');
  } catch (error) {
    console.log('CMS not available for platform page, using fallback content');
  }
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-ink-800 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Quantitative Risk Platform
          </h1>
          <p className="text-lg lg:text-xl text-cream-100 leading-relaxed">
            Enterprise-grade risk analytics built for institutional investors, asset managers, and reinsurance professionals.
          </p>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="bg-cream-50 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-16 text-center">
            Core Capabilities
          </h2>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Portfolio Analytics',
                description: 'Real-time VaR, TVaR, and scenario analysis across multi-asset portfolios with instant recalculation.'
              },
              {
                title: 'Stress Testing',
                description: 'Historical and hypothetical scenarios with cryptographic reproducibility for audit compliance.'
              },
              {
                title: 'Risk Reporting',
                description: 'Auditable risk reports with verified calculations and complete lineage tracking for every metric.'
              }
            ].map((feature) => (
              <DataCard key={feature.title} variant="light">
                <h3 className="text-lg font-semibold text-ink-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </DataCard>
            ))}
          </div>

          <div className="bg-ink-800 rounded-lg p-12 text-center text-white -mx-6 px-6">
            <h3 className="text-2xl font-semibold mb-4">Additional Features</h3>
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
              {[
                'Real-time monitoring',
                'API access',
                'Custom workflows',
                'Multi-currency support',
                'Regulatory reporting',
                'Role-based access control'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="text-teal-400">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
