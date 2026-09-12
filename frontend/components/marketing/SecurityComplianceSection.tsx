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
  items,
}: SecurityComplianceSectionProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-light-bg-primary">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            {title && (
              <div className="inline-block mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink-900">
                  {title}
                </h2>
                <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-teal-500 to-teal-400 mt-4 mx-auto rounded-full"></div>
              </div>
            )}
            {description && (
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-ink-700 max-w-3xl mx-auto mt-4 sm:mt-6 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-24 items-start">
          {/* Left Column: Cryptographic Reproducibility */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-ink-900 mb-2 sm:mb-4 pb-3 border-b-2 border-teal-500">
                {leftTitle}
              </h3>
              <p className="text-sm sm:text-base md:text-base text-ink-700 leading-relaxed">
                {leftDescription}
              </p>
            </div>

            {/* Verified Seal Badge */}
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-200/40 hover:border-teal-300/60 transition-colors">
              <div className="inline-block mb-3 sm:mb-4">
                <VerifiedSealBadge
                  signatureHash="a1b2c3d4e5f6g7h8"
                  verifierUrl="https://qrsrisk.com/trust/seal-verification/verify"
                  fullSignature="3045022100a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0 02207a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7"
                />
              </div>
              <p className="text-xs sm:text-sm text-teal-700 font-medium">
                Click to verify calculation signature using open-source tools
              </p>
            </div>
          </div>

          {/* Right Column: Compliance & Trust Badges */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-ink-900 mb-2 sm:mb-4 pb-3 border-b-2 border-teal-500">
                {rightTitle}
              </h3>
              <p className="text-sm sm:text-base md:text-base text-ink-700 leading-relaxed">
                {rightDescription}
              </p>
            </div>

            {/* Trust Badge Cluster - Dynamic or Fallback */}
            <div className="mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm font-semibold text-teal-700 uppercase tracking-wider mb-4 sm:mb-6">
                Certifications & Standards
              </p>
              {items && items.length > 0 ? (
                <div className="bg-gradient-to-br from-white to-teal-50/30 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl border border-teal-300/30 shadow-lg shadow-teal-500/5">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center p-3 sm:p-4 rounded-lg bg-teal-50/40 border border-teal-200/40 hover:border-teal-300/60 hover:bg-teal-50/60 transition-all"
                      >
                        {item.icon && (
                          <div className="text-2xl sm:text-3xl mb-2">
                            <span>{item.icon}</span>
                          </div>
                        )}
                        <h4 className="text-xs sm:text-sm font-semibold text-ink-900 mb-1">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-ink-700 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white to-teal-50/30 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl border border-teal-300/30 shadow-lg shadow-teal-500/5">
                  <TrustBadgeCluster />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
