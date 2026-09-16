'use client'

import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
}

export function DashboardCard({ title, subtitle, children, action }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg border border-cream-100 p-8 transition-all duration-200 hover:border-teal-200 hover:shadow-md">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-ink-800">{title}</h3>
          {subtitle && <p className="text-sm text-teal-700 mt-2 font-medium">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}
