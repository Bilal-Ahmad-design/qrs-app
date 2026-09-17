// Monochrome SVG icons for trust badges based on QRS design system
export const TrustBadgeIcons = {
  SOC2: ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Shield with checkmark */}
      <path d="M12 2L4 6v6c0 5 8 8 8 8s8-3 8-8V6l-8-4z" />
      <path d="M9 13l2 2 4-4" />
    </svg>
  ),

  Vouch: ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Lock with verified checkmark */}
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <path d="M10 15l2 2 4-4" />
    </svg>
  ),

  GDPR: ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Document with checkmark */}
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  ),

  RFC9116: ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Fingerprint for security.txt */}
      <path d="M12 2c4 0 7 3 7 7v4c0 2-1 3-2 3M12 2c-4 0-7 3-7 7v4c0 2 1 3 2 3" />
      <circle cx="12" cy="7" r="2" />
      <path d="M12 12v8M8 16c0 2 1 4 4 4s4-2 4-4" />
    </svg>
  ),

  CryptographicSeal: ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Seal/badge with star */}
      <path d="M12 2c1 0 2 1 2 2v1c2 0 4 1 5 3l1-1c1-1 2 0 2 1s0 2-1 3l-1 1c1 2 1 4 0 6l1 1c1 1 1 2 0 3s-2 1-3 0l-1-1c-1 2-3 3-5 3v1c0 1-1 2-2 2s-2-1-2-2v-1c-2 0-4-1-5-3l-1 1c-1 1-2 0-2-1s0-2 1-3l1-1c-1-2-1-4 0-6l-1-1c-1-1-1-2 0-3s2-1 3 0l1 1c1-2 3-3 5-3v-1c0-1 1-2 2-2z" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  ),
};

export function TrustBadgeIcon({
  type,
  size = 24,
  className = '',
}: {
  type: 'SOC2' | 'Vouch' | 'GDPR' | 'RFC9116' | 'CryptographicSeal';
  size?: number;
  className?: string;
}) {
  const Icon = TrustBadgeIcons[type];
  return Icon ? <Icon size={size} className={className} /> : null;
}
