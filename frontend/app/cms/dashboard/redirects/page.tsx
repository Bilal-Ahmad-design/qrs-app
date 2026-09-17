'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRedirects = async () => {
      try {
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 180000)

        const res = await fetch('/api/payload/redirects?limit=50&page=1&sort=-createdAt', {
          signal: controller.signal,
          cache: 'default',
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Failed to fetch redirects')
        const data = await res.json()
        setRedirects(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch redirects:', err)
        setError('Unable to load redirects. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRedirects()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Redirects</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">Manage URL redirects and rewrites</p>
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

      <DashboardCard title={`Redirects (${redirects.length})`} subtitle="All URL redirects">
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
        ) : redirects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🔗</p>
            <p className="text-teal-700 font-medium">No redirects configured</p>
            <p className="text-sm text-teal-700/70 mt-1">Add redirects to manage URL mappings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {redirects.map((redirect) => (
              <div
                key={redirect.id}
                className="p-4 border border-cream-100 rounded-lg hover:bg-cream-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-ink-900 text-cream-50 px-2 py-1 rounded">
                        {redirect.fromUrl}
                      </span>
                      <span className="text-teal-600">→</span>
                      <span className="text-sm font-mono bg-teal-100 text-teal-900 px-2 py-1 rounded">
                        {redirect.toUrl}
                      </span>
                    </div>
                    {redirect.description && (
                      <p className="text-sm text-teal-700 mt-2">{redirect.description}</p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                      redirect.statusCode === 301
                        ? 'bg-status-ok/10 text-status-ok'
                        : redirect.statusCode === 302
                          ? 'bg-status-warn/10 text-status-warn'
                          : 'bg-status-error/10 text-status-error'
                    }`}>
                      {redirect.statusCode || 301}
                    </span>
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
