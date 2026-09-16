'use client'

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-cream-100 p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-3 bg-cream-100 rounded w-24"></div>
        <div className="h-10 bg-cream-100 rounded w-32"></div>
        <div className="h-3 bg-cream-100 rounded w-40"></div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-cream-100 p-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-cream-100 rounded w-32"></div>
        <div className="h-4 bg-cream-100 rounded w-48"></div>
        <div className="space-y-3 mt-6">
          <div className="h-10 bg-cream-100 rounded"></div>
          <div className="h-10 bg-cream-100 rounded"></div>
          <div className="h-10 bg-cream-100 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-cream-100 animate-pulse">
      <td className="py-3 px-4">
        <div className="h-4 bg-cream-100 rounded w-32"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-cream-100 rounded w-24"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-cream-100 rounded w-20"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-cream-100 rounded w-16"></div>
      </td>
    </tr>
  )
}
