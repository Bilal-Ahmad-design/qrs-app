import type { ReactNode } from 'react';

interface DataCardProps {
  variant: 'light' | 'dark';
  children: ReactNode;
  className?: string;
  status?: 'validated' | 'illustrative' | 'roadmap';
}

const statusStyles = {
  validated: {
    badge: 'bg-teal-100 text-teal-700',
    label: '✅ Validated',
  },
  illustrative: {
    badge: 'bg-amber-100 text-amber-700',
    label: '🔄 Illustrative',
  },
  roadmap: {
    badge: 'bg-gray-200 text-gray-700',
    label: '🛣️ Roadmap',
  },
};

export function DataCard({ variant, children, className = '', status }: DataCardProps) {
  const baseClasses =
    'rounded-lg p-8 transition-all duration-base hover:shadow-lg hover:border-opacity-100';

  const variantClasses = {
    light:
      'bg-white border border-gray-200 text-text-strong shadow-sm hover:shadow-md',
    dark: 'bg-ink-800 border border-teal-600/40 text-white shadow-lg hover:border-teal-600/60 hover:bg-ink-700',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {status && (
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${statusStyles[status].badge}`}>
          {statusStyles[status].label}
        </div>
      )}
      {children}
    </div>
  );
}
