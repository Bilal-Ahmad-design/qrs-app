'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export interface KPICardProps {
  label: string
  value: number | string
  icon: ReactNode
  trend?: 'up' | 'down'
  trendValue?: string
  color?: 'teal' | 'amber' | 'red' | 'green'
  loading?: boolean
  onClick?: () => void
}

const colorStyles = {
  teal: 'border-teal-500 border-opacity-40',
  amber: 'border-amber-500 border-opacity-40',
  red: 'border-red-500 border-opacity-40',
  green: 'border-green-500 border-opacity-40',
}

const trendColorStyles = {
  up: 'text-teal-400',
  down: 'text-red-400',
}

export function KPICard({
  label,
  value,
  icon,
  trend,
  trendValue,
  color = 'teal',
  loading = false,
  onClick,
}: KPICardProps) {
  return (
    <div
      className={`bg-ink-800 rounded-lg p-6 border ${colorStyles[color]} ${
        onClick ? 'cursor-pointer hover:bg-ink-700 transition-colors' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-ink-700 flex items-center justify-center text-cream-50`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 ${trendColorStyles[trend]}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-xs font-mono font-semibold">{trendValue}</span>
          </div>
        )}
      </div>

      <p className="text-cream-50 text-opacity-70 text-sm font-poppins mb-1">{label}</p>

      {loading ? (
        <div className="h-8 bg-ink-700 rounded animate-pulse" />
      ) : (
        <p className="text-3xl font-mono font-bold text-cream-50">{value}</p>
      )}
    </div>
  )
}
