'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function FormEntriesPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 180000)

        const res = await fetch('/api/payload/form-entries?limit=50&page=1&sort=-createdAt', {
          signal: controller.signal,
          cache: 'default',
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Failed to fetch form entries')
        const data = await res.json()
        setEntries(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch form entries:', err)
        setError('Unable to load form entries. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  const getFieldCount = (fields: any) => {
    if (Array.isArray(fields)) return fields.length
    if (typeof fields === 'object') return Object.keys(fields).length
    return 0
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Form Entries</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">View and manage form submission records</p>
      </div>

      {error && (
        <div className="bg-status-error/10 border border-status-error rounded-lg p-4">
          <p className="text-status-error font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-status-error text-white rounded-lg text-sm font-semibold hover:bg-status-error/90 transition"
          >
            Retry
          </button>
        </div>
      )}

      <DashboardCard title={`Form Entries (${entries.length})`} subtitle="All form submission records">
        {loading ? (
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-cream-100 rounded w-48"></div>
                  <div className="h-3 bg-cream-100 rounded w-96"></div>
                </div>
              ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-teal-700 font-medium">No form entries found</p>
            <p className="text-sm text-teal-700/70 mt-1">Form submissions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 border border-cream-100 rounded-lg hover:bg-cream-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-ink-800">
                        {entry.submitterName || entry.submitterEmail || 'Anonymous'}
                      </h3>
                      {entry.submitterEmail && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                          {entry.submitterEmail}
                        </span>
                      )}
                    </div>

                    {entry.message && (
                      <p className="text-sm text-teal-700 mb-2">{entry.message.slice(0, 150)}...</p>
                    )}

                    {entry.submitterPhone && (
                      <p className="text-xs text-teal-700/70">
                        Phone: <span className="font-mono">{entry.submitterPhone}</span>
                      </p>
                    )}

                    {entry.formType && (
                      <p className="text-xs text-teal-700/70 mt-1">
                        Form Type: <span className="font-semibold">{entry.formType}</span>
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-teal-700/60 whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-teal-700/60 mt-1">
                      {new Date(entry.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ink-800 mb-2">About Form Entries</h3>
        <p className="text-ink-800 mb-4">
          Form entries are automatically captured when visitors submit forms on your website.
          Each entry contains the submitter's information, message, and submission timestamp.
        </p>
        <p className="text-sm text-teal-700">
          ℹ️ Form entries shown here are fetched directly from Payload CMS in real-time.
        </p>
      </div>
    </div>
  )
}
