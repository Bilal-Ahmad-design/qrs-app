import type { ReactNode } from 'react';

interface DataCardProps {
  variant: 'light' | 'dark';
  children: ReactNode;
  className?: string;
}

export function DataCard({ variant, children, className = '' }: DataCardProps) {
  const baseClasses =
    'rounded-md p-space-6 transition-shadow duration-base hover:shadow-sm';

  const variantClasses = {
    light:
      'bg-white border border-cream-100 text-text-on-light',
    dark: 'bg-card-dark border border-teal-700 text-text-on-dark',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
