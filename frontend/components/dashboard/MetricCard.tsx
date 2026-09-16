'use client'

interface MetricCardProps {
  label: string
  value: string | number
  change?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function MetricCard({ label, value, change, icon, trend = 'neutral' }: MetricCardProps) {
  const trendColor = {
    up: 'text-status-ok',
    down: 'text-status-error',
    neutral: 'text-teal-700',
  }

  return (
    <div className="bg-white rounded-lg border border-cream-100 p-6 transition-all duration-200 hover:border-teal-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-teal-700 mb-3 uppercase tracking-wide">{label}</p>
          <p className="text-4xl font-bold text-ink-800 mb-2">{value.toLocaleString?.() || value}</p>
          {change && (
            <p className={`text-sm font-medium mt-2 ${trendColor[trend]}`}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {change}
            </p>
          )}
        </div>
        {icon && <div className="text-4xl flex-shrink-0">{icon}</div>}
      </div>
    </div>
  )
}
