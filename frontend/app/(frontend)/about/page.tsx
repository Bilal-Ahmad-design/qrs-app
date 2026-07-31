import { buildMetadata } from '@/lib/metadata';
import { DataCard } from '@/components/marketing/DataCard';
import { getPageBySlug } from '@/lib/payload-fetch';

export const metadata = buildMetadata({
  title: 'About',
  description: 'Learn about Quantitative Risk Systems and our mission.',
  path: '/about/',
});

export default async function AboutPage() {
  let aboutContent = null;
  try {
    aboutContent = await getPageBySlug('about');
  } catch (error) {
    console.log('CMS not available for about page, using fallback content');
  }
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-ink-800 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            About QRS
          </h1>
          <p className="text-lg lg:text-xl text-cream-100 leading-relaxed">
            Building trust infrastructure for institutional risk management through cryptographic verification and auditable analytics.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-cream-50 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
              QRS is building the trust infrastructure for institutional risk management. Every calculation is cryptographically signed and independently verifiable, enabling institutional investors to make confident decisions backed by auditable, reproducible analysis.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-6">
              Why Verifiable Risk?
            </h2>
            <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
              Institutional risk management demands more than black-box analytics. Our platform gives institutional investors the ability to independently verify every calculation, audit the entire lineage of a risk analysis, and build confidence in the numbers driving their decisions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Transparent',
                description: 'Open-source verification tools. No hidden algorithms or proprietary black boxes.'
              },
              {
                title: 'Reproducible',
                description: 'Cryptographically signed calculations that third parties can independently verify.'
              },
              {
                title: 'Auditable',
                description: 'Complete lineage tracking for every metric, decision, and analysis.'
              }
            ].map((value) => (
              <DataCard key={value.title} variant="light">
                <h3 className="text-lg font-semibold text-ink-900 mb-3">{value.title}</h3>
                <p className="text-sm text-text-muted">{value.description}</p>
              </DataCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-24 lg:py-40 px-6">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-6">
            Built by Risk Experts
          </h2>
          <p className="text-lg text-text-muted mb-12 max-w-2xl mx-auto">
            The QRS team brings together leaders in quantitative finance, software architecture, and institutional risk management.
          </p>
          <div className="text-left">
            <p className="text-base text-text-muted leading-relaxed">
              Our founders have worked at leading investment banks, hedge funds, and fintech companies. We understand the challenges institutional investors face when pricing catastrophic risk and deploying capital in uncertain markets.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
