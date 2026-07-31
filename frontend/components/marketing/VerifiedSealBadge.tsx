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
        className="inline-flex items-center gap-space-3 px-space-5 py-space-3 rounded-full border border-teal-500/60 bg-gradient-to-r from-teal-500/20 to-teal-600/10 hover:from-teal-500/30 hover:to-teal-600/20 text-white transition-all duration-300 hover:border-teal-400/80 hover:shadow-lg hover:shadow-teal-500/20 group"
      >
        <CheckCircle2 size={18} className="text-teal-400 group-hover:text-teal-300 transition-colors" />
        <span className="text-small font-semibold text-teal-50">Lineage verified</span>
        <span className="font-mono text-micro text-teal-300 group-hover:text-teal-200 transition-colors">{truncatedHash}</span>
      </button>

      {showPopover && (
        <div className="absolute top-full mt-space-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-ink-800 to-ink-900 border border-teal-700/40 rounded-xl shadow-2xl shadow-teal-500/20 p-space-6 z-50 w-96 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-space-4">
            <h3 className="font-display text-h4 text-teal-100">
              ECDSA P-256 Signature
            </h3>
            <button
              onClick={() => setShowPopover(false)}
              className="text-teal-500 hover:text-teal-400 transition-colors p-space-1"
            >
              <X size={18} />
            </button>
          </div>

          <div className="bg-ink-900/50 rounded-lg p-space-4 mb-space-4 border border-teal-700/20">
            <p className="font-mono text-xs text-teal-200/80 break-all leading-relaxed">
              {fullSignature || signatureHash}
            </p>
          </div>

          <p className="text-sm text-teal-300/70 mb-space-4 leading-relaxed">
            Placeholder signature. Real ECDSA data from product backend before launch.
          </p>

          <a
            href={verifierUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-space-4 px-space-4 py-space-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 hover:border-teal-400/60 text-teal-300 hover:text-teal-200 text-small font-semibold transition-all duration-300"
          >
            Verify with qrs-replay
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
