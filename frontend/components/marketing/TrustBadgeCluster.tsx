import { TrustBadgeIcon } from '@/components/icons/TrustBadgeIcons';

interface TrustBadgeClusterProps {
  variant?: 'dark' | 'light';
}

export function TrustBadgeCluster({ variant = 'light' }: TrustBadgeClusterProps) {
  const isDark = variant === 'dark';

  const badges = [
    {
      type: 'SOC2' as const,
      label: 'SOC 2',
    },
    {
      type: 'Vouch' as const,
      label: 'Vouch',
    },
    {
      type: 'GDPR' as const,
      label: 'GDPR',
    },
    {
      type: 'RFC9116' as const,
      label: 'RFC 9116',
    },
    {
      type: 'CryptographicSeal' as const,
      label: 'Seal',
      highlight: true,
    },
  ];

  const badgeClass = isDark
    ? 'border-teal-500/60 bg-teal-500/10 hover:bg-teal-500/15'
    : 'border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/10';

  const highlightClass = isDark
    ? 'border-teal-400 bg-teal-500/20 hover:bg-teal-500/30'
    : 'border-teal-500 bg-teal-500/15 hover:bg-teal-500/25';

  const textClass = isDark ? 'text-white' : 'text-ink-800';
  const iconClass = isDark ? 'text-teal-400' : 'text-teal-600';

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={`flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-lg border transition-all duration-base ${
            badge.highlight ? highlightClass : badgeClass
          }`}
        >
          <TrustBadgeIcon
            type={badge.type}
            size={badge.highlight ? 28 : 24}
            className={`flex-shrink-0 transition-opacity ${iconClass}`}
          />
          <span className={`text-sm lg:text-base font-medium leading-tight ${textClass}`}>
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
