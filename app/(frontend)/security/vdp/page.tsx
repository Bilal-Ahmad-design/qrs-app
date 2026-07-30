import { CompliancePage } from '@/components/marketing/CompliancePage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Vulnerability Disclosure Policy',
  path: '/security/vdp/',
});

export default function VDPPage() {
  return (
    <CompliancePage
      title="Vulnerability Disclosure Policy"
      intro="QRS welcomes responsible vulnerability reports and follows a coordinated disclosure process designed to protect customers and the wider ecosystem."
      sections={[
        {
          title: 'How to report',
          bullets: [
            'Please email security@qrsrisk.com with a concise description of the issue, impact, and reproduction steps.',
            'Do not publicly disclose the issue before we have had an opportunity to assess and remediate it.',
          ],
        },
        {
          title: 'Our process',
          bullets: [
            'We aim to acknowledge reports promptly and to work with researchers through a reasonable remediation window.',
            'We may request additional details or a proof of concept if required to validate the finding.',
          ],
        },
        {
          title: 'Safe harbor',
          bullets: [
            'We support coordinated disclosure and will avoid pursuing legal action against researchers acting in good faith and in accordance with this policy.',
            'Please include sufficient detail to allow validation and remediation.',
          ],
        },
      ]}
      footer={
        <p className="text-sm text-text-muted">
          Reports can be sent to <a href="mailto:security@qrsrisk.com" className="text-teal-600 underline">security@qrsrisk.com</a>.
        </p>
      }
    />
  );
}
