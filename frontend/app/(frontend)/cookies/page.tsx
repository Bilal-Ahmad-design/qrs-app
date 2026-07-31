import { CompliancePage } from '@/components/marketing/CompliancePage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Cookie Policy',
  path: '/cookies/',
});

export default function CookiesPage() {
  return (
    <CompliancePage
      title="Cookie Policy"
      intro="We use cookies and similar technologies to improve site performance, remember your preferences, and support security and analytics needs."
      sections={[
        {
          title: 'What we use',
          bullets: [
            'Essential cookies required to keep the site secure and functioning correctly.',
            'Preference cookies that remember your consent choices and UI preferences.',
            'Analytics cookies used to understand site traffic and performance with consent.',
          ],
        },
        {
          title: 'Your choices',
          bullets: [
            'You can accept, reject, or customize non-essential cookies through the consent banner or preferences link.',
            'You can also use Global Privacy Control (GPC) where supported by your browser.',
          ],
        },
      ]}
      footer={
        <p className="text-sm text-text-muted">
          To manage your preferences, use the cookie settings link in the footer or contact <a href="mailto:privacy@qrsrisk.com" className="text-teal-600 underline">privacy@qrsrisk.com</a>.
        </p>
      }
    />
  );
}
