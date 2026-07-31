import { buildMetadata } from '@/lib/metadata';
import { DataCard } from '@/components/marketing/DataCard';
import { getPageBySlug } from '@/lib/payload-fetch';

export const metadata = buildMetadata({
  title: 'Validation & Verification',
  description: 'Independent validation and verification of QRS quantitative models.',
  path: '/validation/',
});

export default async function ValidationPage() {
  let validationContent = null;

  try {
    validationContent = await getPageBySlug('validation');
  } catch (error) {
    console.log('CMS not available for validation page, using fallback content');
  }
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-ink-800 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Independently Verified
          </h1>
          <p className="text-lg lg:text-xl text-cream-100 leading-relaxed">
            QRS models have been independently validated by leading academic and industry experts to ensure calculation accuracy and methodological rigor.
          </p>
        </div>
      </section>

      {/* Validation Reports Section */}
      <section className="bg-cream-50 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-16 text-center">
            Validation Reports
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: 'SSRN Validation Study',
                description: 'Peer-reviewed quantitative validation of QRS portfolio analytics methodology using institutional datasets.',
                link: 'https://ssrn.com'
              },
              {
                title: 'Third-Party Audit',
                description: 'Independent verification of model assumptions, calculation integrity, and reproducibility standards.',
                link: '/validation/'
              }
            ].map((report) => (
              <a
                key={report.title}
                href={report.link}
                target={report.link.startsWith('http') ? '_blank' : undefined}
                rel={report.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                <DataCard variant="light" className="h-full">
                  <h3 className="text-lg font-semibold text-ink-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-text-muted mb-4 leading-relaxed">
                    {report.description}
                  </p>
                  <span className="text-teal-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                    Learn more →
                  </span>
                </DataCard>
              </a>
            ))}
          </div>

          <div className="bg-ink-900 rounded-lg p-12 -mx-6 px-6">
            <h3 className="text-2xl font-semibold text-white mb-8 text-center">
              Validation Methodology
            </h3>
            <div className="grid lg:grid-cols-3 gap-8 text-white">
              {[
                {
                  title: 'Backtesting',
                  description: 'Historical performance validation against known catastrophic events'
                },
                {
                  title: 'Sensitivity Analysis',
                  description: 'Comprehensive testing of model response to parameter variations'
                },
                {
                  title: 'Independent Reproducibility',
                  description: 'Third-party verification that calculations match our published results'
                }
              ].map((item) => (
                <div key={item.title}>
                  <h4 className="font-semibold mb-2 text-teal-300">{item.title}</h4>
                  <p className="text-sm text-teal-100">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
