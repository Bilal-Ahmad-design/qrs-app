import { CompliancePage } from '@/components/marketing/CompliancePage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Terms of Service',
  path: '/terms/',
});

export default function TermsPage() {
  return (
    <CompliancePage
      title="Terms of Service"
      intro="These terms govern access to and use of the QRS platform, documentation, and related services."
      sections={[
        {
          title: 'Use of the service',
          bullets: [
            'You may use QRS only for lawful, authorized evaluation, testing, or operational purposes.',
            'You are responsible for the accuracy and legality of data you submit to the platform.',
            'You may not attempt to reverse engineer, circumvent, or abuse service protections.',
          ],
        },
        {
          title: 'Intellectual property',
          bullets: [
            'QRS content, methodology, and product documentation remain the property of QRS or its licensors.',
            'Customer data remains the property of the customer unless otherwise agreed in writing.',
          ],
        },
        {
          title: 'Limitation of liability',
          bullets: [
            'QRS provides the service on an as-is basis and does not guarantee uninterrupted availability.',
            'Liability is limited to the extent permitted by applicable law and the commercial agreement between parties.',
          ],
        },
      ]}
      footer={
        <p className="text-sm text-text-muted">
          Questions can be sent to <a href="mailto:legal@qrsrisk.com" className="text-teal-600 underline">legal@qrsrisk.com</a>.
        </p>
      }
    />
  );
}
