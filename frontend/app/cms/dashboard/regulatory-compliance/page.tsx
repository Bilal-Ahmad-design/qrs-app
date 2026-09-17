'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function RegulatoryCompliancePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 90000)

        const res = await fetch('/api/payload/regulatory-compliance?limit=50&page=1&sort=-createdAt', {
          signal: controller.signal,
          cache: 'default',
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Failed to fetch compliance items')
        const data = await res.json()
        setItems(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch compliance items:', err)
        setError('Unable to load compliance items. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Regulatory Compliance</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">Manage compliance frameworks and standards</p>
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

      <DashboardCard title={`Compliance Items (${items.length})`} subtitle="All compliance frameworks">
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
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">⚖️</p>
            <p className="text-teal-700 font-medium">No compliance items found</p>
            <p className="text-sm text-teal-700/70 mt-1">Add compliance frameworks to your system</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-cream-100 rounded-lg hover:bg-cream-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink-800">{item.title || 'Untitled'}</h3>
                    {item.description && (
                      <p className="text-sm text-teal-700 mt-2">{item.description.slice(0, 150)}...</p>
                    )}
                    {item.framework && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                          {item.framework}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-teal-700/60">
                      {new Date(item.createdAt).toLocaleDateString()}
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
        <h3 className="text-lg font-semibold text-ink-800 mb-2">Compliance Management</h3>
        <p className="text-ink-800 mb-4">
          Track and manage regulatory compliance frameworks and standards that apply to your organization.
          This includes SOC 2, GDPR, HIPAA, and other compliance requirements.
        </p>
        <p className="text-sm text-teal-700">
          ℹ️ Compliance items shown here are fetched directly from Payload CMS in real-time.
        </p>
      </div>
    </div>
  )
}
