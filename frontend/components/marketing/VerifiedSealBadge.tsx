'use client';

import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface VerifiedSealBadgeProps {
  signatureHash: string;
  verifierUrl: string;
  fullSignature?: string;
  variant?: 'dark' | 'light';
}

export function VerifiedSealBadge({
  signatureHash,
  verifierUrl,
  fullSignature,
  variant = 'light',
}: VerifiedSealBadgeProps) {
  const [showPopover, setShowPopover] = useState(false);
  const truncatedHash = signatureHash.slice(0, 16) + '...';

  const isDark = variant === 'dark';
  const badgeClass = isDark
    ? 'border-teal-500 bg-ink-700 hover:bg-ink-600 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40'
    : 'border-teal-600 bg-white hover:bg-cream-50 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40';

  const textClass = isDark ? 'text-white' : 'text-ink-900';
  const iconClass = isDark ? 'text-teal-400' : 'text-teal-600';

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowPopover(!showPopover)}
        className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 transition-all duration-base hover:border-teal-500 group cursor-pointer ${badgeClass}`}
      >
        <CheckCircle2 size={20} className={`${iconClass} group-hover:opacity-80 transition-opacity flex-shrink-0`} />
        <div className="flex flex-col items-start gap-0.5 sm:gap-1">
          <span className={`text-sm sm:text-base font-bold ${textClass} leading-tight`}>Lineage verified</span>
          <span className={`font-mono text-xs ${isDark ? 'text-teal-300' : 'text-teal-700'} group-hover:opacity-80 font-medium transition-opacity`}>{truncatedHash}</span>
        </div>
      </button>

      {showPopover && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopover(false)}
          />
          {/* Popover */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-ink-900 to-ink-950 border border-teal-500/60 rounded-xl shadow-2xl shadow-teal-500/40 p-8 z-50 w-full max-w-sm mx-4 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-xl md:text-2xl text-white font-bold">
                ECDSA P-256
              </h3>
              <button
                onClick={() => setShowPopover(false)}
                className="text-teal-300 hover:text-teal-200 transition-colors p-1 flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-ink-950 rounded-lg p-6 mb-6 border-2 border-teal-600/50">
              <p className="font-mono text-xs md:text-sm text-teal-50 break-all leading-relaxed tracking-wide">
                {fullSignature || signatureHash}
              </p>
            </div>

            <p className="text-sm text-teal-100 mb-6 leading-relaxed font-medium">
              Click below to verify this calculation&apos;s cryptographic signature using our open-source verification tools.
            </p>

            <a
              href="https://qrsrisk.com/trust/seal-verification/verify"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 border border-teal-400/80 hover:border-teal-300 text-white hover:text-teal-50 font-bold transition-all duration-300 w-full shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
            >
              Verify with QRS-Reply
              <span>→</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
