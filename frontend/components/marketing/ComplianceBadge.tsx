interface ComplianceBadgeProps {
  framework: string
  region?: string
  status: 'certified' | 'in-progress' | 'roadmap'
  icon?: string
  description?: string
  className?: string
}

const statusColors: Record<string, string> = {
  certified: 'bg-green-50 border-green-200 text-green-900',
  'in-progress': 'bg-blue-50 border-blue-200 text-blue-900',
  roadmap: 'bg-gray-50 border-gray-200 text-gray-600',
}

const statusIndicator: Record<string, string> = {
  certified: '✓',
  'in-progress': '◐',
  roadmap: '◯',
}

export function ComplianceBadge({
  framework,
  region,
  status,
  icon = '📋',
  description,
  className = '',
}: ComplianceBadgeProps) {
  return (
    <div
      className={`rounded-lg border p-4 space-y-2 ${statusColors[status]} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl leading-none">{icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{framework}</h4>
              {region && (
                <span className="text-xs font-medium opacity-75">{region}</span>
              )}
            </div>
            {description && (
              <p className="text-sm opacity-85 mt-1">{description}</p>
            )}
          </div>
        </div>
        <span className="text-2xl leading-none">
          {statusIndicator[status]}
        </span>
      </div>

      {/* Status Label */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span
          className={`w-2 h-2 rounded-full ${
            status === 'certified'
              ? 'bg-green-500'
              : status === 'in-progress'
                ? 'bg-blue-500'
                : 'bg-gray-400'
          }`}
        />
        {status === 'certified' && 'Certified'}
        {status === 'in-progress' && 'In Progress'}
        {status === 'roadmap' && 'Roadmap'}
      </div>
    </div>
  )
}
