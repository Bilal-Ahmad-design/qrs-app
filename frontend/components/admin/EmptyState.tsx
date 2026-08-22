import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon && <div className="mb-4 text-teal-500 opacity-60">{icon}</div>}
      <h3 className="text-lg font-outfit font-semibold text-cream-50 mb-2">{title}</h3>
      {description && <p className="text-sm text-cream-50 text-opacity-60 text-center mb-6 max-w-sm font-poppins">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-teal-500 text-ink-900 rounded-md text-sm font-poppins font-medium hover:bg-teal-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
