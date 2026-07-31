import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Documentation',
  description: 'QRS Quantum Risk Systems documentation and technical guides',
  path: '/docs',
});

export default function DocsPage() {
  return (
    <main>
      <section className="bg-cream-50 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-ink-900 mb-6">Documentation</h1>
          <p className="text-lg text-text-muted max-w-2xl">
            Technical guides and API documentation for QRS Quantum Risk Systems
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 border border-teal-700/20">
              <h2 className="text-2xl font-semibold text-ink-900 mb-4">Getting Started</h2>
              <p className="text-text-muted mb-4">
                Learn the basics of QRS and get your first models running.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-teal-700/20">
              <h2 className="text-2xl font-semibold text-ink-900 mb-4">API Reference</h2>
              <p className="text-text-muted mb-4">
                Complete API documentation and integration guides.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-teal-700/20">
              <h2 className="text-2xl font-semibold text-ink-900 mb-4">Validation Reports</h2>
              <p className="text-text-muted mb-4">
                View independent validation studies and audit reports.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-teal-700/20">
              <h2 className="text-2xl font-semibold text-ink-900 mb-4">FAQ</h2>
              <p className="text-text-muted mb-4">
                Frequently asked questions about QRS and catastrophe modeling.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
