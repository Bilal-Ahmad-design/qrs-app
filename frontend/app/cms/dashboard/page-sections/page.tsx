'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function PageSectionsPage() {
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 180000)

        const res = await fetch('/api/payload/page-sections?limit=50&page=1&sort=-createdAt', {
          signal: controller.signal,
          cache: 'default',
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Failed to fetch sections')
        const data = await res.json()
        setSections(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch sections:', err)
        setError('Unable to load sections. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Page Sections</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">Manage content sections for your pages</p>
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

      <DashboardCard title={`Sections (${sections.length})`} subtitle="All page sections">
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
        ) : sections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-teal-700 font-medium">No sections found</p>
            <p className="text-sm text-teal-700/70 mt-1">Create your first section to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="p-4 border border-cream-100 rounded-lg hover:bg-cream-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink-800">{section.title || 'Untitled'}</h3>
                    <p className="text-sm text-teal-700 mt-1">Component: {section.componentType || 'Unknown'}</p>
                    {section.description && (
                      <p className="text-sm text-teal-700/70 mt-2">{section.description.slice(0, 100)}...</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-teal-700/60">
                      {new Date(section.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
