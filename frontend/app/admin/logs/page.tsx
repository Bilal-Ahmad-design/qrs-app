'use client'

import React, { useState } from 'react'
import { Search, Copy, Download } from 'lucide-react'

interface AuditLog {
  id: string
  actor: string
  action: string
  collection: string
  resource: string
  timestamp: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: '1',
      actor: 'admin@example.com',
      action: 'update',
      collection: 'Pages',
      resource: 'Homepage',
      timestamp: '2026-08-22T14:32:15Z',
      before: { title: 'Home', published: false },
      after: { title: 'Home', published: true },
    },
    {
      id: '2',
      actor: 'editor@example.com',
      action: 'create',
      collection: 'Blog',
      resource: 'New Post',
      timestamp: '2026-08-22T13:45:22Z',
      before: {},
      after: { title: 'New Post', slug: 'new-post', published: false },
    },
    {
      id: '3',
      actor: 'admin@example.com',
      action: 'delete',
      collection: 'Media',
      resource: 'old-image.png',
      timestamp: '2026-08-22T12:10:50Z',
      before: { filename: 'old-image.png', size: 2048576 },
      after: {},
    },
    {
      id: '4',
      actor: 'reviewer@example.com',
      action: 'update',
      collection: 'Users',
      resource: 'john@example.com',
      timestamp: '2026-08-22T11:20:30Z',
      before: { role: 'editor' },
      after: { role: 'admin' },
    },
    {
      id: '5',
      actor: 'admin@example.com',
      action: 'update',
      collection: 'Settings',
      resource: 'Email Config',
      timestamp: '2026-08-22T10:05:12Z',
      before: { smtpHost: 'mail.example.com' },
      after: { smtpHost: 'smtp.sendgrid.net' },
    },
  ])

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = logs.filter(log =>
    log.actor.includes(search) ||
    log.action.includes(search) ||
    log.collection.includes(search) ||
    log.resource.includes(search)
  )

  const actionColors: Record<string, string> = {
    create: 'text-green-400',
    update: 'text-yellow-400',
    delete: 'text-red-400',
  }

  const handleCopyJSON = (log: AuditLog) => {
    const json = JSON.stringify({ before: log.before, after: log.after }, null, 2)
    navigator.clipboard.writeText(json)
    setCopiedId(log.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/audit-logs/export', {
        method: 'GET',
        headers: { 'Accept': 'text/csv' },
      })
      if (!response.ok) throw new Error('Failed to export')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = response.headers.get('content-disposition')?.split('filename="')[1]?.slice(0, -1) ||
                   `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export:', error)
      alert('Failed to export audit logs')
    }
  }

  return (
    <div className="flex-1 bg-ink-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-teal-700 border-opacity-20 pb-6">
          <div>
            <h1 className="text-5xl font-outfit font-bold text-cream-50 mb-2">Audit Logs</h1>
            <p className="text-sm text-cream-50 text-opacity-60">Review all system changes and activities</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-ink-900 rounded-md font-poppins text-sm font-medium hover:bg-teal-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
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
        <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60 w-40">Actor</th>
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60 w-24">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60 w-32">Collection</th>
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Resource</th>
                  <th className="text-right px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60 w-48">Timestamp</th>
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
                      <td className={`px-4 py-3 font-mono text-xs font-semibold ${actionColors[log.action] || 'text-cream-50'}`}>
                        {log.action.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-cream-50 font-poppins text-xs">{log.collection}</td>
                      <td className="px-4 py-3 text-cream-50 font-poppins truncate">{log.resource}</td>
                      <td className="px-4 py-3 text-cream-50 text-opacity-60 font-mono text-xs text-right">
                        {log.timestamp.split('T')[0]} {log.timestamp.split('T')[1]?.slice(0, 5)}
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
                            <button
                              onClick={() => handleCopyJSON(log)}
                              className="flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 font-poppins transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                              {copiedId === log.id ? 'Copied!' : 'Copy JSON'}
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

        {filtered.length === 0 && (
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-12 text-center">
            <p className="text-cream-50 text-opacity-60 font-poppins">No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  )
}
