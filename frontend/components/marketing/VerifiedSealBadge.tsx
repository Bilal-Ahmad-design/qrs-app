'use client';

import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface VerifiedSealBadgeProps {
  signatureHash: string;
  verifierUrl: string;
  fullSignature?: string;
}

export function VerifiedSealBadge({
  signatureHash,
  verifierUrl,
  fullSignature,
}: VerifiedSealBadgeProps) {
  const [showPopover, setShowPopover] = useState(false);
  const truncatedHash = signatureHash.slice(0, 16) + '...';

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowPopover(!showPopover)}
        className="inline-flex items-center gap-space-4 px-space-6 py-space-4 rounded-lg border-2 border-teal-500 bg-teal-100 hover:bg-teal-150 transition-all duration-300 hover:border-teal-600 group"
      >
        <CheckCircle2 size={20} className="text-teal-700 group-hover:text-teal-800 transition-colors flex-shrink-0" />
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-bold text-teal-900 leading-tight">Lineage verified</span>
          <span className="font-mono text-xs text-teal-700 group-hover:text-teal-800 font-medium transition-colors">{truncatedHash}</span>
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
              href={verifierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600/50 hover:bg-teal-500/60 border border-teal-400/80 hover:border-teal-300 text-white hover:text-teal-50 font-bold transition-all duration-300 w-full justify-center"
            >
              Verify with qrs-replay
              <span>→</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
