import { SupportForm } from '@/components/marketing/SupportForm';
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
        <div className="mx-auto max-w-screen-xl px-6">
          <h1 className="mb-6 text-5xl font-bold text-ink-900 lg:text-6xl">Support</h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Get help with QRS Quantum Risk Systems.
          </p>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-teal-700/20 bg-white p-8">
              <h2 className="mb-4 text-2xl font-semibold text-ink-900">Contact Support</h2>
              <p className="mb-4 text-text-muted">
                For technical support and assistance, please contact our support team.
              </p>
              <p className="text-lg">
                <strong>Email:</strong>{' '}
                <a href="mailto:support@qrsrisk.com" className="text-teal-600 hover:text-teal-700">
                  support@qrsrisk.com
                </a>
              </p>
            </div>

            <SupportForm />
          </div>
        </div>
      </section>
    </main>
  );
}
