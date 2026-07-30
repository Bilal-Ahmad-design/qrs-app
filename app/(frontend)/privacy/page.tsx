import { CompliancePage } from '@/components/marketing/CompliancePage';
import { PrivacyRequestForm } from '@/components/marketing/PrivacyRequestForm';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  path: '/privacy/',
});

export default function PrivacyPage() {
  return (
    <CompliancePage
      title="Privacy Policy"
      intro="QRS is built to handle sensitive catastrophe and insurance data with care. This policy explains how we collect, use, and protect personal information and how you can exercise your privacy rights."
      sections={[
        {
          title: 'Information we collect',
          bullets: [
            'Contact and account details provided through demo requests, validation reports, and support intake.',
            'Technical metadata such as IP address, browser information, and request logs needed to secure the service.',
            'Business and portfolio details you provide when evaluating or testing the platform.',
          ],
        },
        {
          title: 'How we use it',
          bullets: [
            'To provide onboarding, customer support, and service delivery.',
            'To improve security, reliability, and compliance monitoring.',
            'To respond to legal requests, privacy inquiries, and regulatory obligations.',
          ],
        },
        {
          title: 'Your rights',
          bullets: [
            'You may request access, correction, deletion, or portability of your personal information where applicable.',
            'You may opt out of non-essential analytics or marketing communications where law permits.',
            'Privacy requests can be sent to privacy@qrsrisk.com.',
          ],
        },
        {
          title: 'Privacy request form',
          children: <PrivacyRequestForm />,
        },
      ]}
      footer={
        <p className="text-sm text-text-muted">
          For questions or requests, contact <a href="mailto:privacy@qrsrisk.com" className="text-teal-600 underline">privacy@qrsrisk.com</a>.
        </p>
      }
    />
  );
}
