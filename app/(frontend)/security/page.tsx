import { CompliancePage } from '@/components/marketing/CompliancePage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Security',
  path: '/security/',
});

export default function SecurityPage() {
  return (
    <CompliancePage
      title="Security"
      intro="QRS uses modern infrastructure and disciplined controls to protect customer data, preserve service availability, and support independent verification of results."
      sections={[
        {
          title: 'Approach',
          bullets: [
            'We use encrypted transport, least-privilege access, and secure deployment workflows.',
            'Sensitive deployments require review and approval before release.',
          ],
        },
        {
          title: 'Infrastructure',
          bullets: [
            'The platform is hosted with modern edge and application infrastructure designed for resilience.',
            'Core services are monitored and reviewed for availability, access patterns, and operational health.',
          ],
        },
        {
          title: 'Data protection',
          bullets: [
            'Private data is handled with role-based access and audit logging.',
            'Customers can request account, data, or privacy related support via email.',
          ],
        },
      ]}
      footer={
        <p className="text-sm text-text-muted">
          For security questions or disclosures, contact <a href="mailto:security@qrsrisk.com" className="text-teal-600 underline">security@qrsrisk.com</a>.
        </p>
      }
    />
  );
}
