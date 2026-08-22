export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-ink-600 text-cream-50',
  success: 'bg-teal-500 bg-opacity-20 text-teal-300',
  warning: 'bg-amber-500 bg-opacity-20 text-amber-300',
  danger: 'bg-red-500 bg-opacity-20 text-red-300',
  info: 'bg-blue-500 bg-opacity-20 text-blue-300',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
