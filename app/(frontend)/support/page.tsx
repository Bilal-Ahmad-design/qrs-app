import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Support',
  description: 'Get support for QRS Quantum Risk Systems',
  path: '/support',
});

export default function SupportPage() {
  return (
    <main>
      <section className="bg-cream-50 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-ink-900 mb-6">Support</h1>
          <p className="text-lg text-text-muted max-w-2xl">
            Get help with QRS Quantum Risk Systems
          </p>

          <div className="mt-16 bg-white rounded-lg p-8 border border-teal-700/20">
            <h2 className="text-2xl font-semibold text-ink-900 mb-4">Contact Support</h2>
            <p className="text-text-muted mb-4">
              For technical support and assistance, please contact our support team:
            </p>
            <p className="text-lg">
              <strong>Email:</strong>{' '}
              <a href="mailto:support@qrsrisk.com" className="text-teal-600 hover:text-teal-700">
                support@qrsrisk.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
