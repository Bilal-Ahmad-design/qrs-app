import {
  ShieldCheck,
  Lock,
  FileCheck,
  Fingerprint,
  KeyRound,
} from 'lucide-react';

export function TrustBadgeCluster() {
  const badges = [
    {
      icon: ShieldCheck,
      label: 'SOC 2 in progress',
      description: 'Vanta continuous monitoring',
    },
    {
      icon: Lock,
      label: 'Vouch-insured',
      description: 'Cyber liability coverage',
    },
    {
      icon: FileCheck,
      label: 'GDPR / CCPA',
      description: 'Privacy compliant',
    },
    {
      icon: Fingerprint,
      label: 'RFC 9116',
      description: 'security.txt published',
    },
    {
      icon: KeyRound,
      label: 'Cryptographic seal',
      description: 'Reproducibility verified',
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.label}
            className={`group flex flex-col items-start gap-4 px-6 py-8 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
              badge.highlight
                ? 'border-teal-500/50 bg-teal-500/15 hover:bg-teal-500/25 shadow-lg shadow-teal-500/20'
                : 'border-teal-700/30 bg-ink-800/50 hover:border-teal-600/50 hover:bg-ink-800/80 hover:shadow-lg hover:shadow-teal-500/10'
            }`}
          >
            <Icon
              size={badge.highlight ? 32 : 28}
              className={`transition-colors ${
                badge.highlight ? 'text-teal-400' : 'text-teal-500 group-hover:text-teal-400'
              }`}
              strokeWidth={1.5}
            />
            <div className="flex-1">
              <p className={`font-semibold text-sm leading-tight mb-2 ${
                badge.highlight ? 'text-teal-200' : 'text-white'
              }`}>
                {badge.label}
              </p>
              <p className={`text-xs leading-relaxed ${
                badge.highlight ? 'text-teal-300/70' : 'text-teal-200/60'
              }`}>
                {badge.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
