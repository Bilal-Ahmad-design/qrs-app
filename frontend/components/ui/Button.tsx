import Link from 'next/link';
import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function Button({
  variant = 'primary',
  children,
  href,
  onClick,
  className = '',
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center px-6 py-3 rounded-md min-h-[44px] font-body font-medium transition-colors duration-base ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  const variantClasses = {
    primary: 'bg-teal-500 text-ink-900 hover:bg-teal-600 focus-visible:outline-teal-500',
    secondary:
      'border border-teal-500 bg-transparent text-teal-500 hover:bg-teal-500 hover:text-ink-900 focus-visible:outline-teal-500',
    tertiary: 'bg-transparent text-teal-500 hover:text-teal-600 focus-visible:outline-teal-500',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
