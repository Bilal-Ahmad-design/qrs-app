'use client'

import React, { useState } from 'react'
import { Search, Copy } from 'lucide-react'

interface AuditLog {
  id: string
  actor?: string
  action?: string
  collection?: string
  resource?: string
  timestamp?: string
  createdAt?: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
}

interface LogsPageClientProps {
  logs: AuditLog[]
}

export default function LogsPageClient({ logs }: LogsPageClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const actionColors: Record<string, string> = {
    create: 'text-green-400',
    update: 'text-yellow-400',
    delete: 'text-red-400',
  }

  const filtered = logs.filter((log) =>
    (log.actor?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (log.action?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (log.collection?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (log.resource?.toLowerCase().includes(search.toLowerCase()) || false)
  )

  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const dateStr = date.toISOString().split('T')[0]
    const timeStr = date.toISOString().split('T')[1]?.slice(0, 5) || ''
    return `${dateStr} ${timeStr}`
  }

  return (
    <div className="flex-1 bg-ink-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="border-b border-teal-700 border-opacity-20 pb-6">
          <h1 className="text-5xl font-outfit font-bold text-cream-50 mb-2">Audit Logs</h1>
          <p className="text-sm text-cream-50 text-opacity-60">Review all system changes and activities</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-cream-50 text-opacity-40" />
          <input
            type="text"
            placeholder="Search by actor, action, collection, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md bg-ink-800 border border-teal-700 border-opacity-20 text-cream-50 placeholder-cream-50 placeholder-opacity-40 text-sm font-poppins"
          />
        </div>

        {/* Logs Table */}
        {filtered.length > 0 ? (
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60 w-40">
                      Actor
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60 w-24">
                      Action
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60 w-32">
                      Collection
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">
                      Resource
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60 w-48">
                      Timestamp
                    </th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                        className="border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-cream-50 text-opacity-80 font-mono text-xs truncate">{log.actor}</td>
                        <td className={`px-4 py-3 font-mono text-xs font-semibold ${actionColors[log.action || ''] || 'text-cream-50'}`}>
                          {log.action?.toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-cream-50 font-poppins text-xs">{log.collection}</td>
                        <td className="px-4 py-3 text-cream-50 font-poppins truncate">{log.resource}</td>
                        <td className="px-4 py-3 text-cream-50 text-opacity-60 font-mono text-xs text-right">
                          {formatTimestamp(log.timestamp || log.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div
                            className="w-4 h-4 rounded border border-current text-cream-50 text-opacity-60 transition-transform inline-block"
                            style={{ transform: expandedId === log.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </td>
                      </tr>

                      {expandedId === log.id && (
                        <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-xs font-poppins font-semibold text-cream-50 text-opacity-60 mb-2">Before</h4>
                                <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded p-3 font-mono text-xs text-red-400 overflow-x-auto max-h-40">
                                  <pre>{JSON.stringify(log.before || {}, null, 2)}</pre>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-poppins font-semibold text-cream-50 text-opacity-60 mb-2">After</h4>
                                <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded p-3 font-mono text-xs text-green-400 overflow-x-auto max-h-40">
                                  <pre>{JSON.stringify(log.after || {}, null, 2)}</pre>
                                </div>
                              </div>
                              <button className="flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 font-poppins">
                                <Copy className="w-4 h-4" />
                                Copy JSON
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-12 text-center">
            <p className="text-cream-50 text-opacity-60 font-poppins">No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  )
}
