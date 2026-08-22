'use client'

import { ReactNode } from 'react'
import { AlertCircle, RefreshCw, Wifi, AlertTriangle } from 'lucide-react'

export type DataTableState = 'idle' | 'loading' | 'empty' | 'no-results' | 'error' | 'offline' | 'stale'

export interface DataTableColumn {
  key: string
  label: string
  width?: string // e.g., '200px', '1fr'
  sortable?: boolean
}

export interface DataTableProps {
  columns: DataTableColumn[]
  rows: Record<string, any>[]
  state: DataTableState
  emptyMessage?: string
  emptyAction?: { label: string; onClick: () => void }
  errorMessage?: string
  onRetry?: () => void
  noResultsMessage?: string
  onClearFilters?: () => void
  isOffline?: boolean
  staleMessage?: string
  onRefresh?: () => void
  rowsPerPage?: number
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
}

export function DataTable({
  columns,
  rows,
  state,
  emptyMessage = 'No data available',
  emptyAction,
  errorMessage = 'Failed to load data',
  onRetry,
  noResultsMessage = 'No results match your filters',
  onClearFilters,
  isOffline = false,
  staleMessage,
  onRefresh,
  selectable = false,
}: DataTableProps) {
  // State: Loading - Skeleton
  if (state === 'loading') {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-ink-700 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  // State: Empty - Icon + Message + Action
  if (state === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-ink-700 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-cream-50 opacity-50" />
        </div>
        <p className="text-cream-50 font-poppins mb-4">{emptyMessage}</p>
        {emptyAction && (
          <button
            onClick={emptyAction.onClick}
            className="px-4 py-2 bg-teal-500 text-ink-900 font-poppins font-semibold rounded hover:bg-teal-600 transition-colors"
          >
            {emptyAction.label}
          </button>
        )}
      </div>
    )
  }

  // State: No Results - Filters notice
  if (state === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-ink-700 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-cream-50 opacity-50" />
        </div>
        <p className="text-cream-50 font-poppins mb-4">{noResultsMessage}</p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-ink-700 text-cream-50 font-poppins font-semibold rounded hover:bg-ink-600 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    )
  }

  // State: Error
  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-300 font-poppins mb-4">{errorMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-300 font-poppins font-semibold rounded hover:bg-opacity-30 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    )
  }

  // State: Offline
  if (state === 'offline') {
    return (
      <>
        <div className="mb-4 p-4 bg-amber-500 bg-opacity-20 border border-amber-500 rounded flex items-center gap-2">
          <Wifi className="w-5 h-5 text-amber-400" />
          <span className="text-amber-200 font-poppins">Offline. Changes saved locally.</span>
        </div>
        <TableView columns={columns} rows={rows} selectable={selectable} disabled />
      </>
    )
  }

  // State: Stale
  if (state === 'stale' && staleMessage) {
    return (
      <>
        <div className="mb-4 p-4 bg-amber-500 bg-opacity-20 border border-amber-500 rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-amber-200 font-poppins">{staleMessage}</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 bg-amber-500 bg-opacity-30 text-amber-200 font-poppins text-sm rounded hover:bg-opacity-50 transition-colors"
            >
              Refresh
            </button>
          )}
        </div>
        <TableView columns={columns} rows={rows} selectable={selectable} />
      </>
    )
  }

  // State: Idle - Normal table
  return <TableView columns={columns} rows={rows} selectable={selectable} />
}

interface TableViewProps {
  columns: DataTableColumn[]
  rows: Record<string, any>[]
  selectable?: boolean
  disabled?: boolean
}

function TableView({ columns, rows, selectable, disabled }: TableViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-teal-700 border-opacity-20">
            {selectable && (
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="w-4 h-4" disabled={disabled} />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-poppins font-semibold text-cream-50 text-opacity-80"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-teal-700 border-opacity-10 hover:bg-ink-700 hover:bg-opacity-50 transition-colors h-12"
            >
              {selectable && (
                <td className="px-4 py-3">
                  <input type="checkbox" className="w-4 h-4" disabled={disabled} />
                </td>
              )}
              {columns.map(col => (
                <td
                  key={`${idx}-${col.key}`}
                  className="px-4 py-3 text-cream-50 font-poppins"
                  style={{ width: col.width }}
                >
                  {row[col.key] || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
