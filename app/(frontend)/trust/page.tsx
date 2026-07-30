import { buildMetadata } from '@/lib/metadata';
import { TrustBadgeCluster } from '@/components/marketing/TrustBadgeCluster';
import { VerifiedSealBadge } from '@/components/marketing/VerifiedSealBadge';
import { DataCard } from '@/components/marketing/DataCard';
import { getPageBySlug } from '@/lib/payload-fetch';

export const metadata = buildMetadata({
  title: 'Trust & Security',
  description: 'Enterprise-grade security, compliance, and cryptographic verification.',
  path: '/trust/',
});

export default async function TrustPage() {
  let trustContent = null;
  try {
    trustContent = await getPageBySlug('trust');
  } catch (error) {
    console.log('CMS not available for trust page, using fallback content');
  }
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-ink-800 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Built for Trust
          </h1>
          <p className="text-lg lg:text-xl text-cream-100 leading-relaxed">
            Enterprise-grade security, cryptographic verification, and independent audit trails at every step — designed for institutional review and continuous assurance.
          </p>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="bg-cream-50 py-24 lg:py-40">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-ink-900 mb-16 text-center">
            Security & Compliance
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <DataCard variant="light">
              <div className="flex justify-center mb-6">
                <VerifiedSealBadge
                  signatureHash="a1b2c3d4e5f6g7h8i9j0..."
                  verifierUrl="https://github.com/qrs-risk/qrs-replay"
                  fullSignature="ECDSA-P-256: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0..."
                />
              </div>
              <h3 className="text-xl font-semibold text-ink-900 text-center mb-3">
                Cryptographic Reproducibility
              </h3>
              <p className="text-sm text-text-muted text-center leading-relaxed">
                Every calculation is cryptographically signed with our ECDSA seal. Independently verify any analysis using open-source verification tools.
              </p>
            </DataCard>

            <DataCard variant="dark">
              <h3 className="text-xl font-semibold text-white text-center mb-6">
                Compliance Certifications
              </h3>
              <div className="mb-6 flex justify-center">
                <TrustBadgeCluster />
              </div>
              <p className="text-sm text-teal-100 text-center leading-relaxed">
                SOC 2 audit in progress via Vanta, supported by structured controls, deployment monitoring, and a growing evidence trail for customer diligence and audit readiness.
              </p>
            </DataCard>
          </div>

          <div className="bg-ink-900 rounded-lg p-12 -mx-6 px-6">
            <h3 className="text-2xl font-semibold text-white mb-8 text-center">
              Security Features
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-white">
              {[
                'Encrypted transport and hardened headers',
                'Multi-factor authentication and least-privilege access',
                'Role-based access control and audit logging',
                'Structured change management and deployment evidence',
                'Privacy request and vulnerability disclosure workflows',
                'SOC 2 compliance readiness'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="text-teal-400">✓</span>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
