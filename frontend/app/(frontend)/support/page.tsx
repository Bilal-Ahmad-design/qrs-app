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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-light-bg-primary to-cream-50 py-32 lg:py-48">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-bold text-ink-900 leading-tight">
              We're here to help
            </h1>
            <p className="text-lg sm:text-xl text-light-text-secondary mb-8">
              Get technical support, report issues, or ask questions about QRS Quantum Risk Systems.
            </p>
          </div>
        </div>
      </section>

      {/* Support Content */}
      <section className="bg-white py-24 lg:py-40">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-teal-700/10 bg-gradient-to-br from-light-bg-primary to-white p-8 sm:p-12 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-teal-100">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-ink-900">Direct Support</h2>
                <p className="mb-6 text-light-text-secondary leading-relaxed">
                  For urgent technical issues or complex questions, reach out to our support team directly.
                </p>
              </div>
              <div>
                <p className="text-sm text-light-text-secondary mb-2">Email us at:</p>
                <a
                  href="mailto:support@qrsrisk.com"
                  className="inline-flex items-center text-lg font-semibold text-teal-600 hover:text-teal-700 transition-colors gap-2"
                >
                  support@qrsrisk.com
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <SupportForm />
          </div>
        </div>
      </section>
    </main>
  );
}
