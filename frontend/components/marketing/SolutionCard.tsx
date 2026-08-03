import { ReactNode } from 'react'

export type RoleTitle =
  | 'underwriter'
  | 'portfolio'
  | 'reinsurance'
  | 'ils'
  | 'cro'

interface SolutionCardProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  tagline: string
  challenges: string[]
  value: string[]
  children?: ReactNode
  className?: string
  variant?: 'light' | 'dark'
}

export function SolutionCard({
  title,
  subtitle,
  icon,
  tagline,
  challenges,
  value,
  children,
  className = '',
  variant = 'light',
}: SolutionCardProps) {
  return (
    <div
      className={`rounded-lg border p-8 space-y-6 transition-all hover:shadow-lg ${
        variant === 'light'
          ? 'bg-white border-light-accent-light'
          : 'bg-light-bg-primary border-teal-300'
      } ${className}`}
    >
      {/* Header */}
      <div className="space-y-3">
        {icon && <div className="text-4xl">{icon}</div>}
        <div>
          <h3 className="text-2xl font-bold text-ink-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-text-muted mt-1">{subtitle}</p>
          )}
        </div>
        <p className="text-lg font-semibold text-light-accent-primary italic">
          {tagline}
        </p>
      </div>

      {/* Challenges & Value */}
      <div className="grid grid-cols-2 gap-6 py-6 border-y border-light-accent-light">
        {/* Challenges */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Today's Challenges
          </h4>
          <ul className="space-y-2">
            {challenges.map((challenge) => (
              <li
                key={challenge}
                className="text-sm text-ink-900 flex items-start gap-2"
              >
                <span className="text-red-500 font-bold mt-0.5">✕</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>

        {/* Value */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-light-accent-primary uppercase tracking-wider">
            QRS Value
          </h4>
          <ul className="space-y-2">
            {value.map((point) => (
              <li
                key={point}
                className="text-sm text-ink-900 flex items-start gap-2"
              >
                <span className="text-light-accent-primary font-bold mt-0.5">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {children && <div>{children}</div>}
    </div>
  )
}
