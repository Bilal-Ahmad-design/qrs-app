import { CompliancePage } from '@/components/marketing/CompliancePage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Subprocessors',
  path: '/subprocessors/',
});

export default function SubprocessorsPage() {
  return (
    <CompliancePage
      title="Subprocessors"
      intro="QRS uses a small set of trusted service providers to deliver the platform, support security operations, and maintain reliability."
      sections={[
        {
          title: 'Current subprocessors',
          bullets: [
            'Vercel — hosting and edge delivery for the web application.',
            'Cloudflare — DNS, edge security, and performance services.',
            'Payload CMS / PostgreSQL host — content management and structured data storage.',
            'SMTP provider — delivery of operational and support communications.',
          ],
        },
        {
          title: 'Notice and updates',
          bullets: [
            'Material changes to subprocessors or processing arrangements will be communicated with at least 30 days notice where applicable.',
            'Questions about vendor use or data handling can be directed to privacy@qrsrisk.com.',
          ],
        },
      ]}
      footer={
        <p className="text-sm text-text-muted">
          For questions, contact <a href="mailto:privacy@qrsrisk.com" className="text-teal-600 underline">privacy@qrsrisk.com</a>.
        </p>
      }
    />
  );
}
