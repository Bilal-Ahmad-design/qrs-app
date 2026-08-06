'use client'

import { VerifiedSealBadge } from '@/components/marketing/VerifiedSealBadge'
import { TrustBadgeCluster } from '@/components/marketing/TrustBadgeCluster'

interface SecurityComplianceSectionProps {
  title?: string
  description?: string
  leftTitle?: string
  leftDescription?: string
  rightTitle?: string
  rightDescription?: string
}

export function SecurityComplianceSection({
  title = 'Security & Compliance',
  description = 'Enterprise-grade security built into every layer',
  leftTitle = 'Cryptographic Reproducibility',
  leftDescription = 'Every calculation is cryptographically signed with our ECDSA seal. Independently verify any analysis using open-source verification tools.',
  rightTitle = 'Compliance Certifications',
  rightDescription = 'SOC 2 audit in progress via Vanta, supported by structured controls, deployment monitoring, and a growing evidence trail for customer diligence and audit readiness.',
}: SecurityComplianceSectionProps) {
  return (
    <section className="py-28 lg:py-48 bg-light-bg-primary">
      <div className="max-w-screen-xl mx-auto px-6">
        {(title || description) && (
          <div className="text-center mb-24">
            {title && (
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 text-light-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base sm:text-lg lg:text-xl text-light-text-secondary max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-start">
          {/* Left Column: Cryptographic Reproducibility */}
          <div className="flex flex-col space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-light-text-primary mb-4">
                {leftTitle}
              </h3>
              <p className="text-base text-light-text-secondary leading-relaxed">
                {leftDescription}
              </p>
            </div>

            {/* Verified Seal Badge */}
            <div className="mt-8">
              <div className="inline-block">
                <VerifiedSealBadge
                  signatureHash="a1b2c3d4e5f6g7h8"
                  verifierUrl="https://github.com/qrsrisk/replay-verifier"
                  fullSignature="3045022100a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0 02207a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7"
                />
              </div>
              <p className="text-sm text-light-text-secondary mt-4">
                Click to verify calculation signature using open-source tools
              </p>
            </div>
          </div>

          {/* Right Column: Compliance & Trust Badges */}
          <div className="flex flex-col space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-light-text-primary mb-4">
                {rightTitle}
              </h3>
              <p className="text-base text-light-text-secondary leading-relaxed">
                {rightDescription}
              </p>
            </div>

            {/* Trust Badge Cluster */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-light-accent-primary uppercase tracking-wider mb-4">
                Certifications & Standards
              </p>
              <div className="bg-white p-6 rounded-lg border border-light-accent-light/20">
                <TrustBadgeCluster />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
