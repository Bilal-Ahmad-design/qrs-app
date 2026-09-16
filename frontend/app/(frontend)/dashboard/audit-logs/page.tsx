'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setError(null)
        const res = await fetch('/api/payload/audit-logs?limit=100&sort=-timestamp')
        if (!res.ok) throw new Error('Failed to fetch audit logs')
        const data = await res.json()
        setLogs(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch audit logs:', err)
        setError('Unable to load audit logs. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-status-ok'
      case 'delete':
        return 'text-status-error'
      case 'update':
        return 'text-status-warn'
      default:
        return 'text-teal-700'
    }
  }

  const getActionBg = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-status-ok/10'
      case 'delete':
        return 'bg-status-error/10'
      case 'update':
        return 'bg-status-warn/10'
      default:
        return 'bg-teal-100/30'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Audit Logs</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">Complete activity history and compliance tracking</p>
      </div>

      <DashboardCard title="Recent Activity" subtitle={loading ? 'Loading...' : `${logs.length} total entries`}>
        {error ? (
          <div className="text-center py-8">
            <p className="text-status-error font-medium">{error}</p>
          </div>
        ) : logs.length === 0 && !loading ? (
          <div className="text-center py-8">
            <p className="text-teal-700 font-medium">No audit logs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="border-b border-cream-100 pb-4 last:border-b-0 animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-cream-100 rounded w-32"></div>
                        <div className="h-4 bg-cream-100 rounded w-24"></div>
                      </div>
                    </div>
                  ))
              : logs.map((log) => (
                  <div
                    key={log.id}
                    className={`border-l-4 rounded-lg p-4 mb-3 ${
                      log.action === 'create'
                        ? 'border-status-ok bg-status-ok/5'
                        : log.action === 'delete'
                          ? 'border-status-error bg-status-error/5'
                          : log.action === 'update'
                            ? 'border-status-warn bg-status-warn/5'
                            : 'border-teal-700 bg-teal-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink-800">{log.collectionName}</p>
                        <p className={`text-sm font-bold mt-1 ${getActionColor(log.action)}`}>
                          {log.action.toUpperCase()}
                        </p>
                        <p className="text-xs text-teal-700 mt-2">{log.userEmail}</p>
                      </div>
                      <span className="text-xs text-teal-700/70 whitespace-nowrap ml-4">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
