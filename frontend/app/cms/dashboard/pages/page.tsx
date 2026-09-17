'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function PagesManagementPage() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s for initial load

        const res = await fetch('/api/payload/pages?limit=50&page=1&sort=-createdAt', {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Failed to fetch pages')
        const data = await res.json()
        setPages(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch pages:', err)
        setError('Unable to load pages. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-ink-800">Pages</h1>
          <p className="text-teal-700 mt-3 text-base font-medium">Manage your website pages</p>
        </div>
        <Link
          href="/cms/dashboard"
          className="px-6 py-3 bg-cream-100 hover:bg-cream-200 text-ink-800 rounded-lg font-semibold transition duration-200"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Error Message */}
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

      {/* Pages List */}
      <DashboardCard title={`Pages (${pages.length})`} subtitle="All published pages">
        {loading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-cream-100 rounded w-48"></div>
                <div className="h-3 bg-cream-100 rounded w-96"></div>
              </div>
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-teal-700 font-medium">No pages found</p>
            <p className="text-sm text-teal-700/70 mt-1">Create your first page to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="p-4 border border-cream-100 rounded-lg hover:bg-cream-50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink-800">{page.title || 'Untitled'}</h3>
                    <p className="text-sm text-teal-700 mt-1">
                      {page.slug ? `/${page.slug}` : 'No slug'}
                    </p>
                    {page.description && (
                      <p className="text-sm text-teal-700/70 mt-2">{page.description.slice(0, 100)}...</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-teal-700/60">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                      page.published
                        ? 'bg-status-ok/10 text-status-ok'
                        : 'bg-status-warn/10 text-status-warn'
                    }`}>
                      {page.published ? '✓ Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ink-800 mb-2">About Pages</h3>
        <p className="text-ink-800 mb-4">
          Pages are the backbone of your website. Each page can contain multiple sections from Page Sections,
          and they can be published or saved as drafts.
        </p>
        <p className="text-sm text-teal-700">
          ℹ️ Pages shown here are fetched directly from Payload CMS in real-time.
        </p>
      </div>
    </div>
  )
}
