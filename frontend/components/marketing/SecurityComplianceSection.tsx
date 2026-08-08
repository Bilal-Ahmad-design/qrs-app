'use client'

import { VerifiedSealBadge } from '@/components/marketing/VerifiedSealBadge'
import { TrustBadgeCluster } from '@/components/marketing/TrustBadgeCluster'

interface CertificationItem {
  title?: string
  description?: string
  icon?: string
}

interface SecurityComplianceSectionProps {
  title?: string
  description?: string
  leftTitle?: string
  leftDescription?: string
  rightTitle?: string
  rightDescription?: string
  items?: CertificationItem[]
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
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 text-ink-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base sm:text-lg lg:text-xl text-ink-700 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column: Cryptographic Reproducibility */}
          <div className="flex flex-col space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-4">
                {leftTitle}
              </h3>
              <p className="text-base text-ink-700 leading-relaxed">
                {leftDescription}
              </p>
            </div>

            {/* Verified Seal Badge */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-200/40">
              <div className="inline-block mb-4">
                <VerifiedSealBadge
                  signatureHash="a1b2c3d4e5f6g7h8"
                  verifierUrl="https://github.com/qrsrisk/replay-verifier"
                  fullSignature="3045022100a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0 02207a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7"
                />
              </div>
              <p className="text-sm text-teal-700 font-medium">
                Click to verify calculation signature using open-source tools
              </p>
            </div>
          </div>

          {/* Right Column: Compliance & Trust Badges */}
          <div className="flex flex-col space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-4">
                {rightTitle}
              </h3>
              <p className="text-base text-ink-700 leading-relaxed">
                {rightDescription}
              </p>
            </div>

            {/* Trust Badge Cluster - Dynamic or Fallback */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-6">
                Certifications & Standards
              </p>
              {items && items.length > 0 ? (
                <div className="bg-gradient-to-br from-white to-teal-50/30 p-8 rounded-xl border border-teal-300/30 shadow-lg shadow-teal-500/5">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center p-4 rounded-lg bg-teal-50/40 border border-teal-200/40 hover:border-teal-300/60 transition"
                      >
                        {item.icon && (
                          <div className="text-3xl mb-2">{item.icon}</div>
                        )}
                        <h4 className="text-sm font-semibold text-ink-900 mb-1">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-ink-700">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white to-teal-50/30 p-8 rounded-xl border border-teal-300/30 shadow-lg shadow-teal-500/5">
                  <TrustBadgeCluster />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
