'use client'

import { VerifiedSealBadge } from '@/components/marketing/VerifiedSealBadge'
import { TrustBadgeCluster } from '@/components/marketing/TrustBadgeCluster'
import { IconRenderer } from '@/components/marketing/IconRenderer'

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
    <section className="py-32 bg-light-bg-primary">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-28">
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-ink-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base sm:text-lg lg:text-xl text-ink-700 max-w-3xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left Column: Cryptographic Reproducibility */}
          <div className="flex flex-col space-y-6 p-8 rounded-2xl bg-gradient-to-br from-teal-50/60 to-white border border-teal-200/50 shadow-lg shadow-teal-500/5">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-4">
                {leftTitle}
              </h3>
              <p className="text-base text-ink-700 leading-relaxed">
                {leftDescription}
              </p>
            </div>

            {/* Verified Seal Badge */}
            <div className="mt-6 p-8 rounded-xl bg-white border-2 border-teal-400/60 shadow-lg shadow-teal-500/10 hover:shadow-xl hover:shadow-teal-500/15 hover:border-teal-400 transition-all duration-300">
              <div className="inline-block mb-6">
                <VerifiedSealBadge
                  signatureHash="a1b2c3d4e5f6g7h8"
                  verifierUrl="https://qrsrisk.com/trust/seal-verification/verify"
                  fullSignature="3045022100a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0 02207a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7"
                />
              </div>
              <p className="text-sm text-teal-700 font-medium leading-relaxed">
                Click to verify calculation signature using open-source tools
              </p>
            </div>
          </div>

          {/* Right Column: Compliance & Trust Badges */}
          <div className="flex flex-col space-y-6 p-8 rounded-2xl bg-gradient-to-br from-white to-blue-50/40 border border-blue-200/50 shadow-lg shadow-blue-500/5">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-4">
                {rightTitle}
              </h3>
              <p className="text-base text-ink-700 leading-relaxed">
                {rightDescription}
              </p>
            </div>

            {/* Trust Badge Cluster - Dynamic or Fallback */}
            <div className="mt-6">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-8">
                Certifications & Standards
              </p>
              {items && items.length > 0 ? (
                <div className="grid grid-cols-2 gap-5">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-white to-blue-50/60 border-2 border-blue-300/40 shadow-md shadow-blue-500/5 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300/70 hover:from-white hover:to-blue-100/40 transition-all duration-300 group"
                    >
                      {item.icon && (
                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                          <IconRenderer
                            iconName={item.icon}
                            size={40}
                            className="text-blue-600"
                          />
                        </div>
                      )}
                      <h4 className="text-sm font-bold text-ink-900 mb-2 leading-snug">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-ink-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white to-blue-50/60 p-8 rounded-xl border-2 border-blue-300/40 shadow-lg shadow-blue-500/5">
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
