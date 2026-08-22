type Status = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface StatusChipProps {
  status: Status
  label: string
}

const statusStyles: Record<Status, string> = {
  success: 'bg-green-900 bg-opacity-30 text-green-400 border border-green-700 border-opacity-30',
  warning: 'bg-yellow-900 bg-opacity-30 text-yellow-400 border border-yellow-700 border-opacity-30',
  danger: 'bg-red-900 bg-opacity-30 text-red-400 border border-red-700 border-opacity-30',
  info: 'bg-teal-900 bg-opacity-30 text-teal-300 border border-teal-700 border-opacity-30',
  neutral: 'bg-ink-700 text-cream-50 border border-teal-700 border-opacity-20',
}

export function StatusChip({ status, label }: StatusChipProps) {
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-poppins font-medium ${statusStyles[status]}`}>
      {label}
    </span>
  )
}
